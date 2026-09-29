'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StaffMember } from '@/types/staff';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RosterListProps {
  members: StaffMember[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onHoverIntent: (index: number) => void;
  onHoverCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const RosterList: React.FC<RosterListProps> = ({
  members,
  currentIndex,
  onSelect,
  onHoverIntent,
  onHoverCancel,
  onKeyDown,
}) => {
  return (
    <nav
      aria-label="Staff members roster"
      className="w-full flex flex-col justify-center"
      onKeyDown={onKeyDown}
    >
      {/* ── Desktop Vertical Roster ──────────────────────────────────── */}
      <div
        role="tablist"
        aria-orientation="vertical"
        className="hidden md:flex flex-col space-y-2 relative"
      >
        {members.map((member, idx) => {
          const isActive = idx === currentIndex;

          return (
            <button
              key={member.id}
              role="tab"
              id={`staff-tab-${member.id}`}
              aria-selected={isActive}
              aria-controls={`staff-panel-${member.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(idx)}
              onMouseEnter={() => onHoverIntent(idx)}
              onMouseLeave={onHoverCancel}
              onFocus={() => onSelect(idx)}
              className={`group relative text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] ${
                isActive
                  ? 'bg-[#0F4C2A]/5 text-[#0F172A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {/* Left Indicator bar on Active */}
              {isActive && (
                <motion.div
                  layoutId="roster-active-pill"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#3FA85B] rounded-l-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-4 min-w-0">
                {/* Monospace Number Index */}
                <span
                  className={`font-mono text-xs font-bold transition-colors duration-200 ${
                    isActive ? 'text-[#3FA85B]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {member.index}
                </span>

                {/* Member Name */}
                <div className="min-w-0">
                  <span
                    className={`block font-bold tracking-tight transition-all duration-200 truncate ${
                      isActive
                        ? 'text-lg sm:text-xl text-[#0F172A]'
                        : 'text-base sm:text-lg text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {member.name}
                  </span>
                  <span
                    className={`block text-xs font-mono truncate transition-colors duration-200 ${
                      isActive ? 'text-[#0F4C2A] font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Active Arrow / Sparkle Indicator */}
              <div
                className={`transition-all duration-200 shrink-0 ml-2 ${
                  isActive
                    ? 'opacity-100 translate-x-0 text-[#3FA85B]'
                    : 'opacity-0 -translate-x-2 text-slate-300 group-hover:opacity-40'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Mobile Horizontal Snap Strip ─────────────────────────────── */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-2 pt-1 px-1 snap-x snap-mandatory"
      >
        {members.map((member, idx) => {
          const isActive = idx === currentIndex;

          return (
            <button
              key={member.id}
              role="tab"
              id={`staff-tab-mobile-${member.id}`}
              aria-selected={isActive}
              aria-controls={`staff-panel-${member.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(idx)}
              className={`snap-start shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#0F4C2A] text-white border-[#0F4C2A] shadow-md font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={isActive ? 'text-[#4ADE80]' : 'text-slate-400'}>
                {member.index}
              </span>
              <span className="font-sans font-bold text-xs">{member.firstName}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
