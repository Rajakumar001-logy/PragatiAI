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
  ProgressBar,
  StatusIndicator,
  Modal,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Challenge, Application, Pilot, PaymentMilestone } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Building2,
  Award,
  Briefcase,
  FileCheck2,
  CreditCard,
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Upload,
  Check,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export const StartupPortal: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [myPilots, setMyPilots] = useState<Pilot[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentMilestone[]>([]);

  // 8-step application wizard state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [targetChallenge, setTargetChallenge] = useState<Challenge | null>(null);

  // Form fields
  const [companyName, setCompanyName] = useState('EcoRoute Technologies Pvt Ltd');
  const [dpiitNumber, setDpiitNumber] = useState('DIPP-IN-89342');
  const [solutionTitle, setSolutionTitle] = useState('Dynamic Urban Route Intelligence Engine (DURIE)');
  const [solutionDesc, setSolutionDesc] = useState('Full-stack dynamic algorithmic dispatch engine with IoT ultrasonic bin level sensors for municipal waste fleet optimization.');
  const [techApproach, setTechApproach] = useState('Genetic heuristic routing recalculating optimal vehicle trajectories every 15 minutes using live fill-level telemetry.');
  const [prevExp, setPrevExp] = useState('Successfully piloted across 4 municipal wards in Mysuru with 21.4% diesel savings.');
  const [implPlan, setImplPlan] = useState('Day 1-10: Hardware sensor provisioning; Day 11-20: Driver mobile dispatch rollout; Day 21-60: Continuous dynamic routing.');
  const [proposedBudget, setProposedBudget] = useState('3800000');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    mockService.getChallenges().then(setChallenges);
    mockService.getApplications().then(setMyApplications);
    mockService.getPilots().then(setMyPilots);
    mockService.getPayments().then(setMyPayments);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const openApplyWizard = (challenge: Challenge) => {
    setTargetChallenge(challenge);
    setApplyStep(1);
    setIsApplyModalOpen(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChallenge) return;
    setSubmitting(true);

    await mockService.submitApplication({
      challengeId: targetChallenge.id,
      startupId: 'st-01',
      solutionDescription: solutionDesc,
      technicalApproach: techApproach,
      previousExperience: prevExp,
      implementationPlan: implPlan,
      pilotBudgetProposed: Number(proposedBudget) || 3800000,
    });

    setSubmitting(false);
    setIsApplyModalOpen(false);
    alert('Proposal successfully submitted! Your application has entered the automated DPIIT eligibility and committee screening stage.');
  };

  const pendingPaymentsTotal = myPayments
    .filter((p) => p.status === 'PENDING' || p.status === 'Approved by Department')
    .reduce((acc, p) => acc + p.amount, 0);

  const timelineSteps = [
    'Submitted',
    'Eligibility Check',
    'Expert Evaluation',
    'Shortlisted',
    'Pilot',
    'Validation',
    'Selected',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-navy-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            DPIIT Startup Innovation Gateway
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Startup Innovation & Public Procurement Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
            Welcome back, <strong>{user?.name || 'Aanya Sharma'}</strong> (EcoRoute Technologies). Discover priority government challenges, submit proposals, track sandbox milestones, and qualify for direct GeM scale-up orders.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/challenges">
              <Button variant="success" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                Explore Open Challenges
              </Button>
            </Link>
            <Link to="/pilots">
              <Button variant="outline" size="sm" className="text-white bg-white/10 hover:bg-white/20 border-white/20" leftIcon={<FlaskConical className="w-4 h-4" />}>
                Active Sandbox Pilots ({myPilots.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Startup Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Challenges</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{challenges.length}</p>
              <p className="text-xs text-purple-700 mt-0.5 font-medium">90%+ AI Capability Match</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applications Submitted</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{myApplications.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">DPIIT Screening Cleared</p>
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
              <p className="text-2xl font-bold text-slate-900">{myPilots.length}</p>
              <p className="text-xs text-emerald-700 mt-0.5 font-medium">72% Completed in Sandbox</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Payments</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(pendingPaymentsTotal)}</p>
              <p className="text-xs text-amber-700 mt-0.5 font-medium">PFMS Escrow Backed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Government Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Recommended Government Challenges
            </h3>
            <p className="text-xs text-slate-500">High-compatibility procurement requirements matched by Pragati AI</p>
          </div>
          <Link to="/challenges" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
            View All Open Challenges <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, idx) => {
            const matchScore = idx === 0 ? 94 : idx === 1 ? 87 : 81;
            return (
              <Card key={challenge.id} className="flex flex-col justify-between hover:border-emerald-300 transition-all border-t-4 border-t-emerald-600">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {challenge.code}
                    </span>
                    <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-700" />
                      {matchScore}% Match
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 line-clamp-1">{challenge.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-600">{challenge.department}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs">
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{challenge.expectedOutcome}</p>
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-medium">Budget Allocated</span>
                      <span className="font-bold text-slate-900">{formatCurrency(challenge.budgetAllocated)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Deadline</span>
                      <span className="font-bold text-slate-800">{formatDate(challenge.applicationDeadline)}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 pt-0 mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {challenge.pilotDurationDays} Days Sandbox
                  </span>
                  <Button
                    variant="navy"
                    size="sm"
                    onClick={() => openApplyWizard(challenge)}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* My Applications & Stage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>My Submitted Proposals & Statutory Timeline</CardTitle>
          <CardDescription>
            Live multi-stage tracking from submission to pilot shortlist and GeM scale-up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {myApplications.map((app) => (
            <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{app.challengeTitle}</h4>
                  <p className="text-xs text-slate-500">{app.department} • Submitted on {formatDate(app.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                    Proposed: {formatCurrency(app.pilotBudgetProposed)}
                  </span>
                  <Badge variant="primary" size="sm">{app.status}</Badge>
                </div>
              </div>

              {/* Visual 7-step Timeline */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application Stage Tracker</p>
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-[11px]">
                  {timelineSteps.map((stepName, stepIndex) => {
                    const stepNum = stepIndex + 1;
                    const isPassed = (app.timelineStep || 1) >= stepNum;
                    const isCurrent = (app.timelineStep || 1) === stepNum;
                    return (
                      <div
                        key={stepName}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isCurrent
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="block text-[10px] font-semibold">{stepNum}. {stepName}</span>
                        <span className="block text-[9px] mt-0.5">
                          {isCurrent ? '● Active' : isPassed ? '✓ Done' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 8-Step Startup Application Wizard Modal */}
      {isApplyModalOpen && targetChallenge && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Application Wizard: Step ${applyStep} of 8`}
          description={`Applying to: ${targetChallenge.title} (${targetChallenge.code})`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {applyStep > 1 ? (
                <Button variant="outline" size="sm" onClick={() => setApplyStep((s) => s - 1)}>
                  Previous
                </Button>
              ) : <span />}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </Button>
                {applyStep < 8 ? (
                  <Button variant="navy" size="sm" onClick={() => setApplyStep((s) => s + 1)}>
                    Next Step ({applyStep + 1}/8) →
                  </Button>
                ) : (
                  <Button variant="success" size="sm" onClick={handleFinalSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Proposal to Government'}
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Step Breadcrumb Indicator */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px] overflow-x-auto whitespace-nowrap">
              {[
                '1. Company',
                '2. Solution',
                '3. Tech',
                '4. Experience',
                '5. Plan',
                '6. Budget',
                '7. Documents',
                '8. Submit',
              ].map((name, i) => (
                <span
                  key={name}
                  className={`px-1.5 py-0.5 rounded ${applyStep === i + 1 ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-400'}`}
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Step 1: Company Information */}
            {applyStep === 1 && (
              <div className="space-y-3">
                <Input
                  label="Legal Entity Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  label="DPIIT Startup India Recognition Number"
                  value={dpiitNumber}
                  onChange={(e) => setDpiitNumber(e.target.value)}
                  required
                />
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900">
                  <p className="font-bold">✓ Automated DPIIT Registry Lookup Active</p>
                  <p className="mt-0.5">Your DPIIT certificate qualifies your company for GFR 2017 innovation sandbox grants without prior turnover or experience barriers.</p>
                </div>
              </div>
            )}

            {/* Step 2: Solution Description */}
            {applyStep === 2 && (
              <div className="space-y-3">
                <Input
                  label="Proprietary Solution Title"
                  value={solutionTitle}
                  onChange={(e) => setSolutionTitle(e.target.value)}
                  required
                />
                <Textarea
                  label="Solution Summary & Core Value Proposition"
                  value={solutionDesc}
                  onChange={(e) => setSolutionDesc(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Step 3: Technical Approach */}
            {applyStep === 3 && (
              <div className="space-y-3">
                <Textarea
                  label="Technical Architecture, Algorithms & Edge Infrastructure"
                  value={techApproach}
                  onChange={(e) => setTechApproach(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Step 4: Previous Experience */}
            {applyStep === 4 && (
              <div className="space-y-3">
                <Textarea
                  label="Demonstrated Track Record & Lab / Field Benchmarks"
                  value={prevExp}
                  onChange={(e) => setPrevExp(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Step 5: Implementation Plan */}
            {applyStep === 5 && (
              <div className="space-y-3">
                <Textarea
                  label="60-Day Sandbox Pilot Milestone Schedule"
                  value={implPlan}
                  onChange={(e) => setImplPlan(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}

            {/* Step 6: Budget */}
            {applyStep === 6 && (
              <div className="space-y-3">
                <Input
                  label="Proposed Pilot Cost (INR ₹)"
                  type="number"
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">Target Challenge Ceiling: {formatCurrency(targetChallenge.budgetAllocated)}</p>
              </div>
            )}

            {/* Step 7: Documents */}
            {applyStep === 7 && (
              <div className="space-y-2">
                <p className="font-bold text-slate-900">Verification Documents Attached</p>
                <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Technical Architecture & Proposal.pdf</span>
                  </div>
                  <Badge variant="success" size="sm">Ready</Badge>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>DPIIT Startup India Certificate.pdf</span>
                  </div>
                  <Badge variant="success" size="sm">Verified</Badge>
                </div>
              </div>
            )}

            {/* Step 8: Final Review & Submit */}
            {applyStep === 8 && (
              <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-sm">Review & Submit Proposal</h5>
                <p className="text-xs text-slate-600"><strong>Challenge:</strong> {targetChallenge.title}</p>
                <p className="text-xs text-slate-600"><strong>Solution:</strong> {solutionTitle}</p>
                <p className="text-xs text-slate-600"><strong>Proposed Budget:</strong> {formatCurrency(Number(proposedBudget))}</p>
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900">
                  <p className="font-bold">Legal Self-Declaration</p>
                  <p className="mt-0.5">By clicking Submit, we certify that the technical information provided is accurate and compliant with the GFR 2017 innovation sandbox guidelines.</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
