'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { PastEventArchive } from '@/types/events';
import { History, ArrowUpRight, Users, MapPin, ChevronDown } from 'lucide-react';

interface ArchiveEventListProps {
  pastEvents: PastEventArchive[];
}

export const ArchiveEventList: React.FC<ArchiveEventListProps> = ({ pastEvents }) => {
  const [hoveredEvent, setHoveredEvent] = useState<PastEventArchive | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Mouse spring coordinates for cursor-following floating image
  const mouseX = useSpring(0, { stiffness: 220, damping: 22 });
  const mouseY = useSpring(0, { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 120);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative space-y-8 pt-10 border-t border-slate-200/80"
    >
      {/* ── Section Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>CAMPUS ARCHIVE</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 uppercase font-sans">
            WHAT WE&apos;VE <span className="text-slate-400">ALREADY BUILT</span>
          </h3>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0F4C2A] hover:text-[#3FA85B] transition-colors group"
        >
          <span>View All Historical Sprints</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Floating Cursor Image Preview (Desktop Only) ──────────────── */}
      <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {hoveredEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ x: mouseX, y: mouseY }}
              className="absolute w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/40 bg-slate-900"
            >
              <Image
                src={hoveredEvent.coverImage}
                alt={hoveredEvent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono uppercase text-[#3FA85B] font-bold">
                  {hoveredEvent.category} · {hoveredEvent.year}
                </span>
                <p className="text-xs font-mono font-bold truncate">
                  {hoveredEvent.title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Archive Rows List ─────────────────────────────────────────── */}
      <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
        {pastEvents.map((item) => {
          const isExpanded = expandedEventId === item.id;
          const isHovered = hoveredEvent?.id === item.id;

          return (
            <div
              key={item.id}
              tabIndex={0}
              onFocus={() => setHoveredEvent(item)}
              onBlur={() => setHoveredEvent(null)}
              onMouseEnter={() => setHoveredEvent(item)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => handleToggleExpand(item.id)}
              className={`py-5 sm:py-6 px-3 sm:px-4 cursor-pointer transition-all duration-200 outline-none focus-visible:bg-slate-100/80 ${
                isHovered || isExpanded ? 'bg-slate-50/90' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Year + Title */}
                <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 shrink-0">
                    {item.year}
                  </span>
                  <h4 className="text-base sm:text-xl font-bold text-slate-800 truncate group-hover:text-slate-900">
                    {item.title}
                  </h4>
                </div>

                {/* Right: Tag, Attendee Count, Expand Indicator */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.attendeeCount}</span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 lg:hidden ${
                      isExpanded ? 'rotate-180 text-slate-700' : ''
                    }`}
                  />
                </div>
              </div>

              {/* ── Desktop Hover / Focus Recap ───────────────────────── */}
              <AnimatePresence>
                {(isHovered || isExpanded) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-600">
                      <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-3xl">
                        {item.recap}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 shrink-0">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Mobile Inline Image on tap */}
                    <div className="lg:hidden mt-3 relative w-full h-44 rounded-xl overflow-hidden shadow-inner">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
