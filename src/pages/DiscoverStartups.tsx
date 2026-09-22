import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Select,
  Modal,
  ProgressBar,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Challenge, Startup } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Building2,
  HelpCircle,
  ExternalLink,
  Award,
  Layers,
  Bot,
  ArrowRight,
  TrendingUp,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { AIMatchResult } from '@/services/aiMatchingService';

export const DiscoverStartups: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
  const [filterOnlyRelevant, setFilterOnlyRelevant] = useState<boolean>(true);
  const [startups, setStartups] = useState<AIMatchResult[]>([]);
  const [activeReasonModal, setActiveReasonModal] = useState<AIMatchResult | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    mockService.getChallenges().then((res) => {
      setChallenges(res);
      if (res.length > 0) {
        setSelectedChallengeId(res[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedChallengeId) {
      mockService
        .getRecommendedStartups(selectedChallengeId, { onlyRelevant: filterOnlyRelevant })
        .then(setStartups);
    }
  }, [selectedChallengeId, filterOnlyRelevant]);

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];


  const handleShortlist = (startupId: string, startupName: string) => {
    setShortlistedIds((prev) => new Set([...prev, startupId]));
    alert(`${startupName} has been shortlisted for Committee Review and Sandbox Screening!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              AI-Powered Capability Matching
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Startup Matching & Discovery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Algorithmic capability indexing matching DPIIT registered deep-tech startups against outcome challenge requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <Sparkles className="w-3.5 h-3.5" />
            Neural Semantic Matching
          </Badge>
        </div>
      </div>

      {/* Challenge Selector Bar */}
      <Card className="p-4 bg-white border-blue-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Select Problem Challenge:
            </label>
            <Select
              options={challenges.map((c) => ({ value: c.id, label: `${c.code}: ${c.title}` }))}
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900">{selectedChallenge?.title}</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Budget: {formatCurrency(selectedChallenge?.budgetAllocated || 0)}
              </span>
            </div>
            <p className="text-slate-600 line-clamp-1">{selectedChallenge?.expectedOutcome}</p>
          </div>
        </div>
      </Card>

      {/* AI Advisory Disclaimer */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5">
        <Bot className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Human-in-the-Loop AI Advisory Principle:</span>
          <span className="text-purple-900 ml-1 leading-relaxed">
            AI capability matching generates merit-based recommendations. Final sandbox shortlisting and procurement award remains strictly governed by Government Department Officers and Independent Expert Committees under GFR 2017.
          </span>
        </div>
      </div>

      {/* Relevance Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant={startups.length > 0 ? 'primary' : 'warning'} size="sm">
            {filterOnlyRelevant ? `${startups.length} Relevant AI Match${startups.length === 1 ? '' : 'es'}` : `${startups.length} Total Startups Evaluated`}
          </Badge>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {filterOnlyRelevant ? 'Filtered strictly by domain & tech relevance (≥ 70% threshold)' : 'Showing all startups with compatibility scores'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterOnlyRelevant(true)}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              filterOnlyRelevant
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Only Relevant Matches
          </button>
          <button
            type="button"
            onClick={() => setFilterOnlyRelevant(false)}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              !filterOnlyRelevant
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Startups
          </button>
        </div>
      </div>

      {/* Empty State when no relevant startups match */}
      {startups.length === 0 && (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-slate-200">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">No Direct Relevant Startups Found</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No registered DPIIT startups currently meet the &ge; 70% technical domain compatibility threshold for this specialized challenge. Pragati AI has flagged this challenge for a nationwide incubator broadcast.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOnlyRelevant(false)}
              className="mt-2 text-xs"
            >
              View All Registered Startups Anyway
            </Button>
          </div>
        </Card>
      )}

      {/* Recommended Startups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {startups.map((matchItem) => {
          const { startup, matchScore, reason, isRelevant, domain } = matchItem;
          const isShortlisted = shortlistedIds.has(startup.id);
          return (
            <Card
              key={startup.id}
              className={`flex flex-col justify-between transition-all border-t-4 shadow-sm ${
                isRelevant
                  ? 'border-t-purple-600 hover:border-purple-300'
                  : 'border-t-slate-300 bg-slate-50/50 opacity-80'
              }`}
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        isRelevant
                          ? 'text-purple-900 bg-purple-100 border-purple-300'
                          : 'text-slate-600 bg-slate-200 border-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-purple-700" />
                      {matchScore}% AI Match
                    </span>
                  </div>
                  <Badge variant={isRelevant ? 'success' : 'neutral'} size="sm">
                    {isRelevant ? `✓ ${domain?.toUpperCase() || 'FIT'}` : 'Low Fit'}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">{startup.brandName}</CardTitle>
                  <p className="text-xs text-slate-500">{startup.legalName}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Proprietary Solution</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{startup.solutionTitle}</p>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Technical Capability Fit</span>
                      <span className="font-bold text-blue-700">{startup.technicalFitScore || 92}%</span>
                    </div>
                    <ProgressBar value={startup.technicalFitScore || 92} size="sm" variant="blue" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Nationwide Scalability Score</span>
                      <span className="font-bold text-emerald-700">{startup.scalabilityScore || 88}%</span>
                    </div>
                    <ProgressBar value={startup.scalabilityScore || 88} size="sm" variant="emerald" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-purple-50/50 rounded-lg border border-purple-100">
                  <div>
                    <span className="text-slate-500 block font-medium">Est. Pilot Cost</span>
                    <span className="font-bold text-slate-900">{formatCurrency(startup.estimatedPilotCost || 3800000)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Tech Readiness</span>
                    <span className="font-bold text-purple-900">TRL {startup.trlLevel} / 9</span>
                  </div>
                </div>

                <div className="space-y-1 text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Past Experience</span>
                  <p className="text-[11px] line-clamp-2 leading-relaxed">{startup.relevantExperience}</p>
                </div>
              </CardContent>

              <div className="p-4 pt-0 mt-auto border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveReasonModal(matchItem)}
                  leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Why this match?
                </Button>

                <Button
                  variant={isShortlisted ? 'success' : 'navy'}
                  size="sm"
                  onClick={() => handleShortlist(startup.id, startup.brandName)}
                  className="text-xs"
                >
                  {isShortlisted ? '✓ Shortlisted' : 'Shortlist Startup'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Why This Match Explanation Modal */}
      {activeReasonModal && (
        <Modal
          isOpen={!!activeReasonModal}
          onClose={() => setActiveReasonModal(null)}
          title={`AI Match Rationale: ${activeReasonModal.startup.brandName}`}
          description={`Overall Compatibility: ${activeReasonModal.matchScore}% against ${selectedChallenge?.title}`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setActiveReasonModal(null)}>
              Understood
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 space-y-1">
              <span className="font-bold text-sm block">Synthesized AI Rationale:</span>
              <p className="leading-relaxed">{activeReasonModal.reason}</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900">Key Compatibility Factors</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <p className="font-semibold text-slate-800">✓ Technology Stack Alignment</p>
                  <p className="text-slate-500 mt-0.5">{activeReasonModal.startup.technologyStack?.join(', ')}</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <p className="font-semibold text-slate-800">✓ DPIIT & Regulatory Status</p>
                  <p className="text-emerald-700 font-medium mt-0.5">Empaneled & Verified Active</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-xs">
              <p className="font-semibold text-slate-800">Statutory Notice under GFR 2017</p>
              <p className="mt-0.5">
                AI evaluation metrics serve as decision support data. The official selection order requires formal review by the Technical Evaluation Committee.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
