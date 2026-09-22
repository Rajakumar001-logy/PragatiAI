-- ==============================================================================
-- PRAGATI AI — Government Innovation Procurement Platform
-- Complete PostgreSQL / Supabase Schema & Seed Data
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/cmvejmisvbbqxzopijnv
-- 2. Go to "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- Enable essential extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 1. PROFILES & ROLES TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 2. CHALLENGES TABLE (Outcome-Based Innovation Challenges)
-- ==============================================================================
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

-- ==============================================================================
-- 3. STARTUPS TABLE (DPIIT-Recognized Innovators)
-- ==============================================================================
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

-- ==============================================================================
-- 4. APPLICATIONS TABLE (Startup Proposals & Submissions)
-- ==============================================================================
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

-- ==============================================================================
-- 5. EVALUATIONS TABLE (Expert Scoring Rubric - 6 Weighted Criteria / 100 Pts)
-- ==============================================================================
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

-- ==============================================================================
-- 6. PILOTS / SANDBOXES TABLE (Controlled Field Trials)
-- ==============================================================================
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

-- ==============================================================================
-- 7. KPI MEASUREMENTS TABLE (Live Telemetry & Benchmarking)
-- ==============================================================================
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

-- ==============================================================================
-- 8. PAYMENT MILESTONES TABLE (PFMS & Escrow Disbursals)
-- ==============================================================================
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

-- ==============================================================================
-- 9. VALIDATION REPORTS TABLE (Third-Party Audits - IIT / CSIR Certified)
-- ==============================================================================
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

-- ==============================================================================
-- 10. SCALE-UP PLANS TABLE (GeM Direct Procurement under GFR Rule 149(viii))
-- ==============================================================================
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

-- ==============================================================================
-- 11. NOTIFICATIONS TABLE (Real-Time Stakeholder Alerts)
-- ==============================================================================
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

-- ==============================================================================
-- 12. AUDIT LOGS TABLE (Cryptographic SHA-256 Audit Trail)
-- ==============================================================================
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
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

-- Permissive public read & write policies for prototype demo
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

-- ==============================================================================
-- AUTOMATIC AUTH PROFILE TRIGGER
-- (Syncs auth.users signup with public.profiles matching the 4 credentials)
-- ==============================================================================
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

-- ==============================================================================
-- PRE-POPULATED SEED DATA (SIH Prototype Dataset)
-- ==============================================================================

-- 1. Seed Profiles for the 4 Authorized Credentials
insert into public.profiles (email, role, name, department_or_company, designation, verified)
values
  ('gov1123@gmail.com', 'government', 'Dr. Rajesh Varma, IAS', 'Ministry of Housing & Urban Affairs', 'Joint Secretary (Smart Cities Mission)', true),
  ('startup1123@gmail.com', 'startup', 'Aanya Sharma', 'EcoRoute Technologies Pvt Ltd', 'Founder & CEO (DPIIT Recognized)', true),
  ('evaluater1123@3gmail.com', 'expert', 'Prof. S. Ramanathan', 'IIT Delhi & CSIR Review Committee', 'Chairperson, Technical Review Panel', true),
  ('administrator@gmail.com', 'admin', 'Directorate General', 'Pragati AI Platform Administration (MeitY)', 'Platform Administrator', true)
on conflict (email) do update set
  role = excluded.role,
  name = excluded.name,
  department_or_company = excluded.department_or_company,
  designation = excluded.designation;

