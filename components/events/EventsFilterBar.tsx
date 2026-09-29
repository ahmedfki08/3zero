'use client';

import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, X } from 'lucide-react';
import { EventCategory } from '@/types/events';
import { PillarId } from '@/types';

interface EventsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPillar: string;
  onPillarChange: (pillar: string) => void;
  sortBy: 'date-asc' | 'seats' | 'title';
  onSortChange: (sort: 'date-asc' | 'seats' | 'title') => void;
  totalResults: number;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Formats', value: 'all' },
  { label: 'Hackathons', value: 'Hackathon' },
  { label: 'Workshops', value: 'Workshop' },
  { label: 'Symposiums', value: 'Symposium' },
  { label: 'Tech Talks', value: 'Tech Talk' },
  { label: 'Fieldwork', value: 'Fieldwork' },
];

const PILLARS: { label: string; value: string }[] = [
  { label: 'All 3 Zeros', value: 'all' },
  { label: '01 · Zero Exclusion', value: 'exclusion' },
  { label: '02 · Zero Net Carbon', value: 'carbon' },
  { label: '03 · Zero Poverty', value: 'poverty' },
];

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPillar,
  onPillarChange,
  sortBy,
  onSortChange,
  totalResults,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPillar !== 'all';

  const handleReset = () => {
    onSearchChange('');
    onCategoryChange('all');
    onPillarChange('all');
  };

  return (
    <div className="space-y-4 pt-8 pb-4">
      {/* ── Search & Controls Row ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by topic, speaker, tech or location..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns: Pillar + Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pillar Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#3FA85B]" />
            <select
              value={selectedPillar}
              onChange={(e) => onPillarChange(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-700 focus:outline-none cursor-pointer pr-2"
            >
              {PILLARS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as 'date-asc' | 'seats' | 'title')
              }
              className="bg-transparent text-xs font-mono text-slate-700 focus:outline-none cursor-pointer pr-2"
            >
              <option value="date-asc">Date (Soonest)</option>
              <option value="seats">Seats Available</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-mono font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Category Pill Tabs ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0F4C2A] text-white shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-slate-400 shrink-0 hidden sm:inline-block">
          {totalResults} {totalResults === 1 ? 'session' : 'sessions'}
        </span>
      </div>
    </div>
  );
};
