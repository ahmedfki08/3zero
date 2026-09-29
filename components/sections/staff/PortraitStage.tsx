'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffMember } from '@/types/staff';
import { ParallaxLayers } from '@/hooks/usePointerParallax';

interface PortraitStageProps {
  member: StaffMember | null;
  totalMembers: number;
  direction: number;
  parallax: ParallaxLayers;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export const PortraitStage: React.FC<PortraitStageProps> = ({
  member,
  totalMembers,
  direction,
  parallax,
  onTouchStart,
  onTouchEnd,
}) => {
  const { bgX, bgY, portraitX, portraitY, fgX, fgY } = parallax;

  if (!member) {
    return (
      <div className="relative w-full h-[430px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden bg-[#0F3319] border border-emerald-800/40 flex items-center justify-center text-emerald-200/60 font-mono text-sm">
        No executive members in this cohort.
      </div>
    );
  }

  const portraitVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
      clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
    }),
    animate: {
      opacity: 1,
      x: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
        clipPath: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      clipPath: dir > 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  const textSlideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 14 : -14,
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -14 : 14,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-[430px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden select-none bg-[#0F3319] shadow-2xl border border-emerald-800/40"
    >
      {/* ── Subtle noise texture overlay ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* ── LAYER 1: Top header bar ───────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-3.5 pt-3.5 sm:px-4 sm:pt-4 pointer-events-none gap-2">
        {/* Top-left hashtag tagline */}
        <div className="text-[9px] sm:text-[10px] font-mono text-emerald-200/70 leading-tight">
          <div># Let&apos;s build a Zero Exclusion</div>
          <div>Zero Carbon Zero Poverty world.</div>
        </div>

        {/* Top-right club badge */}
        <div className="flex items-center shrink-0">
          <Image
            src="/club-badge-logo.png"
            alt="ZERO Exclusion Carbon Poverty - Campus Club ISIMS"
            width={180}
            height={55}
            className="h-6 sm:h-8.5 w-auto object-contain drop-shadow-md rounded-xs"
            priority
          />
        </div>
      </div>

      {/* ── LAYER 2: Left vertical BOARD text + number badge ──────────── */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center pointer-events-none pl-3 sm:pl-4"
        aria-hidden="true"
      >
        {/* Number square badge */}
        <div className="mb-3 w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center rounded-sm shadow-lg">
          <span className="text-xl sm:text-2xl font-black text-[#0F3319]">
            {parseInt(member.index, 10)}
          </span>
        </div>

        {/* Vertical BOARD text */}
        <div
          className="text-white font-black uppercase tracking-widest leading-none select-none"
          style={{
            fontSize: 'clamp(38px, 7vw, 60px)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          BOARD
        </div>
      </motion.div>

      {/* ── LAYER 3: Portrait (B&W with white outline glow) ───────────── */}
      <motion.div
        style={{ x: portraitX, y: portraitY }}
        className="absolute inset-0 z-10 flex items-end justify-center"
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={member.id}
            custom={direction}
            variants={portraitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-[72%] sm:w-[68%] h-[92%] ml-12 sm:ml-14"
          >
            <Image
              src={member.fallbackPhoto || member.portraitCutout || ''}
              alt={`Portrait of ${member.name}, ${member.role}`}
              fill
              priority={member.index === '01'}
              className="object-cover object-top"
              style={{
                filter: 'grayscale(100%) contrast(1.1) brightness(0.95)',
              }}
              sizes="(max-width: 640px) 280px, 350px"
            />
            {/* White outline glow effect mimicking cutout border */}
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.85), inset 0 0 0 6px rgba(255,255,255,0.12)',
              }}
            />
            {/* Bottom vignette so portrait fades into card base */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F3319] via-[#0F3319]/60 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── LAYER 4: Bottom name + role pills (foreground) ─────────────── */}
      <motion.div
        style={{ x: fgX, y: fgY }}
        className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5 pointer-events-none"
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={member.id}
            custom={direction}
            variants={textSlideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-start gap-1.5"
          >
            {/* Name pill */}
            <span className="inline-flex px-4 py-1.5 rounded-full bg-[#1A4A2A]/90 backdrop-blur-sm border border-emerald-600/40 text-white text-sm font-bold shadow-lg">
              {member.name}
            </span>
            {/* Role pill */}
            <span className="inline-flex px-4 py-1.5 rounded-full bg-[#163E22]/80 backdrop-blur-sm border border-emerald-700/30 text-emerald-200 text-xs font-medium shadow-md">
              {member.role}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Counter bottom-right ───────────────────────────────────────── */}
      <div className="absolute bottom-5 right-5 z-30 font-mono text-[10px] text-emerald-400/60 pointer-events-none">
        {member.index} <span className="text-emerald-700">/</span> {String(totalMembers).padStart(2, '0')}
      </div>
    </div>
  );
};
