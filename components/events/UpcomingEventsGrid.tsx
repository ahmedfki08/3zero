'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UpcomingEvent } from '@/types/events';
import { EventTicket } from '@/components/sections/events/EventTicket';
import { Ticket, SearchX, CalendarOff, RotateCcw } from 'lucide-react';

interface UpcomingEventsGridProps {
  events: UpcomingEvent[];
  onSelectEvent: (event: UpcomingEvent) => void;
  onResetFilters?: () => void;
}

export const UpcomingEventsGrid: React.FC<UpcomingEventsGridProps> = ({
  events,
  onSelectEvent,
  onResetFilters,
}) => {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 sm:py-24 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 px-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <CalendarOff className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 font-sans">
            No Upcoming Sessions Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-sm mx-auto">
            No active sprints match your current filter selection. Try adjusting your search query or format filter.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F4C2A] text-white hover:bg-[#3FA85B] text-xs font-mono font-bold uppercase transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid of Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
            >
              <EventTicket
                event={event}
                ticketIndex={idx}
                onSelect={onSelectEvent}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
