'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
} from 'framer-motion';
import { MapPin, ArrowDown, Sparkles, Globe, Compass, ShieldCheck } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   High-Performance Particle Pool (Pre-computed & GPU-efficient)
   Zero runtime allocations per frame = 60+ FPS guaranteed
═══════════════════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT = 320;
const PALETTE = [
  'rgba(63, 168, 91, 0.95)',   // Vibrant emerald green
  'rgba(15, 76, 42, 0.9)',    // Deep forest green
  'rgba(74, 222, 128, 0.85)', // Light mint green
  'rgba(30, 41, 59, 0.75)',   // Deep slate / charcoal
  'rgba(22, 101, 52, 0.85)',  // Rich jade
];

interface ParticleData {
  // Relative position within the logo bounding box [0..1]
  relX: number;
  relY: number;
  // Dynamic flight offsets
  burstX: number;
  burstY: number;
  driftSpeed: number;
  driftPhase: number;
  size: number;
  color: string;
  glow: boolean;
}

// Generate deterministic particle pool once
const PARTICLES: ParticleData[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 997 + i * 37.19) * 43758.5453;
    return x - Math.floor(x);
  };

  const rY = pseudoRandom(1);
  const rX = pseudoRandom(2);
  const spreadX = (pseudoRandom(3) - 0.5) * 260;
  const spreadY = - (pseudoRandom(4) * 180 + 30); // Upward burst

  return {
    relX: rX,
    relY: rY,
    burstX: spreadX,
    burstY: spreadY,
    driftSpeed: 0.8 + pseudoRandom(5) * 1.5,
    driftPhase: pseudoRandom(6) * Math.PI * 2,
    size: 1.5 + pseudoRandom(7) * 2.8,
    color: PALETTE[Math.floor(pseudoRandom(8) * PALETTE.length)],
    glow: pseudoRandom(9) > 0.6,
  };
});

