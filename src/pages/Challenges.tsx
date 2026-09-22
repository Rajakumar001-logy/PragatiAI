import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  Textarea,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Challenge, GeneratedChallengeDraft } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Award,
  Plus,
  Search,
  Building,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Compass,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { AICreateChallengeModal } from '@/components/challenges/AICreateChallengeModal';


export const Challenges: React.FC = () => {
  const { role } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<Challenge | null>(null);

  // 5-step wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSituation, setNewSituation] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newDept, setNewDept] = useState('Public Works Department');
  const [newMinistry, setNewMinistry] = useState('Ministry of Housing & Urban Affairs');
  const [newBudget, setNewBudget] = useState('5000000');
  const [newDuration, setNewDuration] = useState('60');
  const [kpiName, setKpiName] = useState('Operational Efficiency Improvement');
  const [kpiBaseline, setKpiBaseline] = useState('0%');
  const [kpiTarget, setKpiTarget] = useState('25%');
  const [startupStage, setStartupStage] = useState('DPIIT Registered (TRL 7+)');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleDeleteChallenge = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete challenge "${title}"? This will permanently remove it from the platform.`)) {
      await mockService.deleteChallenge(id);
      if (activeDetail?.id === id) {
        setActiveDetail(null);
      }
      loadData();
    }
  };

  const handleChallengeCreated = () => {
    loadData();
  };


  const loadData = () => {
    mockService.getChallenges().then(setChallenges);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    await mockService.createChallenge({
      title: newTitle,
      problemStatement: newProblem || 'Municipal infrastructure deterioration requires automated AI monitoring.',
      currentSituation: newSituation || 'Current manual inspection methods are slow and subjective.',
      expectedOutcome: newOutcome || 'Automated classification and real-time alerts with >= 90% accuracy.',
      department: newDept || 'Municipal Services',
      ministry: newMinistry || 'Ministry of Housing & Urban Affairs',
      budgetAllocated: Number(newBudget) || 5000000,
      currentStage: 'OPEN',
      applicationDeadline: '2026-11-30',
      pilotDurationDays: Number(newDuration) || 60,
      tags: ['Smart Cities', 'SIH 2026', 'Automation'],
      kpis: [
        { id: `kpi-${Date.now()}-1`, name: kpiName, unit: '%', baseline: 0, target: 25, weightage: 50 },
        { id: `kpi-${Date.now()}-2`, name: 'Turnaround Time Reduction', unit: 'hours', baseline: 24, target: 4, weightage: 50 },
      ],
      eligibilityCriteria: {
        startupStage,
        requiredCertifications: ['ISO 9001:2015', 'ISO 27001'],
        technologyRequirements: 'Real-time telemetry and edge device acceleration',
        securityRequirements: 'Data residency in India and TLS 1.3 encrypted data transit',
      },
    });

    setIsModalOpen(false);
    setWizardStep(1);
    setNewTitle('');
    setNewProblem('');
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesMinistry = selectedMinistry === 'ALL' || c.ministry.includes(selectedMinistry);
    return matchesSearch && matchesMinistry;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Outcome-Based Innovation Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Government problem statements translated into standardized, challenge-based public procurement requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/discover-startups">
            <Button variant="outline" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
              AI Startup Matching
            </Button>
          </Link>
          {(role === 'government' || role === 'admin') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAIModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Create Challenge with AI
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by challenge name, problem statement, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            options={[
              { value: 'ALL', label: 'All Central & State Ministries' },
              { value: 'Housing & Urban Affairs', label: 'Ministry of Housing & Urban Affairs' },
              { value: 'Road Transport', label: 'Ministry of Road Transport (NHAI)' },
              { value: 'Jal Shakti', label: 'Ministry of Jal Shakti' },
            ]}
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
          />
        </div>
      </div>

      {/* Challenges Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {challenge.code}
                </span>
                <StatusIndicator status={challenge.currentStage} label={challenge.currentStage} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg hover:text-blue-700 cursor-pointer" onClick={() => setActiveDetail(challenge)}>
                  {challenge.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{challenge.department}</span>
                  <span>•</span>
                  <span className="text-slate-400">{challenge.ministry}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Public Problem Statement
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {challenge.problemStatement}
                </p>
              </div>

              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Expected Outcome & Sandbox Validation Benchmark
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {challenge.expectedOutcome}
                </p>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1.5">
                {challenge.tags.map((t, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>

              {/* Budget & Timeline Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg text-center">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Sandbox Budget</span>
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(challenge.budgetAllocated)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Duration</span>
                  <span className="text-xs font-bold text-slate-900">{challenge.pilotDurationDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Proposals</span>
                  <span className="text-xs font-bold text-blue-700">{challenge.totalApplicants} Startups</span>
                </div>
              </div>
            </CardContent>

            <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[11px] text-slate-400">
                Deadline: <strong>{formatDate(challenge.applicationDeadline)}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Link to="/discover-startups">
                  <Button variant="outline" size="sm" leftIcon={<Bot className="w-3.5 h-3.5 text-purple-600" />}>
                    AI Matches
                  </Button>
                </Link>
                <Button
                  variant="navy"
                  size="sm"
                  onClick={() => setActiveDetail(challenge)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Specifications
                </Button>
                {(role === 'government' || role === 'admin') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge.id, challenge.title)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    title="Delete Challenge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Challenge Specifications Modal */}
      {activeDetail && (
        <Modal
          isOpen={!!activeDetail}
          onClose={() => setActiveDetail(null)}
          title={activeDetail.title}
          description={`Challenge Code: ${activeDetail.code} | ${activeDetail.ministry}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {(role === 'government' || role === 'admin') ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteChallenge(activeDetail.id, activeDetail.title)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete Challenge
                </Button>
              ) : <div />}
              <Button variant="navy" size="sm" onClick={() => setActiveDetail(null)}>
                Close Details
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Full Problem Statement</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {activeDetail.problemStatement}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Expected Outcome & Validation Benchmark</h4>
              <p className="text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                {activeDetail.expectedOutcome}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Mandatory Quantitative Pilot KPIs</h4>
              <div className="space-y-2">
                {activeDetail.kpis.map((kpi) => (
                  <div key={kpi.id} className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{kpi.name}</p>
                      <p className="text-[11px] text-slate-500">Weightage: {kpi.weightage}% of final procurement score</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500">Baseline: {kpi.baseline}{kpi.unit}</span>
                      <span className="text-xs font-bold text-blue-700 ml-2">Target: &gt;={kpi.target}{kpi.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Multi-step Create Challenge Wizard Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Publish Outcome Challenge — Step ${wizardStep} of 5`}
          description="Define a new problem statement to initiate startup discovery under GFR Rule 149(viii)"
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {wizardStep > 1 ? (
                <Button variant="outline" size="sm" onClick={() => setWizardStep((s) => s - 1)}>
                  Back
                </Button>
              ) : <span />}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                {wizardStep < 5 ? (
                  <Button variant="navy" size="sm" onClick={() => setWizardStep((s) => s + 1)}>
                    Next Step ({wizardStep + 1}/5) →
                  </Button>
                ) : (
                  <Button variant="success" size="sm" onClick={handleCreateChallenge}>
                    Publish Challenge (Status = OPEN)
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
              {[
                { s: 1, label: '1. Problem Definition' },
                { s: 2, label: '2. Requirements' },
                { s: 3, label: '3. KPIs' },
                { s: 4, label: '4. Eligibility' },
                { s: 5, label: '5. Publish' },
              ].map((step) => (
                <span
                  key={step.s}
                  className={wizardStep === step.s ? 'font-bold text-blue-700 border-b-2 border-blue-700 pb-1' : 'text-slate-400'}
                >
                  {step.label}
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
                  placeholder="e.g. Ministry of Housing & Urban Affairs"
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
                  defaultValue="IoT Telematics, Edge Neural Networks"
                />
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
                <Input
                  label="Primary Quantitative KPI Name"
                  value={kpiName}
                  onChange={(e) => setKpiName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Baseline Value"
                    value={kpiBaseline}
                    onChange={(e) => setKpiBaseline(e.target.value)}
                  />
                  <Input
                    label="Target Benchmark"
                    value={kpiTarget}
                    onChange={(e) => setKpiTarget(e.target.value)}
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
                  defaultValue="ISO 9001:2015, ISO 27001 Data Security"
                />
              </div>
            )}

            {/* Step 5: Publish */}
            {wizardStep === 5 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <Badge variant="primary">Status = OPEN</Badge>
                <h4 className="font-bold text-base text-slate-900">{newTitle || 'Untitled Challenge'}</h4>
                <p className="text-xs text-slate-600">Budget: {formatCurrency(Number(newBudget))}</p>
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900">
                  <p className="font-bold">✓ Ready for Live Discovery</p>
                  <p className="mt-0.5">Will be immediately broadcast to DPIIT startups and indexed for AI matching.</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* AI Challenge Creation Modal */}
      <AICreateChallengeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onChallengeCreated={handleChallengeCreated}
      />
    </div>
  );
};
