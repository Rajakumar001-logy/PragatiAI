import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Award,
  Building2,
  FileCheck2,
  ClipboardList,
  FlaskConical,
  LineChart,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
  Sparkles,
  Users,
  Compass,
  FileSearch,
  Shield,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Home,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { UserRole } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  // Role-specific navigation menus matching exact specifications
  const getNavItems = (currentRole: UserRole): NavItem[] => {
    switch (currentRole) {
      case 'government':
        return [
          { label: 'Dashboard', to: '/government', icon: LayoutDashboard },
          { label: 'My Challenges', to: '/challenges', icon: Award },
          { label: 'Discover Startups', to: '/discover-startups', icon: Compass, badge: 'AI Match' },
          { label: 'Applications', to: '/applications', icon: FileCheck2 },
          { label: 'Evaluations', to: '/evaluations', icon: ClipboardList },
          { label: 'Pilots / Sandboxes', to: '/pilots', icon: FlaskConical },
          { label: 'KPI Evidence', to: '/kpis', icon: LineChart },
          { label: 'Validation Reports', to: '/validation', icon: ShieldCheck },
          { label: 'Milestone Payments', to: '/payments', icon: CreditCard },
          { label: 'Procurement & Scale-up', to: '/scale-up', icon: TrendingUp, badge: 'GeM' },
        ];

      case 'startup':
        return [
          { label: 'Startup Dashboard', to: '/startup', icon: LayoutDashboard },
          { label: 'Discover Challenges', to: '/challenges', icon: Award, badge: 'Open' },
          { label: 'My Applications', to: '/applications', icon: FileCheck2 },
          { label: 'Active Pilots', to: '/pilots', icon: FlaskConical },
          { label: 'KPI Telemetry', to: '/kpis', icon: LineChart },
          { label: 'Payment Tranches', to: '/payments', icon: CreditCard },
        ];

      case 'expert':
        return [
          { label: 'Expert Dashboard', to: '/expert', icon: LayoutDashboard },
          { label: 'Assigned Applications', to: '/applications', icon: FileSearch },
          { label: 'Evaluation Workspace', to: '/evaluations', icon: ClipboardList, badge: 'Rubric' },
          { label: 'Pilot Reviews', to: '/pilots', icon: FlaskConical },
          { label: 'Independent Validation', to: '/validation', icon: ShieldCheck },
        ];

      case 'admin':
      default:
        return [
          { label: 'Admin Command Center', to: '/admin', icon: LayoutDashboard },
          { label: 'All Challenges', to: '/challenges', icon: Award },
          { label: 'AI Startup Matching', to: '/discover-startups', icon: Compass },
          { label: 'Applications & Screening', to: '/applications', icon: FileCheck2 },
          { label: 'Committee Evaluations', to: '/evaluations', icon: ClipboardList },
          { label: 'Active Pilots', to: '/pilots', icon: FlaskConical },
          { label: 'KPI Measurements', to: '/kpis', icon: LineChart },
          { label: 'Validation Clearance', to: '/validation', icon: ShieldCheck },
          { label: 'PFMS Payments', to: '/payments', icon: CreditCard },
          { label: 'GeM Scale-Up Gateway', to: '/scale-up', icon: TrendingUp, badge: 'GFR 149' },
        ];
    }
  };

  const navItems = getNavItems(role);

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    government: { label: 'Government', icon: <Shield className="w-3 h-3" />, color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
    startup: { label: 'Startup', icon: <Briefcase className="w-3 h-3" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
    expert: { label: 'Expert / IIT', icon: <GraduationCap className="w-3 h-3" />, color: 'bg-amber-500/20 text-amber-300 border-amber-400/30' },
    admin: { label: 'Admin', icon: <ShieldAlert className="w-3 h-3" />, color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-navy-950 text-white border-r border-navy-900 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-navy-700 text-white shadow-md shadow-blue-950/40 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">Pragati AI</span>
                <span className="rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SIH
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight">
                Innovation Procurement Platform
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-900 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tagline micro banner */}
        <div className="px-6 py-2 bg-navy-900/40 border-b border-navy-900/50 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 italic">
            From Problems to Scalable Innovation
          </p>
          <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-semibold border flex items-center gap-1', roleMeta[role].color)}>
            {roleMeta[role].icon}
            {roleMeta[role].label}
          </span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {role.toUpperCase()} NAVIGATION
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-sm ring-1 ring-blue-400/30'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-400/20">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-navy-900/80 p-4 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            System & Quick Roles
          </div>

          <NavLink
            to="/"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-navy-900 hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span>Public Home Portal</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-blue-600/90 text-white'
                  : 'text-slate-300 hover:bg-navy-900 hover:text-white'
              )}
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Settings & Profile</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
