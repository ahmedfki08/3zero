'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { siteConfig } from '@/config/site';

export const FooterWordmark: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px 0px 0px' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
  }, []);

  const wordmarkLetters = siteConfig.footer.wordmark.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : siteConfig.tunables.wordmarkLetterStagger,
      },
    },
  };

  const letterVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: '60%' },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none pointer-events-none mt-12 sm:mt-16 -mb-6 sm:-mb-10 md:-mb-14"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex items-center justify-between w-full text-center font-black uppercase font-mono tracking-tighter text-emerald-950/20 leading-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(3.5rem, 16vw, 18rem)',
        }}
      >
        {wordmarkLetters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterVariants}
            className="inline-block transition-colors duration-500 hover:text-emerald-500/30"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
