'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PillarId } from '@/types';
import { PILLARS_DATA } from '@/content/club-data';
import { CustomSculpturalZero } from '../ui/CustomSculpturalZero';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface HeroPortalsProps {
  onOpenJoinForm?: (pillarId: PillarId) => void;
}

/**
 * Animation phases:
 *  idle              → all 3 zeros visible, no selection
 *  isolating         → others fade out
 *  centering         → selected slides to center
 *  zooming           → selected scales up to fill screen
 *  inside_dimension  → dimension card visible; zeros hidden
 *  exit_unzoom       → dimension fades, selected zero appears center at scale 1
 *  exit_slide        → selected zero slides back to its column
 *  exit_reveal       → other zeros fade in → triggers idle
 */
type AnimationPhase =
  | 'idle'
  | 'isolating'
  | 'centering'
  | 'zooming'
  | 'inside_dimension'
  | 'exit_unzoom'
  | 'exit_slide'
  | 'exit_reveal';

const PILLAR_GRADIENTS: Record<
  PillarId,
  {
    start: string;
    mid: string;
    end: string;
    glow: string;
    labelColor: string;
    dimensionBg: string;
  }
> = {
  exclusion: {
    start: '#06B6D4',
    mid: '#3FA85B',
    end: '#0F4C2A',
    glow: 'rgba(6, 182, 212, 0.45)',
    labelColor: '#0891B2',
    dimensionBg: 'radial-gradient(circle at 50% 25%, rgba(6, 182, 212, 0.15) 0%, #FAFCFA 75%)',
  },
  carbon: {
    start: '#4EBA6F',
    mid: '#3FA85B',
    end: '#0A3F25',
    glow: 'rgba(63, 168, 91, 0.55)',
    labelColor: '#0F4C2A',
    dimensionBg: 'radial-gradient(circle at 50% 25%, rgba(63, 168, 91, 0.16) 0%, #FAFCFA 75%)',
  },
  poverty: {
    start: '#F59E0B',
    mid: '#4EBA6F',
    end: '#0A3F25',
    glow: 'rgba(245, 158, 11, 0.45)',
    labelColor: '#D97706',
    dimensionBg: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.15) 0%, #FAFCFA 75%)',
  },
};

// Column positions for each pillar by index (as CSS translateX percentage relative to parent)
// These match the 3-column grid: left=0, center=1, right=2
const PILLAR_INDEX: Record<PillarId, number> = {
  exclusion: 0,
  carbon: 1,
  poverty: 2,
};

