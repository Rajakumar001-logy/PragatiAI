import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Modal,
  Input,
  Textarea,
  Select,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Challenge, Pilot, KPIMeasurement, Application, AuditLogEntry } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
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
  FileCheck2,
  Compass,
  CheckCircle2,
  FileText,
  Activity,
  Bot,
} from 'lucide-react';
import { GeneratedChallengeDraft } from '@/types';
import { AIChallengeAssistantModal } from '@/components/challenges/AIChallengeAssistantModal';


export const GovernmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [kpis, setKpis] = useState<KPIMeasurement[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [metrics, setMetrics] = useState({
    activeChallenges: 0,
    applicationsReceived: 0,
    activePilots: 0,
    solutionsReadyForScale: 0,
    totalCommittedFunds: 0,
    totalDisbursedFunds: 0,
  });

  // Multi-step challenge wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Ministry of Housing & Urban Affairs');
  const [newProblem, setNewProblem] = useState('');
  const [newSituation, setNewSituation] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newTech, setNewTech] = useState('AI Computer Vision, IoT Telematics');
  const [newUsers, setNewUsers] = useState('Municipal Field Engineers');
  const [newArea, setNewArea] = useState('Tier-1 Smart City Sandbox');
  const [newBudget, setNewBudget] = useState('5000000');
  const [newDuration, setNewDuration] = useState('60');
  const [kpi1Name, setKpi1Name] = useState('Operational Efficiency Improvement');
  const [kpi1Baseline, setKpi1Baseline] = useState('0%');
  const [kpi1Target, setKpi1Target] = useState('25%');
  const [kpi1Method, setKpi1Method] = useState('Automated Telemetry Benchmark');
  const [startupStage, setStartupStage] = useState('DPIIT Registered (TRL 7+)');
  const [certifications, setCertifications] = useState('ISO 9001, ISO 27001');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleApplyAIDraft = (draft: GeneratedChallengeDraft) => {
    setNewTitle(draft.title);
    setNewDept(draft.department ? `${draft.department} (${draft.ministry})` : draft.ministry);
    setNewProblem(draft.problemStatement);
    setNewSituation(draft.currentSituation);
    setNewOutcome(draft.expectedOutcome);
    setNewTech(draft.requiredTechnology.join(', '));
    setNewUsers(draft.targetUsers);
    setNewArea(draft.geographicArea);
    setNewBudget(String(draft.budgetAllocated));
    setNewDuration(String(draft.pilotDurationDays));
    if (draft.kpis && draft.kpis.length > 0) {
      setKpi1Name(draft.kpis[0].name);
      setKpi1Baseline(`${draft.kpis[0].baseline} ${draft.kpis[0].unit || ''}`.trim());
      setKpi1Target(`${draft.kpis[0].target} ${draft.kpis[0].unit || ''}`.trim());
      setKpi1Method(draft.kpis[0].measurementMethod || 'Independent Telemetry Verification');
    }
    if (draft.eligibilityCriteria) {
      setStartupStage(draft.eligibilityCriteria.startupStage);
      setCertifications(draft.eligibilityCriteria.requiredCertifications.join(', '));
    }
    // Open wizard directly to review step so the officer can inspect the generated draft
    setWizardStep(5);
    setIsWizardOpen(true);
  };

  const handleDirectPublishAIDraft = async (draft: GeneratedChallengeDraft) => {
    await mockService.createChallenge({
      title: draft.title,
      problemStatement: draft.problemStatement,
      currentSituation: draft.currentSituation,
      expectedOutcome: draft.expectedOutcome,
      department: draft.department,
      ministry: draft.ministry,
      requiredTechnology: draft.requiredTechnology,
      targetUsers: draft.targetUsers,
      geographicArea: draft.geographicArea,
      budgetAllocated: draft.budgetAllocated,
      currentStage: 'OPEN',
      applicationDeadline: '2026-11-30',
      pilotDurationDays: draft.pilotDurationDays,
      tags: draft.tags,
      kpis: draft.kpis,
      eligibilityCriteria: draft.eligibilityCriteria,
    });
    navigate('/challenges');
  };


  const loadData = () => {
    mockService.getChallenges().then(setChallenges);
    mockService.getPilots().then(setPilots);
    mockService.getKPIs().then(setKpis);
    mockService.getApplications().then(setApplications);
    mockService.getAuditLogs().then((logs) => setAuditLogs(logs.slice(0, 5)));
    mockService.getPlatformMetrics().then(setMetrics);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handlePublishChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockService.createChallenge({
      title: newTitle || 'AI-Based Municipal Asset Profiling',
      problemStatement: newProblem || 'Standard manual asset inspections are delayed and lack real-time photographic audit evidence.',
      currentSituation: newSituation || 'Over 40% of municipal assets are not geotagged or inspected in scheduled timelines.',
      expectedOutcome: newOutcome || 'Automated classification of asset damage with >= 90% precision over 60-day sandbox pilot.',
      department: newDept,
      ministry: 'Ministry of Housing & Urban Affairs (MoHUA)',
      requiredTechnology: newTech.split(',').map((t) => t.trim()),
      targetUsers: newUsers,
      geographicArea: newArea,
      budgetAllocated: Number(newBudget) || 5000000,
      currentStage: 'OPEN',
      applicationDeadline: '2026-11-30',
      pilotDurationDays: Number(newDuration) || 60,
      tags: ['Smart Cities', 'Asset AI', 'SIH 2026'],
      kpis: [
        { id: `kpi-${Date.now()}-1`, name: kpi1Name, unit: '%', baseline: 0, target: 25, weightage: 50, measurementMethod: kpi1Method },
        { id: `kpi-${Date.now()}-2`, name: 'Audit SLA Adherence', unit: '%', baseline: 60, target: 99, weightage: 50, measurementMethod: 'Swachhata API logs' },
      ],
      eligibilityCriteria: {
        startupStage,
        requiredCertifications: certifications.split(',').map((c) => c.trim()),
        technologyRequirements: 'Sub-second neural network inference on low-power devices',
        securityRequirements: 'ISO 27001 / CERT-In compliance with Indian sovereign cloud hosting',
      },
    });

    setIsWizardOpen(false);
    setWizardStep(1);
    navigate('/challenges');
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Government Innovation Procurement Command Center (GFR Rule 149(viii))
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Transforming Public Problems into Scalable Innovations
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover DPIIT-vetted startups, run risk-shielded sandbox pilots, measure tamper-evident telemetry KPIs, release milestone payments, and transition into nationwide GeM public procurement.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAIModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 border border-blue-400/30"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Draft with AI (Gemini / OpenAI)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setWizardStep(1);
                setIsWizardOpen(true);
              }}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Manual Wizard
            </Button>
            <Link to="/discover-startups">
              <Button variant="outline" size="sm" className="text-white bg-white/10 hover:bg-white/20 border-white/20" leftIcon={<Compass className="w-4 h-4" />}>
                AI Startup Discovery
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Layers className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Top 4 KPI Cards */}
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
              <p className="text-xs text-slate-500 mt-0.5">Across Central Ministries</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applications Received</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.applicationsReceived}</p>
              <p className="text-xs text-purple-700 mt-0.5 font-medium">DPIIT Empaneled Startups</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Pilots</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.activePilots}</p>
              <p className="text-xs text-emerald-700 mt-0.5 font-medium">Live Telemetry Connected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solutions Ready for Scale</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{metrics.solutionsReadyForScale}</p>
              <p className="text-xs text-blue-600 mt-0.5 font-medium">GeM Direct Buy Eligible</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A. Procurement Pipeline Funnel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Government Innovation Procurement Pipeline</CardTitle>
              <CardDescription>
                End-to-end statutory funnel tracking innovations from problem challenge to nationwide scale-up
              </CardDescription>
            </div>
            <Badge variant="primary">GFR 2017 Funnel</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-xs">
            {[
              { stage: '1. Challenge', count: challenges.length, desc: 'Problem Defined', link: '/challenges' },
              { stage: '2. Matching', count: `${metrics.applicationsReceived} Startups`, desc: 'AI Match & Screening', link: '/discover-startups' },
              { stage: '3. Evaluation', count: '2 Assessed', desc: 'Double-Blind Review', link: '/evaluations' },
              { stage: '4. Pilot', count: `${metrics.activePilots} Live`, desc: 'Sandbox Testbed', link: '/pilots' },
              { stage: '5. Validation', count: '2 Validated', desc: 'CSIR / IIT Audit', link: '/validation' },
              { stage: '6. Procurement', count: '₹2.8 Cr', desc: 'Milestone Disbursal', link: '/payments' },
              { stage: '7. Scale', count: '₹42.5 Cr', desc: 'GeM Direct Order', link: '/scale-up' },
            ].map((st, idx) => (
              <Link
                key={idx}
                to={st.link}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{st.stage}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{st.desc}</span>
                </div>
                <div className="mt-3 pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-blue-700 text-xs">{st.count}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: B. Active Challenges & C. Pilot Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: B. Active Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Priority Department Challenges</h3>
            <Link to="/challenges" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
              View All ({challenges.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge Code & Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {c.code}
                        </span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{c.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{c.department}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(c.budgetAllocated)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-blue-700">
                      {c.totalApplicants} Startups
                    </TableCell>
                    <TableCell>
                      <StatusIndicator status={c.currentStage} label={c.currentStage} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(c.applicationDeadline)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right 1 Col: C. Pilot Performance & D. Recent Activities */}
        <div className="space-y-6">
          {/* C. Pilot Performance */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Pilot Performance & KPI Progress</CardTitle>
                <Link to="/kpis" className="text-[11px] font-bold text-blue-700 hover:underline">
                  All KPIs
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {kpis.slice(0, 3).map((kpi) => (
                <div key={kpi.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{kpi.metricName}</p>
                      <p className="text-[10px] text-slate-500">{kpi.startupName}</p>
                    </div>
                    <Badge variant={kpi.status === 'Exceeding' ? 'success' : 'primary'} size="sm">
                      {kpi.achievementPercentage}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-600 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-semibold">Baseline</span>
                      <span className="font-mono">{kpi.baseline}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Target</span>
                      <span className="font-mono text-slate-800">{kpi.target}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Achieved</span>
                      <span className="font-mono font-bold text-emerald-700">{kpi.currentValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* D. Recent Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Procurement Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="p-1 rounded-md bg-blue-50 text-blue-700 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 line-clamp-1">{log.details}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{log.actorName}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Multi-Step Challenge Creation Wizard Modal */}
      {isWizardOpen && (
        <Modal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          title={`Create Innovation Challenge — Step ${wizardStep} of 5`}
          description="Transform a department operational problem into an outcome-based public challenge under GFR 2017"
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {wizardStep > 1 ? (
                <Button variant="outline" size="sm" onClick={() => setWizardStep((s) => s - 1)}>
                  Back
                </Button>
              ) : <span />}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsWizardOpen(false)}>
                  Cancel
                </Button>
                {wizardStep < 5 ? (
                  <Button variant="navy" size="sm" onClick={() => setWizardStep((s) => s + 1)}>
                    Continue to Step {wizardStep + 1} →
                  </Button>
                ) : (
                  <Button variant="success" size="sm" onClick={handlePublishChallenge}>
                    Publish Challenge (Status = OPEN)
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
              {[
                { step: 1, name: '1. Problem Definition' },
                { step: 2, name: '2. Requirements' },
                { step: 3, name: '3. KPIs' },
                { step: 4, name: '4. Eligibility' },
                { step: 5, name: '5. Preview & Publish' },
              ].map((s) => (
                <span
                  key={s.step}
                  className={wizardStep === s.step ? 'font-bold text-blue-700 border-b-2 border-blue-700 pb-1' : 'text-slate-400'}
                >
                  {s.name}
                </span>
              ))}
            </div>

            {/* Step 1: Problem Definition */}
            {wizardStep === 1 && (
              <div className="space-y-3">
                {/* AI Assist Banner inside Wizard */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Draft Faster with AI Assistant</p>
                      <p className="text-[11px] text-slate-500">Auto-formulate GFR 149(viii) problem statement, KPIs & budget using Gemini or OpenAI</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAIModalOpen(true)}
                    leftIcon={<Bot className="w-3.5 h-3.5 text-blue-600" />}
                    className="text-xs bg-white hover:bg-blue-50 border-blue-300 text-blue-700 shrink-0"
                  >
                    Auto-Draft with AI
                  </Button>
                </div>

                <Input
                  label="Challenge Title"
                  placeholder="e.g. AI-Based Municipal Pipeline Corrosion Detection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <Input
                  label="Department / Ministry"
                  placeholder="e.g. Ministry of Jal Shakti"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  required
                />
                <Textarea
                  label="Problem Description"
                  placeholder="Describe the current operational bottlenecks, frequency, and financial losses..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  rows={2}
                  required
                />
                <Textarea
                  label="Current Situation"
                  placeholder="Current manual methods, costs, and inspection delays..."
                  value={newSituation}
                  onChange={(e) => setNewSituation(e.target.value)}
                  rows={2}
                />
                <Textarea
                  label="Expected Outcome"
                  placeholder="Target outcome-based criteria (e.g. >= 25% cost reduction, real-time alerts)..."
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  rows={2}
                  required
                />
              </div>
            )}

            {/* Step 2: Requirements */}
            {wizardStep === 2 && (
              <div className="space-y-3">
                <Input
                  label="Required Technology Stack"
                  placeholder="e.g. Acoustic Sensors, IoT Telematics, Edge AI"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Target Users"
                    placeholder="e.g. Municipal Water Engineers"
                    value={newUsers}
                    onChange={(e) => setNewUsers(e.target.value)}
                  />
                  <Input
                    label="Geographic Sandbox Area"
                    placeholder="e.g. Ward 4-12, Smart City Sandbox"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Allocated Sandbox Budget (INR ₹)"
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                  />
                  <Input
                    label="Pilot Duration (Days)"
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: KPIs */}
            {wizardStep === 3 && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900">
                  <p className="font-bold">Define Quantitative Performance Benchmarks</p>
                  <p className="mt-0.5 text-blue-700">Milestone payments and GeM scale-up decisions are tied strictly to these metrics.</p>
                </div>
                <Input
                  label="Primary KPI Name"
                  value={kpi1Name}
                  onChange={(e) => setKpi1Name(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Baseline Value"
                    value={kpi1Baseline}
                    onChange={(e) => setKpi1Baseline(e.target.value)}
                  />
                  <Input
                    label="Target Benchmark"
                    value={kpi1Target}
                    onChange={(e) => setKpi1Target(e.target.value)}
                  />
                  <Input
                    label="Measurement Method"
                    value={kpi1Method}
                    onChange={(e) => setKpi1Method(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Eligibility */}
            {wizardStep === 4 && (
              <div className="space-y-3">
                <Input
                  label="Startup Stage / Readiness"
                  value={startupStage}
                  onChange={(e) => setStartupStage(e.target.value)}
                />
                <Input
                  label="Required Certifications"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                />
                <Textarea
                  label="Security & Sovereign Cloud Requirements"
                  defaultValue="Data residency on Indian cloud, TLS 1.3 encryption, and ISO 27001 compliance."
                  rows={2}
                />
              </div>
            )}

            {/* Step 5: Preview & Publish */}
            {wizardStep === 5 && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <Badge variant="primary" size="sm">Status: Ready to Publish</Badge>
                  <h4 className="font-bold text-base text-slate-900 mt-1">{newTitle || 'Untitled Challenge'}</h4>
                  <p className="text-xs text-slate-500">{newDept} • Budget: {formatCurrency(Number(newBudget))}</p>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <strong>Expected Outcome:</strong> {newOutcome || 'Automated classification of asset damage with >= 90% precision.'}
                </p>
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900">
                  <p className="font-bold">✓ Compliant with GFR 2017 Rule 149(viii)</p>
                  <p className="mt-0.5">Upon publishing, this challenge will be instantly broadcast to eligible DPIIT startups for AI matching.</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* AI Challenge Assistant Modal */}
      <AIChallengeAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyDraft={handleApplyAIDraft}
        onDirectPublish={handleDirectPublishAIDraft}
      />
    </div>
  );
};
