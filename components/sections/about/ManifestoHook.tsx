'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '@/components/ui/ScrambleText';
import { ABOUT_MANIFESTO } from '@/content/about';
import { ArrowUpRight } from 'lucide-react';

export const ManifestoHook: React.FC = () => {
  return (
    <div className="relative py-24 sm:py-32 bg-[#FAFCFA] border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Eyebrow Tag */}
        <div className="flex items-center justify-between pb-8 mb-12 border-b border-slate-200/80 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="text-[#0F4C2A] font-bold">MANIFESTO</span>
            <span className="text-slate-300">/</span>
            <span>ISIMS CAMPUS CHAPTER</span>
          </div>
          <div className="hidden sm:block text-slate-400">
            {ABOUT_MANIFESTO.coordinates}
          </div>
        </div>

        {/* Big Bold Editorial Typographic Statement */}
        <div className="max-w-4xl">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15] mb-12">
            <ScrambleText
              text={ABOUT_MANIFESTO.leadQuote}
              speed={20}
              trigger="inView"
              wordByWord={true}
              hoverRescramble={true}
              wordClassName="hover:text-[#3FA85B] transition-colors duration-200 cursor-default"
            />
          </h2>
        </div>

        {/* Narrative Sub-block & Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-slate-200/80 items-end">
          <div className="md:col-span-8">
            <p className="text-base sm:text-lg font-sans text-slate-600 leading-relaxed max-w-2xl">
              <ScrambleText
                text={ABOUT_MANIFESTO.subtext}
                speed={16}
                trigger="inView"
                wordByWord={true}
                hoverRescramble={true}
                wordClassName="hover:text-slate-900 transition-colors"
              />
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col md:items-end justify-end space-y-1 text-left md:text-right">
            <div className="text-sm font-bold font-mono text-slate-900">
              {ABOUT_MANIFESTO.author}
            </div>
            <div className="text-xs text-slate-500 font-sans">
              {ABOUT_MANIFESTO.authorRole}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
