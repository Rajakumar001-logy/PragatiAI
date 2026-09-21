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
  Zap,
  Globe,
  HelpCircle,
  Clock,
  Layers,
  BarChart3,
  Check,
  Building2,
  MapPin,
  Cpu,
} from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, Input } from '@/components/ui';
import { useAuth } from '@/auth/AuthProvider';
import { mockService } from '@/services/mockService';
import { UserRole, Challenge } from '@/types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAsRole, signIn, signUp } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    mockService.getChallenges().then((list) => setChallenges(list.slice(0, 4)));
  }, []);

  // Direct Auth State for the inline sign-in / registration
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('government');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Selected stage for interactive 7-stage walkthrough
  const [activeStage, setActiveStage] = useState(0);

  const handleQuickDemo = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'government') navigate('/government');
    else if (role === 'startup') navigate('/startup');
    else if (role === 'expert') navigate('/expert');
    else if (role === 'admin') navigate('/admin');
  };

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        const loggedInUser = await signIn(email || 'rajesh.varma@gov.in', password, selectedRole);
        setAuthSuccessMsg(`Logged in as ${loggedInUser.name} (${loggedInUser.role})! Redirecting...`);
        setTimeout(() => {
          if (loggedInUser.role === 'government') navigate('/government');
          else if (loggedInUser.role === 'startup') navigate('/startup');
          else if (loggedInUser.role === 'expert') navigate('/expert');
          else navigate('/admin');
        }, 800);
      } else {
        const newUser = await signUp({
          name: name || 'Demo User',
          email: email || `user_${Date.now()}@domain.in`,
          password,
          role: selectedRole,
          departmentOrCompany: organization || (selectedRole === 'government' ? 'State Innovation Mission' : 'NexGen AI Solutions'),
        });
        setAuthSuccessMsg(`Welcome, ${newUser.name}! Account registered. Redirecting...`);
        setTimeout(() => {
          if (newUser.role === 'government') navigate('/government');
          else if (newUser.role === 'startup') navigate('/startup');
          else if (newUser.role === 'expert') navigate('/expert');
          else navigate('/admin');
        }, 800);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stages = [
    {
      step: '01',
      title: 'Problem Formulation',
      icon: Award,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Outcome-Based',
      desc: 'Government departments formulate actionable problem statements with clear baseline KPIs and budget allocations, avoiding proprietary vendor lock-in.',
      deliverables: ['Standardized Challenge Specification', 'Target KPI Matrix & Weights', 'Sandbox Budget Allocation'],
    },
    {
      step: '02',
      title: 'AI Startup Discovery',
      icon: Sparkles,
      color: 'from-sky-600 to-blue-700',
      badge: 'Automated Match',
      desc: 'AI semantic matching analyzes startup capability profiles, DPIIT credentials, and technical readiness against ministry requirements.',
      deliverables: ['DPIIT Verification Check', 'AI Compatibility Score & Rationale', 'Automated Shortlist Matrix'],
    },
    {
      step: '03',
      title: '6-Criteria Expert Review',
      icon: GraduationCap,
      color: 'from-amber-600 to-orange-600',
      badge: 'IIT / CSIR Committee',
      desc: 'Independent domain experts from premier technical institutes score proposals on a rigorous 100-point rubric across feasibility, innovation, and scalability.',
      deliverables: ['100-Point Weighted Scorecard', 'Technical Feasibility Dossier', 'Committee Decision Protocol'],
    },
    {
      step: '04',
      title: 'Controlled Sandboxing',
      icon: FlaskConical,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Live Testing',
      desc: 'Selected startups deploy their prototypes in live, risk-mitigated government sandboxes with real telemetry and hardware-in-the-loop validation.',
      deliverables: ['Sandbox Testbed Agreement', 'IoT / Telemetry Stream', 'Sprint Milestone Tracking'],
    },
    {
      step: '05',
      title: 'Independent KPI Validation',
      icon: LineChart,
      color: 'from-violet-600 to-purple-600',
      badge: 'Third-Party Certified',
      desc: 'Third-party auditors (IITs, CSIR, STQC) inspect pilot data against baseline targets to generate tamper-proof validation reports.',
      deliverables: ['IIT / CSIR Audit Certificate', 'Baseline vs Actual KPI Telemetry', 'Production Readiness Rating'],
    },
    {
      step: '06',
      title: 'Milestone Payments',
      icon: CreditCard,
      color: 'from-teal-600 to-emerald-700',
      badge: 'PFMS Integrated',
      desc: 'Guaranteed milestone disbursements released directly through escrow upon verified metric attainment, ensuring zero delayed payments.',
      deliverables: ['PFMS Disbursement Order', 'Cryptographic Escrow Log', 'Milestone Completion Certificate'],
    },
    {
      step: '07',
      title: 'GeM Scale-Up Gateway',
      icon: TrendingUp,
      color: 'from-rose-600 to-pink-600',
      badge: 'GFR 149(viii) Scale',
      desc: 'Validated pilot solutions transition directly to pan-India public procurement via Government e-Marketplace (GeM) catalogue listing.',
      deliverables: ['Direct GeM Catalogue Entry', 'Pan-India Ministry Rollout Plan', 'State-Level Scale-Up Contract'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Tricolor National Accent Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      {/* Indian Government Emblem Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">🇮🇳 Government of India</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Smart India Hackathon 2024 Prototype</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden sm:inline text-blue-300">DPIIT Vetted</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-400">GFR 2017 Rule 149(viii) Compliant</span>
            <span>•</span>
            <span className="text-amber-400">GeM Scale-Up Ready</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-navy-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-tight">Pragati AI</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  SIH
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                From Government Problems to Scalable Innovation
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#challenges" className="hover:text-blue-400 transition-colors">
              Active Challenges
            </a>
            <a href="#portals" className="hover:text-blue-400 transition-colors">
              Stakeholder Portals
            </a>
            <a href="#auth-section" className="hover:text-blue-400 transition-colors">
              Login / Register
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Dashboard ({user.role})
              </Button>
            ) : (
              <>
                <a href="#auth-section">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                    Sign In
                  </Button>
                </a>
                <a href="#auth-section">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Enter Platform
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-indigo-600/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>National Innovation Procurement Infrastructure</span>
            <span className="bg-blue-500/30 px-1.5 py-0.5 rounded text-[10px] text-blue-200">New</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            From Government Problems to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Scalable Innovation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Pragati AI bridges the gap between Indian government departments and high-impact startups through standardized
            outcome challenges, AI capability discovery, controlled sandboxes, verifiable KPI telemetry, and direct GeM scale-up.
          </p>

          {/* CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <a href="#auth-section">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-600/30 px-6"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In / Enter Platform
              </Button>
            </a>
            <a href="#challenges">
              <Button
                variant="secondary"
                size="lg"
                className="bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600 font-semibold px-6"
              >
                Browse Active Challenges
              </Button>
            </a>
            <button
              onClick={() => handleQuickDemo('government')}
              className="px-5 py-3 rounded-lg text-sm font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>1-Click Judge Demo</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">No 3-Yr Turnover Barrier</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">AI Capability Matching</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">Milestone Escrow Payouts</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">Tamper-Proof Audit Trail</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Ecosystem Stats Bar */}
      <section className="bg-slate-900/80 border-y border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-white">₹145+ Cr</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Innovation Budget Allocated</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-400">1,200+</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">DPIIT-Recognized Startups</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">48+</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Ministry Challenges</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-purple-400">94.6%</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pilot Validation Success Rate</p>
          </div>
        </div>
      </section>

      {/* 7-Stage Innovation Procurement Lifecycle */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="primary" size="md">
            The 7-Stage Framework
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Pragati AI Powers Procurement
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A legally compliant, transparent, and evidence-based innovation pipeline compliant with GFR 2017 Rule 149(viii).
          </p>
        </div>

        {/* Interactive Stages Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stg.step}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 text-white'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>
                    {stg.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-300' : 'text-slate-500'}`} />
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
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Stage {cur.step} of 07
                      </span>
                      <h3 className="text-2xl font-black text-white">{cur.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{cur.desc}</p>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Deliverables & Artefacts</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {cur.deliverables.map((item) => (
                        <div key={item} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Target Role</span>
                    <Badge variant="navy" size="sm">
                      {cur.badge}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 space-y-2">
                    <p>
                      <strong className="text-slate-200">Automation Level:</strong> Real-time AI Validation & Smart Checkpoints
                    </p>
                    <p>
                      <strong className="text-slate-200">Legal Audit:</strong> SHA-256 Hash Logged
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-500"
                    onClick={() => handleQuickDemo('government')}
                  >
                    Experience Stage {cur.step} in Demo →
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Featured Innovation Challenges Showcase */}
      <section id="challenges" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="success" size="md" className="mb-2">
              Outcome-Based Challenges
            </Badge>
            <h2 className="text-3xl font-black text-white tracking-tight">Active Ministry Problem Statements</h2>
            <p className="text-sm text-slate-400 mt-1">
              Startups can apply directly to solve mission-critical government challenges.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickDemo('startup')}
            className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            View All 48 Challenges →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <Card key={c.id} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {c.code}
                  </span>
                  <Badge variant="primary" size="sm">
                    {c.currentStage}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-white line-clamp-1">{c.title}</CardTitle>
                <CardDescription className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{c.ministry}</span>
                  <span>•</span>
                  <span>{c.department}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <p className="line-clamp-2 text-slate-400">{c.problemStatement}</p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Sandbox Budget</span>
                    <span className="font-bold text-emerald-400 text-xs">₹{(c.budgetAllocated / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                    <span className="font-semibold text-slate-200 text-xs">{c.pilotDurationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Deadline</span>
                    <span className="font-semibold text-slate-200 text-xs">{c.applicationDeadline}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Target KPIs: <strong className="text-slate-200">{c.kpis.length} Metrics</strong>
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleQuickDemo('startup')}
                    className="bg-blue-600 hover:bg-blue-500 text-xs py-1"
                  >
                    Apply as Startup
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stakeholder Portals Showcase */}
      <section id="portals" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="navy" size="md">
            Tailored Experiences
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Dedicated role portals tailored for Indian administrative workflows, startup innovation, and academic peer review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Government Portal */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border border-blue-900/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Government Departments</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Formulate standardized outcome-based tenders, eliminate single-vendor lock-in, and test prototypes in controlled sandboxes before multi-crore rollouts.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>5-Step AI Challenge Auto-Drafter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Real-time Sandbox Telemetry Feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Milestone Escrow Payout Trigger</span>
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleQuickDemo('government')}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500"
            >
              Enter Gov Command Center →
            </Button>
          </div>

          {/* Startup Portal */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-900/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">DPIIT Startups & Innovators</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Participate in public procurement without restrictive 3-year prior revenue or turnover thresholds. Receive guaranteed milestone disbursements.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Compatibility Match Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>8-Step Application & Sandbox Wizard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct GeM Scale-up Gateway</span>
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleQuickDemo('startup')}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500"
            >
              Enter Startup Portal →
            </Button>
          </div>

          {/* Expert Workspace */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-900/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Technical Experts & Academics</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Review technical proposals using an objective 6-criteria weighted rubric (out of 100). Certify sandbox results with third-party institutional authority.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Split-Screen Dossier & Scoring Panel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>6-Criteria Slider-Based Rubric</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Third-Party Verification Certification</span>
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleQuickDemo('expert')}
              className="mt-6 w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
            >
              Enter Expert Workspace →
            </Button>
          </div>
        </div>
      </section>

      {/* Direct Interactive Authentication Section (Anyone can sign in / register with custom details) */}
      <section id="auth-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" size="md">
            Direct Platform Access
          </Badge>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Sign In or Register with Your Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Anyone can log in with their custom credentials, register a new ministry/startup account, or use 1-click demo personas.
          </p>
        </div>

        <Card className="bg-slate-900/90 border-slate-800 shadow-2xl overflow-hidden">
          {/* Auth Mode Toggle Header */}
          <div className="grid grid-cols-2 border-b border-slate-800 text-center font-bold text-xs sm:text-sm">
            <button
              onClick={() => setAuthMode('login')}
              className={`py-3.5 transition-colors ${
                authMode === 'login' ? 'bg-blue-600 text-white shadow-inner' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Existing Account
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`py-3.5 transition-colors ${
                authMode === 'register' ? 'bg-blue-600 text-white shadow-inner' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Register New Organization / User
            </button>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Judge Quick Personas Ribbon */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant 1-Click Persona Access (For Judges & Evaluators)</span>
                </span>
                <span className="text-[10px] text-slate-500">Zero Password Needed</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('government')}
                  className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-bold text-left transition-all flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Gov Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('startup')}
                  className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold text-left transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Startup</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('expert')}
                  className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold text-left transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Expert</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-bold text-left transition-all flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {authSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCustomAuth} className="space-y-4">
              {/* Role Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Stakeholder Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'government', label: 'Government Dept', icon: Shield },
                    { id: 'startup', label: 'DPIIT Startup', icon: Briefcase },
                    { id: 'expert', label: 'Technical Expert', icon: GraduationCap },
                    { id: 'admin', label: 'Platform Admin', icon: ShieldAlert },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as UserRole)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 text-left transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {authMode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      required={authMode === 'register'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Ministry / Company / Institute</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Ministry of Health / ArogyaMed AI"
                      required={authMode === 'register'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Official Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMode === 'login' ? 'rajesh.varma@gov.in or any email' : 'officer@gov.in'}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Password / Token</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/30"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting
                  ? 'Authenticating...'
                  : authMode === 'login'
                  ? `Sign In as ${selectedRole.toUpperCase()}`
                  : `Complete Registration & Enter Platform`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              PA
            </div>
            <div>
              <p className="font-bold text-slate-300">Pragati AI Platform</p>
              <p className="text-[11px] text-slate-500">Smart India Hackathon Prototype</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] space-y-1">
            <p className="text-slate-400">Compliant with GFR 2017 Rule 149(viii) & Startup India Guidelines</p>
            <p>© 2026 Pragati AI. From Government Problems to Scalable Innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
