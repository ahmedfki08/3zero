'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { defaultStaffConfig, StaffSectionConfig } from '@/components/sections/staff/staffConfig';

export interface ParallaxLayers {
  bgX: MotionValue<number>;
  bgY: MotionValue<number>;
  portraitX: MotionValue<number>;
  portraitY: MotionValue<number>;
  fgX: MotionValue<number>;
  fgY: MotionValue<number>;
}

export function usePointerParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  config: StaffSectionConfig = defaultStaffConfig
): ParallaxLayers {
  // Raw normalized pointer coordinates from -1 to 1
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs for high performance tracking
  const springX = useSpring(rawX, config.parallax.springConfig);
  const springY = useSpring(rawY, config.parallax.springConfig);

  // Derived layer displacements
  const bgX = useTransform(springX, [-1, 1], [-config.parallax.layerBackground.x, config.parallax.layerBackground.x]);
  const bgY = useTransform(springY, [-1, 1], [-config.parallax.layerBackground.y, config.parallax.layerBackground.y]);

  const portraitX = useTransform(springX, [-1, 1], [-config.parallax.layerPortrait.x, config.parallax.layerPortrait.x]);
  const portraitY = useTransform(springY, [-1, 1], [-config.parallax.layerPortrait.y, config.parallax.layerPortrait.y]);

  const fgX = useTransform(springX, [-1, 1], [-config.parallax.layerForeground.x, config.parallax.layerForeground.x]);
  const fgY = useTransform(springY, [-1, 1], [-config.parallax.layerForeground.y, config.parallax.layerForeground.y]);

  const lastMoveRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion or is purely touch
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (isTouchDevice || e.pointerType === 'touch') return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Clamp between -1 and 1
      rawX.set(Math.max(-1, Math.min(1, x)));
      rawY.set(Math.max(-1, Math.min(1, y)));
      lastMoveRef.current = Date.now();
    };

    const handlePointerLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Subtle idle float when pointer is resting
    let startTimestamp = performance.now();
    const animateIdle = (now: number) => {
      const elapsed = (now - startTimestamp) / 1000;
      const idleTime = Date.now() - lastMoveRef.current;

      // If resting for more than 500ms, apply tiny gentle sine float
      if (idleTime > 500 && !isTouchDevice && !prefersReducedMotion) {
        const sineVal = Math.sin((elapsed * 2 * Math.PI) / config.idleFloatPeriod);
        const floatDelta = (sineVal * config.idleFloatAmplitude) / 40;
        // Subtle additive micro drift
        rawY.set(rawY.get() * 0.95 + floatDelta * 0.05);
      }

      rafRef.current = requestAnimationFrame(animateIdle);
    };

    rafRef.current = requestAnimationFrame(animateIdle);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, config, rawX, rawY]);

  return { bgX, bgY, portraitX, portraitY, fgX, fgY };
}
