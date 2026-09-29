'use client';

import React, { useState, useEffect } from 'react';
import { FEATURED_EVENT, UPCOMING_EVENTS, PAST_EVENTS_ARCHIVE } from '@/content/events';
import { UpcomingEvent } from '@/types/events';
import { fetchEvents } from '@/lib/data/events';
import { FeaturedEventCard } from './events/FeaturedEventCard';
import { TicketWall } from './events/TicketWall';
import { ArchiveEventList } from './events/ArchiveEventList';
import { EventRegistrationModal } from './events/EventRegistrationModal';
import { SoundToggle } from './events/SoundToggle';
import { Calendar } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const [featuredEvent, setFeaturedEvent] = useState<UpcomingEvent>(FEATURED_EVENT);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(UPCOMING_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchEvents().then(({ featured, upcoming }) => {
      if (isMounted) {
        setFeaturedEvent(featured);
        setUpcomingEvents(upcoming);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenRegistration = (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="events"
      className="relative py-24 sm:py-32 bg-[#FAFCFA] border-t border-slate-200/80 overflow-hidden"
    >
      {/* Background Ambient Decorator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(15,76,42,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-24">
        {/* ── Section Story Header ───────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>ISIMS CALENDAR &amp; ROADMAP</span>
              </div>
              <SoundToggle />
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase font-sans">
              SPRINTS &amp; <span className="text-[#3FA85B]">SESSIONS</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base font-sans text-slate-600 max-w-md leading-relaxed">
            From 48-hour hackathons to hands-on lab sessions. See what&apos;s coming, join what interests you, and look back at what we&apos;ve already done.
          </p>
        </div>

        {/* ── PART A: Featured Next Event (Countdown to 000) ─────────── */}
        <FeaturedEventCard
          event={featuredEvent}
          onRegister={handleOpenRegistration}
        />

        {/* ── PART B: Ticket Wall (Remaining Upcoming Events) ────────── */}
        <TicketWall
          events={upcomingEvents}
          onSelectEvent={handleOpenRegistration}
        />

        {/* ── PART C: Archive List (Past Historical Sprints) ─────────── */}
        <ArchiveEventList pastEvents={PAST_EVENTS_ARCHIVE} />
      </div>

      {/* ── Dedicated Event Registration Modal ──────────────────────── */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};
