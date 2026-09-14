import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  StatusIndicator,
} from '@/components/ui';
import { mockService } from '@/services/mockService';
import { Startup } from '@/types';
import {
  Building2,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

export const StartupPortal: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  useEffect(() => {
    mockService.getStartups().then(setStartups);
  }, []);

  const filteredStartups = startups.filter((s) => {
    const matchesSearch =
      s.brandName.toLowerCase().includes(search.toLowerCase()) ||
      s.solutionTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.dpiitNumber.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || s.focusSector.includes(selectedSector);
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Startup Discovery & DPIIT Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empaneled deep-tech startups qualified for outcome-based government innovation sandboxes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            DPIIT Verified Registry
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by startup name, solution title, DPIIT number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            options={[
              { value: 'ALL', label: 'All Innovation Sectors' },
              { value: 'Civic-Tech', label: 'Civic-Tech & Logistics' },
              { value: 'Transportation', label: 'Transportation & Edge AI' },
              { value: 'Clean Water', label: 'Clean Water & Utilities' },
            ]}
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          />
        </div>
      </div>

      {/* Startup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <Card key={startup.id} className="flex flex-col justify-between hover:border-blue-300 transition-all">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {startup.dpiitNumber}
                </Badge>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                  TRL {startup.trlLevel}/9
                </span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                {startup.brandName}
              </CardTitle>
              <CardDescription className="text-xs">
                {startup.legalName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Proprietary Innovation
                </span>
                <h5 className="text-xs font-semibold text-slate-800 mb-1">
                  {startup.solutionTitle}
                </h5>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {startup.solutionSummary}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{startup.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sector: <strong>{startup.focusSector}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {startup.certifications.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </CardContent>

            <div className="p-5 pt-0 mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DPIIT Empaneled
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStartup(startup)}
              >
                View Dossier
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Startup Dossier Modal */}
      {selectedStartup && (
        <Modal
          isOpen={!!selectedStartup}
          onClose={() => setSelectedStartup(null)}
          title={selectedStartup.brandName}
          description={`DPIIT Registration: ${selectedStartup.dpiitNumber} | Inc. ${selectedStartup.incorporationYear}`}
          maxWidth="lg"
          footer={
            <Button variant="navy" size="sm" onClick={() => setSelectedStartup(null)}>
              Close Dossier
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Solution Description</h4>
              <p className="text-slate-700 font-medium">{selectedStartup.solutionTitle}</p>
              <p className="text-slate-600 mt-1 leading-relaxed">{selectedStartup.solutionSummary}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Founding Team</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedStartup.founderName}</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Readiness Level</p>
                <p className="font-semibold text-blue-700 mt-0.5">TRL {selectedStartup.trlLevel} (Validated in Field)</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">Compliance & Certifications</p>
              <div className="flex flex-wrap gap-2">
                {selectedStartup.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="success" size="md">
                    <CheckCircle2 className="w-3 h-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 text-xs">
              <p className="font-semibold">Procurement Sandbox Eligibility</p>
              <p className="mt-0.5 text-blue-700">
                Meets General Financial Rules (GFR) 2017 criteria for micro & small startup sandbox pilots without prior turnover requirement.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