-- 2. Seed Challenges
insert into public.challenges (
  id, code, title, problem_statement, current_situation, expected_outcome,
  department, ministry, required_technology, target_users, geographic_area,
  budget_allocated, current_stage, application_deadline, pilot_duration_days,
  published_date, tags, total_applicants, selected_startup_id, ai_match_summary,
  kpis, eligibility_criteria
) values
(
  'ch-01',
  'PRG-2026-001',
  'Smart Waste Collection Route Optimization',
  'Municipal solid waste collection vehicles in urban local bodies follow static, scheduled routes resulting in 34% excess fuel consumption, uncollected overflowing bins during peak hours, and delayed grievance redressal.',
  'Indore and 12 Tier-1 cities spend over ₹8.5 Crores monthly on fixed-schedule diesel collection trucks without dynamic load telemetry or route rerouting.',
  'Dynamic sensor-driven route optimization algorithm capable of reducing fleet fuel expenditure by >= 22% while guaranteeing 99.5% bin clearance SLA in a 60-day sandbox pilot across 10 municipal wards.',
  'Urban Development Department',
  'Ministry of Housing & Urban Affairs (MoHUA)',
  array['IoT Sensors', 'AI Dynamic Routing', 'Telematics', 'Mobile GIS'],
  'Municipal Sanitation Fleet Drivers & Ward Officers',
  'Zone 4 (Wards 18-27), Indore Municipal Corporation',
  4500000,
  'Sandbox / Pilot',
  '2026-10-15',
  60,
  '2026-08-01',
  array['Smart Cities', 'IoT Logistics', 'Clean India Mission', 'Fleet Telematics'],
  14,
  'st-01',
  'EcoRoute Technologies scored 94% match based on patented edge-IoT routing algorithms and TRL-8 readiness.',
  '[
    {"id": "kpi-1", "name": "Fleet Fuel Cost Reduction", "unit": "%", "baseline": 0, "target": 22, "achieved": 24.8, "weightage": 35, "measurementMethod": "Fuel flow sensor telemetry vs pre-pilot baseline logs"},
    {"id": "kpi-2", "name": "Bin Clearance SLA Adherence", "unit": "%", "baseline": 78, "target": 99.5, "achieved": 98.9, "weightage": 35, "measurementMethod": "Ultrasonic bin fill sensor timestamp logs"},
    {"id": "kpi-3", "name": "Citizen Complaint Resolution Time", "unit": "hours", "baseline": 18, "target": 4, "achieved": 3.2, "weightage": 30, "measurementMethod": "Swachhata App grievance redressal webhook stream"}
  ]'::jsonb,
  '{
    "startupStage": "DPIIT Registered Early-Growth (TRL 7+)",
    "requiredCertifications": ["ISO 9001:2015", "ISO 27001 Data Security"],
    "technologyRequirements": "Must operate on low-power LPWAN / 4G telemetry with sub-second rerouting",
    "securityRequirements": "End-to-end TLS encryption with NIC cloud gateway compatibility"
  }'::jsonb
),
(
  'ch-02',
  'PRG-2026-002',
  'AI-Based Road Damage Detection',
  'Manual road condition assessments across national highway corridors are infrequent, hazardous, and subjective, resulting in undetected potholes, severe structural pavement deterioration, and road traffic fatalities.',
  'Specialized laser profiler survey vans cost over ₹2.4 Crores per unit and survey only 15% of national highway corridors annually.',
  'Computer vision and edge-AI system deployable on patrol vehicles to detect, classify (pothole, rutting, cracking), and geolocate road defects at 60 km/h with >= 92% classification accuracy verified against standard laser profilometers.',
  'National Highways Authority of India (NHAI)',
  'Ministry of Road Transport and Highways (MoRTH)',
  array['Computer Vision', 'Edge AI', 'High-speed GIS Mapping', 'Deep Learning'],
  'NHAI Project Implementation Units & Highway Patrol Officers',
  'NH-48 Corridor (Gurugram to Jaipur Section, 220 km)',
  6000000,
  'Independent Validation',
  '2026-09-20',
  90,
  '2026-07-10',
  array['Edge AI', 'Computer Vision', 'Highway Safety', 'Infrastructure'],
  21,
  'st-02',
  'RoadVision AI matches NHAI requirements with 87% score and CRRI lab-benchmarked edge vision models.',
  '[
    {"id": "kpi-4", "name": "Defect Detection Accuracy", "unit": "%", "baseline": 65, "target": 92, "achieved": 94.2, "weightage": 40, "measurementMethod": "Continuous frame validation against laser profilometer ground truth"},
    {"id": "kpi-5", "name": "Survey Speed Tolerance", "unit": "km/h", "baseline": 25, "target": 60, "achieved": 62.4, "weightage": 30, "measurementMethod": "OBD-II vehicle speed telemetry synchronization"},
    {"id": "kpi-6", "name": "Geotagging Precision Error", "unit": "meters", "baseline": 12, "target": 1.5, "achieved": 0.8, "weightage": 30, "measurementMethod": "RTK-GPS differential satellite positioning"}
  ]'::jsonb,
  '{
    "startupStage": "DPIIT Registered (TRL 8)",
    "requiredCertifications": ["BIS Certified", "ISO 27001"],
    "technologyRequirements": "Ruggedized IP67 edge computing box with 45+ FPS neural network inference",
    "securityRequirements": "Data sovereignty on Indian sovereign cloud with AES-256 encrypted storage"
  }'::jsonb
),
(
  'ch-03',
  'PRG-2026-003',
  'Water Leakage Detection',
  'Non-revenue water (NRW) loss due to subterranean pipeline fractures exceeds 38% in municipal distribution networks, causing massive water wastage and financial leakage for public utility boards.',
  'Underground fractures remain undetected for weeks until visible sinkholes or severe pressure drops appear.',
  'Acoustic sensor grid or satellite radar-based subterranean leak detection system providing pinpoint localization within a 3-meter radius, tested across 45 km of pipeline network.',
  'State Water & Sanitation Mission',
  'Ministry of Jal Shakti',
  array['Acoustic Wave Correlation', 'LoRaWAN Telemetry', 'Hydrophone Arrays'],
  'Municipal Water Engineers & Leak Remediation Crews',
  'Pune Division Distribution Mains (45 km)',
  5000000,
  'Open for Applications',
  '2026-11-30',
  75,
  '2026-09-01',
  array['Jal Jeevan Mission', 'Acoustic Sensors', 'Non-Revenue Water', 'Smart Utilities'],
  8,
  null,
  'WaterSense Technologies identified as top match (81%) with submersible IP68 acoustic correlator hardware.',
  '[
    {"id": "kpi-7", "name": "NRW Water Loss Reduction", "unit": "%", "baseline": 38, "target": 15, "weightage": 40, "measurementMethod": "District Metered Area (DMA) ultrasonic inflow vs outflow balance"},
    {"id": "kpi-8", "name": "Leak Pinpoint Accuracy", "unit": "meters", "baseline": 25, "target": 3, "weightage": 35, "measurementMethod": "Physical excavation verification distance error"},
    {"id": "kpi-9", "name": "False Alarm Ratio", "unit": "%", "baseline": 40, "target": 5, "weightage": 25, "measurementMethod": "Percentage of dispatched crews finding dry/intact pipe"}
  ]'::jsonb,
  '{
    "startupStage": "DPIIT Registered (TRL 7+)",
    "requiredCertifications": ["IP68 Submersible Certified", "LoRaWAN Certified"],
    "technologyRequirements": "Acoustic correlation hardware with 3-year autonomous battery life",
    "securityRequirements": "Encrypted LoRa payload with SCADA integration API"
  }'::jsonb
)
on conflict (id) do nothing;

