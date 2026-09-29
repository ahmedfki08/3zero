'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  UserCheck,
  Users,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  userEmail?: string;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  userEmail,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Executive Board',
      href: '/admin/staff',
      icon: Users,
      active: pathname.startsWith('/admin/staff'),
    },
    {
      label: 'Events & Sprints',
      href: '/admin/events',
      icon: CalendarDays,
      active: pathname.startsWith('/admin/events'),
    },
    {
      label: 'Pass Registrations',
      href: '/admin/submissions/registrations',
      icon: Ticket,
      active: pathname.startsWith('/admin/submissions/registrations'),
    },
    {
      label: 'Club Applications',
      href: '/admin/submissions/applications',
      icon: UserCheck,
      active: pathname.startsWith('/admin/submissions/applications'),
    },
  ];

  return (
    <aside className="w-64 bg-[#082010] border-r border-emerald-900/60 text-white flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 border border-white/10">
            <Image
              src="/club-badge-logo.png"
              alt="3-Zero ISIMS"
              width={120}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </div>
          <span className="text-[10px] font-mono text-[#4ADE80] font-bold uppercase tracking-widest block">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200/50 px-3 py-2">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
                item.active
                  ? 'bg-[#3FA85B] text-[#071A0E] shadow-sm font-black'
                  : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200/50 px-3 py-2">
          Live Platform
        </div>

        <Link
          href="/events"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-emerald-100/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-[#3FA85B]" />
            <span>Public Events</span>
          </div>
          <span className="text-[10px] text-emerald-300/40">↗</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-emerald-100/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-[#3FA85B]" />
            <span>Public Website</span>
          </div>
          <span className="text-[10px] text-emerald-300/40">↗</span>
        </Link>
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-emerald-900/60 bg-black/20">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3FA85B]/20 text-[#4ADE80] border border-[#3FA85B]/40 flex items-center justify-center font-mono text-xs font-bold shrink-0">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-emerald-300/60 block uppercase">
                Officer Account
              </span>
              <p className="text-xs font-mono text-white truncate max-w-[120px]">
                {userEmail || 'admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
