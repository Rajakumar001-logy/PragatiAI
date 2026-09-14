import React, { useState } from 'react';
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
  Tabs,
} from '@/components/ui';
import { GraduationCap, ShieldCheck, CheckCircle2, FileText, Send } from 'lucide-react';

export const ExpertReview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active-eval');
  const [scoreTech, setScoreTech] = useState(24);
  const [scoreInno, setScoreInno] = useState(22);
  const [scoreExecution, setScoreExecution] = useState(23);
  const [scoreCommercial, setScoreCommercial] = useState(21);
  const [remarks, setRemarks] = useState(
    'Strong algorithm architecture with low edge-compute latency. Feasibility in real-world road conditions is validated by lab simulations.'
  );

  const totalScore = Number(scoreTech) + Number(scoreInno) + Number(scoreExecution) + Number(scoreCommercial);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              IIT Delhi / CSIR Evaluator Desk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assigned Technical Evaluations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluating: <strong>RoadVision AI</strong> for Challenge <strong>PRG-2026-002</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" size="md">
            <GraduationCap className="w-4 h-4" />
            Empaneled Expert #EXP-IITD-401
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposal Dossier Left Col */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Applicant Dossier</CardTitle>
              <CardDescription>RoadVision Artificial Intelligence Labs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Solution</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  PavementScan 360 Edge AI Hardware & Cloud Dashboard
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400">Target Corridor</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  NH-48 Corridor (220 km section, NHAI)
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-semibold text-slate-700">Proposal Attachments</p>
                <div className="p-2 border border-slate-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edge AI Benchmark Paper.pdf</span>
                  </div>
                  <span className="text-blue-700 font-medium cursor-pointer">View</span>
                </div>
                <div className="p-2 border border-slate-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>IRC Standards Compliance.pdf</span>
                  </div>
                  <span className="text-blue-700 font-medium cursor-pointer">View</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scoring Form Right Col */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Standard Innovation Scoring Rubric</CardTitle>
                  <CardDescription>Grade according to GFR 2017 Innovation Procurement Guidelines</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-slate-400 block">Total Score</span>
                  <span className="text-2xl font-extrabold text-blue-700">{totalScore} / 100</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">1. Technical Feasibility</span>
                    <span className="text-xs font-bold text-blue-700">{scoreTech}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Robustness of AI architecture, hardware latency, and edge resilience.</p>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={scoreTech}
                    onChange={(e) => setScoreTech(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">2. Novelty vs GeM Alternatives</span>
                    <span className="text-xs font-bold text-blue-700">{scoreInno}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Substantial performance improvement over existing market catalog.</p>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={scoreInno}
                    onChange={(e) => setScoreInno(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">3. Pilot Execution Plan</span>
                    <span className="text-xs font-bold text-blue-700">{scoreExecution}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Clarity of sandbox milestones, deliverables, and safety protocols.</p>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={scoreExecution}
                    onChange={(e) => setScoreExecution(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">4. Unit Economics & Scale</span>
                    <span className="text-xs font-bold text-blue-700">{scoreCommercial}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Commercial viability for nationwide highway deployment.</p>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={scoreCommercial}
                    onChange={(e) => setScoreCommercial(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              <Textarea
                label="Evaluator Remarks & Justification"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  variant="primary"
                  onClick={() => alert(`Score of ${totalScore}/100 submitted successfully to Committee Convener.`)}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Submit Official Evaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
