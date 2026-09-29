'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { PastEventArchive } from '@/types/events';
import { ArchiveDetailModal } from './ArchiveDetailModal';
import {
  History,
  Users,
  MapPin,
  Search,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Images,
} from 'lucide-react';

interface PastEventsArchiveSectionProps {
  initialEvents: PastEventArchive[];
}

const YEARS = ['all', '2026', '2025'];
const ARCHIVE_CATEGORIES = [
  'all',
  'Hackathon',
  'Workshop',
  'Symposium',
  'Fieldwork',
  'Ideation Jam',
];

const PAGE_SIZE = 4;

export const PastEventsArchiveSection: React.FC<PastEventsArchiveSectionProps> = ({
  initialEvents,
}) => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [hoveredEvent, setHoveredEvent] = useState<PastEventArchive | null>(null);
  const [activeModalEvent, setActiveModalEvent] = useState<PastEventArchive | null>(null);

  // Mouse spring coordinates for cursor-following floating image
  const mouseX = useSpring(0, { stiffness: 220, damping: 22 });
  const mouseY = useSpring(0, { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 120);
  };

  // Filter & Search logic
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((item) => {
      const matchYear = selectedYear === 'all' || item.year === selectedYear;
      const matchCat =
        selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchYear && matchCat && matchSearch;
    });
  }, [initialEvents, selectedYear, selectedCategory, searchQuery]);

  const visibleItems = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleReset = () => {
    setSelectedYear('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative space-y-10 pt-16 border-t border-slate-200/80"
    >
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>HISTORICAL ARCHIVE &amp; ARTIFACTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase font-sans">
            WHAT WE&apos;VE <span className="text-[#3FA85B]">ALREADY BUILT</span>
          </h2>
        </div>

        <p className="text-sm font-sans text-slate-600 max-w-md leading-relaxed">
          Explore complete recaps, gallery snapshots, and open deliverables from past university sprints and fieldwork campaigns.
        </p>
      </div>

      {/* ── Filter Controls ────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Year Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
            {YEARS.map((y) => {
              const isActive = selectedYear === y;
              return (
                <button
                  key={y}
                  onClick={() => {
                    setSelectedYear(y);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {y === 'all' ? 'All Years' : y}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search archive..."
              className="w-full pl-8 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ARCHIVE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0F4C2A] text-white'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Floating Cursor Image Preview (Desktop Only) ────────────── */}
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

      {/* ── Archive Rows List ───────────────────────────────────────── */}
      {filteredEvents.length === 0 ? (
        <div className="py-12 text-center rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3">
          <p className="text-sm font-sans text-slate-500">
            No past sprints found matching your archive filters.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-mono font-bold uppercase transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Archive Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-slate-200/80 border-y border-slate-200/80 bg-white rounded-3xl shadow-xs overflow-hidden">
            {visibleItems.map((item) => {
              const isHovered = hoveredEvent?.id === item.id;
              const hasGallery = item.galleryImages && item.galleryImages.length > 0;

              return (
                <div
                  key={item.id}
                  tabIndex={0}
                  onFocus={() => setHoveredEvent(item)}
                  onBlur={() => setHoveredEvent(null)}
                  onMouseEnter={() => setHoveredEvent(item)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  onClick={() => setActiveModalEvent(item)}
                  className={`py-5 sm:py-6 px-4 sm:px-6 cursor-pointer transition-all duration-200 outline-none focus-visible:bg-slate-100/80 group ${
                    isHovered ? 'bg-[#FAFCFA]' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                    {/* Left: Year + Title */}
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 shrink-0">
                        {item.year}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 truncate group-hover:text-[#0F4C2A] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs font-sans text-slate-500 line-clamp-1 mt-0.5 sm:hidden">
                          {item.recap}
                        </p>
                      </div>
                    </div>

                    {/* Right: Tag, Attendees, Gallery count, View link */}
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0 justify-between sm:justify-end">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.attendeeCount}</span>
                      </div>

                      {hasGallery && (
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#0F4C2A] bg-[#E8F7EE] px-2 py-0.5 rounded-md">
                          <Images className="w-3 h-3 text-[#3FA85B]" />
                          <span>{item.galleryImages?.length} photos</span>
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#3FA85B] group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination / Load More ────────────────────────────────── */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 hover:border-slate-300 text-xs font-mono font-bold uppercase transition-all shadow-xs inline-flex items-center gap-2"
              >
                <span>Load More Historical Sprints</span>
                <span className="text-slate-400">
                  ({visibleCount} of {filteredEvents.length})
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Rich Archive Details Modal ──────────────────────────────── */}
      <ArchiveDetailModal
        event={activeModalEvent}
        isOpen={!!activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />
    </section>
  );
};
