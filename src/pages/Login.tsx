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
import { mockUsers } from '@/data/mockData';
import { mockService } from '@/services/mockService';
import { UserRole } from '@/types';
import { Sparkles, ShieldCheck, ArrowRight, Building, GraduationCap, Briefcase, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rajesh.varma@gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleQuickLogin = (role: UserRole) => {
    mockService.switchRole(role);
    if (role === 'expert') {
      navigate('/expert');
    } else if (role === 'startup') {
      navigate('/startup');
    } else {
      navigate('/government');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/government');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20 mb-2">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pragati AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Government Innovation Procurement Platform
          </p>
          <div className="pt-1">
            <span className="text-[11px] text-blue-400 font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              Smart India Hackathon Prototype
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-white shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Platform Access</CardTitle>
            <CardDescription className="text-xs">
              Authenticate using government Single Sign-On (Parichay / MeriPehchaan) or role credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Official Email ID"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@gov.in"
                required
              />
              <Input
                label="Password / Token"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="navy" className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Secure Sign In
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold text-[10px]">
                  Or Instant Prototype Demo Login
                </span>
              </div>
            </div>

            {/* Persona Quick Logins */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('government')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-navy-900 text-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Government Officer (IAS)</p>
                    <p className="text-[10px] text-slate-500">Ministry of Housing & Urban Affairs</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('startup')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-blue-600 text-white">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Startup Innovator</p>
                    <p className="text-[10px] text-slate-500">EcoRoute Technologies Pvt Ltd</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('expert')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-amber-600 text-white">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Technical Evaluator</p>
                    <p className="text-[10px] text-slate-500">IIT Delhi / CSIR Scientist</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center block">
            <p className="text-[11px] text-slate-500">
              National Innovation Procurement System • GFR 2017 Compliant
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
