'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ScrollProgressProps {
  height?: number;
  className?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  height = 2,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const calculated = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setProgress(calculated);
      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-inline-0 bottom-0 pointer-events-none overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full w-full bg-gradient-to-r from-[#3FA85B] via-[#4ADE80] to-[#10B981] origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transition: 'transform 80ms linear',
        }}
      />
    </div>
  );
};
