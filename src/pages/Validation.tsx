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
  Modal,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { ValidationReport } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ShieldCheck, CheckCircle2, FileCheck, Download, Award, Building, ExternalLink, FileText, Check } from 'lucide-react';

export const Validation: React.FC = () => {
  const [reports, setReports] = useState<ValidationReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ValidationReport | null>(null);

  const loadData = () => {
    mockService.getValidationReports().then(setReports);
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
            Independent Third-Party Scientific Validation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empaneled scientific bodies (CSIR / IIT) certifying field test accuracy, security compliance, and procurement readiness under GFR 149(viii)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <ShieldCheck className="w-3.5 h-3.5" />
            CSIR / IIT Accredited Testbeds
          </Badge>
        </div>
      </div>

      {/* Validation Reports List */}
      <div className="space-y-6">
        {reports.map((report) => (
          <Card key={report.id} className="border-l-4 border-l-emerald-600 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={report.verdict === 'FAILED' ? 'danger' : 'success'} size="sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {report.verdict}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">Cert #{report.certificateNumber}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Audited {formatDate(report.auditDate)}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {report.startupName} — Scientific Validation Clearance
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Target Challenge: {report.challengeTitle}
                  </CardDescription>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Procurement Suitability Score
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {report.procurementSuitabilityScore} / 100
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certifying Body</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{report.auditingAgency}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Scientist</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{report.leadAuditor}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Security & Vulnerability</span>
                  <span className="font-semibold text-emerald-700 mt-0.5 block">{report.securityCompliance}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Regulatory Compliance</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{report.regulatoryCompliance}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Official Auditor Findings & Legal Recommendation
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  {report.summaryObservations}
                </p>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-blue-950">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    Statutory Verdict: <strong>{report.verdict}</strong> (Rule 149(viii) GFR 2017)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                  >
                    View Official Certificate
                  </Button>
                  <Button
                    variant="navy"
                    size="sm"
                    onClick={() => alert(`Downloading signed CSIR / IIT Validation Certificate #${report.certificateNumber}`)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Official Certificate Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="National Innovation Procurement Validation Certificate"
          description={`Issued pursuant to GFR 2017 Rule 149(viii) | Cert #${selectedReport.certificateNumber}`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setSelectedReport(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-center border-b border-slate-200 pb-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Independent Audit Clearing Authority</span>
              <h4 className="font-extrabold text-base text-slate-900 mt-0.5">{selectedReport.auditingAgency}</h4>
              <p className="text-xs text-slate-600">Lead Auditor: {selectedReport.leadAuditor}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Tested Startup</span>
                <span className="font-bold text-slate-900 text-sm">{selectedReport.startupName}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Procurement Score</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedReport.procurementSuitabilityScore} / 100</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Legal Procurement Mandate</span>
              <p className="text-slate-700 leading-relaxed text-xs">
                "Having independently audited and verified the quantitative performance, data privacy standards, and edge hardware reliability in field trials, this solution is hereby certified as fully validated and suitable for single-source direct procurement under General Financial Rules (GFR) 2017 Rule 149(viii)."
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
