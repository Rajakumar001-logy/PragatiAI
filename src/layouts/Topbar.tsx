import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Shield,
  Building,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { mockUsers, mockNotifications } from '@/data/mockData';
import { UserRole } from '@/types';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const routeTitles: Record<string, { title: string; category: string }> = {
  '/government': { title: 'Government Command Center', category: 'Executive Dashboard' },
  '/startup': { title: 'Startup Innovation Discovery', category: 'DPIIT Solutions Directory' },
  '/expert': { title: 'Expert Evaluation Committee', category: 'Technical & Legal Vetting' },
  '/challenges': { title: 'Outcome-Based Innovation Challenges', category: 'Problem Statements' },
  '/applications': { title: 'Startup Applications & Screening', category: 'Proposals Management' },
  '/evaluations': { title: 'Scoring & Assessment Committee', category: 'Multi-Stage Review' },
  '/pilots': { title: 'Sandbox & Field Pilots', category: 'Live Deployment Monitoring' },
  '/kpis': { title: 'KPI Measurement & Evidence', category: 'Telemetry & Verification' },
  '/payments': { title: 'Milestone Payments Disbursal', category: 'Tranche Governance' },
  '/validation': { title: 'Independent Third-Party Validation', category: 'Audit & Certifications' },
  '/scale-up': { title: 'Procurement Scale-up & GeM Transition', category: 'Public Procurement' },
  '/settings': { title: 'Platform Settings & Audit Logs', category: 'Governance & Administration' },
  '/login': { title: 'Portal Login', category: 'Authentication' },
};

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  currentRole,
  onRoleChange,
}) => {
  const location = useLocation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRouteMeta = routeTitles[location.pathname] || {
    title: 'Innovation Procurement Platform',
    category: 'Pragati AI',
  };

  const currentUser = mockUsers.find((u) => u.role === currentRole) || mockUsers[0];

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: 'navy' | 'primary' | 'warning' | 'default' }> = {
    government: { label: 'Government Officer (IAS)', icon: <Shield className="w-3.5 h-3.5" />, color: 'navy' },
    startup: { label: 'Startup Innovator', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'primary' },
    expert: { label: 'Technical Evaluator (IIT)', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'warning' },
    admin: { label: 'Platform Administrator', icon: <Building className="w-3.5 h-3.5" />, color: 'default' },
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger + Page Title & Category */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              {currentRouteMeta.category}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {currentRouteMeta.title}
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges, startups, pilots, GeM codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications + Role Switcher / User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute 1.5 top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications & Alerts</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{notif.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-blue-700 font-medium hover:underline cursor-pointer">
                  View All Audit Logs & Alerts
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill (Prototype feature to simulate personas) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-left"
            title="Switch Prototype Actor Persona"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 text-white font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <UserCheck className="w-3 h-3 text-blue-600" />
              </div>
              <Badge variant={roleMeta[currentRole].color} size="sm">
                {roleMeta[currentRole].icon}
                {roleMeta[currentRole].label}
              </Badge>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Persona Switcher Dropdown */}
          {showRoleModal && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">Switch Prototype Persona</p>
                <p className="text-[11px] text-slate-500">
                  Experience Pragati AI from different stakeholder perspectives
                </p>
              </div>
              {(['government', 'startup', 'expert', 'admin'] as UserRole[]).map((r) => {
                const user = mockUsers.find((u) => u.role === r);
                const isCurrent = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleModal(false);
                    }}
                    className={`flex w-full items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                      isCurrent ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">{roleMeta[r].icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{roleMeta[r].label}</p>
                      <p className="text-[10px] text-slate-500">{user?.departmentOrCompany}</p>
                    </div>
                    {isCurrent && <span className="text-[10px] text-blue-700 font-bold">Active</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
