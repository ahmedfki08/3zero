'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { UPCOMING_EVENTS } from '@/content/events';
import { scrollToTarget } from '@/lib/scroll';

interface NavCtaProps {
  className?: string;
  onNavigate?: () => void;
  showEventPreview?: boolean;
}

export const NavCta: React.FC<NavCtaProps> = ({
  className = '',
  onNavigate,
  showEventPreview = siteConfig.nav.cta.showUpcomingEventPreview,
}) => {
  // Find next upcoming event
  const nextEventInfo = useMemo(() => {
    if (!showEventPreview || !UPCOMING_EVENTS || UPCOMING_EVENTS.length === 0) {
      return null;
    }

    const now = new Date().getTime();
    const sorted = [...UPCOMING_EVENTS].sort(
      (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime()
    );

    const upcoming = sorted.find((e) => new Date(e.startUtc).getTime() > now) || sorted[0];
    if (!upcoming) return null;

    const diffDays = Math.ceil(
      (new Date(upcoming.startUtc).getTime() - now) / (1000 * 60 * 60 * 24)
    );

    let relativeText = 'Soon';
    if (diffDays <= 0) relativeText = 'Today';
    else if (diffDays === 1) relativeText = 'Tomorrow';
    else if (diffDays > 1 && diffDays < 60) relativeText = `in ${diffDays}d`;

    return {
      title: upcoming.title,
      dateText: upcoming.displayDate,
      relativeText,
      id: upcoming.id,
    };
  }, [showEventPreview]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (siteConfig.nav.cta.type === 'anchor') {
      e.preventDefault();
      const targetId = siteConfig.nav.cta.href.replace('#', '');
      scrollToTarget(targetId, { offset: 76 });
      onNavigate?.();
    }
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Optional Next Event Mini Pill (Desktop) */}
      {nextEventInfo && (
        <button
          type="button"
          onClick={() => scrollToTarget('events', { offset: 76 })}
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/60 text-[11px] font-mono text-emerald-800 transition-colors group cursor-pointer"
          title={`Next Event: ${nextEventInfo.title}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA85B] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3FA85B]" />
          </span>
          <span className="text-emerald-700 font-medium">Next event</span>
          <span className="text-emerald-400">·</span>
          <span className="font-bold text-[#0F4C2A]">{nextEventInfo.relativeText}</span>
          <ArrowRight className="w-3 h-3 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      {/* Main CTA Button */}
      <Link
        href={siteConfig.nav.cta.href}
        onClick={handleClick}
        className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#0F4C2A] to-[#3FA85B] hover:from-[#0c3c21] hover:to-[#358f4d] rounded-full shadow-[0_2px_10px_rgba(63,168,91,0.25)] hover:shadow-[0_4px_16px_rgba(63,168,91,0.35)] transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] focus-visible:ring-offset-2 overflow-hidden"
      >
        {/* Subtle sheen highlight */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        />

        <span className="relative z-10 flex items-center gap-1.5">
          <span>{siteConfig.nav.cta.label}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
};
