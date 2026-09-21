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
  Tabs,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { User, Startup, Challenge, Pilot, AuditLogEntry, ScaleUpPlan } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ShieldAlert,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  FlaskConical,
  TrendingUp,
  CreditCard,
  Activity,
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { mockUsers } from '@/data/mockData';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [scalePlans, setScalePlans] = useState<ScaleUpPlan[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = () => {
    mockService.getChallenges().then(setChallenges);
    mockService.getStartups().then(setStartups);
    mockService.getPilots().then(setPilots);
    mockService.getAuditLogs().then(setAuditLogs);
    mockService.getScaleUpPlans().then(setScalePlans);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const totalProcurementValue = scalePlans.reduce((acc, p) => acc + p.estimatedContractValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              National Platform Directorate
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pragati AI Governance & System Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ecosystem oversight, GFR 2017 sandbox compliance, and cryptographic audit log monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              mockService.resetToDefaults();
              alert('Ecosystem state reset to official SIH initial baseline.');
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Demo Data
          </Button>
          <Badge variant="navy" size="md">
            <ShieldAlert className="w-3.5 h-3.5" />
            Super Admin
          </Badge>
        </div>
      </div>

      {/* 7 Top Ecosystem Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Departments</span>
          <p className="text-xl font-bold text-slate-900 mt-1">3</p>
          <p className="text-[9px] text-slate-500">Central Ministries</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Vetted Startups</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{startups.length}</p>
          <p className="text-[9px] text-emerald-600">DPIIT Active</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Empaneled Experts</span>
          <p className="text-xl font-bold text-amber-700 mt-1">12</p>
          <p className="text-[9px] text-amber-600">IIT / CSIR</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Challenges</span>
          <p className="text-xl font-bold text-blue-700 mt-1">{challenges.length}</p>
          <p className="text-[9px] text-blue-600">Open for Bids</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Pilots</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{pilots.length}</p>
          <p className="text-[9px] text-slate-500">In Sandboxes</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Scale-Up Pipeline</span>
          <p className="text-xl font-bold text-purple-700 mt-1">{formatCurrency(totalProcurementValue)}</p>
          <p className="text-[9px] text-purple-600">GeM Direct Buy</p>
        </Card>
        <Card className="p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Scale-ups Issued</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{scalePlans.length}</p>
          <p className="text-[9px] text-emerald-600">GFR 149(viii)</p>
        </Card>
      </div>

      {/* Tabs for Admin Management Sections */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'overview', label: 'Ecosystem Overview' },
          { id: 'users', label: 'User & Stakeholder Directory' },
          { id: 'startups', label: 'DPIIT Startup Verification' },
          { id: 'audit', label: 'Cryptographic Audit Trail' },
        ]}
      />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ministry & Department Participation</CardTitle>
              <CardDescription>Procuring entities with active innovation challenge grants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                { name: 'Ministry of Housing & Urban Affairs', challenges: 1, budget: '₹45.0 Lakhs', pilots: 'Indore Smart City' },
                { name: 'Ministry of Road Transport (NHAI)', challenges: 1, budget: '₹60.0 Lakhs', pilots: 'NH-48 Corridor' },
                { name: 'Ministry of Jal Shakti', challenges: 1, budget: '₹50.0 Lakhs', pilots: 'Pune Water Grid' },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Sandbox: {m.pilots}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-700 block">{m.budget}</span>
                    <span className="text-[10px] text-slate-500">{m.challenges} Challenge</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statutory Compliance Status</CardTitle>
              <CardDescription>Public procurement audit metrics under GFR 2017</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">Rule 149(viii) Sandbox Exemption</p>
                  <p className="text-slate-500 text-[11px]">Valid for all empaneled DPIIT startups</p>
                </div>
                <Badge variant="success">100% Compliant</Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">Public Financial Management System (PFMS)</p>
                  <p className="text-slate-500 text-[11px]">Escrow disbursement integration active</p>
                </div>
                <Badge variant="success">PFMS Active</Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">Government e-Marketplace (GeM) API</p>
                  <p className="text-slate-500 text-[11px]">Direct purchase order category link</p>
                </div>
                <Badge variant="primary">GeM Ready</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registered Stakeholders & Role Directory</CardTitle>
            <CardDescription>Accounts authorized to create challenges, submit bids, and perform evaluations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Official Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department / Entity</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{u.name}</TableCell>
                    <TableCell className="text-xs text-slate-600">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="navy" size="sm">{u.role.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-800">{u.departmentOrCompany}</TableCell>
                    <TableCell className="text-xs text-slate-500">{u.designation || 'Officer'}</TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm">Verified Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'startups' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">DPIIT Startup Empanelment Verification</CardTitle>
            <CardDescription>Live sync with Startup India National Registry</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup Name</TableHead>
                  <TableHead>DPIIT Number</TableHead>
                  <TableHead>Founder & Contact</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Readiness Level</TableHead>
                  <TableHead>Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-bold text-slate-900 text-xs">{s.brandName}</TableCell>
                    <TableCell className="font-mono text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {s.dpiitNumber}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">{s.founderName} ({s.contactEmail})</TableCell>
                    <TableCell className="text-xs text-slate-600">{s.focusSector}</TableCell>
                    <TableCell className="text-xs font-bold text-purple-900">TRL {s.trlLevel} / 9</TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm">✓ DPIIT Verified</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cryptographic SHA-256 Audit Trail</CardTitle>
            <CardDescription>Immutable log of every challenge, evaluation, milestone release, and scale-up decision</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Audit Details</TableHead>
                  <TableHead>SHA-256 Block Signature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap font-mono">{log.timestamp}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">{log.actorName} ({log.actorRole})</TableCell>
                    <TableCell>
                      <Badge variant="primary" size="sm">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-sm">{log.details}</TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                      {log.hash}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