-- 3. Seed Startups
insert into public.startups (
  id, legal_name, brand_name, dpiit_number, incorporation_year, founder_name,
  contact_email, contact_phone, headquarters, focus_sector, solution_title,
  solution_summary, technology_stack, trl_level, certifications, verified_status,
  estimated_pilot_cost, match_score, technical_fit_score, scalability_score,
  ai_match_reason, relevant_experience
) values
(
  'st-01',
  'EcoRoute Technologies Private Limited',
  'EcoRoute Technologies',
  'DIPP-IN-89342',
  2022,
  'Aanya Sharma & Vikramaditya Rao',
  'contact@ecoroute.tech',
  '+91 98765 43210',
  'Bengaluru, Karnataka',
  'Civic-Tech & Sustainable Logistics',
  'Dynamic Urban Route Intelligence Engine (DURIE)',
  'Patented dynamic algorithmic dispatch engine with edge IoT bin fill-level telemetry that optimizes municipal waste fleet schedules in real-time.',
  array['AI / Heuristic Optimization', 'IoT Ultrasonic Telemetry', 'Node.js', 'PostGIS', 'Flutter Driver App'],
  8,
  array['ISO 9001:2015', 'ISO 27001 Data Security', 'Make in India Certified'],
  'Verified',
  3800000,
  94,
  92,
  88,
  'Startup matches the required AI, IoT and smart-city capabilities and meets all defined municipal eligibility criteria.',
  'Deployed in 4 wards in Mysuru Municipal Corporation with 21.4% recorded fuel savings.'
),
(
  'st-02',
  'RoadVision Artificial Intelligence Labs LLP',
  'RoadVision AI',
  'DIPP-IN-74219',
  2021,
  'Dr. Rohan Mehra',
  'info@roadvision.ai',
  '+91 98111 22334',
  'Hyderabad, Telangana',
  'Transportation & Edge Computer Vision',
  'PavementScan 360 Edge AI Hardware & Cloud Dashboard',
  'Vehicle-mountable ruggedized vision box running neural networks at 45 FPS to map pavement distress, potholes, and roughness index (IRI) on highways.',
  array['PyTorch Edge TensorRT', 'NVIDIA Jetson AGX', 'RTK-GPS', 'React Cloud GIS'],
  8,
  array['BIS Certified', 'ISO 27001', 'NHAI Sandbox Empaneled'],
  'Verified',
  5200000,
  87,
  90,
  95,
  'Matches NHAI high-speed corridor assessment requirements with validated CRRI accuracy and edge acceleration.',
  'Completed 600 km state highway audit in Telangana with 93.8% verified distress identification.'
),
(
  'st-03',
  'WaterSense IoT Technologies Pvt Ltd',
  'WaterSense Technologies',
  'DIPP-IN-91044',
  2023,
  'Kavita Sundaram',
  'hello@watersensetech.in',
  '+91 99401 55678',
  'Pune, Maharashtra',
  'Clean Water & Smart Municipal Infrastructure',
  'AcousticWave Subterranean Leak Detection Array',
  'Low-power acoustic correlation sensors installed on valve chambers to detect micro-vibrations indicative of pipe leakage with automated alert dispatches.',
  array['Acoustic Signal Processing', 'LoRaWAN Edge Firmware', 'Cloud Hydroinformatics'],
  7,
  array['IP68 Submersible Certified', 'LoRaWAN Alliance Member'],
  'Verified',
  4400000,
  81,
  84,
  86,
  'Matches subterranean water distribution monitoring needs with high IP68 reliability and low deployment overhead.',
  'Piloted across 15 km network in Pimpri Chinchwad with 11 confirmed pin-point leak discoveries.'
)
on conflict (id) do nothing;

