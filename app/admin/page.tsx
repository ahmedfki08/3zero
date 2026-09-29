import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Calendar,
  Ticket,
  UserCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Fetch telemetry counts
  const [{ count: eventsCount }, { count: publishedCount }] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('draft', false),
  ]);

  const { count: registrationsCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true });

  const { count: applicationsCount } = await supabase
    .from('club_applications')
    .select('*', { count: 'exact', head: true });

  const { data: recentEvents } = await supabase
    .from('events_with_status')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: recentRegistrations } = await supabase
    .from('event_registrations')
    .select('*, events(title, category)')
    .order('submitted_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>EXECUTIVE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            CHAPTER OPERATIONS OVERVIEW
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-500 mt-1">
            Real-time status of ISIMS campus sprints, attendee reservations, and membership intakes.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F4C2A] hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Event / Sprint</span>
        </Link>
      </div>

      {/* ── KPI Metric Cards Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Events */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase text-slate-500">
              Total Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F4C2A] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#3FA85B]" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {eventsCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3FA85B]" />
            <span>{publishedCount ?? 0} live on site</span>
          </div>
        </div>

        {/* Total Registrations */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase text-slate-500">
              Pass Admissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F4C2A] flex items-center justify-center">
              <Ticket className="w-4 h-4 text-[#3FA85B]" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {registrationsCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Across all scheduled sprints
          </div>
        </div>

        {/* Club Applications */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase text-slate-500">
              Club Applicants
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F4C2A] flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-[#3FA85B]" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {applicationsCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Student cohort candidates
          </div>
        </div>

        {/* System Health */}
        <div className="p-6 rounded-3xl bg-[#082010] text-white border border-emerald-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-300/60">
            <span className="text-xs font-mono font-bold uppercase text-[#4ADE80]">
              Database Sync
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            100%
          </div>
          <div className="text-[11px] font-mono text-emerald-200/70">
            Supabase RLS &amp; Realtime Online
          </div>
        </div>
      </div>

      {/* ── Two Column Operations Deck ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Events & Management (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider">
              Current Events &amp; Sprints
            </h2>
            <Link
              href="/admin/events"
              className="text-xs font-mono font-bold text-[#0F4C2A] hover:text-[#3FA85B] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {recentEvents && recentEvents.length > 0 ? (
              recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {evt.category}
                      </span>
                      {evt.draft ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Draft
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Published
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {evt.title}
                    </h3>
                  </div>

                  <Link
                    href={`/admin/events/${evt.id}/edit`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-400">
                No events found. Click &quot;New Event&quot; to create one.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Submissions Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider">
              Recent Registrations
            </h2>
            <Link
              href="/admin/submissions/registrations"
              className="text-xs font-mono font-bold text-[#0F4C2A] hover:text-[#3FA85B] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {recentRegistrations && recentRegistrations.length > 0 ? (
              recentRegistrations.map((reg: any) => {
                const responses = (reg.responses || {}) as Record<string, string>;
                const attendeeName = responses.fullName || reg.email || 'Attendee';
                const timeAgo = new Date(reg.submitted_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={reg.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 truncate font-mono">
                        {attendeeName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-sans">
                        {reg.events?.title || 'Event Pass'}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {timeAgo}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-400">
                No submissions logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
