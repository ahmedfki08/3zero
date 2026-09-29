'use client';

import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';

interface ScrollDirectionOptions {
  threshold?: number;
  delta?: number;
}

export function useScrollDirection({
  threshold = siteConfig.tunables.scrollThreshold,
  delta = siteConfig.tunables.hideScrollDelta,
}: ScrollDirectionOptions = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollY.current = window.scrollY;
    setIsScrolled(window.scrollY > threshold);

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > threshold);

      if (Math.abs(diff) >= delta) {
        if (currentScrollY <= threshold) {
          // At top of page, always show navbar
          setIsVisible(true);
          setScrollDirection('up');
        } else if (diff > 0) {
          // Scrolling down
          setScrollDirection('down');
          setIsVisible(false);
        } else {
          // Scrolling up
          setScrollDirection('up');
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }

      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [threshold, delta]);

  return { isScrolled, scrollDirection, isVisible };
}
