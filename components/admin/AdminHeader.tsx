'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, ShieldCheck, ChevronRight } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminHeaderProps {
  userEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/events/new')) return 'Create Event';
    if (pathname.startsWith('/admin/events') && pathname.includes('/edit')) return 'Edit Event';
    if (pathname.startsWith('/admin/events')) return 'Events Management';
    if (pathname.startsWith('/admin/submissions/registrations')) return 'Pass Registrations';
    if (pathname.startsWith('/admin/submissions/applications')) return 'Club Applications';
    return 'Admin';
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">ADMIN</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#0F4C2A] font-bold uppercase">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right: Telemetry pill & account status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-[11px] font-mono font-bold border border-[#3FA85B]/20">
            <span className="w-2 h-2 rounded-full bg-[#3FA85B] animate-pulse" />
            <span>ISIMS Live Node</span>
          </div>

          <div className="text-xs font-mono text-slate-500 hidden md:block">
            {userEmail}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative z-10 w-64 h-full">
            <AdminSidebar
              userEmail={userEmail}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
