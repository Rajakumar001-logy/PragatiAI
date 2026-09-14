import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { PaymentMilestone } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentMilestone[]>([]);

  useEffect(() => {
    mockService.getPayments().then(setPayments);
  }, []);

  const totalCommitted = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalDisbursed = payments
    .filter((p) => p.status === 'Disbursed')
    .reduce((acc, p) => acc + p.amount, 0);

  const getStatusBadge = (status: PaymentMilestone['status']) => {
    switch (status) {
      case 'Disbursed':
        return 'success';
      case 'Approved by Department':
        return 'primary';
      case 'Pending Verification':
        return 'warning';
      case 'On Hold':
        return 'danger';
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
            Milestone-Based Payment Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated public fund escrow disbursal tied strictly to verified KPI delivery benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" size="md">
            <ShieldCheck className="w-3.5 h-3.5" />
            PFMS Escrow Linked
          </Badge>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">Allocated Milestone Budget</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(totalCommitted)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Approved under GFR 2017 Sandbox Grants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">Disbursed on Verified Delivery</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">{formatCurrency(totalDisbursed)}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">100% Audit Cleared via PFMS</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">Held in Milestone Escrow</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">
              {formatCurrency(totalCommitted - totalDisbursed)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Disbursed upon third-party audit pass</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Tranche Ledger</CardTitle>
          <CardDescription>
            Each tranche is verified by department engineers before release
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tranche & Milestone Details</TableHead>
                <TableHead>Recipient Startup</TableHead>
                <TableHead>Verification Deliverable</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">Sanction Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs">
                    <p className="font-semibold text-slate-900 text-xs">{p.milestoneTitle}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{p.challengeTitle}</p>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800 text-xs">
                    {p.startupName}
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-slate-600">
                    {p.deliverableCriteria}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 text-xs whitespace-nowrap">
                    {formatCurrency(p.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(p.status)} size="sm">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-slate-500">
                    {p.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Downloading PFMS Sanction Order for ${p.invoiceNumber}`)}
                      leftIcon={<Download className="w-3 h-3" />}
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
