import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { UserRole } from '@/types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole, signIn } = useAuth();
  const [email, setEmail] = useState('rajesh.varma@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'government') navigate('/government');
    else if (role === 'startup') navigate('/startup');
    else if (role === 'expert') navigate('/expert');
    else if (role === 'admin') navigate('/admin');
  };

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
    navigate('/government');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-6">
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
              SIH Prototype Demo
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              GFR 2017 Rule 149(viii)
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-white shadow-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base sm:text-lg">Select Demo Persona</CardTitle>
            <CardDescription className="text-xs">
              Experience the end-to-end procurement journey as any stakeholder (No credentials required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {/* Quick Demo Persona Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('government')}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-400 transition-all text-left shadow-xs"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-lg bg-navy-900 text-white shadow-sm">
                    <Shield className="w-4 h-4 text-blue-300" />
                  </div>
                  <Badge variant="navy" size="sm">Gov IAS</Badge>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">Government Officer</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">MoHUA / Smart Cities</p>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-semibold text-blue-800">
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('startup')}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 transition-all text-left shadow-xs"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-lg bg-emerald-700 text-white shadow-sm">
                    <Briefcase className="w-4 h-4 text-emerald-200" />
                  </div>
                  <Badge variant="success" size="sm">DPIIT Vetted</Badge>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">Startup Innovator</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">EcoRoute Technologies</p>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                  <span>Apply & Track Pilot</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('expert')}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-400 transition-all text-left shadow-xs"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-lg bg-amber-700 text-white shadow-sm">
                    <GraduationCap className="w-4 h-4 text-amber-200" />
                  </div>
                  <Badge variant="warning" size="sm">IIT / CSIR</Badge>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">Technical Evaluator</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Prof. S. Ramanathan</p>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-semibold text-amber-900">
                  <span>Evaluation Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-400 transition-all text-left shadow-xs"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-lg bg-purple-900 text-white shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-purple-200" />
                  </div>
                  <Badge variant="primary" size="sm">Platform</Badge>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">Platform Admin</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Directorate General</p>
                </div>
                <div className="mt-2 pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-semibold text-purple-900">
                  <span>System Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold text-[10px]">
                  Or Standard Email Authentication
                </span>
              </div>
            </div>

            <form onSubmit={handleCustomSignIn} className="space-y-3">
              <Input
                label="Official Email ID"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@gov.in"
                required
              />
              <Input
                label="Password / Security Token"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="navy"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In with Government ID'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center block">
            <p className="text-[11px] text-slate-500">
              National Innovation Procurement System • Smart India Hackathon Prototype
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
