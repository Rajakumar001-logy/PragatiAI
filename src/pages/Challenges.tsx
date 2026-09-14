import React, { useState, useEffect } from 'react';
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
import { Challenge } from '@/types';
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
} from 'lucide-react';

export const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<Challenge | null>(null);

  // New challenge form state
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newMinistry, setNewMinistry] = useState('');
  const [newBudget, setNewBudget] = useState('3500000');
  const [newDuration, setNewDuration] = useState('60');

  useEffect(() => {
    mockService.getChallenges().then(setChallenges);
  }, []);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProblem) return;

    mockService
      .createChallenge({
        title: newTitle,
        problemStatement: newProblem,
        expectedOutcome: newOutcome,
        department: newDept || 'Municipal Services',
        ministry: newMinistry || 'Ministry of Urban Development',
        budgetAllocated: Number(newBudget),
        currentStage: 'Open for Applications',
        applicationDeadline: '2026-11-30',
        pilotDurationDays: Number(newDuration),
        tags: ['New Challenge', 'SIH 2026'],
        kpis: [
          { id: 'k1', name: 'Primary Operational Efficiency', unit: '%', baseline: 0, target: 20, weightage: 50 },
          { id: 'k2', name: 'Response Time Reduction', unit: 'hours', baseline: 12, target: 2, weightage: 50 },
        ],
      })
      .then((created) => {
        setChallenges((prev) => [created, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setNewTitle('');
        setNewProblem('');
        setNewOutcome('');
      });
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
            Government problem statements translated into measurable, challenge-based procurement requirements
          </p>
        </div>

        <Button
          variant="navy"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish New Challenge
        </Button>
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
          <Card key={challenge.id} className="flex flex-col justify-between hover:border-blue-300 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {challenge.code}
                </span>
                <StatusIndicator status={challenge.currentStage} label={challenge.currentStage} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg hover:text-blue-700 cursor-pointer">
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
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Public Problem Statement
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {challenge.problemStatement}
                </p>
              </div>

              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Outcome & Sandbox Pilot Criteria
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveDetail(challenge)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Specifications & KPIs
              </Button>
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
            <Button variant="navy" size="sm" onClick={() => setActiveDetail(null)}>
              Close Details
            </Button>
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

      {/* Publish Challenge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Outcome-Based Innovation Challenge"
        description="Define a new problem statement to initiate startup discovery under GFR Rule 149(viii)"
        maxWidth="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="navy" size="sm" onClick={handleCreateChallenge}>
              Publish Challenge
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateChallenge} className="space-y-4">
          <Input
            label="Challenge Title"
            placeholder="e.g. AI-Based Pipeline Corrosion Profiling"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Department / Agency"
              placeholder="e.g. Public Works Department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
            />
            <Input
              label="Ministry"
              placeholder="e.g. Ministry of Jal Shakti"
              value={newMinistry}
              onChange={(e) => setNewMinistry(e.target.value)}
            />
          </div>

          <Textarea
            label="Problem Statement"
            placeholder="Describe the current operational bottlenecks, frequency, and financial/social impacts..."
            value={newProblem}
            onChange={(e) => setNewProblem(e.target.value)}
            rows={3}
            required
          />

          <Textarea
            label="Expected Outcome & Target Metrics"
            placeholder="Describe the outcome-based validation goals (e.g. >= 25% cost reduction, real-time alerts)..."
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Sandbox Budget (INR ₹)"
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
        </form>
      </Modal>
    </div>
  );
};
