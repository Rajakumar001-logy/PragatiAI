import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Building,
  TrendingUp,
  FlaskConical,
  LineChart,
  CreditCard,
  Award,
  ChevronRight,
  FileCheck2,
  Users,
  Search,
  ExternalLink,
  Check,
  Building2,
  MapPin,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, Input } from '@/components/ui';
import { useAuth } from '@/auth/AuthProvider';
import { mockService } from '@/services/mockService';
import { UserRole, Challenge } from '@/types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithCredentials } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    mockService.getChallenges().then((list) => setChallenges(list.slice(0, 4)));
  }, []);

  // Secure Portal Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Selected stage for interactive 7-stage walkthrough
  const [activeStage, setActiveStage] = useState(0);

  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthErrorMsg('');
    setAuthSuccessMsg('');

    try {
      const result = await signInWithCredentials(email, password);
      if (!result.success) {
        setAuthErrorMsg(result.error || 'Invalid credentials. Please verify your registered email ID and password.');
        return;
      }
      setAuthSuccessMsg(`Authentication successful. Redirecting to your official dashboard...`);
      setTimeout(() => {
        navigate(result.targetDashboard || '/government');
      }, 500);
    } catch (err) {
      setAuthErrorMsg('An error occurred during authentication. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stages = [
    {
      step: '01',
      title: 'Problem Formulation',
      icon: Award,
      badge: 'Outcome-Based',
      desc: 'Government departments formulate actionable problem statements with clear baseline KPIs and budget allocations, avoiding proprietary single-vendor lock-in.',
      deliverables: ['Standardized Challenge Specification', 'Target KPI Matrix & Weights', 'Sandbox Budget Allocation'],
    },
    {
      step: '02',
      title: 'AI Startup Discovery',
      icon: Sparkles,
      badge: 'Capability Match',
      desc: 'AI semantic matching analyzes startup capability profiles, DPIIT credentials, and technical readiness against ministry requirements.',
      deliverables: ['DPIIT Verification Check', 'AI Compatibility Score & Rationale', 'Automated Shortlist Matrix'],
    },
    {
      step: '03',
      title: '6-Criteria Expert Review',
      icon: GraduationCap,
      badge: 'IIT / CSIR Committee',
      desc: 'Independent domain experts from premier technical institutes score proposals on a rigorous 100-point rubric across feasibility, innovation, and scalability.',
      deliverables: ['100-Point Weighted Scorecard', 'Technical Feasibility Dossier', 'Committee Decision Protocol'],
    },
    {
      step: '04',
      title: 'Controlled Sandboxing',
      icon: FlaskConical,
      badge: 'Live Field Testing',
      desc: 'Selected startups deploy their prototypes in live, risk-mitigated government sandboxes with real telemetry and hardware-in-the-loop validation.',
      deliverables: ['Sandbox Testbed Agreement', 'IoT / Telemetry Stream', 'Sprint Milestone Tracking'],
    },
    {
      step: '05',
      title: 'Independent KPI Validation',
      icon: LineChart,
      badge: 'Third-Party Certified',
      desc: 'Third-party auditors (IITs, CSIR, STQC) inspect pilot data against baseline targets to generate tamper-proof validation reports.',
      deliverables: ['IIT / CSIR Audit Certificate', 'Baseline vs Actual KPI Telemetry', 'Production Readiness Rating'],
    },
    {
      step: '06',
      title: 'Milestone Payments',
      icon: CreditCard,
      badge: 'PFMS Integrated',
      desc: 'Guaranteed milestone disbursements released directly through escrow upon verified metric attainment, ensuring zero delayed payments.',
      deliverables: ['PFMS Disbursement Order', 'Cryptographic Escrow Log', 'Milestone Completion Certificate'],
    },
    {
      step: '07',
      title: 'GeM Scale-Up Gateway',
      icon: TrendingUp,
      badge: 'GFR 149(viii) Scale',
      desc: 'Validated pilot solutions transition directly to pan-India public procurement via Government e-Marketplace (GeM) catalogue listing.',
      deliverables: ['Direct GeM Catalogue Entry', 'Pan-India Ministry Rollout Plan', 'State-Level Scale-Up Contract'],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-800 selection:text-white relative overflow-hidden">
      {/* Tricolor National Accent Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm" />

      {/* Indian Government Header Ribbon */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">भारत सरकार | Government of India</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Ministry of Electronics & Information Technology (MeitY)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="font-semibold text-blue-900">DPIIT Recognized</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">GFR 2017 Rule 149(viii) Compliant</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">GeM Scale-Up Gateway</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md ring-2 ring-blue-100 group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight">Pragati AI</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200">
                  GOV.IN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                National Innovation Procurement Platform
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <a href="#how-it-works" className="hover:text-blue-800 transition-colors">
              How It Works
            </a>
            <a href="#challenges" className="hover:text-blue-800 transition-colors">
              Active Challenges
            </a>
            <a href="#portals" className="hover:text-blue-800 transition-colors">
              Stakeholder Portals
            </a>
            <a href="#auth-section" className="hover:text-blue-800 transition-colors">
              Sign In
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (user.role === 'government') navigate('/government');
                  else if (user.role === 'startup') navigate('/startup');
                  else if (user.role === 'expert') navigate('/expert');
                  else navigate('/admin');
                }}
                className="bg-navy-900 hover:bg-navy-800 text-white shadow-sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Dashboard ({user.role})
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold shadow-sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Portal Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span>National Digital Public Infrastructure for Innovation Procurement</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            From Government Problems to{' '}
            <span className="text-blue-800">
              Scalable Innovation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Pragati AI bridges the gap between Indian government departments and high-impact startups through standardized
            outcome challenges, AI capability discovery, controlled sandboxes, verifiable KPI telemetry, and direct GeM scale-up.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/login">
              <Button
                variant="primary"
                size="lg"
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold shadow-md shadow-navy-900/20 px-6 py-3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Platform
              </Button>
            </Link>
            <a href="#challenges">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 font-semibold px-6 py-3 shadow-xs"
              >
                Browse Active Challenges
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">No 3-Yr Turnover Barrier</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">AI Capability Matching</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">Milestone Escrow Payouts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">Tamper-Proof Audit Trail</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Statistics Bar */}
      <section className="bg-slate-50 border-y border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-navy-900">₹145+ Cr</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Innovation Budget Allocated</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-800">1,200+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">DPIIT-Recognized Startups</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-700">48+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Ministry Challenges</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-indigo-900">94.6%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilot Validation Success Rate</p>
          </div>
        </div>
      </section>

      {/* 7-Stage Innovation Procurement Lifecycle */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <Badge variant="navy" size="md">
            The 7-Stage Procurement Framework
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Pragati AI Powers Procurement
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A legally compliant, transparent, and evidence-based innovation pipeline compliant with GFR 2017 Rule 149(viii).
          </p>
        </div>

        {/* Interactive Stages Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stg.step}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-navy-900 border-navy-900 shadow-md text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                    {stg.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`} />
                </div>
                <p className="text-xs font-bold truncate">{stg.title}</p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Display Box */}
        {(() => {
          const cur = stages[activeStage];
          const Icon = cur.icon;
          return (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-lg relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-navy-900 text-white shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                        Stage {cur.step} of 07
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">{cur.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{cur.desc}</p>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Deliverables & Artefacts</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {cur.deliverables.map((item) => (
                        <div key={item} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Target Role</span>
                    <Badge variant="navy" size="sm">
                      {cur.badge}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <p>
                      <strong className="text-slate-800">Verification:</strong> Automated AI Validation & Smart Checkpoints
                    </p>
                    <p>
                      <strong className="text-slate-800">Legal Audit:</strong> SHA-256 Cryptographic Hash Logged
                    </p>
                  </div>
                  <Link to="/login">
                    <Button
                      variant="navy"
                      size="sm"
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold mt-2"
                    >
                      Sign In to Access Stage {cur.step} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Featured Innovation Challenges Showcase */}
      <section id="challenges" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="success" size="md" className="mb-2">
              Outcome-Based Challenges
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Ministry Problem Statements</h2>
            <p className="text-sm text-slate-600 mt-1">
              Startups can apply directly through the portal to solve mission-critical government challenges.
            </p>
          </div>
          <Link to="/login">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs"
            >
              Sign In to View All 48 Challenges →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <Card key={c.id} className="bg-white border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {c.code}
                  </span>
                  <Badge variant="navy" size="sm">
                    {c.currentStage}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">{c.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.ministry}</span>
                  <span>•</span>
                  <span>{c.department}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-700 pt-4">
                <p className="line-clamp-2 text-slate-600">{c.problemStatement}</p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Sandbox Budget</span>
                    <span className="font-bold text-emerald-700 text-xs">₹{(c.budgetAllocated / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                    <span className="font-semibold text-slate-800 text-xs">{c.pilotDurationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Deadline</span>
                    <span className="font-semibold text-slate-800 text-xs">{c.applicationDeadline}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    Target KPIs: <strong className="text-slate-800">{c.kpis.length} Metrics</strong>
                  </span>
                  <Link to="/login">
                    <Button
                      variant="navy"
                      size="sm"
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs py-1"
                    >
                      Apply via Portal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stakeholder Portals Showcase */}
      <section id="portals" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <Badge variant="navy" size="md">
            Dedicated Workspaces
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Secure role-based workspaces tailored for Indian administrative officers, startup innovators, and academic peer reviewers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Government Portal */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-blue-900 text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Government Departments</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Formulate standardized outcome-based tenders, eliminate single-vendor lock-in, and test prototypes in controlled sandboxes before multi-crore rollouts.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-700" />
                  <span>5-Step AI Challenge Formulation Wizard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-700" />
                  <span>Real-time Sandbox Telemetry Feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-700" />
                  <span>Milestone Escrow Payout Trigger</span>
                </li>
              </ul>
            </div>
            <Link to="/login">
              <Button
                variant="navy"
                size="sm"
                className="mt-6 w-full bg-navy-900 hover:bg-navy-800 text-white"
              >
                Enter Gov Command Center →
              </Button>
            </Link>
          </div>

          {/* Startup Portal */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-emerald-800 text-white shadow-md">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">DPIIT Startups & Innovators</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Participate in public procurement without restrictive 3-year prior revenue or turnover thresholds. Receive guaranteed milestone disbursements.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI Compatibility Match Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>8-Step Application & Sandbox Proposal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Direct GeM Scale-up Gateway</span>
                </li>
              </ul>
            </div>
            <Link to="/login">
              <Button
                variant="primary"
                size="sm"
                className="mt-6 w-full bg-emerald-800 hover:bg-emerald-700 text-white"
              >
                Enter Startup Portal →
              </Button>
            </Link>
          </div>

          {/* Expert Workspace */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-amber-800 text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Technical Experts & Academics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review technical proposals using an objective 6-criteria weighted rubric (out of 100). Certify sandbox results with third-party institutional authority.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700" />
                  <span>Split-Screen Dossier & Scoring Panel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700" />
                  <span>6-Criteria Slider-Based Rubric</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700" />
                  <span>Third-Party Verification Certification</span>
                </li>
              </ul>
            </div>
            <Link to="/login">
              <Button
                variant="primary"
                size="sm"
                className="mt-6 w-full bg-amber-800 hover:bg-amber-700 text-white font-semibold"
              >
                Enter Expert Workspace →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Sign In Section */}
      <section id="auth-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <Badge variant="navy" size="md">
            Portal Access Gateway
          </Badge>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Official Stakeholder Sign In
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Sign in with your registered stakeholder credentials to access your official dashboard.
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {authErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authErrorMsg}</span>
              </div>
            )}

            {authSuccessMsg && !authErrorMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCredentialAuth} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registered Official Email ID"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@gov.in or registered email"
                  required
                  className="bg-white border-slate-300 text-slate-900 focus:border-blue-700"
                />

                <Input
                  label="Password / Security Token"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="bg-white border-slate-300 text-slate-900 focus:border-blue-700"
                />
              </div>

              <Button
                type="submit"
                variant="navy"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold shadow-md shadow-navy-900/20 py-2.5"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Verifying Official Credentials...' : 'Sign In to Official Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-navy-900 flex items-center justify-center text-white font-bold text-sm">
              PA
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Pragati AI Platform</p>
              <p className="text-[11px] text-slate-500">National Innovation Procurement Portal</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] space-y-1">
            <p className="text-slate-700 font-semibold">Compliant with GFR 2017 Rule 149(viii) & Startup India Guidelines</p>
            <p className="text-slate-500">© 2026 Government of India • Ministry of Electronics & IT • All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
