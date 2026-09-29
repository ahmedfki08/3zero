'use client';

import React from 'react';
import { UpcomingEvent } from '@/types/events';
import { EventTicket } from './EventTicket';
import { Ticket } from 'lucide-react';

interface TicketWallProps {
  events: UpcomingEvent[];
  onSelectEvent: (event: UpcomingEvent) => void;
}

export const TicketWall: React.FC<TicketWallProps> = ({ events, onSelectEvent }) => {
  if (events.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold border border-[#3FA85B]/20">
          <Ticket className="w-3.5 h-3.5 text-[#3FA85B]" />
          <span>TICKET WALL · UPCOMING PASSES</span>
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
          Click Scan to verify admission
        </span>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, idx) => (
          <EventTicket
            key={event.id}
            event={event}
            ticketIndex={idx}
            onSelect={onSelectEvent}
          />
        ))}
      </div>

      {/* Mobile Horizontal Snap Carousel */}
      <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none">
        {events.map((event, idx) => (
          <div key={event.id} className="snap-center shrink-0 w-[90vw] max-w-[380px]">
            <EventTicket
              event={event}
              ticketIndex={idx}
              onSelect={onSelectEvent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
