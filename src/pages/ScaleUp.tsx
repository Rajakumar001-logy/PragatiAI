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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  Input,
  Select,
  Textarea,
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
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export const ScaleUp: React.FC = () => {
  const { role } = useAuth();
  const [plans, setPlans] = useState<ScaleUpPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ScaleUpPlan | null>(null);

  // Scale Solution Modal state
  const [procuringDept, setProcuringDept] = useState('Ministry of Housing & Urban Affairs');
  const [selectedDistricts, setSelectedDistricts] = useState('Indore, Bhopal, Jabalpur, Gwalior, Ujjain (50 Municipal Corporations)');
  const [quantity, setQuantity] = useState('50 Municipal Fleet SaaS Licenses & 2,000 Bin Sensors');
  const [estimatedCost, setEstimatedCost] = useState('140000000');
  const [scalingPlanNotes, setScalingPlanNotes] = useState('3-Year nationwide rollout across Swachh Bharat Mission Urban 2.0 ULBs under GFR Rule 149(viii) single-source procurement exemption.');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    mockService.getScaleUpPlans().then(setPlans);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const openScaleModal = (plan: ScaleUpPlan) => {
    setSelectedPlan(plan);
    setProcuringDept(plan.procuringDepartment);
    setEstimatedCost(String(plan.estimatedContractValue));
  };

  const handleExecuteScaleUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitting(true);
    await mockService.scaleSolution({
      planId: selectedPlan.id,
      procuringDepartment: procuringDept,
      targetDistricts: selectedDistricts.split(',').map((d) => d.trim()),
      procurementQuantity: quantity,
      estimatedCost: Number(estimatedCost) || selectedPlan.estimatedContractValue,
    });
    setSubmitting(false);
    setSelectedPlan(null);
    alert('Scale-up purchase order issued on GeM under GFR Rule 149(viii)!');
  };

  const getStatusBadge = (status: ScaleUpPlan['status']) => {
    switch (status) {
      case 'Scaled':
        return 'success';
      case 'Ready for Procurement':
      case 'Ready for GeM Listing':
        return 'primary';
      case 'Procurement Initiated':
      case 'Cabinet Note in Progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Procurement Decision & Scale-Up Gateway
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct public procurement transition from validated sandboxes into GeM catalogs and nationwide rollouts under GFR 2017 Rule 149(viii)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" size="md">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            GeM Direct Buy Mandate
          </Badge>
        </div>
      </div>

      {/* Statutory Procurement Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-blue-950">
            Legal Statutory Authority: General Financial Rules (GFR) 2017 - Rule 149(viii)
          </p>
          <p className="mt-1 text-slate-700 leading-relaxed">
            Upon successful completion and third-party scientific validation of an innovation sandbox pilot, procuring entities are legally authorized to execute direct single-source scale-up procurement through the Government e-Marketplace (GeM) without repetitive open tenders.
          </p>
        </div>
      </div>

      {/* Validated Solutions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Validated Solutions Ready for Scale-Up</CardTitle>
          <CardDescription>
            Solutions certified by independent scientific bodies (CSIR / IIT) ready for government-wide purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solution Name</TableHead>
                <TableHead>Startup</TableHead>
                <TableHead>Pilot Score</TableHead>
                <TableHead>Validation Status</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Procurement Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="max-w-xs">
                    <p className="font-bold text-slate-900 text-xs">{plan.solutionName}</p>
                    <p className="text-[11px] text-blue-700">{plan.gemCategory}</p>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 text-xs">
                    {plan.startupName}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                      {plan.pilotScore} / 100
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {plan.validationStatus}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {plan.recommendation}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 text-xs whitespace-nowrap">
                    {formatCurrency(plan.estimatedContractValue)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(plan.status)} size="sm">
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(role === 'government' || role === 'admin') ? (
                      <Button
                        variant={plan.status === 'Scaled' ? 'success' : 'navy'}
                        size="sm"
                        onClick={() => openScaleModal(plan)}
                        rightIcon={plan.status === 'Scaled' ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      >
                        {plan.status === 'Scaled' ? 'Scale Details' : 'Scale Solution'}
                      </Button>
                    ) : (
                      <Badge variant="primary" size="sm">Qualified</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scale Solution Modal */}
      {selectedPlan && (
        <Modal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title={`Scale Solution: ${selectedPlan.solutionName}`}
          description={`Initiate direct GeM public procurement under GFR Rule 149(viii) for ${selectedPlan.startupName}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-medium">
                Pilot Score: <strong>{selectedPlan.pilotScore}/100 (Validated)</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(null)}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleExecuteScaleUp}
                  disabled={submitting}
                >
                  {submitting ? 'Executing...' : 'Confirm & Issue GeM Scale-Up Order'}
                </Button>
              </div>
            </div>
          }
        >
          <form onSubmit={handleExecuteScaleUp} className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 space-y-1">
              <span className="font-bold text-xs uppercase text-blue-800 block">Single-Source Procurement Exemption Cleared</span>
              <p className="text-xs text-slate-700">
                Independent CSIR/IIT validation report confirms technical superiority and benchmark achievement. No fresh open tender required.
              </p>
            </div>

            <Input
              label="Procuring Department / Ministry"
              value={procuringDept}
              onChange={(e) => setProcuringDept(e.target.value)}
              required
            />

            <Input
              label="Target Scale Districts / Municipal Jurisdictions"
              value={selectedDistricts}
              onChange={(e) => setSelectedDistricts(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Procurement Quantity / Scope"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <Input
                label="Estimated Contract Value (INR ₹)"
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Scale-up Implementation Blueprint & GeM Schedule"
              value={scalingPlanNotes}
              onChange={(e) => setScalingPlanNotes(e.target.value)}
              rows={3}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
