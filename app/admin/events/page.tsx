import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, Calendar, Sparkles } from 'lucide-react';
import { EventsTableClient } from '@/components/admin/events/EventsTableClient';

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events_with_status')
    .select('*')
    .order('starts_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>SPRINT CATALOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            EVENTS &amp; SESSIONS MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-500 mt-1">
            Create, edit, toggle visibility, and configure registration forms.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F4C2A] hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Interactive Table Client */}
      <EventsTableClient initialEvents={events || []} />
    </div>
  );
}
