'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UpcomingEvent, PastEventArchive } from '@/types/events';
import { EventsHero } from './EventsHero';
import { EventsFilterBar } from './EventsFilterBar';
import { UpcomingEventsGrid } from './UpcomingEventsGrid';
import { PastEventsArchiveSection } from './PastEventsArchiveSection';
import { EventRegistrationModal } from '@/components/sections/events/EventRegistrationModal';
import { Ticket } from 'lucide-react';

interface EventsPageClientProps {
  initialFeatured: UpcomingEvent;
  initialUpcoming: UpcomingEvent[];
  initialPastEvents: PastEventArchive[];
}

export const EventsPageClient: React.FC<EventsPageClientProps> = ({
  initialFeatured,
  initialUpcoming,
  initialPastEvents,
}) => {
  const searchParams = useSearchParams();

  const [featuredEvent, setFeaturedEvent] = useState<UpcomingEvent>(initialFeatured);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(initialUpcoming);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'seats' | 'title'>('date-asc');

  // Modal registration state
  const [selectedEventForModal, setSelectedEventForModal] = useState<UpcomingEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Handle deep-link query parameter (e.g., /events?event=sfax-3zero-hackathon)
  useEffect(() => {
    const eventParam = searchParams.get('event') || searchParams.get('register');
    if (eventParam) {
      const allEvents = [featuredEvent, ...upcomingEvents];
      const match = allEvents.find((e) => e.slug === eventParam || e.id === eventParam);
      if (match) {
        setSelectedEventForModal(match);
        setIsRegistrationModalOpen(true);
      }
    }
  }, [searchParams, featuredEvent, upcomingEvents]);

  const handleOpenRegistration = (event: UpcomingEvent) => {
    setSelectedEventForModal(event);
    setIsRegistrationModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationModalOpen(false);
  };

  // Filter & Sort upcoming events
  const filteredUpcoming = useMemo(() => {
    let list = [...upcomingEvents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.venue.toLowerCase().includes(q) ||
          e.speakersOrLeads.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(
        (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedPillar !== 'all') {
      list = list.filter((e) => e.pillarId === selectedPillar || e.pillarId === 'all');
    }

    if (sortBy === 'date-asc') {
      list.sort((a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime());
    } else if (sortBy === 'seats') {
      list.sort((a, b) => b.seatsRemaining - a.seatsRemaining);
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [upcomingEvents, searchQuery, selectedCategory, selectedPillar, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPillar('all');
    setSortBy('date-asc');
  };

  return (
    <div className="relative min-h-screen bg-[#FAFCFA] py-24 sm:py-32 overflow-hidden">
      {/* Background Subtle Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(15,76,42,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 sm:space-y-28">
        {/* ── 1. Hero & Featured Event ──────────────────────────────── */}
        <EventsHero
          featuredEvent={featuredEvent}
          onRegister={handleOpenRegistration}
        />

        {/* ── 2. Upcoming Passes & Sprints ───────────────────────────── */}
        <section id="upcoming" className="space-y-8 pt-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold border border-[#3FA85B]/20">
              <Ticket className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>UPCOMING CALENDAR &amp; ADMISSION PASSES</span>
            </div>

            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
              Flip passes to view requirements &amp; speakers
            </span>
          </div>

          <EventsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPillar={selectedPillar}
            onPillarChange={setSelectedPillar}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredUpcoming.length}
          />

          <UpcomingEventsGrid
            events={filteredUpcoming}
            onSelectEvent={handleOpenRegistration}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* ── 3. Past Events Archive ─────────────────────────────────── */}
        <PastEventsArchiveSection initialEvents={initialPastEvents} />
      </div>

      {/* ── 4. Pass Admission Registration Modal ───────────────────── */}
      <EventRegistrationModal
        event={selectedEventForModal}
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistration}
      />
    </div>
  );
};
