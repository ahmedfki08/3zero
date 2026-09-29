import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { RegistrationsTableClient } from '@/components/admin/submissions/RegistrationsTableClient';
import { Ticket } from 'lucide-react';

export default async function AdminRegistrationsPage() {
  const supabase = await createClient();

  const [{ data: registrations }, { data: events }] = await Promise.all([
    supabase
      .from('event_registrations')
      .select('*, events(id, title, category, slug)')
      .order('submitted_at', { ascending: false }),
    supabase
      .from('events')
      .select('id, title')
      .order('title', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold mb-2">
          <Ticket className="w-3.5 h-3.5 text-[#3FA85B]" />
          <span>PASS ADMISSIONS LOG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
          EVENT PASS REGISTRATIONS
        </h1>
        <p className="text-xs sm:text-sm font-sans text-slate-500 mt-1">
          Review attendee reservations, inspect custom form questions, and export participant rosters.
        </p>
      </div>

      <RegistrationsTableClient
        initialRegistrations={registrations || []}
        eventsList={events || []}
      />
    </div>
  );
}