-- 4. Seed Applications
insert into public.applications (
  id, challenge_id, challenge_title, department, startup_id, startup_name,
  dpiit_number, solution_description, technical_approach, previous_experience,
  implementation_plan, proposal_summary, submitted_at, status, eligibility_score,
  technical_score, pilot_budget_proposed, timeline_step, documents
) values
(
  'app-01',
  'ch-01',
  'Smart Waste Collection Route Optimization',
  'Urban Development Department',
  'st-01',
  'EcoRoute Technologies',
  'DIPP-IN-89342',
  'Deploying DURIE software engine across 45 collection trucks in Indore with 400 ultrasonic bin level sensors.',
  'Dynamic genetic routing algorithm computing optimal topological paths every 15 minutes based on sensor thresholds.',
  'Executed pilot in Mysuru reducing diesel usage by 21.4% with 99.1% bin collection adherence.',
  'Phase 1: Sensor installation (10 days); Phase 2: Driver app onboarding (5 days); Phase 3: 45-day continuous dynamic routing.',
  'Full-stack dynamic routing SaaS with IoT sensor retrofits delivering guaranteed >= 22% fuel reduction within 60 days.',
  '2026-08-12',
  'Shortlisted for Pilot',
  96,
  92,
  3800000,
  4,
  '[
    {"title": "Technical Proposal & Architecture.pdf", "url": "#", "verified": true},
    {"title": "DPIIT Startup India Certificate.pdf", "url": "#", "verified": true},
    {"title": "Audited Financials FY 24-25.pdf", "url": "#", "verified": true},
    {"title": "ISO 27001 Security Audit.pdf", "url": "#", "verified": true}
  ]'::jsonb
),
(
  'app-02',
  'ch-02',
  'AI-Based Road Damage Detection',
  'National Highways Authority of India (NHAI)',
  'st-02',
  'RoadVision AI',
  'DIPP-IN-74219',
  '4 PavementScan Edge AI ruggedized pods mounted on standard NHAI inspection SUVs covering 220 km corridor daily.',
  'TensorRT-accelerated YOLO-v8 customized model identifying 12 classes of pavement distress at 60 km/h.',
  '600 km state highway survey in Telangana certified by State PWD Engineers.',
  'Mounting units on patrol vehicles, cloud dashboard integration with NHAI Data Lake, 90-day daily runs.',
  'Edge-AI vision pods delivering 94%+ distress accuracy with sub-meter RTK-GPS geolocation for NHAI corridor.',
  '2026-07-18',
  'Validation',
  98,
  95,
  5200000,
  6,
  '[
    {"title": "NHAI Sandbox Proposal.pdf", "url": "#", "verified": true},
    {"title": "CRRI Benchmark Certification.pdf", "url": "#", "verified": true},
    {"title": "DPIIT Recognition.pdf", "url": "#", "verified": true}
  ]'::jsonb
),
(
  'app-03',
  'ch-03',
  'Water Leakage Detection',
  'State Water & Sanitation Mission',
  'st-03',
  'WaterSense Technologies',
  'DIPP-IN-91044',
  'Acoustic correlation hydrophone grid installed at 500m intervals on Pune drinking water mains.',
  'High-frequency vibration correlation detecting turbulent leak noises with time-difference-of-arrival (TDOA) math.',
  'Identified 11 subterranean leaks in Pimpri Chinchwad network saving ~1.2 MLD of treated water.',
  'Installation of 90 valve sensors, LoRa gateway setup, continuous telemetry to water board dashboard.',
  'Non-invasive acoustic monitoring pinpointing underground leaks within 3 meters without road cutting.',
  '2026-09-08',
  'Submitted',
  91,
  null,
  4400000,
  1,
  '[
    {"title": "Acoustic Wave Hydrophone Whitepaper.pdf", "url": "#", "verified": true},
    {"title": "DPIIT Recognition.pdf", "url": "#", "verified": true}
  ]'::jsonb
)
on conflict (id) do nothing;

