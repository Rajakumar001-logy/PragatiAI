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
  Modal,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Application } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { FileCheck, FileText, CheckCircle2, AlertCircle, Eye, Check, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export const Applications: React.FC = () => {
  const { role } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadData = () => {
    mockService.getApplications().then(setApplications);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (appId: string, nextStatus: Application['status']) => {
    await mockService.updateApplicationStatus(appId, nextStatus);
    setSelectedApp(null);
    alert(`Application status transitioned to '${nextStatus}'.`);
  };

  const getStatusBadgeVariant = (status: Application['status']) => {
    switch (status) {
      case 'Selected':
      case 'Shortlisted for Pilot':
      case 'Shortlisted':
        return 'success';
      case 'Eligibility Passed':
      case 'Pilot':
      case 'Validation':
        return 'primary';
      case 'Expert Evaluation':
      case 'Under Evaluation':
      case 'Eligibility Check':
        return 'warning';
      case 'Rejected':
      case 'Eligibility Rejected':
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
            Startup Applications & Proposal Screening
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            DPIIT verification, technical eligibility qualification, and sandbox shortlist governance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Total Proposals: <strong>{applications.length}</strong></span>
          <span>•</span>
          <span className="text-emerald-600 font-medium">100% Automated Compliance Checked</span>
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Received Innovation Proposals</CardTitle>
          <CardDescription>
            All submitted solutions matched against problem challenge criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup & DPIIT</TableHead>
                <TableHead>Target Problem Challenge</TableHead>
                <TableHead>Eligibility Score</TableHead>
                <TableHead>Proposed Pilot Budget</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-0.5">
                      <p className="text-slate-900 font-semibold text-xs">{app.startupName}</p>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {app.dpiitNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{app.challengeTitle}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{app.proposalSummary}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{app.eligibilityScore}%</span>
                      {app.eligibilityScore >= 90 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 text-xs">
                    {formatCurrency(app.pilotBudgetProposed)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(app.submittedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Dossier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Review: ${selectedApp.startupName}`}
          description={`Challenge: ${selectedApp.challengeTitle}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">Status: <strong>{selectedApp.status}</strong></span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedApp(null)}>
                  Close
                </Button>
                {(role === 'government' || role === 'admin') && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="navy"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedApp.id, 'Shortlisted for Pilot')}
                    >
                      Shortlist for Sandbox Pilot
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900">Proposal Summary & Solution</h5>
              <p className="text-slate-700 leading-relaxed">{selectedApp.solutionDescription || selectedApp.proposalSummary}</p>
            </div>

            {selectedApp.technicalApproach && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">Technical Approach & Algorithms</h5>
                <p className="text-slate-700 leading-relaxed">{selectedApp.technicalApproach}</p>
              </div>
            )}

            {selectedApp.implementationPlan && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">60-Day Pilot Implementation Plan</h5>
                <p className="text-slate-700 leading-relaxed">{selectedApp.implementationPlan}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">DPIIT Recognition</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 block">Verified Active ({selectedApp.dpiitNumber})</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Pilot Cost</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  {formatCurrency(selectedApp.pilotBudgetProposed)}
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-2">Attached Verification Documents</h5>
              <div className="space-y-2">
                {selectedApp.documents?.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-slate-800">{doc.title}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      <Check className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
