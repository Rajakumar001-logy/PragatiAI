import React, { useState, useEffect } from 'react';
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
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Pilot } from '@/types';
import { formatDate } from '@/utils/formatters';
import {
  FlaskConical,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const Pilots: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);

  useEffect(() => {
    mockService.getPilots().then(setPilots);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Innovation Sandbox & Field Pilots
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-world municipal and highway testbed deployments with live telemetry and milestone governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning" size="md">
            <FlaskConical className="w-3.5 h-3.5" />
            Active Regulatory Sandbox
          </Badge>
        </div>
      </div>

      {/* Pilots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pilots.map((pilot) => (
          <Card key={pilot.id} className="flex flex-col justify-between hover:border-blue-300 transition-all">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <StatusIndicator status={pilot.status} label={pilot.status} pulse={pilot.status === 'In Sandbox'} />
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  KPI Score: {pilot.liveKpiScore}/100
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {pilot.startupName}
              </CardTitle>
              <CardDescription className="text-xs">
                {pilot.challengeTitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Deployment: {pilot.deploymentLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {formatDate(pilot.startDate)} – {formatDate(pilot.endDate)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Sandbox Duration Elapsed</span>
                  <span className="text-blue-700">{pilot.completionPercentage}%</span>
                </div>
                <ProgressBar
                  value={pilot.completionPercentage}
                  size="md"
                  variant={pilot.completionPercentage === 100 ? 'emerald' : 'blue'}
                />
              </div>

              {/* Milestones counter */}
              <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-lg text-xs">
                <span className="text-slate-600">Verified Milestone Deliverables</span>
                <span className="font-bold text-blue-900">
                  {pilot.completedMilestones} / {pilot.totalMilestones} Completed
                </span>
              </div>
            </CardContent>

            <div className="p-5 pt-0 mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Overseeing: <strong>{pilot.department}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPilot(pilot)}
              >
                Inspect Telemetry
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pilot Inspection Modal */}
      {selectedPilot && (
        <Modal
          isOpen={!!selectedPilot}
          onClose={() => setSelectedPilot(null)}
          title={`Sandbox Telemetry: ${selectedPilot.startupName}`}
          description={`Location: ${selectedPilot.deploymentLocation}`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setSelectedPilot(null)}>
              Close Telemetry Stream
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-emerald-400 text-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live MQTT Telemetry Stream Connected
                </span>
                <span className="text-slate-400 text-[10px]">Ping: 28ms</span>
              </div>
              <p className="text-xs text-slate-300">
                Device Nodes Active: <strong>400 Ultrasonic Sensors</strong> | Sampling Rate: <strong>60s</strong>
              </p>
              <p className="text-xs text-slate-300">
                Current Data Integrity Check: <strong>SHA-256 Verified on Gov-NIC Gateway</strong>
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
              <p className="font-bold">Sandbox Safe Harbor Status</p>
              <p className="mt-0.5">
                Startup operates under regulatory sandbox liability exemptions approved by Municipal Commissioner pursuant to Innovation Procurement Circular.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