-- 5. Seed Evaluations
insert into public.evaluations (
  id, application_id, challenge_id, challenge_title, startup_id, startup_name,
  evaluator_name, evaluator_role, evaluator_affiliation, date_evaluated, total_score,
  recommendation, status, summary_remarks, criteria_scores
) values
(
  'eval-01',
  'app-01',
  'ch-01',
  'Smart Waste Collection Route Optimization',
  'st-01',
  'EcoRoute Technologies',
  'Prof. S. Ramanathan',
  'Principal Technical Evaluator',
  'IIT Delhi',
  '2026-08-25',
  92,
  'Recommend for Pilot',
  'Completed',
  'Strong proprietary algorithm demonstrated on historical municipal datasets. High TRL, robust fail-safe fallback during network loss, and clear compliance with MoHUA IT standards.',
  '[
    {"id": "c-1", "criterion": "Technical Capability & Architecture", "weightPercentage": 30, "maxScore": 30, "scoreAwarded": 28, "remarks": "Proven sensor telemetry and cloud dispatch architecture."},
    {"id": "c-2", "criterion": "Innovation & Novelty vs GeM Alternatives", "weightPercentage": 20, "maxScore": 20, "scoreAwarded": 19, "remarks": "Real dynamic rerouting vs simple static GPS breadcrumb tracking."},
    {"id": "c-3", "criterion": "Cost Effectiveness & Budget Justification", "weightPercentage": 15, "maxScore": 15, "scoreAwarded": 14, "remarks": "Well-budgeted unit economics for sensor hardware."},
    {"id": "c-4", "criterion": "Scalability for Nationwide Deployment", "weightPercentage": 15, "maxScore": 15, "scoreAwarded": 13, "remarks": "Multi-tenant cloud architecture ready for 50+ municipal corporations."},
    {"id": "c-5", "criterion": "Security, Data Privacy & ISO Standards", "weightPercentage": 10, "maxScore": 10, "scoreAwarded": 9, "remarks": "ISO 27001 certified with sovereign data residency."},
    {"id": "c-6", "criterion": "Implementation Feasibility & Team Expertise", "weightPercentage": 10, "maxScore": 10, "scoreAwarded": 9, "remarks": "Experienced founders with previous municipal pilot track record."}
  ]'::jsonb
),
(
  'eval-02',
  'app-02',
  'ch-02',
  'AI-Based Road Damage Detection',
  'st-02',
  'RoadVision AI',
  'Dr. Sunita Deshmukh',
  'Senior Scientist',
  'CSIR - Central Road Research Institute (CRRI)',
  '2026-07-28',
  95,
  'Approve',
  'Completed',
  'Exceptional edge-computing latency under 20ms per frame. Compliant with IRC:SP:16 standard road distress classification formats.',
  '[
    {"id": "c-7", "criterion": "Technical Capability & Architecture", "weightPercentage": 30, "maxScore": 30, "scoreAwarded": 29, "remarks": "Hardware acceleration with TensorRT and dual RTK-GPS integration."},
    {"id": "c-8", "criterion": "Innovation & Novelty vs GeM Alternatives", "weightPercentage": 20, "maxScore": 20, "scoreAwarded": 19, "remarks": "Disrupts costly ₹2.4 Cr specialized profiler vans with edge AI pods."},
    {"id": "c-9", "criterion": "Cost Effectiveness & Budget Justification", "weightPercentage": 15, "maxScore": 15, "scoreAwarded": 14, "remarks": "78% lower cost per lane-km surveyed."},
    {"id": "c-10", "criterion": "Scalability for Nationwide Deployment", "weightPercentage": 15, "maxScore": 15, "scoreAwarded": 15, "remarks": "Easily retrofittable onto existing NHAI highway patrol vehicle fleet."},
    {"id": "c-11", "criterion": "Security, Data Privacy & ISO Standards", "weightPercentage": 10, "maxScore": 10, "scoreAwarded": 9, "remarks": "BIS certified hardware with secure encrypted telemetry."},
    {"id": "c-12", "criterion": "Implementation Feasibility & Team Expertise", "weightPercentage": 10, "maxScore": 10, "scoreAwarded": 9, "remarks": "PhD research team with prior CRRI collaborative benchmarking."}
  ]'::jsonb
)
on conflict (id) do nothing;

