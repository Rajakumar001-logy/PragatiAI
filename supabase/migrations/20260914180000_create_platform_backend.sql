-- ==============================================================================
-- PRAGATI AI — Complete PostgreSQL / Supabase Schema & Seed Data
-- ==============================================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('government', 'startup', 'expert', 'admin')),
  name text not null,
  department_or_company text not null,
  designation text,
  phone text,
  verified boolean default true,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Challenges Table
create table if not exists public.challenges (
  id text primary key,
  code text unique not null,
  title text not null,
  problem_statement text not null,
  current_situation text,
  expected_outcome text not null,
  department text not null,
  ministry text not null,
  required_technology text[] default '{}',
  target_users text,
  geographic_area text,
  budget_allocated bigint not null,
  current_stage text not null default 'Draft',
  application_deadline text not null,
  pilot_duration_days int not null default 60,
  published_date text not null,
  tags text[] default '{}',
  total_applicants int not null default 0,
  selected_startup_id text,
  ai_match_summary text,
  kpis jsonb default '[]'::jsonb,
  eligibility_criteria jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Startups Table
create table if not exists public.startups (
  id text primary key,
  legal_name text not null,
  brand_name text not null,
  dpiit_number text unique not null,
  incorporation_year int not null,
  founder_name text not null,
  contact_email text not null,
  contact_phone text not null,
  headquarters text not null,
  focus_sector text not null,
  solution_title text not null,
  solution_summary text not null,
  technology_stack text[] default '{}',
  trl_level int not null default 7,
  certifications text[] default '{}',
  verified_status text not null default 'Verified' check (verified_status in ('Verified', 'Pending', 'Rejected')),
  estimated_pilot_cost bigint,
  match_score int default 85,
  technical_fit_score int default 85,
  scalability_score int default 85,
  ai_match_reason text,
  relevant_experience text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Applications Table
create table if not exists public.applications (
  id text primary key,
  challenge_id text not null references public.challenges(id) on delete cascade,
  challenge_title text not null,
  department text not null,
  startup_id text not null references public.startups(id) on delete cascade,
  startup_name text not null,
  dpiit_number text not null,
  solution_description text not null,
  technical_approach text not null,
  previous_experience text not null,
  implementation_plan text not null,
  proposal_summary text not null,
  submitted_at text not null,
  status text not null default 'Submitted',
  eligibility_score int not null default 90,
  technical_score int,
  pilot_budget_proposed bigint not null,
  timeline_step int not null default 1,
  documents jsonb default '[]'::jsonb,
  clarification_requested text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Evaluations Table
create table if not exists public.evaluations (
  id text primary key,
  application_id text not null references public.applications(id) on delete cascade,
  challenge_id text not null references public.challenges(id) on delete cascade,
  challenge_title text not null,
  startup_id text not null references public.startups(id) on delete cascade,
  startup_name text not null,
  evaluator_name text not null,
  evaluator_role text not null,
  evaluator_affiliation text not null,
  date_evaluated text not null,
  total_score int not null,
  recommendation text not null,
  status text not null default 'Completed',
  summary_remarks text not null,
  clarification_notes text,
  criteria_scores jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Pilots Table
create table if not exists public.pilots (
  id text primary key,
  challenge_id text not null references public.challenges(id) on delete cascade,
  challenge_title text not null,
  startup_id text not null references public.startups(id) on delete cascade,
  startup_name text not null,
  department text not null,
  deployment_location text not null,
  start_date text not null,
  end_date text not null,
  budget bigint not null,
  status text not null default 'Preparing',
  completion_percentage int not null default 0,
  live_kpi_score int not null default 85,
  total_milestones int not null default 4,
  completed_milestones int not null default 0,
  current_milestone_stage text not null,
  milestones jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. KPI Measurements Table
create table if not exists public.kpi_measurements (
  id text primary key,
  pilot_id text not null references public.pilots(id) on delete cascade,
  challenge_title text not null,
  startup_name text not null,
  metric_name text not null,
  baseline text not null,
  target text not null,
  current_value text not null,
  achievement_percentage numeric not null,
  status text not null,
  last_updated text not null,
  telemetry_source text not null,
  history jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Payment Milestones Table
create table if not exists public.payment_milestones (
  id text primary key,
  pilot_id text not null references public.pilots(id) on delete cascade,
  challenge_title text not null,
  startup_name text not null,
  milestone_title text not null,
  tranche_number int not null,
  amount bigint not null,
  deliverable_criteria text not null,
  status text not null default 'PENDING',
  eligible_for_release boolean not null default false,
  invoice_number text not null,
  approved_date text,
  disbursed_date text,
  pfms_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Validation Reports Table
create table if not exists public.validation_reports (
  id text primary key,
  pilot_id text not null references public.pilots(id) on delete cascade,
  challenge_title text not null,
  startup_name text not null,
  auditing_agency text not null,
  lead_auditor text not null,
  audit_date text not null,
  performance_score int not null,
  security_compliance text not null,
  regulatory_compliance text not null,
  kpi_verification_status text not null,
  procurement_suitability_score int not null,
  verdict text not null,
  certificate_number text not null,
  summary_observations text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Scale-Up Plans Table
create table if not exists public.scale_up_plans (
  id text primary key,
  challenge_title text not null,
  startup_name text not null,
  solution_name text not null,
  gem_category text not null,
  recommended_scale text not null,
  estimated_contract_value bigint not null,
  legal_basis text not null,
  procuring_department text not null,
  pilot_score int not null,
  validation_status text not null,
  recommendation text not null,
  status text not null default 'Ready for Procurement',
  procurement_quantity text,
  target_districts text[] default '{}',
  scaled_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. Notifications Table
create table if not exists public.notifications (
  id text primary key,
  title text not null,
  description text not null,
  timestamp text not null,
  read boolean not null default false,
  type text not null default 'info',
  target_role text not null default 'all',
  link_to text,
  created_at timestamptz not null default now()
);

-- 12. Audit Logs Table
create table if not exists public.audit_logs (
  id text primary key,
  timestamp text not null,
  actor_name text not null,
  actor_role text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details text not null,
  hash text not null,
  created_at timestamptz not null default now()
);

-- RLS Enablement
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.startups enable row level security;
alter table public.applications enable row level security;
alter table public.evaluations enable row level security;
alter table public.pilots enable row level security;
alter table public.kpi_measurements enable row level security;
alter table public.payment_milestones enable row level security;
alter table public.validation_reports enable row level security;
alter table public.scale_up_plans enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- Permissive RLS Policies for SIH Hackathon Prototype
create policy "Allow read access to all" on public.profiles for select using (true);
create policy "Allow insert/update profiles" on public.profiles for all using (true);

create policy "Allow read challenges" on public.challenges for select using (true);
create policy "Allow manage challenges" on public.challenges for all using (true);

create policy "Allow read startups" on public.startups for select using (true);
create policy "Allow manage startups" on public.startups for all using (true);

create policy "Allow read applications" on public.applications for select using (true);
create policy "Allow manage applications" on public.applications for all using (true);

create policy "Allow read evaluations" on public.evaluations for select using (true);
create policy "Allow manage evaluations" on public.evaluations for all using (true);

create policy "Allow read pilots" on public.pilots for select using (true);
create policy "Allow manage pilots" on public.pilots for all using (true);

create policy "Allow read kpi_measurements" on public.kpi_measurements for select using (true);
create policy "Allow manage kpi_measurements" on public.kpi_measurements for all using (true);

create policy "Allow read payment_milestones" on public.payment_milestones for select using (true);
create policy "Allow manage payment_milestones" on public.payment_milestones for all using (true);

create policy "Allow read validation_reports" on public.validation_reports for select using (true);
create policy "Allow manage validation_reports" on public.validation_reports for all using (true);

create policy "Allow read scale_up_plans" on public.scale_up_plans for select using (true);
create policy "Allow manage scale_up_plans" on public.scale_up_plans for all using (true);

create policy "Allow read notifications" on public.notifications for select using (true);
create policy "Allow manage notifications" on public.notifications for all using (true);

create policy "Allow read audit_logs" on public.audit_logs for select using (true);
create policy "Allow manage audit_logs" on public.audit_logs for all using (true);

-- Auth Profile Trigger
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
as $$
declare
  assigned_role text;
  assigned_name text;
  assigned_org text;
  assigned_desig text;
begin
  if new.email = 'gov1123@gmail.com' then
    assigned_role := 'government';
    assigned_name := 'Dr. Rajesh Varma, IAS';
    assigned_org := 'Ministry of Housing & Urban Affairs';
    assigned_desig := 'Joint Secretary (Smart Cities Mission)';
  elsif new.email = 'startup1123@gmail.com' then
    assigned_role := 'startup';
    assigned_name := 'Aanya Sharma';
    assigned_org := 'EcoRoute Technologies Pvt Ltd';
    assigned_desig := 'Founder & CEO (DPIIT Recognized)';
  elsif new.email in ('evaluater1123@3gmail.com', 'evaluater1123@gmail.com') then
    assigned_role := 'expert';
    assigned_name := 'Prof. S. Ramanathan';
    assigned_org := 'IIT Delhi & CSIR Review Committee';
    assigned_desig := 'Chairperson, Technical Review Panel';
  elsif new.email = 'administrator@gmail.com' then
    assigned_role := 'admin';
    assigned_name := 'Directorate General';
    assigned_org := 'Pragati AI Platform Administration (MeitY)';
    assigned_desig := 'Platform Administrator';
  else
    assigned_role := coalesce(new.raw_user_meta_data ->> 'role', 'startup');
    assigned_name := coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1));
    assigned_org := coalesce(new.raw_user_meta_data ->> 'department_or_company', 'Authorized Stakeholder');
    assigned_desig := coalesce(new.raw_user_meta_data ->> 'designation', 'Lead Officer');
  end if;

  insert into public.profiles (auth_user_id, email, role, name, department_or_company, designation, verified)
  values (new.id, new.email, assigned_role, assigned_name, assigned_org, assigned_desig, true)
  on conflict (email) do update
  set auth_user_id = new.id,
      role = excluded.role,
      name = excluded.name,
      department_or_company = excluded.department_or_company,
      designation = excluded.designation,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
