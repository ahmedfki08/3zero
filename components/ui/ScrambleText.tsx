'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { DEFAULT_SCRAMBLE_CHARS } from '@/hooks/useScramble';

interface ScrambleTextProps {
  text: string;
  speed?: number;
  trigger?: 'inView' | 'mount' | 'hover' | 'manual';
  once?: boolean;
  scrambleChars?: string;
  className?: string;
  wordClassName?: string;
  as?: React.ElementType;
  wordByWord?: boolean;
  hoverRescramble?: boolean;
  active?: boolean;
}

interface WordScrambleProps {
  word: string;
  speed: number;
  scrambleChars: string;
  startDelay: number;
  shouldStart: boolean;
  hoverRescramble: boolean;
  className?: string;
}

const SingleWordScramble: React.FC<WordScrambleProps> = ({
  word,
  speed,
  scrambleChars,
  startDelay,
  shouldStart,
  hoverRescramble,
  className = '',
}) => {
  const [displayed, setDisplayed] = useState<string>(word);
  const [isScrambling, setIsScrambling] = useState(false);
  const hasTriggeredRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const runScramble = useCallback(
    (customSpeed = speed) => {
      if (checkReducedMotion()) {
        setDisplayed(word);
        return;
      }

      setIsScrambling(true);
      let step = 0;
      const totalSteps = word.length * 2.5;

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setDisplayed(() => {
          return word
            .split('')
            .map((char, i) => {
              if (char === ' ' || !/[a-zA-Z0-9—]/.test(char)) return char;
              if (i < step / 2.5) return word[i];
              return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            })
            .join('');
        });

        step += 1;

        if (step >= totalSteps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayed(word);
          setIsScrambling(false);
        }
      }, customSpeed);
    },
    [word, speed, scrambleChars]
  );

  useEffect(() => {
    if (shouldStart && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        runScramble();
      }, startDelay);
      return () => clearTimeout(timer);
    }
  }, [shouldStart, startDelay, runScramble]);

  const handleMouseEnter = () => {
    if (hoverRescramble && !isScrambling) {
      runScramble(25);
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`inline-block transition-colors duration-200 cursor-default select-none ${
        isScrambling ? 'text-[#3FA85B] font-mono' : ''
      } ${className}`}
    >
      {displayed}
    </span>
  );
};

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  speed = 28,
  trigger = 'inView',
  once = true,
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  className = '',
  wordClassName = '',
  as: Component = 'span',
  wordByWord = true,
  hoverRescramble = true,
  active = true,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once, margin: '-40px' });

  const shouldTrigger = trigger === 'inView' ? isInView : active;

  const words = text.split(' ');

  return (
    <Component
      ref={containerRef}
      className={`relative inline ${className}`}
      aria-label={text}
    >
      {/* Accessible DOM text for SEO and Screen Readers */}
      <span className="sr-only">{text}</span>

      {/* Visual Scrambled Rendering */}
      <span aria-hidden="true" className="inline">
        {wordByWord ? (
          words.map((word, idx) => (
            <React.Fragment key={`${word}-${idx}`}>
              <SingleWordScramble
                word={word}
                speed={speed}
                scrambleChars={scrambleChars}
                startDelay={idx * 45} // Stagger words as they decode
                shouldStart={shouldTrigger}
                hoverRescramble={hoverRescramble}
                className={wordClassName}
              />
              {idx < words.length - 1 && ' '}
            </React.Fragment>
          ))
        ) : (
          <SingleWordScramble
            word={text}
            speed={speed}
            scrambleChars={scrambleChars}
            startDelay={0}
            shouldStart={shouldTrigger}
            hoverRescramble={hoverRescramble}
            className={wordClassName}
          />
        )}
      </span>
    </Component>
  );
};
