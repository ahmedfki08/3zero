'use client';

import React from 'react';
import Link from 'next/link';
import { UpcomingEvent } from '@/types/events';
import { FeaturedEventCard } from '@/components/sections/events/FeaturedEventCard';
import { SoundToggle } from '@/components/sections/events/SoundToggle';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface EventsHeroProps {
  featuredEvent: UpcomingEvent;
  onRegister: (event: UpcomingEvent) => void;
}

export const EventsHero: React.FC<EventsHeroProps> = ({
  featuredEvent,
  onRegister,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ── Breadcrumbs & Subtitle ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/" className="hover:text-[#0F4C2A] transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#0F4C2A] font-bold">SPRINTS &amp; SESSIONS</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>LIVE ACADEMIC YEAR 2026</span>
            </div>
            <SoundToggle />
          </div>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase font-sans leading-[1.05]">
            ENGINEERING <span className="text-[#3FA85B]">ZERO EXCLUSION,</span> ZERO CARBON &amp; ZERO POVERTY
          </h1>

          <p className="text-base sm:text-lg font-sans text-slate-600 max-w-2xl leading-relaxed">
            Join 48-hour hardware sprints, open-source AI computer vision labs, and sustainable enterprise venture pitch sessions at ISIMS Sfax.
          </p>
        </div>
      </div>

      {/* ── Featured Next Event Card ───────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#3FA85B]" />
          <span>NEXT FLAGSHIP SPRINT (COUNTDOWN TO 000)</span>
        </div>

        <FeaturedEventCard
          event={featuredEvent}
          onRegister={onRegister}
        />
      </div>
    </div>
  );
};
