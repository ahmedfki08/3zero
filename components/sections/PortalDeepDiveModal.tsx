'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PillarId } from '@/types';
import { PILLARS_DATA } from '@/content/club-data';
import { X, ArrowRight, Sparkles, Target, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PortalDeepDiveModalProps {
  pillarId: PillarId | null;
  onClose: () => void;
  onSelectOtherPillar: (id: PillarId) => void;
  onOpenJoinForm?: (pillarId: PillarId) => void;
}

export const PortalDeepDiveModal: React.FC<PortalDeepDiveModalProps> = ({
  pillarId,
  onClose,
  onSelectOtherPillar,
  onOpenJoinForm,
}) => {
  const [activeTab, setActiveTab] = useState<'manifesto' | 'tech' | 'telemetry'>('manifesto');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (pillarId) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pillarId, onClose]);

  if (!pillarId) return null;

  const pillar = PILLARS_DATA[pillarId];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,76,42,0.2)] overflow-hidden my-auto z-10 max-h-[90vh] flex flex-col"
        >
          {/* Top Decorative Emerald Header Ribbon */}
          <div className="h-2 bg-gradient-to-r from-[#0F4C2A] via-[#3FA85B] to-[#4EBA6F]" />

          {/* Modal Header */}
          <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-[#FAFCFA]">
            <div className="flex items-center gap-3">
              {/* Zero Indicator glyph */}
              <div className="w-12 h-12 rounded-2xl bg-[#E8F7EE] text-[#0F4C2A] font-mono font-black text-lg flex items-center justify-center border border-[#3FA85B]/30 shadow-sm">
                0
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">
                    ISIMS CAMPUS PILLAR
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-mono text-[#3FA85B] font-bold">
                    ZERO {pillar.code}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {pillar.title}
                </h2>
              </div>
            </div>

            {/* Switcher & Close */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                {(['exclusion', 'carbon', 'poverty'] as PillarId[]).map((id) => {
                  const p = PILLARS_DATA[id];
                  const isActive = id === pillarId;
                  return (
                    <button
                      key={id}
                      onClick={() => onSelectOtherPillar(id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                        isActive
                          ? 'bg-[#3FA85B] text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p.code} {p.title.replace('Zero ', '')}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clean Tab Navigation */}
          <div className="px-6 sm:px-8 pt-3 bg-white border-b border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manifesto')}
              className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === 'manifesto'
                  ? 'border-[#3FA85B] text-[#0F4C2A] font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              01. Core Mission & Manifesto
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === 'tech'
                  ? 'border-[#3FA85B] text-[#0F4C2A] font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              02. Campus Lab Focus Areas
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === 'telemetry'
                  ? 'border-[#3FA85B] text-[#0F4C2A] font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              03. Impact Metrics
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
            {activeTab === 'manifesto' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Manifesto Banner */}
                <div className="p-6 rounded-2xl bg-[#E8F7EE]/60 border border-[#3FA85B]/20 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#3FA85B] shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F4C2A] leading-snug">
                        {pillar.manifesto.headline}
                      </h3>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problem vs ISIMS Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-700 font-bold">
                      <Target className="w-4 h-4" />
                      The Real-World Challenge
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {pillar.manifesto.coreProblem}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#0F4C2A] font-bold">
                      <Zap className="w-4 h-4 text-[#3FA85B]" />
                      ISIMS Student Solution
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {pillar.manifesto.ourSolution}
                    </p>
                  </div>
                </div>

                {/* Quote Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 italic text-center">
                  {pillar.manifesto.quote}
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pillar.focusAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#3FA85B]/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F7EE] text-[#0F4C2A] font-mono text-xs font-bold flex items-center justify-center border border-[#3FA85B]/20">
                          0{idx + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {area.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {area.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>ISIMS R&D</span>
                        <span className="text-[#3FA85B] font-bold">Active Cohort</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'telemetry' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pillar.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center"
                    >
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                        {m.label}
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1">
                        {m.value}
                        <span className="text-[#3FA85B] text-lg">{m.suffix}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        {m.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer CTA */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#3FA85B]" />
              <span>Higher Institute of Computer Science and Multimedia of Sfax</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenJoinForm?.(pillar.id);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wide bg-[#3FA85B] text-white hover:bg-[#0F4C2A] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Join {pillar.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
