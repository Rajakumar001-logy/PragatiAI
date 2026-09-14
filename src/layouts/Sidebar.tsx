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
} from 'lucide-react';

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

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/government', icon: LayoutDashboard },
  { label: 'Challenges', to: '/challenges', icon: Award },
  { label: 'Startups', to: '/startup', icon: Building2 },
  { label: 'Applications', to: '/applications', icon: FileCheck2 },
  { label: 'Evaluations', to: '/evaluations', icon: ClipboardList },
  { label: 'Pilots', to: '/pilots', icon: FlaskConical },
  { label: 'KPIs', to: '/kpis', icon: LineChart },
  { label: 'Payments', to: '/payments', icon: CreditCard },
  { label: 'Validation', to: '/validation', icon: ShieldCheck },
  { label: 'Scale-up', to: '/scale-up', icon: TrendingUp, badge: 'GeM' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-900/80">
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
        <div className="px-6 py-2 bg-navy-900/40 border-b border-navy-900/50">
          <p className="text-[11px] text-slate-400 italic">
            From Government Problems to Scalable Innovation
          </p>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Procurement Lifecycle
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
            System
          </div>
          <NavLink
            to="/settings"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600/90 text-white'
                  : 'text-slate-300 hover:bg-navy-900 hover:text-white'
              )}
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </NavLink>

          <a
            href="#help"
            onClick={(e) => {
              e.preventDefault();
              alert('Pragati AI Helpdesk: 1800-XXX-SIH26 | Reference: GFR 2017 Rule 149(viii) Innovation Procurement Guidelines');
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-navy-900 hover:text-white transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Help & GFR Guide</span>
          </a>

          {/* Compliance & Trust Badge */}
          <div className="mt-3 rounded-lg bg-navy-900/90 p-2.5 border border-navy-800 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-200">Legal Sandbox Protocol</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Compliant with GFR 2017 & DPIIT Framework</p>
          </div>
        </div>
      </aside>
    </>
  );
};
