'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CHAPTERS, StoryChapter } from '@/content/about';
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, Layers } from 'lucide-react';

export const ThreePanelStory: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>(STORY_CHAPTERS[0].id);

  const handleKeyDown = (e: React.KeyboardEvent, chapterId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveChapterId(chapterId);
    }
  };

  return (
    <div className="relative py-20 sm:py-28 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-3 font-bold">
              <Layers className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>THE 3-ZERO CHAPTERS</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              THE <span className="text-[#3FA85B]">ISIMS STORY</span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-500 max-w-sm">
            Three short chapters about who we are, what we build and where we're going. Pick one to open it.
          </p>
        </div>

        {/* Desktop Accordion Split Layout */}
        <div className="hidden lg:flex gap-4 h-[620px] w-full items-stretch">
          {STORY_CHAPTERS.map((chapter) => {
            const isActive = chapter.id === activeChapterId;

            return (
              <motion.div
                key={chapter.id}
                role="region"
                id={`panel-${chapter.id}`}
                aria-labelledby={`tab-${chapter.id}`}
                aria-expanded={isActive}
                tabIndex={0}
                onMouseEnter={() => setActiveChapterId(chapter.id)}
                onFocus={() => setActiveChapterId(chapter.id)}
                onKeyDown={(e) => handleKeyDown(e, chapter.id)}
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3FA85B]/40 ${
                  isActive
                    ? 'flex-[3.5] border-[#3FA85B]/40 shadow-2xl bg-[#FAFCFA]'
                    : 'flex-[1] border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Background Media with Next/Image */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src={chapter.media.src}
                    alt={chapter.media.alt}
                    fill
                    sizes="(max-width: 1200px) 100vw, 60vw"
                    className={`object-cover transition-all duration-700 ${
                      isActive ? 'opacity-15 scale-105 filter saturate-100' : 'opacity-0 scale-100'
                    }`}
                    priority={chapter.id === 'who-we-are'}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                      isActive
                        ? 'from-white via-white/90 to-white/40'
                        : 'from-slate-100/90 to-transparent'
                    }`}
                  />
                </div>

                {/* Collapsed State View */}
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full p-6 flex flex-col justify-between items-center text-center relative z-10 select-none"
                  >
                    <div className="text-xl font-black font-mono text-[#0F4C2A] bg-[#E8F7EE] w-12 h-12 rounded-2xl flex items-center justify-center border border-[#3FA85B]/20 shadow-sm">
                      {chapter.number}
                    </div>

                    <div className="my-auto py-6 space-y-2 px-2">
                      <span className="text-[11px] font-mono font-bold text-[#3FA85B] tracking-wider uppercase block">
                        {chapter.tag}
                      </span>
                      <h4 className="text-lg font-black font-sans tracking-tight text-slate-900 uppercase leading-snug">
                        {chapter.title}
                      </h4>
                    </div>

                    <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <span>EXPAND</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#3FA85B]" />
                    </div>
                  </motion.div>
                )}

                {/* Expanded Full Story Content */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative z-10 h-full p-8 sm:p-10 flex flex-col justify-between overflow-y-auto"
                  >
                    {/* Header bar of active panel */}
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold bg-[#E8F7EE] text-[#0F4C2A] px-3 py-1 rounded-full border border-[#3FA85B]/30">
                            CHAPTER {chapter.number} // {chapter.tag}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          ISIMS CAMPUS STORY
                        </span>
                      </div>

                      <h4 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">
                        {chapter.title}
                      </h4>
                      <p className="text-sm font-mono text-[#0F4C2A] font-semibold mb-6">
                        {chapter.subtitle}
                      </p>

                      <p className="text-base font-serif text-slate-800 leading-relaxed italic mb-4">
                        “{chapter.lead}”
                      </p>

                      <div className="space-y-3 mb-6">
                        {chapter.paragraphs.map((p, idx) => (
                          <p key={idx} className="text-sm font-sans text-slate-600 leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Key Highlights Bento */}
                    <div className="pt-4 border-t border-slate-200/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {chapter.keyHighlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3FA85B]" />
                              <span>{highlight.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-sans leading-normal">
                              {highlight.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>CAPTION: {chapter.media.caption}</span>
                        <span className="text-[#3FA85B] font-bold inline-flex items-center gap-1">
                          ACTIVE CHAPTER <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Vertical Stack / Tap-to-Expand Stepper */}
        <div className="lg:hidden flex flex-col gap-4">
          {STORY_CHAPTERS.map((chapter) => {
            const isActive = chapter.id === activeChapterId;

            return (
              <div
                key={chapter.id}
                role="region"
                id={`mobile-panel-${chapter.id}`}
                aria-expanded={isActive}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'bg-white border-[#3FA85B] shadow-xl'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                {/* Accordion header button */}
                <button
                  type="button"
                  onClick={() => setActiveChapterId(chapter.id)}
                  aria-controls={`mobile-content-${chapter.id}`}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black font-mono bg-[#E8F7EE] text-[#0F4C2A] w-9 h-9 rounded-xl flex items-center justify-center border border-[#3FA85B]/20">
                      {chapter.number}
                    </span>
                    <div>
                      <div className="text-lg font-bold text-slate-900 uppercase">
                        {chapter.title}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {chapter.tag}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isActive ? 'rotate-90 text-[#3FA85B]' : ''
                    }`}
                  />
                </button>

                {/* Accordion Body */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      id={`mobile-content-${chapter.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-2 border-t border-slate-100"
                    >
                      {/* Image snippet */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-slate-200">
                        <Image
                          src={chapter.media.src}
                          alt={chapter.media.alt}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-[11px] font-mono text-white/90">
                          {chapter.media.caption}
                        </span>
                      </div>

                      <p className="text-sm font-serif italic text-slate-800 mb-3">
                        “{chapter.lead}”
                      </p>

                      <div className="space-y-2 mb-4">
                        {chapter.paragraphs.map((p, idx) => (
                          <p key={idx} className="text-xs font-sans text-slate-600 leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        {chapter.keyHighlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3FA85B]" />
                              <span>{highlight.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-sans mt-0.5">
                              {highlight.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
