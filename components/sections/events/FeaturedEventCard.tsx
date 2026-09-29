'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { UpcomingEvent } from '@/types/events';
import { useCountdown } from '@/lib/events/useCountdown';
import { CountdownDisplay } from './CountdownDisplay';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface FeaturedEventCardProps {
  event: UpcomingEvent | null;
  onRegister: (event: UpcomingEvent) => void;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  event,
  onRegister,
}) => {
  const countdown = useCountdown(event?.startUtc || '', event?.endUtc);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer sheen
  const [sheenX, setSheenX] = useState('50%');
  const [sheenY, setSheenY] = useState('50%');
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSheenX(`${x}%`);
    setSheenY(`${y}%`);
  };

  if (!event) {
    return (
      <div className="w-full p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-[#3FA85B] mx-auto opacity-70" />
        <h3 className="text-xl font-bold text-slate-900">Next Event Coming Soon</h3>
        <p className="text-sm font-sans text-slate-500 max-w-md mx-auto">
          Our engineering cohorts are preparing the next hackathon sprint. Stay tuned or explore our past archives below.
        </p>
      </div>
    );
  }

  const isFull = event.ticketStatus === 'closed' || event.seatsRemaining === 0;

  // Relative days calculation
  const relativeDays = Math.max(
    1,
    Math.round((new Date(event.startUtc).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-[#3FA85B]/40 group"
    >
      {/* Holographic pointer sheen on desktop */}
      {isHovered && !shouldReduceMotion && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 320px at ${sheenX} ${sheenY}, rgba(74, 222, 128, 0.14), rgba(255, 255, 255, 0.12), transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-0 mix-blend-overlay z-30 transition-opacity duration-300"
        />
      )}

      {/* Background Mesh Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#3FA85B]/10 via-[#10B981]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-5 sm:p-8 lg:p-9 items-center">
        {/* Left Column: Cover Image & Duotone Overlay */}
        <div className="lg:col-span-5 relative w-full h-[240px] sm:h-[280px] lg:h-[340px] rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[#0F4C2A]/15 mix-blend-multiply" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-mono font-bold text-[#0F4C2A] uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#3FA85B]" />
              NEXT FLAGSHIP
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur text-[11px] font-mono font-bold text-white uppercase border border-white/20">
              {event.category}
            </span>
          </div>

          {/* Bottom Barcode & Seats Left Detail on Cover */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/70 block">
                FLAGSHIP PASS ID
              </span>
              <span className="text-xs font-mono font-bold text-[#4ADE80]">
                {event.barcodeNumber}
              </span>
            </div>

            <div className="text-xs font-mono text-white/90 flex items-center gap-1.5 bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg border border-white/10">
              <Users className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>{event.seatsRemaining} left / {event.seatsTotal}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Description & Live Countdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-3">
            {/* Date & Time Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-slate-500">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F7EE] text-[#0F4C2A] font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>{event.displayDate}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>{event.displayTime}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#0F4C2A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                in {relativeDays} days
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-sans leading-tight">
                {event.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#0F4C2A] font-semibold mt-1">
                {event.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-3">
              {event.description}
            </p>

            {/* Venue Details */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-[#3FA85B] shrink-0" />
              <span className="truncate">
                <strong className="text-slate-800">{event.location.venue}</strong>
                {event.location.room ? ` · ${event.location.room}` : ''} ({event.location.city})
              </span>
            </div>
          </div>

          {/* Countdown & Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                COUNTDOWN TO ZERO
              </span>
              <CountdownDisplay
                days={countdown.days}
                hours={countdown.hours}
                minutes={countdown.minutes}
                seconds={countdown.seconds}
                isMounted={countdown.isMounted}
                isHappeningNow={countdown.isHappeningNow}
              />
            </div>

            <button
              onClick={() => onRegister(event)}
              disabled={isFull}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md shrink-0 ${
                isFull
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-[#3FA85B] hover:shadow-[#3FA85B]/25 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <span>{isFull ? 'Sold Out' : 'Register Pass'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