export const HeroPortals: React.FC<HeroPortalsProps> = ({ onOpenJoinForm }) => {
  const [hoveredPillar, setHoveredPillar] = useState<PillarId | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(null);
  const [phase, setPhase] = useState<AnimationPhase>('idle');

  const pillarsList: PillarId[] = ['exclusion', 'carbon', 'poverty'];

  const handleZeroClick = (pillarId: PillarId) => {
    if (phase !== 'idle') return;

    setSelectedPillar(pillarId);

    // Stage 1: Others dissolve (250ms)
    setPhase('isolating');

    // Stage 2: Slide to center (400ms)
    setTimeout(() => setPhase('centering'), 250);

    // Stage 3: Smooth Zoom in (550ms)
    setTimeout(() => setPhase('zooming'), 650);

    // Stage 4: Inside dimension (synchronized exactly with zoom completion)
    setTimeout(() => setPhase('inside_dimension'), 1200);
  };

  const handleExitDimension = () => {
    // Step 1: Dimension fades, zero reappears center at scale=1 (graceful, smooth reverse)
    setPhase('exit_unzoom');

    // Step 2: Zero slides back to its column position
    setTimeout(() => setPhase('exit_slide'), 750);

    // Step 3: Other zeros fade in
    setTimeout(() => setPhase('exit_reveal'), 1400);

    // Step 4: Full idle restored
    setTimeout(() => {
      setPhase('idle');
      setSelectedPillar(null);
    }, 1850);
  };

  // Dimension card visible when inside or during zoom-out exit
  const showDimension = phase === 'inside_dimension' || phase === 'exit_unzoom';


  return (
    <section
      id="three-zeros"
      className="relative min-h-[96vh] pt-24 pb-16 flex flex-col justify-between overflow-hidden bg-clean-mesh select-none transition-colors duration-1000"
      style={{
        background:
          selectedPillar && showDimension
            ? PILLAR_GRADIENTS[selectedPillar].dimensionBg
            : undefined,
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] rounded-full bg-[#3FA85B]/10 blur-[150px] pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 text-center pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: phase === 'inside_dimension' ? 0 : 1,
            y: 0,
          }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-[family-name:var(--font-oswald)] text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none py-1 text-slate-900">
            WELCOME TO <span className="text-[#3FA85B]">3 ZERO</span>
          </h1>

          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#0F4C2A] font-bold">
            <span>CAMPUS CLUB</span>
            <span className="bg-[#0F4C2A] text-white px-2 py-0.5 rounded text-[10px] tracking-[0.18em] shadow-sm">
              ISIMS
            </span>
          </div>
        </motion.div>
      </div>

      {/* MAIN KINETIC STAGE */}
      <div className="relative z-20 max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 w-full my-auto py-4 sm:py-6">

        {/* Shared stage: grid + dimension card are absolutely stacked */}
        <div className="relative w-full min-h-[300px] xs:min-h-[360px] sm:min-h-[440px] md:min-h-[500px]">

          {/* ── PORTAL GRID — always mounted for animation continuity ── */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1.5 xs:gap-3 sm:gap-6 md:gap-8 items-center justify-items-center w-full">
              {pillarsList.map((pillarId, index) => {
                const pillar = PILLARS_DATA[pillarId];
                const isHovered = hoveredPillar === pillarId && phase === 'idle';
                const isSelected = selectedPillar === pillarId;
                const isOther = selectedPillar !== null && !isSelected;
                const gradientConfig = PILLAR_GRADIENTS[pillarId];
                const selectedIndex = selectedPillar ? PILLAR_INDEX[selectedPillar] : 1;

                // ── ENTRY: slide selected zero to center column
                // ── EXIT: slide it back from center column to its original column
                const isCenteringPhase = phase === 'centering' || phase === 'zooming';

                // X offset in grid units (each column = ~33.33% of grid)
                const columnsFromCenter = selectedIndex - 1; // -1, 0, or +1

                let slideX = '0%';

                if (isSelected) {
                  if (isCenteringPhase || phase === 'inside_dimension' || phase === 'exit_unzoom') {
                    // Centered: stay at center offset through the entire portal + exit-unzoom
                    slideX = `${-columnsFromCenter * 100}%`;
                  } else if (phase === 'exit_slide' || phase === 'exit_reveal') {
                    // Slide back to original position
                    slideX = '0%';
                  }
                }

                // Scale logic (optimized for 60-120fps GPU performance)
                let scaleValue = 1;
                if (isOther) {
                  scaleValue = 0.5;
                } else if (isSelected) {
                  if (phase === 'zooming' || phase === 'inside_dimension') {
                    scaleValue = 8;
                  } else if (phase === 'exit_unzoom') {
                    scaleValue = 1;
                  } else if (isHovered) {
                    scaleValue = 1.05;
                  }
                } else if (isHovered) {
                  scaleValue = 1.05;
                }

                // Opacity logic
                let opacityValue = 1;
                if (isOther) {
                  opacityValue = phase === 'exit_reveal' ? 1 : 0;
                } else if (isSelected && phase === 'inside_dimension') {
                  opacityValue = 0;
                }

                // Transition timing per phase
                let transitionDuration = 0.35;
                let transitionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

                if (phase === 'zooming') {
                  transitionDuration = 0.8;
                } else if (phase === 'centering') {
                  transitionDuration = 0.4;
                } else if (phase === 'exit_unzoom') {
                  // Slower, graceful zoom-out on return
                  transitionDuration = 0.75;
                  transitionEase = [0.16, 1, 0.3, 1];
                } else if (phase === 'exit_slide') {
                  // Slower, smooth slide back on return
                  transitionDuration = 0.65;
                  transitionEase = [0.16, 1, 0.3, 1];
                } else if (phase === 'exit_reveal') {
                  transitionDuration = 0.4;
                }

                return (
                  <motion.div
                    key={pillar.id}
                    animate={{
                      opacity: opacityValue,
                      scale: scaleValue,
                      x: slideX,
                    }}
                    transition={{
                      opacity: {
                        duration: phase === 'exit_unzoom' ? 0.05 : transitionDuration,
                        ease: 'linear',
                      },
                      scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                      x: { duration: transitionDuration, ease: transitionEase },
                    }}
                    onMouseEnter={() => phase === 'idle' && setHoveredPillar(pillarId)}
                    onMouseLeave={() => phase === 'idle' && setHoveredPillar(null)}
                    onClick={() => handleZeroClick(pillarId)}
                    className={`group relative flex flex-col items-center justify-center cursor-pointer p-1.5 sm:p-4 w-full transform-gpu will-change-transform ${phase !== 'idle' ? 'pointer-events-none' : ''
                      }`}
                  >
                    {/* Sculptural Zero */}
                    <CustomSculpturalZero
                      pillarId={pillarId}
                      isHovered={isHovered}
                      borderGradient={gradientConfig}
                    />

                    {/* Label underneath */}
                    <motion.div
                      className="mt-2 sm:mt-4 text-center space-y-0.5 sm:space-y-1"
                      animate={{
                        opacity:
                          isSelected &&
                            (phase === 'centering' ||
                              phase === 'zooming' ||
                              phase === 'exit_unzoom' ||
                              phase === 'exit_slide')
                            ? 0
                            : 1,
                        y: isHovered ? -4 : 0,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div
                        className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black"
                        style={{ color: gradientConfig.labelColor }}
                      >
                        ZERO {pillar.code}
                      </div>

                      <h3 className="font-[family-name:var(--font-oswald)] text-xs xs:text-sm sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 uppercase group-hover:text-[#0F4C2A] transition-colors">
                        {pillar.title.replace('Zero ', '')}
                      </h3>

                      <div
                        className={`hidden xs:inline-flex items-center gap-1.5 text-[9px] sm:text-[11px] font-mono font-bold transition-all duration-300 ${isHovered
                          ? 'text-[#3FA85B] opacity-100 translate-y-0'
                          : 'text-slate-400 opacity-0 translate-y-1'
                          }`}
                      >
                        <span>Enter Portal</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>{/* end grid absolute */}

          {/* ── DIMENSION TEXT REVEAL — absolutely overlaid on top of the grid ── */}
          <AnimatePresence>
            {showDimension && selectedPillar && (
              <motion.div
                key="dimension-interior"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'exit_unzoom' ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6"
              >
                {/* Eyebrow: ZERO 01 */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: phase === 'exit_unzoom' ? 0 : 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] font-black mb-2 sm:mb-4 text-center"
                  style={{ color: PILLAR_GRADIENTS[selectedPillar].labelColor }}
                >
                  ZERO {PILLARS_DATA[selectedPillar].code} · ISIMS CAMPUS CLUB
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: phase === 'exit_unzoom' ? 0 : 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-[family-name:var(--font-oswald)] text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tight text-center leading-none mb-4 sm:mb-8"
                  style={{ color: PILLAR_GRADIENTS[selectedPillar].end }}
                >
                  {PILLARS_DATA[selectedPillar].title}
                </motion.h2>

                {/* Description — word-by-word stagger reveal */}
                <motion.p
                  className="max-w-2xl text-center text-sm xs:text-base sm:text-xl md:text-2xl font-light leading-relaxed text-slate-700 px-2"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {PILLARS_DATA[selectedPillar].description.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{
                        opacity: phase === 'exit_unzoom' ? 0 : 1,
                        y: phase === 'exit_unzoom' ? 16 : 0,
                        filter: phase === 'exit_unzoom' ? 'blur(6px)' : 'blur(0px)',
                      }}
                      transition={{
                        duration: 0.45,
                        delay: phase === 'exit_unzoom' ? 0 : 0.35 + i * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-[0.25em] sm:mr-[0.3em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>

                {/* Exit cue */}
                <motion.button
                  onClick={handleExitDimension}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'exit_unzoom' ? 0 : 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-6 sm:mt-12 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-slate-400 hover:text-[#0F4C2A] transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Return</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>{/* end shared stage */}
      </div>{/* end kinetic stage */}

      {/* Interactive Helper Hint under Zeros */}
      <div className="relative z-20 flex justify-center -mt-1 sm:-mt-2 mb-3 sm:mb-4 px-4">
        <motion.div
          animate={{ opacity: phase === 'idle' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/25 text-[#0F4C2A] text-[11px] sm:text-xs font-mono font-bold shadow-xs select-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3FA85B]" />
          <span>Click any zero to explore its dimension</span>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 w-full flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 pt-4 border-t border-slate-200/80 gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B] shrink-0" />
          <span>ZERO EXCLUSION • ZERO CARBON • ZERO POVERTY</span>
        </div>

        <div className="text-slate-400 text-[10px] sm:text-[11px]">
          UNIVERSITY OF SFAX • ISIMS
        </div>
      </div>
    </section>
  );
};
