-- Pragati AI initial Supabase backend.
-- Each resource keeps its validated TypeScript shape in `data`; this preserves the
-- existing frontend contract while enabling secure persistence and incremental schema normalisation.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'startup' check (role in ('government', 'startup', 'expert', 'admin')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.has_platform_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = any(allowed_roles)
  );
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_profile_on_auth_user on auth.users;
create trigger create_profile_on_auth_user
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

-- Backfill users that were created before this migration ran.
insert into public.profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', email)
from auth.users
on conflict (id) do nothing;

do $$
declare
  resource_table text;
  read_policy text;
  write_policy text;
begin
  foreach resource_table in array array[
    'challenges',
    'startups',
    'applications',
    'evaluations',
    'pilots',
    'kpi_measurements',
    'payment_milestones',
    'validation_reports',
    'scale_up_plans',
    'notifications'
  ]
  loop
    execute format(
      'create table if not exists public.%I (
        id text primary key,
        data jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )',
      resource_table
    );
    execute format('alter table public.%I enable row level security', resource_table);

    read_policy := format('Authenticated users can read %s', resource_table);
    write_policy := format('Officers can manage %s', resource_table);

    if not exists (
      select 1 from pg_policies where schemaname = 'public' and tablename = resource_table and policyname = read_policy
    ) then
      if resource_table = any(array['challenges', 'startups']) then
        execute format('create policy %I on public.%I for select to authenticated using (true)', read_policy, resource_table);
      else
        execute format(
          'create policy %I on public.%I for select to authenticated using (public.has_platform_role(array[''government'', ''expert'', ''admin'']))',
          read_policy,
          resource_table
        );
      end if;
    end if;

    if not exists (
      select 1 from pg_policies where schemaname = 'public' and tablename = resource_table and policyname = write_policy
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (public.has_platform_role(array[''government'', ''admin''])) with check (public.has_platform_role(array[''government'', ''admin'']))',
        write_policy,
        resource_table
      );
    end if;
  end loop;
end;
$$;

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_platform_role(array['admin']));

drop policy if exists "Administrators manage profiles" on public.profiles;
create policy "Administrators manage profiles"
  on public.profiles for all to authenticated
  using (public.has_platform_role(array['admin']))
  with check (public.has_platform_role(array['admin']));
