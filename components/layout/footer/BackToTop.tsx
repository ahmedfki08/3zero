'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from '@/lib/scroll';

interface BackToTopProps {
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({ className = '' }) => {
  const handleClick = () => {
    scrollToTarget('hero', { offset: 0 });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to the top"
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 hover:bg-[#3FA85B] text-emerald-100 hover:text-white border border-emerald-700/60 hover:border-[#3FA85B] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F4C2A] cursor-pointer ${className}`}
    >
      <span>Back to the top</span>
      <div className="relative w-3.5 h-3.5 overflow-hidden">
        <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-full" />
        <ArrowUp className="w-3.5 h-3.5 absolute inset-0 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0" />
      </div>
    </button>
  );
};
