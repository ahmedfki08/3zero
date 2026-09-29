'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { MapPin, ArrowDown } from 'lucide-react';
import { ParticleScene } from '@/lib/particles/particleScene';
import { DEFAULT_PARTICLE_CONFIG, ParticleConfig } from '@/lib/particles/config';
import { measureWordTargets } from '@/lib/particles/measureTextTargets';
import { BackgroundCurves } from './BackgroundCurves';
import { RevealParagraph } from './RevealParagraph';

interface ParticleLogoRevealProps {
  logoSrc?: string;
  configOverrides?: Partial<ParticleConfig>;
}

const CLUB_PARAGRAPH =
  "Inside the amphitheatres and innovation labs of ISIMS Sfax, 3-Zero is a student vanguard rewriting the campus blueprint. We unite computer scientists, multimedia creators, and hardware tinkerers around one radical mission: engineer decentralized prototypes that bring poverty, carbon emissions, and social exclusion to absolute zero.";

export const ParticleLogoReveal: React.FC<ParticleLogoRevealProps> = ({
  logoSrc = '/logo.png',
  configOverrides,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paragraphContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ParticleScene | null>(null);

  const activeConfig = { ...DEFAULT_PARTICLE_CONFIG, ...configOverrides };
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
  });

  // 1. Scroll Hint Fade
  const hintOpacity = useTransform(smoothProgress, [0.0, 0.08], [1, 0]);

  // 2. Description Block Container Opacity
  const descOpacity = useTransform(smoothProgress, [0.42, 0.54], [0, 1]);

  // Fallback transforms for reduced motion
  const fallbackLogoOpacity = useTransform(smoothProgress, [0.0, 0.4], [1, 0]);
  const fallbackTextOpacity = useTransform(smoothProgress, [0.4, 0.8], [0, 1]);

  // Re-measure word targets and pass to WebGL particle scene
  const syncWordMeasurements = useCallback(() => {
    if (!paragraphContainerRef.current || !sceneRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const targets = measureWordTargets(paragraphContainerRef.current, width, height);
    if (targets.length > 0) {
      sceneRef.current.updateWordTargets(targets);
    }
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !canvasRef.current) return;

    const initialTargets = paragraphContainerRef.current
      ? measureWordTargets(paragraphContainerRef.current, window.innerWidth, window.innerHeight)
      : [];

    const scene = new ParticleScene(
      canvasRef.current,
      logoSrc,
      ['3 ZERO', 'ISIMS CAMPUS'],
      initialTargets,
      activeConfig,
      () => {
        if (typeof document !== 'undefined' && document.fonts) {
          document.fonts.ready.then(() => {
            syncWordMeasurements();
          });
        }
      }
    );
    sceneRef.current = scene;

    const unsubscribe = smoothProgress.on('change', (v: number) => {
      scene.setProgress(v);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        scene.setPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let resizeTimer = 0;
    const handleResize = () => {
      scene.handleResize();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        syncWordMeasurements();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      scene.destroy();
    };
  }, [logoSrc, shouldReduceMotion, smoothProgress, syncWordMeasurements]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[300vh] bg-[#FAFCFA] selection:bg-[#3FA85B]/20"
    >
      {/* ── Sticky Pinned Fullscreen Stage ───────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Ambient Flowing Curves & Background Glow */}
        <BackgroundCurves progress={smoothProgress} />


        {/* ── Main Stage ─────────────────────────────────────────────── */}
        <div className="relative w-full h-full flex flex-col items-center justify-end pb-20 sm:pb-24 px-6 sm:px-12">

          {/* 1. WebGL GPU Particles Canvas (Shows pure particle logo at rest & animates on scroll) */}
          {!shouldReduceMotion && (
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 w-full h-full"
            />
          )}

          {/* 2. REAL CRISP HTML DESCRIPTION PARAGRAPH (Box-free, Clean & Floating) */}
          {!shouldReduceMotion && (
            <motion.div
              ref={paragraphContainerRef}
              style={{ opacity: descOpacity }}
              className="relative z-10 max-w-3xl mx-auto text-center px-4 pointer-events-auto"
            >
              <RevealParagraph
                text={CLUB_PARAGRAPH}
                progress={smoothProgress}
                range={[activeConfig.scrollRanges.descRevealStart, activeConfig.scrollRanges.descRevealEnd]}
                className="text-lg sm:text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed text-center"
              />
            </motion.div>
          )}

          {/* 3. Accessible Reduced Motion Version */}
          {shouldReduceMotion && (
            <div className="relative z-20 max-w-3xl text-center px-6">
              <motion.div style={{ opacity: fallbackLogoOpacity }} className="mb-6">
                <Image
                  src={logoSrc}
                  alt="3 ZERO Logo"
                  width={600}
                  height={220}
                  className="mx-auto object-contain"
                />
              </motion.div>
              <motion.div style={{ opacity: fallbackTextOpacity }} className="space-y-4">
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                  3 ZERO · ISIMS CAMPUS
                </h2>
                <p className="text-slate-700 text-lg sm:text-2xl max-w-2xl mx-auto font-[family-name:var(--font-space-grotesk)] leading-relaxed">
                  {CLUB_PARAGRAPH}
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* ── Scroll Prompt Indicator ────────────────────────────────── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-7 sm:bottom-9 flex flex-col items-center gap-1.5 text-xs font-mono text-slate-400 select-none z-30 pointer-events-none"
        >
          <span className="tracking-widest uppercase text-[10px] font-semibold text-slate-500">
            Scroll to disintegrate
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#3FA85B]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Screen Reader Semantic HTML */}
      <div className="sr-only">
        <h2>About 3-Zero ISIMS Campus Club</h2>
        <p>{CLUB_PARAGRAPH}</p>
      </div>
    </section>
  );
};
