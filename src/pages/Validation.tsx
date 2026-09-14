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
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { ValidationReport } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ShieldCheck, CheckCircle2, FileCheck, Download, Award, Building, ExternalLink } from 'lucide-react';

export const Validation: React.FC = () => {
  const [reports, setReports] = useState<ValidationReport[]>([]);

  useEffect(() => {
    mockService.getValidationReports().then(setReports);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Independent Third-Party Validation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empaneled academic & scientific bodies certifying field trial validity and legal procurement readiness
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
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {report.kpiVerificationStatus}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Audited {formatDate(report.auditDate)}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {report.startupName} — Validation Clearance Certificate
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Target Challenge: {report.challengeTitle}
                  </CardDescription>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Procurement Suitability
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {report.procurementSuitabilityScore} / 100
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
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
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Official Auditor Findings & Legal Recommendation
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  {report.summaryObservations}
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 text-blue-950">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    Official Verdict: <strong>{report.verdict}</strong> (Rule 149(viii) GFR 2017)
                  </span>
                </div>
                <Button
                  variant="navy"
                  size="sm"
                  onClick={() => alert(`Downloading Third-Party Validation Certificate #${report.id}`)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Formal Audit Dossier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
