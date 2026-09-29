import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { EventDetailsForm } from '@/components/admin/events/EventDetailsForm';

export default function NewEventPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Events List</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
          CREATE NEW SPRINT / EVENT
        </h1>
        <p className="text-xs sm:text-sm font-sans text-slate-500 mt-0.5">
          Fill in the sprint logistics below. Once created, you can attach photo galleries and custom registration questions.
        </p>
      </div>

      <EventDetailsForm isNew={true} />
    </div>
  );
}
