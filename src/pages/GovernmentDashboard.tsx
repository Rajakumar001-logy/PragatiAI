import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  ProgressBar,
  StatusIndicator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Challenge, Pilot } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import {
  Award,
  Building2,
  FlaskConical,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [metrics, setMetrics] = useState({
    activeChallenges: 0,
    vettedStartups: 0,
    activePilots: 0,
    validatedSolutions: 0,
    totalCommittedFunds: 0,
    totalDisbursedFunds: 0,
    scaleUpPipelineValue: 0,
  });

  useEffect(() => {
    mockService.getChallenges().then(setChallenges);
    mockService.getPilots().then(setPilots);
    mockService.getPlatformMetrics().then(setMetrics);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Digital Innovation Procurement Framework
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Government Innovation Command Center
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Move from public problem statements to verified pilot deployments, legally compliant milestone payments, and nationwide GeM scale-up.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/challenges">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Create Problem Challenge
              </Button>
            </Link>
            <Link to="/pilots">
              <Button variant="outline" size="sm" className="text-white bg-white/10 hover:bg-white/20 border-white/20">
                View Active Sandboxes ({metrics.activePilots})
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Layers className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Challenges</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.activeChallenges}</p>
              <p className="text-xs text-slate-500 mt-0.5">Across 3 Central Ministries</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Pilots / Sandboxes</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.activePilots}</p>
              <p className="text-xs text-emerald-600 mt-0.5 font-medium">100% Live Telemetry Connected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Validated Solutions</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.validatedSolutions}</p>
              <p className="text-xs text-slate-500 mt-0.5">CSIR / IIT Verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-navy-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scale-up Pipeline</span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.scaleUpPipelineValue)}</p>
              <p className="text-xs text-blue-600 mt-0.5 font-medium">Ready for GeM Direct Buy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Lifecycle Pipeline Stepper */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Government Innovation Procurement Funnel</CardTitle>
              <CardDescription>
                Live tracker of innovation challenges progressing from problem definitions to scale-up
              </CardDescription>
            </div>
            <Badge variant="primary">GFR 2017 Compliant</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {[
              { step: '1. Problem Challenge', desc: 'Outcome-defined requirements', count: '3 Active' },
              { step: '2. Startup Screening', desc: 'DPIIT & eligibility filters', count: '43 Applied' },
              { step: '3. Sandbox Pilot', desc: 'Real-world field testbed', count: '2 Live' },
              { step: '4. Third-Party Audit', desc: 'Independent validation', count: '1 Validated' },
              { step: '5. GeM Scale-up', desc: 'Direct public procurement', count: '₹42.5 Cr' },
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{s.step}</span>
                  <span className="text-slate-500 text-[11px] mt-1 block">{s.desc}</span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-blue-700 text-xs">{s.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Section: Live Challenges & Sandbox Pilots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Priority Department Challenges</h3>
            <Link to="/challenges" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {challenges.map((c) => (
              <Card key={c.id} className="hover:border-blue-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-700">{c.code}</span>
                        <Badge variant="navy" size="sm">{c.ministry}</Badge>
                        <StatusIndicator status={c.currentStage} label={c.currentStage} />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.problemStatement}
                      </p>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <p className="text-xs text-slate-400">Allocated Sandbox Budget</p>
                      <p className="text-base font-bold text-slate-900">{formatCurrency(c.budgetAllocated)}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.totalApplicants} Startups Applied</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pilot Duration: <strong>{c.pilotDurationDays} Days</strong></span>
                    </div>
                    <Link to="/challenges">
                      <Button variant="ghost" size="sm" className="text-blue-700 p-0 hover:bg-transparent">
                        View Challenge Details →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Pilots Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Live Field Pilots</h3>
            <Link to="/pilots" className="text-xs font-semibold text-blue-700 hover:underline">
              Sandboxes
            </Link>
          </div>

          <div className="space-y-3">
            {pilots.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
                      {p.startupName}
                    </span>
                    <Badge variant={p.status === 'Completed' ? 'success' : 'warning'} size="sm">
                      {p.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">{p.challengeTitle}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Pilot Progress</span>
                      <span className="font-semibold">{p.completionPercentage}%</span>
                    </div>
                    <ProgressBar
                      value={p.completionPercentage}
                      size="sm"
                      variant={p.completionPercentage === 100 ? 'emerald' : 'blue'}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Live KPI Score</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {p.liveKpiScore}/100
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-blue-50 to-slate-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs mb-1">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  Direct GeM Onboarding
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Startups achieving 100% validated pilots qualify for direct government procurement without repetitive tendering.
                </p>
                <Link to="/scale-up" className="mt-3 block">
                  <Button variant="navy" size="sm" className="w-full text-xs">
                    Scale-up Recommendations
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
