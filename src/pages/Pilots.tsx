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
  Input,
  Select,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Pilot, Application } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  FlaskConical,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Radio,
  Cpu,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export const Pilots: React.FC = () => {
  const { role } = useAuth();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);

  // Create Pilot modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [location, setLocation] = useState('Zone 2 Sandbox Testbed, Pune');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
  const [budget, setBudget] = useState('4500000');

  const loadData = () => {
    mockService.getPilots().then(setPilots);
    mockService.getApplications().then((apps) => {
      setApplications(apps);
      if (apps.length > 0) setSelectedAppId(apps[0].id);
    });
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handleCreatePilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;
    await mockService.createPilotFromApplication(
      selectedAppId,
      location,
      startDate,
      endDate,
      Number(budget) || 4500000
    );
    setIsCreateModalOpen(false);
    alert('Sandbox pilot created successfully! Live telemetry tracking activated.');
  };

  const handleToggleMilestone = async (pilotId: string, milestoneId: string, currentCompleted: boolean) => {
    await mockService.updatePilotMilestone(pilotId, milestoneId, !currentCompleted);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Innovation Sandbox & Field Pilots
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-world testbeds with live telemetry, safe-harbor regulatory shielding, and milestone governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(role === 'government' || role === 'admin') && (
            <Button
              variant="navy"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Initiate New Pilot
            </Button>
          )}
          <Badge variant="warning" size="md">
            <FlaskConical className="w-3.5 h-3.5" />
            Regulatory Sandbox Shield Active
          </Badge>
        </div>
      </div>

      {/* Pilots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pilots.map((pilot) => (
          <Card key={pilot.id} className="flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <StatusIndicator status={pilot.status} label={pilot.status} pulse={pilot.status === 'In Sandbox'} />
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  KPI Score: {pilot.liveKpiScore}/100
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {pilot.startupName}
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                {pilot.challengeTitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Deployment: <strong>{pilot.deploymentLocation}</strong></span>
                </div>
                <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(pilot.startDate)} – {formatDate(pilot.endDate)}</span>
                  </div>
                  <span className="font-bold text-slate-900">Budget: {formatCurrency(pilot.budget)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Sandbox Milestone Progress</span>
                  <span className="text-blue-700 font-bold">{pilot.completionPercentage}%</span>
                </div>
                <ProgressBar
                  value={pilot.completionPercentage}
                  size="md"
                  variant={pilot.completionPercentage === 100 ? 'emerald' : 'blue'}
                />
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pilot Milestones Checklist ({pilot.completedMilestones}/{pilot.totalMilestones})
                </p>
                <div className="space-y-1.5">
                  {pilot.milestones?.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => (role === 'government' || role === 'admin') && handleToggleMilestone(pilot.id, m.id, m.completed)}
                      className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                        (role === 'government' || role === 'admin') ? 'cursor-pointer hover:bg-slate-50' : ''
                      } ${m.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                          {m.completed ? <Check className="w-2.5 h-2.5" /> : null}
                        </div>
                        <div>
                          <p className={`font-semibold text-xs ${m.completed ? 'text-emerald-950 line-through' : 'text-slate-800'}`}>
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-500">{m.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="p-4 pt-0 mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Dept: <strong>{pilot.department}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPilot(pilot)}
                leftIcon={<Radio className="w-3.5 h-3.5 text-blue-600" />}
              >
                Inspect Telemetry
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Telemetry Stream Modal */}
      {selectedPilot && (
        <Modal
          isOpen={!!selectedPilot}
          onClose={() => setSelectedPilot(null)}
          title={`Live Sandbox Telemetry: ${selectedPilot.startupName}`}
          description={`Testbed: ${selectedPilot.deploymentLocation}`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setSelectedPilot(null)}>
              Close Telemetry Feed
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-emerald-400 text-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live MQTT Telemetry Stream Connected (NIC Gateway)
                </span>
                <span className="text-slate-400 text-[10px]">Ping: 22ms</span>
              </div>
              <p className="text-xs text-slate-300">
                Active Edge Nodes: <strong>400 Sensors</strong> | Telemetry Ingestion: <strong>60s Interval</strong>
              </p>
              <p className="text-xs text-slate-300">
                Cryptographic Checksum: <strong>SHA-256 Validated on Sovereign Server</strong>
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
              <p className="font-bold">Safe-Harbor Regulatory Exemption</p>
              <p className="mt-0.5">
                This deployment operates under approved GFR 2017 sandbox liability protections issued by the Ministry Directorate.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Pilot Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Initiate Sandbox Pilot Deployment"
          description="Commission a 60-day field trial with milestone escrow governance"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="navy" size="sm" onClick={handleCreatePilot}>
                Commission Pilot
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreatePilot} className="space-y-4">
            <Select
              label="Select Shortlisted Proposal"
              options={applications.map((a) => ({
                value: a.id,
                label: `${a.startupName} — ${a.challengeTitle} (${a.dpiitNumber})`,
              }))}
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
            />

            <Input
              label="Deployment Location / Testbed"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Input
              label="Allocated Sandbox Pilot Grant (INR ₹)"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
