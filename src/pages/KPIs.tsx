import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { KPIMeasurement } from '@/types';
import { LineChart, Activity, Radio, Cpu, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';

export const KPIs: React.FC = () => {
  const [kpis, setKpis] = useState<KPIMeasurement[]>([]);

  useEffect(() => {
    mockService.getKPIs().then(setKpis);
  }, []);

  const getKPIBadge = (status: KPIMeasurement['status']) => {
    switch (status) {
      case 'Exceeding':
        return 'success';
      case 'On Track':
        return 'primary';
      case 'At Risk':
        return 'warning';
      case 'Underperforming':
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
            Objective KPI Measurement & Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident baseline vs target measurement powering milestone payments and procurement decisions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Telemetry Ingestion Active
          </Badge>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-emerald-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Fuel Cost Reduction</span>
              <Badge variant="success" size="sm">Exceeding Target</Badge>
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">24.8%</p>
            <p className="text-[11px] text-slate-500">Target was 22.0% | Baseline: 0%</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Bin Overflow SLA</span>
              <Badge variant="primary" size="sm">On Track</Badge>
            </div>
            <p className="text-2xl font-extrabold text-blue-700">98.9%</p>
            <p className="text-[11px] text-slate-500">Target was 99.5% | Baseline: 78.0%</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Defect Detection Accuracy</span>
              <Badge variant="success" size="sm">Exceeding</Badge>
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">94.2%</p>
            <p className="text-[11px] text-slate-500">Target was 92.0% | Baseline: 65.0%</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Survey Vehicle Speed</span>
              <Badge variant="primary" size="sm">Compliant</Badge>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">62.4 km/h</p>
            <p className="text-[11px] text-slate-500">Target was 60 km/h patrol speed</p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Objective Field Telemetry Audit Log</CardTitle>
          <CardDescription>
            Continuous quantitative evidence collected from IoT nodes and algorithmic benchmark runs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge & Startup</TableHead>
                <TableHead>Outcome Target Metric</TableHead>
                <TableHead>Baseline (Pre-Pilot)</TableHead>
                <TableHead>Contractual Target</TableHead>
                <TableHead>Current Field Result</TableHead>
                <TableHead>Telemetry Source</TableHead>
                <TableHead>Performance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi) => (
                <TableRow key={kpi.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900">{kpi.startupName}</p>
                      <p className="text-xs text-slate-500">{kpi.challengeTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {kpi.metricName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {kpi.baseline}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700 font-mono">
                    {kpi.target}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-blue-700 bg-blue-50/60 p-2 rounded">
                    {kpi.currentValue}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span>{kpi.telemetrySource}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getKPIBadge(kpi.status)} size="sm">
                      {kpi.status}
                    </Badge>
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
