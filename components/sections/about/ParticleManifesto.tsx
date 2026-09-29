'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowDown, MapPin, Compass } from 'lucide-react';

interface ParticleManifestoProps {
  className?: string;
}

const STAGES = [
  { id: 'scatter-entry', label: '00 // SCATTERED ZEROS' },
  { id: '3-zero', label: '01 // 3 ZERO' },
  { id: 'zero-poverty', label: '02 // ZERO POVERTY' },
  { id: 'zero-carbon', label: '03 // ZERO CARBON' },
  { id: 'zero-exclusion', label: '04 // ZERO EXCLUSION' },
  { id: 'dissolve', label: '05 // RELEASE TO CHAPTERS' },
];

export const ParticleManifesto: React.FC<ParticleManifestoProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Scroll tracking across pinned container (350vh total scroll distance)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Config particle counts: ~2000 on desktop, ~650 on mobile
    const isMobile = window.innerWidth < 768;
    const NUM_PARTICLES = isMobile ? 650 : 2200;

    // Typed arrays for particle simulation
    const posX = new Float32Array(NUM_PARTICLES);
    const posY = new Float32Array(NUM_PARTICLES);
    const velX = new Float32Array(NUM_PARTICLES);
    const velY = new Float32Array(NUM_PARTICLES);
    const originX = new Float32Array(NUM_PARTICLES);
    const originY = new Float32Array(NUM_PARTICLES);
    const phase = new Float32Array(NUM_PARTICLES);
    const spriteIdx = new Uint8Array(NUM_PARTICLES);
    const baseAlpha = new Float32Array(NUM_PARTICLES);

    // Target position buffers for each stage (6 stages: 0 to 5)
    // Stage 0: scattered, 1: "3 ZERO", 2: "ZERO POVERTY", 3: "ZERO CARBON", 4: "ZERO EXCLUSION", 5: release scatter
    const targets = Array.from({ length: 6 }, () => ({
      x: new Float32Array(NUM_PARTICLES),
      y: new Float32Array(NUM_PARTICLES),
      alpha: new Float32Array(NUM_PARTICLES),
    }));

    // Mouse / Touch repulsion state
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseRadius = isMobile ? 80 : 130;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    // 1. Create Pre-rendered Sprites for "0" glyphs (Massive performance boost over ctx.fillText)
    const sprites: HTMLCanvasElement[] = [];
    const spriteColors = ['#3FA85B', '#0F4C2A', '#10B981', '#4EBA6F', '#06B6D4', '#2E7D47'];
    const spriteSizes = isMobile ? [9, 12, 14, 16] : [11, 14, 17, 21];

    spriteColors.forEach((color) => {
      spriteSizes.forEach((fontSize) => {
        const spriteCanvas = document.createElement('canvas');
        const sDpr = 2;
        const pad = 6;
        const boxSize = fontSize * 2 + pad * 2;
        spriteCanvas.width = boxSize * sDpr;
        spriteCanvas.height = boxSize * sDpr;

        const sCtx = spriteCanvas.getContext('2d');
        if (sCtx) {
          sCtx.scale(sDpr, sDpr);
          sCtx.font = `900 ${fontSize}px var(--font-oswald), "Oswald", -apple-system, sans-serif`;
          sCtx.textAlign = 'center';
          sCtx.textBaseline = 'middle';
          sCtx.fillStyle = color;
          sCtx.fillText('0', boxSize / 2, boxSize / 2);
        }
        sprites.push(spriteCanvas);
      });
    });

    // 2. Offscreen Text Sampler to generate point grids
    const sampleTextToPoints = (
      textLines: string[],
      canvasW: number,
      canvasH: number,
      targetArray: { x: Float32Array; y: Float32Array; alpha: Float32Array }
    ) => {
      const offscreen = document.createElement('canvas');
      const offW = Math.min(canvasW, 1400);
      const offH = Math.min(canvasH, 800);
      offscreen.width = offW;
      offscreen.height = offH;

      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.clearRect(0, 0, offW, offH);

      // Determine font size
      const maxLen = Math.max(...textLines.map((l) => l.length));
      const baseFontSize = isMobile
        ? Math.min(offW / (maxLen * 0.7), 64)
        : Math.min(offW / (maxLen * 0.65), 110);

      offCtx.font = `900 ${baseFontSize}px var(--font-oswald), "Oswald", -apple-system, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#000000';

      const lineHeight = baseFontSize * 1.15;
      const totalTextHeight = textLines.length * lineHeight;
      const startY = offH / 2 - totalTextHeight / 2 + lineHeight / 2;

      textLines.forEach((line, idx) => {
        offCtx.fillText(line, offW / 2, startY + idx * lineHeight);
      });

      // Sample pixels
      const imgData = offCtx.getImageData(0, 0, offW, offH);
      const data = imgData.data;
      const points: { x: number; y: number }[] = [];

      // Adaptive sampling step based on particle count
      const step = isMobile ? 3 : 4;

      for (let y = 0; y < offH; y += step) {
        for (let x = 0; x < offW; x += step) {
          const alphaIndex = (y * offW + x) * 4 + 3;
          if (data[alphaIndex] > 120) {
            points.push({
              x: x + (canvasW - offW) / 2,
              y: y + (canvasH - offH) / 2,
            });
          }
        }
      }

      // Shuffle points for organic distribution
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
      }

      // Populate target arrays
      for (let i = 0; i < NUM_PARTICLES; i++) {
        if (i < points.length) {
          // Point belongs to the text
          targetArray.x[i] = points[i].x;
          targetArray.y[i] = points[i].y;
          targetArray.alpha[i] = 0.95;
        } else {
          // Extra floating ambient zeros surrounding the text
          const angle = Math.random() * Math.PI * 2;
          const dist = 300 + Math.random() * Math.max(canvasW, canvasH) * 0.4;
          targetArray.x[i] = canvasW / 2 + Math.cos(angle) * dist;
          targetArray.y[i] = canvasH / 2 + Math.sin(angle) * dist;
          targetArray.alpha[i] = 0.18; // Soft ambient background alpha
        }
      }
    };

    // 3. Initialize / Recompute All Target Stages
    const setupStages = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Stage 0: Initial Scatter
      for (let i = 0; i < NUM_PARTICLES; i++) {
        targets[0].x[i] = Math.random() * width;
        targets[0].y[i] = Math.random() * height;
        targets[0].alpha[i] = 0.35 + Math.random() * 0.45;
      }

      // Stage 1: "3 ZERO"
      sampleTextToPoints(['3 ZERO'], width, height, targets[1]);

      // Stage 2: "ZERO POVERTY"
      sampleTextToPoints(['ZERO', 'POVERTY'], width, height, targets[2]);

      // Stage 3: "ZERO CARBON"
      sampleTextToPoints(['ZERO', 'CARBON'], width, height, targets[3]);

      // Stage 4: "ZERO EXCLUSION"
      sampleTextToPoints(['ZERO', 'EXCLUSION'], width, height, targets[4]);

      // Stage 5: Dissolve / Scatter into Next Section
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(width, height) * 0.9;
        targets[5].x[i] = width / 2 + Math.cos(angle) * radius;
        targets[5].y[i] = height / 2 + Math.sin(angle) * radius + height * 0.3; // drifting downward
        targets[5].alpha[i] = 0.1 + Math.random() * 0.3;
      }

      // Initial positions for particles
      for (let i = 0; i < NUM_PARTICLES; i++) {
        posX[i] = targets[0].x[i];
        posY[i] = targets[0].y[i];
        originX[i] = targets[0].x[i];
        originY[i] = targets[0].y[i];
        velX[i] = 0;
        velY[i] = 0;
        phase[i] = Math.random() * Math.PI * 2;
        spriteIdx[i] = Math.floor(Math.random() * sprites.length);
        baseAlpha[i] = 0.3 + Math.random() * 0.6;
      }
    };

    setupStages();

    // Resize listener with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupStages();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Pointer movement tracking
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave);

    // Touch support (soft repulsion without blocking scroll)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    };
    const handleTouchEnd = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Visibility Observer to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 4. Main Physics & Render Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) {
        lastTime = currentTime;
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // Calculate current scroll progress (0.0 to 1.0)
      const progress = scrollYProgress.get();

      // Determine active stage transition
      // Stage 0: 0.00 - 0.16 (Scatter)
      // Stage 1: 0.16 - 0.36 ("3 ZERO")
      // Stage 2: 0.36 - 0.54 ("ZERO POVERTY")
      // Stage 3: 0.54 - 0.72 ("ZERO CARBON")
      // Stage 4: 0.72 - 0.88 ("ZERO EXCLUSION")
      // Stage 5: 0.88 - 1.00 (Dissolve / Release)
      const stageBreakpoints = [0.0, 0.18, 0.38, 0.58, 0.76, 0.92, 1.0];
      let fromStage = 0;
      let toStage = 0;
      let stageT = 0;

      for (let s = 0; s < stageBreakpoints.length - 1; s++) {
        if (progress >= stageBreakpoints[s] && progress <= stageBreakpoints[s + 1]) {
          fromStage = s;
          toStage = Math.min(s + 1, 5);
          const range = stageBreakpoints[s + 1] - stageBreakpoints[s];
          const localT = (progress - stageBreakpoints[s]) / range;

          // Smooth cosine interpolation between stages
          stageT = 0.5 - 0.5 * Math.cos(localT * Math.PI);
          break;
        }
      }

      // Update current stage state for UI labels
      const activeStageIdx = Math.min(Math.floor(progress * 5.5), 5);
      setCurrentStageIdx(activeStageIdx);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Physics parameters
      const spring = 4.2;
      const damping = 0.78;
      const repelStrength = isMobile ? 320 : 540;
      const time = currentTime * 0.002;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        // Individual organic stagger offset
        const particleStagger = (Math.sin(phase[i] + time) + 1) * 0.08;
        const staggeredT = Math.max(0, Math.min(1, stageT + particleStagger - 0.04));

        // Interpolated Target Coordinates
        const fromTargetX = targets[fromStage].x[i];
        const fromTargetY = targets[fromStage].y[i];
        const toTargetX = targets[toStage].x[i];
        const toTargetY = targets[toStage].y[i];

        const targetX = fromTargetX + (toTargetX - fromTargetX) * staggeredT;
        const targetY = fromTargetY + (toTargetY - fromTargetY) * staggeredT;

        // Target Alpha
        const fromAlpha = targets[fromStage].alpha[i];
        const toAlpha = targets[toStage].alpha[i];
        const curAlpha = fromAlpha + (toAlpha - fromAlpha) * staggeredT;

        // Floating ambient drift
        const driftX = Math.sin(time + phase[i]) * 1.5;
        const driftY = Math.cos(time * 0.8 + phase[i]) * 1.5;

        // Spring Force toward Target
        const ax = (targetX + driftX - posX[i]) * spring;
        const ay = (targetY + driftY - posY[i]) * spring;

        velX[i] = (velX[i] + ax * dt) * damping;
        velY[i] = (velY[i] + ay * dt) * damping;

        // Pointer Repulsion Physics (Spatial radius check)
        const dx = posX[i] - mouseX;
        const dy = posY[i] - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius) * repelStrength * dt;
          velX[i] += (dx / dist) * force;
          velY[i] += (dy / dist) * force;
        }

        // Apply velocities to positions
        posX[i] += velX[i];
        posY[i] += velY[i];

        // Draw Pre-rendered Sprite
        const sprite = sprites[spriteIdx[i]];
        const sW = sprite.width / 4;
        const sH = sprite.height / 4;

        ctx.globalAlpha = Math.max(0.05, Math.min(1, curAlpha));
        ctx.drawImage(sprite, posX[i] - sW / 2, posY[i] - sH / 2, sW, sH);
      }

      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      observer.disconnect();
    };
  }, [isReducedMotion, scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[360vh] bg-[#FAFCFA] ${className}`}
    >
      {/* Pinned Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
        {/* Ambient background gradients */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#3FA85B]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top HUD / Live Assembly Status */}
        <div className="relative z-20 flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA85B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FA85B]" />
            </span>
            <span className="text-[#0F4C2A] font-bold">LIVING PARTICLE MANIFESTO</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-semibold">{STAGES[currentStageIdx]?.label}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200">
            <Compass className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>INTERACTIVE FIELD • REPEL WITH CURSOR</span>
          </div>
        </div>

        {/* The Particle Canvas (Aria Hidden for clean accessibility) */}
        {!isReducedMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-10"
            aria-hidden="true"
          />
        )}

        {/* Reduced Motion Accessible Fallback */}
        {isReducedMotion && (
          <div className="relative z-10 my-auto max-w-4xl mx-auto text-center space-y-6 pointer-events-auto">
            <h2 className="text-5xl sm:text-7xl font-black font-sans text-slate-900 uppercase tracking-tight">
              3 <span className="text-[#3FA85B]">ZERO</span>
            </h2>
            <div className="space-y-2 text-2xl sm:text-3xl font-serif text-slate-700 italic">
              <p>Zero Poverty: Transforming job seekers into social enterprise architects.</p>
              <p>Zero Carbon: Net-negative campus footprint & circular hardware.</p>
              <p>Zero Exclusion: Universal digital accessibility & assistive technology.</p>
            </div>
          </div>
        )}

        {/* Bottom Scroll Prompt / Stage Tracker */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto pt-4 border-t border-slate-200/50">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>ISIMS SFAX CAMPUS NODE • 34.7406° N</span>
          </div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/90 px-3.5 py-1 rounded-full border border-slate-200 shadow-sm"
          >
            <span>SCROLL TO SHIFT MANIFESTO</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#3FA85B]" />
          </motion.div>
        </div>
      </div>

      {/* Real Semantic Content for SEO and Screen Readers */}
      <div className="sr-only">
        <h2>3-Zero ISIMS Campus Manifesto</h2>
        <p>
          We believe poverty, climate degradation, and exclusion are design flaws of an outdated
          system. As student engineers at ISIMS, we rewrite the architecture to absolute zero.
        </p>
        <section>
          <h3>Zero Poverty</h3>
          <p>
            Dismantling economic disparity through student-led micro-initiatives, peer financial
            literacy tech, and seed-stage social entrepreneurship.
          </p>
        </section>
        <section>
          <h3>Zero Carbon</h3>
          <p>
            Combining embedded IoT hardware, circular waste software, and student action to
            decarbonize university facilities.
          </p>
        </section>
        <section>
          <h3>Zero Exclusion</h3>
          <p>
            Designing assistive multimedia tech, open-access tech bootcamps, and universal design
            frameworks.
          </p>
        </section>
      </div>
    </div>
  );
};
