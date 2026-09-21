import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Badge,
} from '@/components/ui';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { UserRole } from '@/types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole, signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('rajesh.varma@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('government');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'government') navigate('/government');
    else if (role === 'startup') navigate('/startup');
    else if (role === 'expert') navigate('/expert');
    else if (role === 'admin') navigate('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (tab === 'signin') {
        const u = await signIn(email, password, selectedRole);
        setMessage(`Authenticated as ${u.name}! Redirecting...`);
        setTimeout(() => {
          if (u.role === 'government') navigate('/government');
          else if (u.role === 'startup') navigate('/startup');
          else if (u.role === 'expert') navigate('/expert');
          else navigate('/admin');
        }, 500);
      } else {
        const u = await signUp({
          name: name || 'Demo Officer',
          email: email || `user_${Date.now()}@domain.in`,
          password,
          role: selectedRole,
          departmentOrCompany: organization || (selectedRole === 'government' ? 'State Innovation Council' : 'InnoTech Solutions'),
        });
        setMessage(`Account created for ${u.name}! Redirecting...`);
        setTimeout(() => {
          if (u.role === 'government') navigate('/government');
          else if (u.role === 'startup') navigate('/startup');
          else if (u.role === 'expert') navigate('/expert');
          else navigate('/admin');
        }, 500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Return to Home Link */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-6 pt-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-navy-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 mb-2 ring-1 ring-white/20">
            <Sparkles className="h-7 w-7 text-blue-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pragati AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Government Innovation Procurement Platform
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="text-[11px] text-blue-300 font-semibold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
              SIH Prototype
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              GFR 2017 Rule 149(viii)
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-white shadow-2xl overflow-hidden">
          {/* Top Auth Mode Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 text-center font-bold text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`py-3 transition-colors ${
                tab === 'signin' ? 'bg-slate-900 text-white shadow-inner' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sign In with Credentials
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-3 transition-colors ${
                tab === 'register' ? 'bg-slate-900 text-white shadow-inner' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Register New Account
            </button>
          </div>

          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  {tab === 'signin' ? 'Account Authentication' : 'Create New Stakeholder Account'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tab === 'signin'
                    ? 'Enter your official credentials or use 1-click demo personas below'
                    : 'Register as Government Department, DPIIT Startup, or Technical Expert'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Quick Demo Persona Ribbon */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant 1-Click Role Login (Demo & Evaluation)</span>
                </span>
                <span className="text-[10px] text-slate-400">Zero Password</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('government')}
                  className="p-2 rounded-lg bg-blue-100/70 border border-blue-300 text-blue-900 hover:bg-blue-200 text-xs font-bold text-left transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="truncate">Gov Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('startup')}
                  className="p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 hover:bg-emerald-200 text-xs font-bold text-left transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Startup</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('expert')}
                  className="p-2 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-950 hover:bg-amber-200 text-xs font-bold text-left transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">Expert</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2 rounded-lg bg-purple-100/70 border border-purple-300 text-purple-950 hover:bg-purple-200 text-xs font-bold text-left transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span className="truncate">Admin</span>
                </button>
              </div>
            </div>

            {message && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Custom Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Role Picker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Stakeholder Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'government', label: 'Government', icon: Shield },
                    { id: 'startup', label: 'Startup', icon: Briefcase },
                    { id: 'expert', label: 'Expert', icon: GraduationCap },
                    { id: 'admin', label: 'Admin', icon: ShieldAlert },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as UserRole)}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 text-left transition-all ${
                          isSelected
                            ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {tab === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    required
                  />
                  <Input
                    label="Ministry / Organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Ministry of Health"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Official Email ID"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@gov.in or any email"
                  required
                />
                <Input
                  label="Password / Token"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="navy"
                className="w-full mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Verifying...'
                  : tab === 'signin'
                  ? `Sign In as ${selectedRole.toUpperCase()}`
                  : `Complete Registration & Enter Platform`}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 text-center block">
            <p className="text-[11px] text-slate-500">
              National Innovation Procurement System • Smart India Hackathon Prototype
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