/* ═══════════════════════════════════════════════════════════════════════════
   Canvas Particle Renderer
═══════════════════════════════════════════════════════════════════════════ */
interface ParticleCanvasProps {
  scrollProgressRef: React.RefObject<number>;
  logoRectRef: React.RefObject<DOMRect | null>;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  scrollProgressRef,
  logoRectRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const render = () => {
      time += 0.015;
      const progress = scrollProgressRef.current ?? 0;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Only draw when there is some scroll movement or in transition
      const logoRect = logoRectRef.current;
      const lw = logoRect ? logoRect.width : Math.min(width * 0.85, 840);
      const lh = logoRect ? logoRect.height : lw * 0.35;
      const lx = logoRect ? logoRect.left : (width - lw) / 2;
      const ly = logoRect ? logoRect.top : (height - lh) / 2;

      // Dissolve progress spans from scroll 0.05 to 0.65
      const dissolveProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.55));

      if (progress > 0.02 && progress < 0.98) {
        for (let i = 0; i < PARTICLES.length; i++) {
          const p = PARTICLES[i];

          // Particle activates when the wipe line crosses its relative Y position
          if (dissolveProgress < p.relY * 0.85) continue;

          // Local evolution factor [0..1]
          const localLife = Math.min(1, (dissolveProgress - p.relY * 0.85) / 0.35);

          // Position calculation: starts at logo point, erupts and drifts
          const startX = lx + p.relX * lw;
          const startY = ly + p.relY * lh;

          // Physics curve: initial burst, then gentle sine wave floating
          const floatOffset = Math.sin(time * p.driftSpeed + p.driftPhase) * 14 * localLife;
          const currentX = startX + p.burstX * Math.pow(localLife, 0.8) + floatOffset;
          const currentY = startY + p.burstY * Math.pow(localLife, 0.7) - (localLife * 40);

          // Alpha fade in rapidly then gently linger until text takes over
          let alpha = 0;
          if (localLife < 0.2) {
            alpha = localLife / 0.2;
          } else {
            alpha = (1 - (progress - 0.5) / 0.45);
          }
          alpha = Math.max(0, Math.min(1, alpha));

          if (alpha <= 0.01) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;

          // Draw particle
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glow for glowing particles
          if (p.glow && alpha > 0.3) {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.25)';
            ctx.beginPath();
            ctx.arc(currentX, currentY, p.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgressRef, logoRectRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden="true"
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component: Big Logo Dissolve into Manifesto Paragraph
═══════════════════════════════════════════════════════════════════════════ */
export const LogoSliceManifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoRectRef = useRef<DOMRect | null>(null);
  const scrollRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring progress for buttery transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 24,
    mass: 0.5,
  });

  // Keep scroll progress in a plain ref for high-frequency Canvas animation
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v: number) => {
      scrollRef.current = v;
    });

    const updateRect = () => {
      if (logoWrapperRef.current) {
        logoRectRef.current = logoWrapperRef.current.getBoundingClientRect();
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [smoothProgress]);

  /* ── Logo Transformations ── */
  // Dissolves top-to-bottom as user scrolls down
  const clipBottom = useTransform(smoothProgress, [0.05, 0.58], [0, 105]);
  const logoClipPath = useMotionTemplate`inset(${clipBottom}% 0% 0% 0%)`;

  const logoOpacity = useTransform(smoothProgress, [0.0, 0.1, 0.55], [1, 0.95, 0]);
  const logoScale = useTransform(smoothProgress, [0, 0.55], [1, 0.92]);
  const logoY = useTransform(smoothProgress, [0, 0.55], [0, -20]);

  /* ── Text Emergence Transformations ── */
  const textOpacity = useTransform(smoothProgress, [0.38, 0.65], [0, 1]);
  const textScale = useTransform(smoothProgress, [0.38, 0.65], [0.94, 1]);
  const textY = useTransform(smoothProgress, [0.38, 0.65], [40, 0]);

  /* ── Ambient Background Glow & Hint ── */
  const hintOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const ambientGlowScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.2, 1]);

  return (
    <div
      ref={containerRef}
      className="relative h-[240vh] bg-[#FAFCFA] selection:bg-[#3FA85B]/20"
    >
      {/* ── Sticky Pinned Fullscreen Stage ───────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Ambient high-tech background glow & subtle dot-grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(15,76,42,0.12) 1.2px, transparent 1.2px)',
            backgroundSize: '36px 36px',
          }}
        />

        <motion.div
          aria-hidden="true"
          style={{ scale: ambientGlowScale }}
          className="pointer-events-none absolute w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#3FA85B]/10 via-[#22c55e]/15 to-transparent blur-[120px] -z-10"
        />

        {/* Dynamic Canvas Particle Layer */}
        <ParticleCanvas
          scrollProgressRef={scrollRef as React.RefObject<number>}
          logoRectRef={logoRectRef}
        />

        {/* ── Top Header Navigation Badges ─────────────────────────────── */}
        <header className="absolute top-6 sm:top-8 left-5 sm:left-12 right-5 sm:right-12 flex items-center justify-between z-30 pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-xs font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA85B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FA85B]" />
            </span>
            <span className="text-[#0F4C2A] font-bold tracking-wider">ABOUT THE CLUB</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>ISIMS CAMPUS · SFAX</span>
          </div>
        </header>

        {/* ── Main Stage Center Area ──────────────────────────────────── */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-center min-h-[500px]">

          {/* 1. BIG BIG LOGO (Hero Initial View) */}
          <motion.div
            ref={logoWrapperRef}
            style={{
              clipPath: logoClipPath,
              opacity: logoOpacity,
              scale: logoScale,
              y: logoY,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none pointer-events-none"
          >
            <div className="relative w-full max-w-[840px] sm:w-[88vw] px-4">
              {/* Grand Majestic Logo Frame */}
              <div
                className="relative w-full aspect-[2.85/1] drop-shadow-[0_12px_32px_rgba(15,76,42,0.14)]"
              >
                <Image
                  src="/logo.png"
                  alt="3 ZERO ISIMS Campus Club"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 840px"
                />
              </div>

              {/* Sub-label under big logo */}
              <div className="mt-4 text-center">
                <span className="inline-block text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#0F4C2A]/70 font-semibold bg-[#E8F7EE]/80 px-3.5 py-1 rounded-full border border-[#3FA85B]/20">
                  ISIMS · University of Sfax
                </span>
              </div>
            </div>
          </motion.div>

          {/* 2. DESCRIPTION MANIFESTO (Appears as Logo Dissolves into Particles) */}
          <motion.div
            style={{
              opacity: textOpacity,
              scale: textScale,
              y: textY,
            }}
            className="relative z-30 max-w-3xl text-center space-y-6 sm:space-y-8 px-4"
          >
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>THE VISION &amp; THE CAMPUS</span>
            </div>

            {/* Main Punchy Heading */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans text-slate-900 leading-[1.12] tracking-tight">
              Engineering a Future of{' '}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C2A] via-[#3FA85B] to-[#10B981]"
              >
                Three Zeros
              </span>
            </h2>

            {/* Rich Detailed Campus Paragraph */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto font-normal">
              Born inside the lecture halls of <strong className="text-slate-900 font-semibold">ISIMS Sfax</strong>, 
              the <strong className="text-[#0F4C2A] font-semibold">3-Zero Club</strong> brings together computer scientists, 
              creative engineers, and changemakers to pioneer real-world social impact and sustainable technology.
            </p>

            {/* Three Zero Core Pillars Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-mono text-slate-700 font-medium shadow-sm hover:border-[#3FA85B]/50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#3FA85B]" />
                Zero Net Carbon
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-mono text-slate-700 font-medium shadow-sm hover:border-[#3FA85B]/50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#3FA85B]" />
                Zero Poverty
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-mono text-slate-700 font-medium shadow-sm hover:border-[#3FA85B]/50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#3FA85B]" />
                Zero Exclusion
              </span>
            </div>

            {/* Coordinate Footer */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                <Compass className="w-3 h-3 text-[#3FA85B]" />
                <span>34.7406° N, 10.7603° E · SFAX, TUNISIA</span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300" />
            </div>
          </motion.div>
        </div>

        {/* ── Scroll Guide Indicator ─────────────────────────────────── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-7 sm:bottom-10 flex flex-col items-center gap-2 text-xs font-mono text-slate-400 select-none z-20 pointer-events-none"
        >
          <span className="tracking-widest uppercase text-[10px] font-semibold text-slate-500">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#3FA85B]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Screen reader content */}
      <div className="sr-only">
        <h2>About 3-Zero ISIMS Campus Club</h2>
        <p>
          Born at Institut Supérieur d&apos;Informatique &amp; Multimédia de Sfax (ISIMS), 3-Zero unites students to build a future of Zero Net Carbon, Zero Poverty, and Zero Exclusion.
        </p>
      </div>
    </div>
  );
};
