'use client';

import type Lenis from 'lenis';

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Smoothly and reliably scrolls to a target section by ID or selector.
 * Integrates with Lenis if active, calculating a graceful duration that
 * allows GPU scenes (like the particle logo reveal in AboutUs) to interpolate
 * cleanly without stutter or visual jumps.
 */
export function scrollToTarget(
  target: string | HTMLElement,
  options: ScrollToOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const { offset = 80, immediate = false } = options;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isImmediate = immediate || prefersReduced;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const currentScrollY = window.scrollY;

  // 1. Handle top/hero shortcut
  if (target === 'top' || target === '0') {
    const scrollDistance = currentScrollY;
    const duration = options.duration ?? Math.min(2.4, Math.max(1.6, (scrollDistance / 1500) * 1.6));

    if (lenis && !isImmediate) {
      lenis.scrollTo(0, { duration, immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: isImmediate ? 'instant' : 'smooth' });
    }
    return;
  }

  // 2. Resolve DOM element
  let element: HTMLElement | null = null;

  if (typeof target === 'string') {
    const cleanId = target.replace(/^#/, '');
    if (cleanId === 'hero') {
      const scrollDistance = currentScrollY;
      const duration = options.duration ?? Math.min(2.4, Math.max(1.6, (scrollDistance / 1500) * 1.6));

      if (lenis && !isImmediate) {
        lenis.scrollTo(0, { duration, immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: isImmediate ? 'instant' : 'smooth' });
      }
      return;
    }

    element = document.getElementById(cleanId) || document.querySelector(target);
  } else {
    element = target;
  }

  if (!element) {
    console.warn(`[scrollToTarget] Target element not found:`, target);
    return;
  }

  // 3. Compute target position & distance
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + currentScrollY;
  const targetScrollY = Math.max(0, absoluteElementTop - offset);
  const scrollDistance = Math.abs(targetScrollY - currentScrollY);

  // Slower, graceful scroll (1.8s - 2.5s) to let pinned WebGL particle scenes animate smoothly
  const duration = options.duration ?? Math.min(2.5, Math.max(1.8, (scrollDistance / 1200) * 1.6));

  if (lenis && !isImmediate) {
    lenis.scrollTo(element, {
      offset: -offset,
      duration,
      immediate: false,
    });
  } else {
    window.scrollTo({
      top: targetScrollY,
      behavior: isImmediate ? 'instant' : 'smooth',
    });
  }
}
