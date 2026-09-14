import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Select,
  Badge,
  Tabs,
} from '@/components/ui';
import { Shield, Bell, Key, Database, FileText, CheckCircle2, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('department');
  const [deptName, setDeptName] = useState('Ministry of Housing & Urban Affairs');
  const [nodalOfficer, setNodalOfficer] = useState('Rajesh Varma, IAS');
  const [email, setEmail] = useState('rajesh.varma@gov.in');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Settings & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department configuration, audit trails, and GFR 2017 innovation sandbox policy parameters
          </p>
        </div>

        <Badge variant="navy" size="md">
          <Shield className="w-3.5 h-3.5" />
          Enterprise Tier
        </Badge>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'department', label: 'Department Profile' },
          { id: 'compliance', label: 'Legal & GFR Sandbox Rules' },
          { id: 'audit', label: 'Security & Audit Trails' },
          { id: 'integrations', label: 'GeM & PFMS Integrations' },
        ]}
      />

      {activeTab === 'department' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department & Nodal Authority Details</CardTitle>
              <CardDescription>
                Primary procurement identity used on official sandbox sanction orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Department / Ministry Name"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                />
                <Input
                  label="Nodal Officer Name & Designation"
                  value={nodalOfficer}
                  onChange={(e) => setNodalOfficer(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Official Government Email (.gov.in / .nic.in)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  label="State / Union Territory Jurisdiction"
                  options={[
                    { value: 'central', label: 'Central Ministry (National Scope)' },
                    { value: 'delhi', label: 'NCT of Delhi' },
                    { value: 'karnataka', label: 'Karnataka' },
                    { value: 'maharashtra', label: 'Maharashtra' },
                  ]}
                  defaultValue="central"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Settings saved successfully!
                  </span>
                ) : <span />}
                <Button type="submit" variant="navy" leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {activeTab === 'compliance' && (
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Sandbox Thresholds</CardTitle>
            <CardDescription>Policy limits governing startup discovery and pilot risk shielding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Maximum Grant Ceiling Per Sandbox Pilot</span>
              <p className="text-xs text-slate-500">Configured at ₹1,00,00,000 (INR 1.00 Crore) pursuant to GFR 2017</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Minimum Pilot Evaluation Period</span>
              <p className="text-xs text-slate-500">60 continuous calendar days with automated live telemetry</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Direct GeM Onboarding Threshold</span>
              <p className="text-xs text-slate-500">Minimum 90% aggregate score on Third-Party Independent Scientific Audit</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Security & Immutable Audit Logs</CardTitle>
            <CardDescription>All decision records are cryptographically timestamped for CAG audit readiness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Audit Log Hashes</p>
                <p className="text-slate-500 text-[11px]">SHA-256 Merkle tree verification active</p>
              </div>
              <Badge variant="success">Compliant</Badge>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">CERT-In Compliance</p>
                <p className="text-slate-500 text-[11px]">Periodic VAPT audit passed</p>
              </div>
              <Badge variant="success">Valid</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'integrations' && (
        <Card>
          <CardHeader>
            <CardTitle>Government System Connectors</CardTitle>
            <CardDescription>Modular adapters ready for production national service links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {[
              { name: 'Public Financial Management System (PFMS)', desc: 'Milestone escrow disbursal', status: 'Ready for Key' },
              { name: 'Government e-Marketplace (GeM API)', desc: 'Direct catalog scale-up pipeline', status: 'API v3 Compatible' },
              { name: 'DPIIT Startup India API', desc: 'Real-time DIPP recognition verification', status: 'Mock Connected' },
              { name: 'DigiLocker / National Single Window', desc: 'Founder KYC and business documents', status: 'Mock Connected' },
            ].map((int, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{int.name}</p>
                  <p className="text-slate-500 text-[11px]">{int.desc}</p>
                </div>
                <Badge variant="primary" size="sm">{int.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
