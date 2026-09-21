# Pragati AI

> **From Government Problems to Scalable Innovation**

Pragati AI is a digital Government Innovation Procurement Platform built as a prototype for Smart India Hackathon (SIH).

It establishes a transparent, competitive, evidence-based, and legally compliant pathway for government departments to discover, test, and scale innovative startup solutions under **General Financial Rules (GFR) 2017 Rule 149(viii)**.

---

## 🏛️ Procurement Lifecycle

```
Government Problem Statement
        ↓
Outcome-Based Innovation Challenge
        ↓
Startup Discovery (DPIIT Empaneled)
        ↓
Automated Eligibility Screening
        ↓
Double-Blind Expert Evaluation (IIT/CSIR)
        ↓
Regulatory Sandbox / Field Pilot
        ↓
Tamper-Evident KPI Measurement
        ↓
Milestone-Based Fund Disbursal
        ↓
Independent Third-Party Validation
        ↓
Direct GeM Scale-Up Purchase Order
```

---

## 🚀 Key Features

- **Government Command Center**: Multi-ministry dashboard tracking challenge budgets, sandboxes, and procurement funnels.
- **Outcome-Based Challenges**: Structured problem statements with measurable quantitative targets.
- **DPIIT Startup Registry**: Deep-tech startup discovery with TRL tracking and compliance verification.
- **Evaluation Committee Desk**: Multi-criteria double-blind scoring rubric for scientific and academic evaluators.
- **Pilot & Sandbox Telemetry**: Live IoT/algorithmic telemetry monitoring with safe-harbor regulatory shielding.
- **KPI Evidence Grid**: Objective baseline vs. target tracking powering automated milestone releases.
- **Milestone Payment Governance**: PFMS-aligned escrow and tranche disbursal system.
- **Independent Validation**: CSIR & IIT validation reports with legal certifications.
- **GeM Scale-Up Gateway**: Direct-to-procurement transitions under GFR Rule 149(viii).
- **Interactive Persona Switcher**: Seamlessly switch between Government Officer (IAS), Startup Founder, Evaluator (IIT), and Admin roles.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS (Government Enterprise Blue/Navy identity)
- **Icons**: Lucide React
- **Architecture**: Modular service-oriented architecture designed for easy future backend integration (Supabase, PostgreSQL, AI pipelines, PFMS & GeM APIs).

---

## 📦 Getting Started

### Prerequisites

- Node.js (v22+)
- npm (v9+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rajakumar001-logy/PragatiAI.git
   cd PragatiAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173/
   ```

### Production Build

```bash
npm run build
```

---

## Supabase backend setup

The frontend uses Supabase Auth and reads its workflow data from Supabase. It intentionally uses only a browser-safe publishable key. Never expose a `SUPABASE_SECRET_KEY` through a `VITE_` variable or commit it to the repository.

1. In the Supabase SQL Editor, run [the initial migration](supabase/migrations/20260914180000_create_platform_backend.sql). This creates the profiles table, resource tables, a new-user profile trigger, and row-level security policies.
2. Enable Email authentication in Supabase and create the initial user account. New accounts begin with the `startup` role. Promote a government user after creation:

   ```sql
   update public.profiles
   set role = 'government'
   where id = '<auth-user-uuid>';
   ```

3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_PUBLISHABLE_KEY`. For Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Project Settings → Environment Variables, then redeploy.
4. Insert records using the existing TypeScript shapes in the `data` JSONB field of each resource table. The frontend now reads those records directly. A future migration can normalise individual resource fields once reporting or server-side filtering requires it.

The supplied secret key is for future server-side or Edge Function work only. It is not needed by the static Vite frontend and should remain in a protected server environment.

---

## 📄 License

This prototype is developed for the Smart India Hackathon.
