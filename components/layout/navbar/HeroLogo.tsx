'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Large logo fixed in the top-left of the viewport.
 * Slides upward and fades out as the user scrolls past SCROLL_THRESHOLD px.
 */
const SCROLL_THRESHOLD = 120; // px before disappear starts
const DISAPPEAR_RANGE = 80;   // px over which it fades + slides

export const HeroLogo: React.FC = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0); // 0 = fully visible, 1 = gone
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, (y - SCROLL_THRESHOLD) / DISAPPEAR_RANGE));
      setProgress(p);
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // sync on mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const translateY = -progress * 40;
  const opacity = 1 - progress;

  if (opacity <= 0) return null;

  return (
    <>
      {/* Club badge – top-left */}
      <div
        className="fixed top-4 left-3.5 xs:left-5 sm:top-6 sm:left-7 z-50 pointer-events-none"
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.location.pathname !== '/') router.push('/');
          }}
          aria-label="3-Zero Campus Club ISIMS – Go to top"
          className="pointer-events-auto group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] rounded-xl"
          tabIndex={0}
        >
          <Image
            src="/logo.png"
            alt="3-Zero Campus Club ISIMS"
            width={220}
            height={66}
            className="h-8 xs:h-9 sm:h-12 md:h-13 w-auto object-contain drop-shadow-lg group-hover:scale-[1.03] transition-transform duration-200"
            priority
          />
        </button>
      </div>

      {/* ISIMS college logo – right edge */}
      <div
        className="fixed top-4 right-3.5 xs:right-5 sm:top-6 sm:right-7 z-50 pointer-events-none"
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          willChange: 'transform, opacity',
        }}
      >
        <Image
          src="/isims.png"
          alt="Institut Supérieur d'Informatique et de Multimédia de Sfax"
          width={220}
          height={88}
          className="h-9 xs:h-11 sm:h-14 md:h-16 w-auto object-contain drop-shadow-lg"
          priority
        />
      </div>
    </>
  );
};
