import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { ScaleUpPlan } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';

export const ScaleUp: React.FC = () => {
  const [plans, setPlans] = useState<ScaleUpPlan[]>([]);

  useEffect(() => {
    mockService.getScaleUpPlans().then(setPlans);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Procurement Decision & Scale-Up Gateway
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct public procurement transition from validated sandboxes into GeM catalogs and nationwide rollouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" size="md">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            GeM Innovation Category Ready
          </Badge>
        </div>
      </div>

      {/* Statutory Procurement Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-blue-950">
            Legal Authority: General Financial Rules (GFR) 2017 - Rule 149(viii)
          </p>
          <p className="mt-1 text-slate-700 leading-relaxed">
            Upon successful completion and third-party scientific validation of an innovation sandbox pilot, the procuring entity is legally authorized to execute direct single-source scale-up procurement through the Government e-Marketplace (GeM) without initiating fresh open tenders.
          </p>
        </div>
      </div>

      {/* Scale Up Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col justify-between hover:border-blue-300 transition-all">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {plan.status}
                </Badge>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                  Estimated Value: {formatCurrency(plan.estimatedContractValue)}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {plan.startupName}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-blue-700">
                {plan.solutionName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Scale</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{plan.recommendedScale}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GeM Classification</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">{plan.gemCategory}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Procuring Authority</span>
                <p className="font-semibold text-slate-800">{plan.procuringDepartment}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{plan.legalBasis}</p>
              </div>
            </CardContent>

            <div className="p-5 pt-0 mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DPIIT Innovation Exempted
              </span>
              <Button
                variant="navy"
                size="sm"
                onClick={() => alert(`Initiating GeM Direct Listing Workflow for ${plan.solutionName}`)}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Initiate GeM Purchase Order
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
