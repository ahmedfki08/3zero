'use client';

import React from 'react';
import { UpcomingEvent } from '@/types/events';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface TicketBackProps {
  event: UpcomingEvent;
  onFlipBack: () => void;
  onRegister: () => void;
  style?: React.CSSProperties;
}

export const TicketBack: React.FC<TicketBackProps> = ({
  event,
  onFlipBack,
  onRegister,
  style,
}) => {
  const isFull = event.ticketStatus === 'closed' || event.seatsRemaining === 0;

  return (
    <div
      style={style}
      className="relative w-full h-full bg-[#092314] text-white flex flex-col md:flex-row overflow-hidden border border-[#3FA85B]/30 rounded-2xl shadow-xl select-none"
    >
      {/* ── Main Back Content Body (Emerald Dark Theme) ─────────────── */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0 bg-gradient-to-t from-[#05180D] via-[#0A2917] to-[#04140B]">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#4ADE80] font-bold uppercase tracking-wider truncate">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#3FA85B]" />
              <span className="truncate">PASS VERIFIED · ISIMS NODE</span>
            </div>

            <button
              onClick={onFlipBack}
              aria-label="Flip back to front face"
              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-100 hover:text-white bg-[#0F3820] hover:bg-[#165330] px-2 py-0.5 rounded-lg border border-emerald-600/30 transition-colors shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
            {event.title}
          </h4>

          {/* Clamped Description with Subtle Scroll */}
          <div className="mt-1.5 text-xs font-sans text-emerald-100/90 leading-relaxed max-h-[64px] overflow-y-auto pr-1 scrollbar-thin">
            {event.description}
          </div>
        </div>

        {/* Date & Location */}
        <div className="pt-2.5 border-t border-emerald-500/25 flex items-center justify-between gap-2 text-[11px] font-mono text-emerald-200">
          <div className="flex items-center gap-1.5 text-emerald-100 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
            <span className="truncate">{event.displayDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-100 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
            <span className="truncate max-w-[120px]">{event.location.venue}</span>
          </div>
        </div>
      </div>

      {/* ── Perforation Separator ───────────────────────────────────── */}
      <div className="relative flex md:flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-emerald-600/40 py-1 md:py-0 px-2 md:px-0 bg-[#071c10]">
        <div className="hidden md:block absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAFCFA] border border-slate-200/80 -z-0" />
        <div className="hidden md:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAFCFA] border border-slate-200/80 -z-0" />
      </div>

      {/* ── Verified Stub / Join Action ──────────────────────────────── */}
      <div className="w-full md:w-36 lg:w-40 p-3 sm:p-4 flex flex-col items-center justify-between gap-2.5 bg-[#05180D] text-center shrink-0">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#4ADE80] block">
            ADMIT ONE
          </span>
          <span className="text-[11px] font-mono text-emerald-200/70 block">
            {event.seatsRemaining} spots left
          </span>
        </div>

        <button
          onClick={onRegister}
          disabled={isFull}
          className={`w-full py-2.5 px-2 rounded-xl font-mono text-[11px] font-bold uppercase transition-all duration-200 flex items-center justify-center gap-1 shadow-md ${
            isFull
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[#3FA85B] text-slate-950 hover:bg-[#4ADE80] hover:shadow-[0_0_12px_rgba(74,222,128,0.4)] font-black'
          }`}
        >
          <span className="truncate">{isFull ? 'Sold Out' : event.ticketStatus === 'waitlist' ? 'Waitlist' : 'Claim Seat'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
