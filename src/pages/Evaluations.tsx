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
  Modal,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Evaluation } from '@/types';
import { formatDate } from '@/utils/formatters';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  FileCheck,
  Star,
  Sparkles,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

export const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);

  const loadData = () => {
    mockService.getEvaluations().then(setEvaluations);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Expert Evaluation Committee & Scoring Grid
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Independent scientific and academic peer assessments (IIT Delhi / CSIR) grading technology feasibility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/expert">
            <Button variant="navy" size="sm" leftIcon={<GraduationCap className="w-4 h-4" />}>
              Open Evaluator Workspace
            </Button>
          </Link>
        </div>
      </div>

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:border-blue-300 transition-all shadow-xs">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={evaluation.recommendation === 'Reject' ? 'danger' : 'success'} size="sm">
                  <CheckCircle2 className="w-3 h-3" />
                  {evaluation.recommendation}
                </Badge>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{evaluation.totalScore} / 100</span>
                </div>
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                {evaluation.startupName}
              </CardTitle>
              <CardDescription className="text-xs">
                {evaluation.challengeTitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-bold text-slate-700">{evaluation.evaluatorName}</span>
                  <span>{evaluation.evaluatorAffiliation}</span>
                </div>
                <p className="text-slate-600 italic leading-relaxed">
                  "{evaluation.summaryRemarks}"
                </p>
              </div>

              {/* 6 Criteria Score Bars */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Scoring Breakdown (6 Factors)
                </p>
                {evaluation.criteriaScores?.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600 truncate max-w-[240px]">{c.criterion}</span>
                      <span className="font-bold text-slate-900">{c.scoreAwarded} / {c.maxScore}</span>
                    </div>
                    <ProgressBar
                      value={(c.scoreAwarded / c.maxScore) * 100}
                      size="sm"
                      variant="blue"
                    />
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-4 pt-0 mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Assessed: <strong>{formatDate(evaluation.dateEvaluated)}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEval(evaluation)}
              >
                Full Scorecard
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Scorecard Modal */}
      {selectedEval && (
        <Modal
          isOpen={!!selectedEval}
          onClose={() => setSelectedEval(null)}
          title={`Committee Scorecard: ${selectedEval.startupName}`}
          description={`Evaluated by ${selectedEval.evaluatorName} (${selectedEval.evaluatorAffiliation})`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setSelectedEval(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
              <div>
                <p className="text-xs uppercase font-bold text-emerald-700">Official Recommendation</p>
                <p className="text-base font-bold mt-0.5">{selectedEval.recommendation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-bold text-emerald-700">Total Aggregate Score</p>
                <p className="text-2xl font-extrabold">{selectedEval.totalScore} / 100</p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-slate-900">Evaluator Rubric Details</h5>
              {selectedEval.criteriaScores?.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">{c.criterion}</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {c.scoreAwarded} / {c.maxScore} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{c.remarks}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