-- 6. Seed Pilots
insert into public.pilots (
  id, challenge_id, challenge_title, startup_id, startup_name, department,
  deployment_location, start_date, end_date, budget, status, completion_percentage,
  live_kpi_score, total_milestones, completed_milestones, current_milestone_stage,
  milestones
) values
(
  'pilot-01',
  'ch-01',
  'Smart Waste Collection Route Optimization',
  'st-01',
  'EcoRoute Technologies',
  'Urban Development Department',
  'Zone 4 (Wards 18-27), Indore Smart City Sandbox',
  '2026-08-15',
  '2026-10-15',
  3800000,
  'In Sandbox',
  72,
  94,
  4,
  2,
  'KPI Validation in Progress',
  '[
    {"id": "pm-1", "title": "Prototype & Hardware Deployment", "description": "400 bin ultrasonic sensors and telemetry onboarding", "completed": true, "dueDate": "2026-08-30", "verifiedBy": "Ward Executive Engineer"},
    {"id": "pm-2", "title": "Field Testing & Fleet Integration", "description": "Driver mobile app dispatch integration across 45 collection vehicles", "completed": true, "dueDate": "2026-09-15", "verifiedBy": "Superintending Engineer"},
    {"id": "pm-3", "title": "KPI Validation & Fuel Audit", "description": "Verification of >= 22% fuel reduction over 30 days continuous telemetry", "completed": false, "dueDate": "2026-10-05"},
    {"id": "pm-4", "title": "Final Report & Municipal Handover", "description": "Third-party certification and municipal scale-up blueprint", "completed": false, "dueDate": "2026-10-15"}
  ]'::jsonb
),
(
  'pilot-02',
  'ch-02',
  'AI-Based Road Damage Detection',
  'st-02',
  'RoadVision AI',
  'National Highways Authority of India (NHAI)',
  'NH-48 Corridor (Gurugram to Jaipur Section, 220 km)',
  '2026-06-01',
  '2026-09-01',
  5200000,
  'Completed',
  100,
  96,
  4,
  4,
  'All Milestones Completed & Validated',
  '[
    {"id": "pm-5", "title": "Edge Hardware Mounting", "description": "Installation of 4 PavementScan boxes on NHAI patrol SUVs", "completed": true, "dueDate": "2026-06-15", "verifiedBy": "NHAI Project Director"},
    {"id": "pm-6", "title": "Corridor Field Survey Run", "description": "1,200 lane-km automated survey with continuous distress classification", "completed": true, "dueDate": "2026-07-15", "verifiedBy": "CRRI Independent Observer"},
    {"id": "pm-7", "title": "Ground-Truth Comparative Benchmark", "description": "Validation of AI distress accuracy vs laser profilometer rig", "completed": true, "dueDate": "2026-08-15", "verifiedBy": "CSIR Chief Scientist"},
    {"id": "pm-8", "title": "Final Report & GeM Procurement Blueprint", "description": "Submission of nationwide procurement recommendation dossier", "completed": true, "dueDate": "2026-09-01", "verifiedBy": "NHAI Member (Technical)"}
  ]'::jsonb
)
on conflict (id) do nothing;

-- 7. Seed KPI Measurements
insert into public.kpi_measurements (
  id, pilot_id, challenge_title, startup_name, metric_name, baseline, target,
  current_value, achievement_percentage, status, last_updated, telemetry_source
) values
(
  'kpi-live-1',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Diesel Fuel Consumption Reduction',
  '3,840 Litres / week',
  '2,995 Litres (-22.0%)',
  '2,887 Litres (-24.8%)',
  112.7,
  'Exceeding',
  '2026-09-21 18:30 IST',
  'IoT Sensor Stream'
),
(
  'kpi-live-2',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Bin Overflow Incidents (Monthly)',
  '142 reports / month',
  '< 15 reports / month',
  '12 reports / month',
  108.3,
  'Exceeding',
  '2026-09-21 20:00 IST',
  'IoT Sensor Stream'
),
(
  'kpi-live-3',
  'pilot-02',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'Road Inspection Speed & Tolerance',
  '20 km/h (Specialized Rig)',
  '60 km/h (Patrol Vehicle)',
  '62.4 km/h maintained',
  104.0,
  'Exceeding',
  '2026-09-01 11:00 IST',
  'IoT Sensor Stream'
),
(
  'kpi-live-4',
  'pilot-02',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'Pothole Classification Accuracy vs Laser Rig',
  '65.0% (Manual Sample Survey)',
  '>= 92.0% Accuracy',
  '94.2% verified',
  102.4,
  'Exceeding',
  '2026-09-01 11:00 IST',
  'Algorithmic Benchmark'
),
(
  'kpi-live-5',
  'pilot-02',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'Geotagging Precision Error',
  '12.0 meters (Standard GPS)',
  '< 1.5 meters',
  '0.8 meters (RTK-GPS)',
  146.6,
  'Exceeding',
  '2026-09-01 11:00 IST',
  'IoT Sensor Stream'
)
on conflict (id) do nothing;

