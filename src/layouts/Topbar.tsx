import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  UserCheck,
  CheckCircle2,
  Shield,
  Building,
  Briefcase,
  GraduationCap,
  ChevronDown,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Award,
  FlaskConical,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { NotificationItem, UserRole, Challenge, Startup, Application, Pilot } from '@/types';
import { mockService } from '@/services/mockService';
import { useAuth } from '@/auth/AuthProvider';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  currentRole: UserRole;
  userName: string;
}

const routeTitles: Record<string, { title: string; category: string }> = {
  '/government': { title: 'Government Command Center', category: 'Executive Dashboard' },
  '/startup': { title: 'Startup Innovation Portal', category: 'DPIIT Solutions Hub' },
  '/expert': { title: 'Expert Evaluation Workspace', category: 'Committee Review' },
  '/admin': { title: 'System Administration & Governance', category: 'Platform Overview' },
  '/discover-startups': { title: 'AI Startup Matching & Discovery', category: 'Intelligence Hub' },
  '/challenges': { title: 'Outcome-Based Innovation Challenges', category: 'Problem Repository' },
  '/applications': { title: 'Startup Proposals & Screening', category: 'Procurement Funnel' },
  '/evaluations': { title: 'Evaluation Committee & Rubrics', category: 'Double-Blind Review' },
  '/pilots': { title: 'Sandbox & Field Trial Monitoring', category: 'Live Deployment' },
  '/kpis': { title: 'KPI Evidence & Quantitative Telemetry', category: 'Performance Verification' },
  '/payments': { title: 'Milestone Payments Disbursal', category: 'PFMS Governance' },
  '/validation': { title: 'Independent Validation Reports', category: 'CSIR / IIT Certification' },
  '/scale-up': { title: 'Procurement Scale-up & GeM Transition', category: 'Public Procurement' },
  '/settings': { title: 'Platform Settings & Audit Logs', category: 'Governance & Administration' },
  '/login': { title: 'Portal Login', category: 'Authentication' },
};

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  currentRole,
  userName,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, switchRole, signOut, user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    challenges: Challenge[];
    startups: Startup[];
    applications: Application[];
    pilots: Pilot[];
  }>({ challenges: [], startups: [], applications: [], pilots: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const refreshData = () => {
    mockService.getNotifications().then(setNotifications);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = mockService.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      mockService.globalSearch(searchQuery).then((res) => {
        setSearchResults(res);
        setShowSearchResults(true);
      });
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Click outside listener for search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRouteMeta = routeTitles[location.pathname] || {
    title: 'Innovation Procurement Platform',
    category: 'Pragati AI',
  };

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: 'navy' | 'primary' | 'warning' | 'default' }> = {
    government: { label: 'Government Officer (IAS)', icon: <Shield className="w-3.5 h-3.5" />, color: 'navy' },
    startup: { label: 'Startup Innovator', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'primary' },
    expert: { label: 'Technical Evaluator (IIT)', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'warning' },
    admin: { label: 'Platform Administrator', icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'default' },
  };

  const unreadCount = notifications.filter((n) => !n.read && (n.targetRole === 'all' || n.targetRole === role)).length;

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
      <div className="hidden md:flex items-center max-w-md w-full mx-6 relative" ref={searchContainerRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges, startups, proposals, pilots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 1 && setShowSearchResults(true)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-11 left-0 right-0 rounded-xl border border-slate-200 bg-white shadow-2xl p-3 z-50 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="space-y-3 text-xs">
              {searchResults.challenges.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    Challenges ({searchResults.challenges.length})
                  </p>
                  {searchResults.challenges.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        navigate('/challenges');
                        setShowSearchResults(false);
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-900">{c.title}</span>
                      </div>
                      <Badge variant="primary" size="sm">{c.code}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.startups.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    Startups ({searchResults.startups.length})
                  </p>
                  {searchResults.startups.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        navigate('/discover-startups');
                        setShowSearchResults(false);
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-slate-900">{s.brandName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{s.focusSector}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.pilots.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    Pilots / Sandboxes ({searchResults.pilots.length})
                  </p>
                  {searchResults.pilots.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate('/pilots');
                        setShowSearchResults(false);
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-semibold text-slate-900">{p.startupName}</span>
                      </div>
                      <Badge variant="success" size="sm">{p.status}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.challenges.length === 0 && searchResults.startups.length === 0 && searchResults.pilots.length === 0 && (
                <p className="text-center py-4 text-slate-400">No matching records found for "{searchQuery}".</p>
              )}
            </div>
          </div>
        )}
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
            {unreadCount > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications & Alerts</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      mockService.markNotificationRead(notif.id);
                      if (notif.linkTo) navigate(notif.linkTo);
                      setShowNotifs(false);
                    }}
                    className={cn(
                      'p-3 hover:bg-slate-50 transition-colors cursor-pointer',
                      !notif.read && 'bg-blue-50/40'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{notif.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <span
                  onClick={() => {
                    navigate('/settings');
                    setShowNotifs(false);
                  }}
                  className="text-[11px] text-blue-700 font-medium hover:underline cursor-pointer"
                >
                  View System Audit Logs
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 text-white font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{userName}</span>
                <UserCheck className="w-3 h-3 text-blue-600" />
              </div>
              <Badge variant={roleMeta[currentRole].color} size="sm">
                {roleMeta[currentRole].icon}
                {roleMeta[currentRole].label}
              </Badge>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{userName}</p>
                <p className="text-[10px] text-slate-500">{user?.departmentOrCompany}</p>
              </div>

              <div className="px-3 py-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Switch Persona (SIH Demo)</p>
              </div>

              {(['government', 'startup', 'expert', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowUserMenu(false);
                    if (r === 'government') navigate('/government');
                    else if (r === 'startup') navigate('/startup');
                    else if (r === 'expert') navigate('/expert');
                    else if (r === 'admin') navigate('/admin');
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left',
                    role === r ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {roleMeta[r].icon}
                    <span>{roleMeta[r].label}</span>
                  </div>
                  {role === r && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </button>
              ))}

              <div className="pt-2 mt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    signOut();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
