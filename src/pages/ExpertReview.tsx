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
  Textarea,
  Select,
  ProgressBar,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Application, Evaluation } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Send,
  Sparkles,
  Award,
  AlertCircle,
  FileSearch,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const ExpertReview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // 6-criteria scoring state
  const [scoreTech, setScoreTech] = useState(28); // max 30
  const [scoreInno, setScoreInno] = useState(19); // max 20
  const [scoreCost, setScoreCost] = useState(14); // max 15
  const [scoreScale, setScoreScale] = useState(14); // max 15
  const [scoreSec, setScoreSec] = useState(9); // max 10
  const [scoreFeas, setScoreFeas] = useState(9); // max 10
  const [remarks, setRemarks] = useState(
    'Strong algorithm architecture with low edge-compute latency. Sub-second rerouting and ISO 27001 data residency verified for municipal testbed.'
  );
  const [recommendation, setRecommendation] = useState<Evaluation['recommendation']>('Recommend for Pilot');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    mockService.getApplications().then((apps) => {
      setApplications(apps);
      if (apps.length > 0 && !selectedAppId) {
        setSelectedAppId(apps[0].id);
      }
    });
    mockService.getEvaluations().then(setEvaluations);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const totalScore = Number(scoreTech) + Number(scoreInno) + Number(scoreCost) + Number(scoreScale) + Number(scoreSec) + Number(scoreFeas);

  const handleSubmitEvaluation = async (rec: Evaluation['recommendation']) => {
    if (!currentApp) return;
    setSubmitting(true);
    await mockService.submitEvaluation({
      applicationId: currentApp.id,
      evaluatorName: 'Prof. S. Ramanathan',
      evaluatorRole: 'Principal Technical Evaluator',
      evaluatorAffiliation: 'IIT Delhi - Dept of Civil & Urban Eng',
      totalScore,
      recommendation: rec,
      summaryRemarks: remarks,
      criteriaScores: [
        { id: 'c-1', criterion: 'Technical Capability & Architecture', weightPercentage: 30, maxScore: 30, scoreAwarded: scoreTech, remarks: 'Proven sensor telemetry and cloud dispatch architecture.' },
        { id: 'c-2', criterion: 'Innovation & Novelty vs GeM Alternatives', weightPercentage: 20, maxScore: 20, scoreAwarded: scoreInno, remarks: 'Real dynamic rerouting vs simple static GPS breadcrumb tracking.' },
        { id: 'c-3', criterion: 'Cost Effectiveness & Budget Justification', weightPercentage: 15, maxScore: 15, scoreAwarded: scoreCost, remarks: 'Well-budgeted unit economics for sensor hardware.' },
        { id: 'c-4', criterion: 'Scalability for Nationwide Deployment', weightPercentage: 15, maxScore: 15, scoreAwarded: scoreScale, remarks: 'Multi-tenant cloud architecture ready for 50+ municipal corporations.' },
        { id: 'c-5', criterion: 'Security, Data Privacy & ISO Standards', weightPercentage: 10, maxScore: 10, scoreAwarded: scoreSec, remarks: 'ISO 27001 certified with sovereign data residency.' },
        { id: 'c-6', criterion: 'Implementation Feasibility & Team Expertise', weightPercentage: 10, maxScore: 10, scoreAwarded: scoreFeas, remarks: 'Experienced founders with previous municipal pilot track record.' },
      ],
    });
    setSubmitting(false);
    alert(`Scorecard of ${totalScore}/100 and recommendation '${rec}' submitted to Government Selection Directorate!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              IIT Delhi / CSIR Scientific Evaluation Committee
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Expert Evaluation & Scoring Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Double-blind technical feasibility scoring and sandbox pilot recommendation under GFR 2017
          </p>
        </div>

        <Badge variant="warning" size="md">
          <GraduationCap className="w-4 h-4" />
          Empaneled Expert #EXP-IITD-401
        </Badge>
      </div>

      {/* Top 4 Expert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Assigned Applications</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">{applications.length}</p>
            <p className="text-[11px] text-blue-700 mt-0.5 font-medium">Under Committee Review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Pending Evaluations</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
            <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Awaiting Your Scorecard</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Completed Evaluations</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">{evaluations.length}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Avg Score: 93.5 / 100</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Pilots to Review</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">2</p>
            <p className="text-[11px] text-purple-700 mt-0.5 font-medium">Live Telemetry Linked</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Selector */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
          Active Proposal:
        </span>
        <Select
          options={applications.map((a) => ({
            value: a.id,
            label: `${a.startupName} — ${a.challengeTitle} (DPIIT: ${a.dpiitNumber})`,
          }))}
          value={selectedAppId}
          onChange={(e) => setSelectedAppId(e.target.value)}
        />
      </div>

      {/* Main Two Column Evaluation Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Startup Proposal Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">{currentApp?.dpiitNumber}</Badge>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Proposed: {formatCurrency(currentApp?.pilotBudgetProposed || 3800000)}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-1">
                {currentApp?.startupName}
              </CardTitle>
              <CardDescription className="text-xs">
                Applying to: {currentApp?.challengeTitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Solution Summary</p>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{currentApp?.solutionDescription}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Technical Approach</p>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{currentApp?.technicalApproach}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Track Record & Field Results</p>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{currentApp?.previousExperience}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">60-Day Pilot Implementation Plan</p>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{currentApp?.implementationPlan}</p>
              </div>

              <div className="space-y-2 pt-1">
                <p className="font-bold text-slate-800">Proposal Attachments</p>
                {currentApp?.documents?.map((doc, idx) => (
                  <div key={idx} className="p-2 border border-slate-200 rounded-lg flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px] font-medium text-slate-800">{doc.title}</span>
                    </div>
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 7 Cols: Scoring Panel with 6 criteria */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-t-4 border-t-amber-600">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Standard Innovation Scoring Rubric</CardTitle>
                  <CardDescription className="text-xs">
                    6-Factor Weighted Assessment pursuant to GFR Rule 149(viii)
                  </CardDescription>
                </div>
                <div className="text-right p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Aggregate</span>
                  <span className="text-2xl font-extrabold text-amber-900">{totalScore} / 100</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* 6 Criteria Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* 1. Technical Capability 30% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>1. Technical Capability (30%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreTech} / 30</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Algorithm architecture, edge computing latency, robustness.</p>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={scoreTech}
                    onChange={(e) => setScoreTech(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 2. Innovation 20% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>2. Innovation & Novelty (20%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreInno} / 20</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Novelty and improvement over existing GeM catalog products.</p>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={scoreInno}
                    onChange={(e) => setScoreInno(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 3. Cost Effectiveness 15% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>3. Cost Effectiveness (15%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreCost} / 15</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Clear unit economics for municipal & department procurement.</p>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={scoreCost}
                    onChange={(e) => setScoreCost(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 4. Scalability 15% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>4. Scalability (15%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreScale} / 15</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Readiness for pan-India deployment across municipal bodies.</p>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={scoreScale}
                    onChange={(e) => setScoreScale(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 5. Security 10% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>5. Security & Privacy (10%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreSec} / 10</span>
                  </div>
                  <p className="text-[10px] text-slate-500">ISO 27001 data residency, CERT-In compliance.</p>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scoreSec}
                    onChange={(e) => setScoreSec(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 6. Implementation Feasibility 10% */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>6. Feasibility (10%)</span>
                    <span className="text-blue-700 font-extrabold">{scoreFeas} / 10</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Milestone clarity, team expertise, risk mitigation.</p>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scoreFeas}
                    onChange={(e) => setScoreFeas(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <Textarea
                label="Evaluator Remarks & Official Justification"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />

              {/* Action Buttons: Approve / Request Clarification / Reject */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmitEvaluation('Request Clarification')}
                    leftIcon={<HelpCircle className="w-3.5 h-3.5 text-amber-600" />}
                    disabled={submitting}
                  >
                    Request Clarification
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSubmitEvaluation('Reject')}
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    disabled={submitting}
                  >
                    Reject
                  </Button>
                </div>

                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleSubmitEvaluation('Recommend for Pilot')}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  disabled={submitting}
                >
                  Approve & Recommend for Pilot ({totalScore}/100)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
