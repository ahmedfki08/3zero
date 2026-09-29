'use client';

import React from 'react';
import Image from 'next/image';
import { UpcomingEvent } from '@/types/events';
import { BarcodeScanner } from './BarcodeScanner';
import { Calendar, MapPin, Users, Ticket, Scan, Sparkles, Clock } from 'lucide-react';

interface TicketFrontProps {
  event: UpcomingEvent;
  ticketNumber: string;
  relativeTime: string;
  isScanning: boolean;
  isSuccess: boolean;
  onScan: () => void;
  style?: React.CSSProperties;
}

export const TicketFront: React.FC<TicketFrontProps> = ({
  event,
  ticketNumber,
  relativeTime,
  isScanning,
  isSuccess,
  onScan,
  style,
}) => {
  const stateBadge = {
    open: { label: 'Open', bg: 'bg-[#E8F7EE]', text: 'text-[#0F4C2A]' },
    'closing-soon': { label: 'Closing Soon', bg: 'bg-amber-100', text: 'text-amber-900' },
    waitlist: { label: 'Waitlist', bg: 'bg-indigo-100', text: 'text-indigo-900' },
    closed: { label: 'Closed', bg: 'bg-slate-200', text: 'text-slate-700' },
  }[event.ticketStatus];

  return (
    <div
      style={style}
      className="relative w-full h-full bg-[#092314] flex flex-col md:flex-row overflow-hidden border border-[#3FA85B]/30 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 select-none"
    >
      {/* ── Left Ticket Body ── */}
      {/*
          Architecture:
          - `relative` parent with `overflow-hidden` clips everything to the card edge.
          - `.bg-layer` is `absolute inset-0 isolate` — isolate keeps mix-blend modes
            contained WITHIN the background stack so they never bleed into content.
          - Content wrapper is a `relative z-10` flex sibling rendered after the
            background, so it always paints on top in normal stacking order.
      */}
      <div className="relative flex-1 min-w-0 overflow-hidden text-white">

        {/* Background stack — fully covers the parent, blend modes isolated here */}
        <div className="absolute inset-0 isolate">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover filter contrast-110 brightness-90"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Deep emerald gradient — fully opaque at bottom edge */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05180D] via-[#0A2917]/90 to-[#04140B]/80" />
          {/* Accent glow — blend modes stay inside this isolate context */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3FA85B]/25 via-transparent to-[#10B981]/20 mix-blend-screen" />
          <div className="absolute inset-0 bg-[#0F4C2A]/30 mix-blend-multiply" />
        </div>

        {/* Content — relative + z-10 renders above the background stack */}
        <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between gap-3">

          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-200 bg-black/50 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                {ticketNumber}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#0F4C2A] shrink-0 shadow-xs">
                <Ticket className="w-3 h-3 text-[#3FA85B]" />
                {event.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono text-emerald-200 font-semibold hidden sm:inline-block bg-black/40 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/20">
                {relativeTime}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-xs ${stateBadge.bg} ${stateBadge.text}`}>
                {stateBadge.label}
              </span>
            </div>
          </div>

          {/* Middle: Title & Tagline */}
          <div className="min-w-0 space-y-1">
            <h4 className="text-base sm:text-lg font-black text-white leading-snug line-clamp-2 drop-shadow-md">
              {event.title}
            </h4>
            <p className="text-[11px] font-mono text-emerald-100/85 line-clamp-1">
              {event.tagline}
            </p>
          </div>

          {/* Bottom: Date & Seats */}
          <div className="pt-2.5 border-t border-emerald-500/25 flex items-center justify-between gap-2 text-[11px] font-mono text-emerald-100">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Calendar className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
              <span className="font-semibold text-white truncate">{event.displayDate}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[#4ADE80] font-bold bg-black/40 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/30">
              <Users className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>{event.seatsRemaining} left</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Perforation Dashed Separator ─────────────────────────────── */}
      <div className="relative flex md:flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-emerald-600/40 py-1 md:py-0 px-2 md:px-0 bg-[#071c10]">
        <div className="hidden md:block absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAFCFA] border border-slate-200/80 -z-0" />
        <div className="hidden md:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAFCFA] border border-slate-200/80 -z-0" />
      </div>

      {/* ── Stub with Barcode & Scan Action ─────────────────────────── */}
      <div className="w-full md:w-36 lg:w-40 p-3 sm:p-4 flex flex-col items-center justify-between gap-2.5 bg-white shrink-0">
        <BarcodeScanner
          seed={event.id}
          isScanning={isScanning}
          isSuccess={isSuccess}
          barcodeNumber={event.barcodeNumber}
          className="w-full"
        />

        <button
          onClick={onScan}
          disabled={isScanning || isSuccess}
          aria-label={`Scan ticket to reveal details for ${event.title}`}
          className={`w-full py-2 px-2.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs ${isScanning
            ? 'bg-[#E8F7EE] text-[#0F4C2A] border border-[#3FA85B]/40 animate-pulse cursor-wait'
            : isSuccess
              ? 'bg-[#3FA85B] text-white shadow-[#3FA85B]/30'
              : 'bg-slate-900 text-white hover:bg-[#3FA85B] hover:shadow-md'
            }`}
        >
          {isScanning ? (
            <>
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Scanning</span>
            </>
          ) : isSuccess ? (
            <span>Verified</span>
          ) : (
            <>
              <Scan className="w-3 h-3 text-[#3FA85B]" />
              <span>Scan Pass</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