-- 8. Seed Payment Milestones
insert into public.payment_milestones (
  id, pilot_id, challenge_title, startup_name, milestone_title, tranche_number,
  amount, deliverable_criteria, status, eligible_for_release, invoice_number,
  approved_date, disbursed_date, pfms_reference
) values
(
  'pay-01',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Milestone 1: Prototype & Sensor Provisioning',
  1,
  1140000,
  'Installation of 400 bin sensors and telemetry onboarding verified by Municipal Commissioner.',
  'PAID',
  true,
  'INV-ECOR-2026-001',
  '2026-08-30',
  '2026-09-02',
  'PFMS-2026-SBM-992144'
),
(
  'pay-02',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Milestone 2: Pilot Deployment & Dynamic Routing',
  2,
  1520000,
  'Demonstrated fuel reduction >= 20% across 10 wards over continuous 30-day operating cycle.',
  'PAID',
  true,
  'INV-ECOR-2026-002',
  '2026-09-18',
  '2026-09-20',
  'PFMS-2026-SBM-994821'
),
(
  'pay-03',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Milestone 3: KPI Achievement & Third-Party Audit',
  3,
  1140000,
  'Final pilot performance certification from IIT Indore and complete municipal handover.',
  'PENDING',
  true,
  'INV-ECOR-2026-003',
  null,
  null,
  null
),
(
  'pay-04',
  'pilot-02',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'Milestone 3: Independent Validation Clearance & Final Payment',
  3,
  1560000,
  'CRRI independent audit confirmation and 1,200 km digital pavement catalog submission.',
  'PAID',
  true,
  'INV-RVAI-2026-088',
  '2026-08-28',
  '2026-09-02',
  'PFMS-2026-NHAI-772109'
)
on conflict (id) do nothing;

-- 9. Seed Validation Reports
insert into public.validation_reports (
  id, pilot_id, challenge_title, startup_name, auditing_agency, lead_auditor,
  audit_date, performance_score, security_compliance, regulatory_compliance,
  kpi_verification_status, procurement_suitability_score, verdict, certificate_number,
  summary_observations
) values
(
  'val-01',
  'pilot-02',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'CSIR - Central Road Research Institute (CRRI)',
  'Dr. Sunita Deshmukh, Chief Scientist',
  '2026-08-25',
  96,
  'ISO 27001 / CERT-In Compliant',
  'IRC:SP:16 Standard Compliant',
  '100% Validated',
  98,
  'VALIDATED',
  'CSIR-CRRI-VALID-2026-089',
  'The RoadVision edge AI solution successfully met all quantitative test benchmarks over the 220 km NH-48 testbed. Pavement distress classification achieved 94.2% accuracy versus standard laser profiling rigs, with a 78% reduction in survey cost per lane-km. Solution is legally and technically fit for direct public procurement under GFR Rule 149(viii).'
),
(
  'val-02',
  'pilot-01',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'IIT Indore - Clean City Research Center',
  'Prof. K. Sen, Head of Urban Informatics',
  '2026-09-19',
  94,
  'ISO 27001 Certified & TLS 1.3 Protected',
  'MoHUA Swachh Bharat Smart Telematics Standard',
  '100% Validated',
  95,
  'VALIDATED',
  'IIT-IND-SBM-2026-042',
  'Independently audited over 30 consecutive operating days across 10 municipal wards in Indore. Recorded 24.8% reduction in net diesel consumption with zero missed bin complaints over the test cycle.'
)
on conflict (id) do nothing;

