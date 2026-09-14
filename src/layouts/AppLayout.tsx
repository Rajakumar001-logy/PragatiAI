import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UserRole } from '@/types';
import { mockService } from '@/services/mockService';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('government');

  const handleRoleChange = (role: UserRole) => {
    mockService.switchRole(role);
    setCurrentRole(role);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ currentRole }} />
        </main>

        {/* Enterprise Government Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026 <strong>Pragati AI</strong> — Smart India Hackathon Prototype | National Innovation Procurement Framework
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>GFR 2017 Compliant</span>
              <span>•</span>
              <span>DPIIT Startup India</span>
              <span>•</span>
              <span>GeM Integration Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
