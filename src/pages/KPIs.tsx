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
  ProgressBar,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { KPIMeasurement } from '@/types';
import { Radio, Cpu, CheckCircle2, TrendingUp, Sparkles, Activity, Layers } from 'lucide-react';

export const KPIs: React.FC = () => {
  const [kpis, setKpis] = useState<KPIMeasurement[]>([]);

  const loadData = () => {
    mockService.getKPIs().then(setKpis);
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
            Objective KPI Measurement & Verification Grid
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident baseline vs target telemetry powering automated milestone payments and GeM procurement scale-up
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Ingestion Active (NIC IoT Hub)
          </Badge>
        </div>
      </div>

      {/* Visual KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="border-t-4 border-t-emerald-600 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={kpi.status === 'Exceeding' ? 'success' : 'primary'} size="sm">
                  {kpi.status}
                </Badge>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {kpi.achievementPercentage}% Achievement
                </span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-1">{kpi.metricName}</CardTitle>
              <CardDescription className="text-xs">{kpi.startupName} • {kpi.challengeTitle}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Visual Comparative Bar Chart */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Baseline (Pre-Pilot)</span>
                    <span className="font-mono font-semibold">{kpi.baseline}</span>
                  </div>
                  <ProgressBar value={30} size="sm" variant="navy" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Contractual Target Benchmark</span>
                    <span className="font-mono font-semibold text-blue-700">{kpi.target}</span>
                  </div>
                  <ProgressBar value={80} size="sm" variant="blue" />
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-emerald-700">Live Achieved Field Value</span>
                    <span className="font-mono text-emerald-800">{kpi.currentValue}</span>
                  </div>
                  <ProgressBar value={kpi.achievementPercentage >= 100 ? 100 : kpi.achievementPercentage} size="md" variant="emerald" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>{kpi.telemetrySource}</span>
                </div>
                <span className="font-mono text-[10px]">{kpi.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
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
                <TableHead>Baseline</TableHead>
                <TableHead>Contractual Target</TableHead>
                <TableHead>Current Field Result</TableHead>
                <TableHead>Achievement %</TableHead>
                <TableHead>Telemetry Source</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi) => (
                <TableRow key={kpi.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 text-xs">{kpi.startupName}</p>
                      <p className="text-[11px] text-slate-500">{kpi.challengeTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 text-xs">
                    {kpi.metricName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {kpi.baseline}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700 font-mono">
                    {kpi.target}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded">
                    {kpi.currentValue}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-blue-700">
                    {kpi.achievementPercentage}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span>{kpi.telemetrySource}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={kpi.status === 'Exceeding' ? 'success' : 'primary'} size="sm">
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