-- 10. Seed Scale-Up Plans
insert into public.scale_up_plans (
  id, challenge_title, startup_name, solution_name, gem_category, recommended_scale,
  estimated_contract_value, legal_basis, procuring_department, pilot_score,
  validation_status, recommendation, status
) values
(
  'scale-01',
  'AI-Based Road Damage Detection',
  'RoadVision AI',
  'PavementScan 360 Edge AI Hardware & Cloud Dashboard',
  'Highway Asset Management & Automated Pavement Assessment Systems',
  'Pan-India 28 NHAI Regional Offices (covering 140,000 km of National Highways)',
  285000000,
  'Rule 149(viii) General Financial Rules (GFR) 2017 - Innovation Procurement Post Validated Pilot',
  'National Highways Authority of India (NHAI) / MoRTH',
  96,
  '100% Validated (CSIR-CRRI)',
  'Direct GeM Scale-up Approved',
  'Ready for Procurement'
),
(
  'scale-02',
  'Smart Waste Collection Route Optimization',
  'EcoRoute Technologies',
  'Dynamic Urban Route Intelligence Engine (DURIE)',
  'Smart City Fleet Management & Dynamic Waste Logistics SaaS',
  'Tier-1 & Tier-2 Smart Cities under Swachh Bharat Mission Urban 2.0 (50 Municipal Corporations)',
  140000000,
  'GFR 2017 Rule 149(viii) & Mission Directorate Innovation Framework',
  'Ministry of Housing & Urban Affairs (MoHUA)',
  94,
  '100% Validated (IIT Indore)',
  'Cabinet Note Sanctioned',
  'Procurement Initiated'
)
on conflict (id) do nothing;

-- 11. Seed Notifications
insert into public.notifications (
  id, title, description, timestamp, read, type, target_role, link_to
) values
(
  'notif-1',
  'New Startup Application Received',
  'EcoRoute Technologies submitted a proposal for Smart Waste Collection Route Optimization.',
  '10 mins ago',
  false,
  'info',
  'government',
  '/applications'
),
(
  'notif-2',
  'Your Proposal Has Been Shortlisted!',
  'Urban Development Department shortlisted DURIE for the 60-day Indore Smart City Sandbox.',
  '1 hour ago',
  false,
  'success',
  'startup',
  '/applications'
),
(
  'notif-3',
  'New Technical Evaluation Assigned',
  'You have been assigned to evaluate RoadVision AI for AI-Based Road Damage Detection.',
  '3 hours ago',
  false,
  'warning',
  'expert',
  '/evaluations'
),
(
  'notif-4',
  'Milestone Payment Approved via PFMS',
  'Tranche 2 payment of ₹15,20,000 has been verified and released to EcoRoute Technologies.',
  '5 hours ago',
  true,
  'success',
  'all',
  '/payments'
),
(
  'notif-5',
  'CSIR-CRRI Validation Report Uploaded',
  'RoadVision AI completed independent third-party audit with 98/100 procurement suitability score.',
  '1 day ago',
  true,
  'info',
  'all',
  '/validation'
)
on conflict (id) do nothing;

-- 12. Seed Audit Logs
insert into public.audit_logs (
  id, timestamp, actor_name, actor_role, action, entity_type, entity_id, details, hash
) values
(
  'audit-01',
  '2026-09-22 09:15:00 IST',
  'Rajesh Varma, IAS',
  'government',
  'PUBLISH_CHALLENGE',
  'Challenge',
  'PRG-2026-001',
  'Published Outcome-Based Innovation Challenge: Smart Waste Collection Route Optimization (Budget ₹45L)',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
),
(
  'audit-02',
  '2026-09-22 09:45:12 IST',
  'Aanya Sharma',
  'startup',
  'SUBMIT_APPLICATION',
  'Application',
  'APP-01',
  'Submitted technical proposal and DPIIT verification for DURIE solution',
  'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
),
(
  'audit-03',
  '2026-09-22 10:30:45 IST',
  'Prof. S. Ramanathan',
  'expert',
  'RECORD_EVALUATION',
  'Evaluation',
  'EVAL-01',
  'Scored EcoRoute Technologies (92/100) - Recommended for Sandbox Pilot',
  '7d793037a0760186574b0282f2f435e7b1e7377ec7076a0cf3baff4de5e741fa'
),
(
  'audit-04',
  '2026-09-22 11:15:20 IST',
  'Rajesh Varma, IAS',
  'government',
  'APPROVE_PAYMENT',
  'PaymentMilestone',
  'PAY-02',
  'Approved Tranche 2 disbursal ₹15,20,000 upon verified 24.8% fuel reduction telemetry',
  '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
)
on conflict (id) do nothing;
