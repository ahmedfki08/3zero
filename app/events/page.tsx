import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar/Navbar';
import { Footer } from '@/components/layout/footer/Footer';
import { EventsPageClient } from '@/components/events/EventsPageClient';
import { fetchEvents, fetchPastEventsArchive } from '@/lib/data/events';
import { FEATURED_EVENT, UPCOMING_EVENTS, PAST_EVENTS_ARCHIVE } from '@/content/events';

export const metadata: Metadata = {
  title: 'Sprints & Sessions Calendar | 3-Zero ISIMS',
  description:
    'Explore upcoming engineering hackathons, circular IoT sprints, Tunisian Sign Language AI workshops, and past historical archives at the Higher Institute of Computer Science and Multimedia of Sfax (ISIMS).',
  openGraph: {
    title: '3-Zero Sprints & Sessions Calendar · ISIMS Sfax',
    description:
      'Claim admission passes to 48-hour student hackathons, open hardware sprints, and social venture pitch nights.',
    type: 'website',
  },
};

export default async function EventsPage() {
  const { featured, upcoming } = await fetchEvents();
  const archiveResult = await fetchPastEventsArchive({ limit: 100 });

  return (
    <div className="relative min-h-screen bg-[#FAFCFA] text-[#0F172A] flex flex-col selection:bg-[#3FA85B] selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#3FA85B] border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  Loading 3-Zero Calendar...
                </span>
              </div>
            </div>
          }
        >
          <EventsPageClient
            initialFeatured={featured || FEATURED_EVENT}
            initialUpcoming={upcoming || UPCOMING_EVENTS}
            initialPastEvents={archiveResult.items || PAST_EVENTS_ARCHIVE}
          />
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
