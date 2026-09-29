'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseScrambleOptions {
  speed?: number; // ms per frame
  scrambleChars?: string;
  trigger?: 'mount' | 'manual';
  once?: boolean;
  onComplete?: () => void;
  revealDuration?: number; // total ms to reveal
}

// 3-Zero themed scramble character set emphasizing zeros and symbols
export const DEFAULT_SCRAMBLE_CHARS = '0ØøO0#/_<>[]{}*+~=!0';

export function useScramble(text: string, options: UseScrambleOptions = {}) {
  const {
    speed = 30,
    scrambleChars = DEFAULT_SCRAMBLE_CHARS,
    trigger = 'mount',
    once = true,
    onComplete,
  } = options;

  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [hasScrambled, setHasScrambled] = useState<boolean>(false);
  
  const frameRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const scramble = useCallback(() => {
    if (checkReducedMotion()) {
      setDisplayText(text);
      setIsScrambling(false);
      setHasScrambled(true);
      onComplete?.();
      return;
    }

    if (once && hasScrambled && isScrambling) {
      return;
    }

    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length * 3; // roughly 3 scrambles per character before lock

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            // If the character's turn to resolve has passed
            if (index < iteration / 3) {
              return text[index];
            }
            // Otherwise pick a random scramble char
            const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            return randomChar;
          })
          .join('');
      });

      iteration += 1;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
        setHasScrambled(true);
        onComplete?.();
      }
    }, speed);
  }, [text, speed, scrambleChars, once, hasScrambled, isScrambling, onComplete, checkReducedMotion]);

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, scramble]);

  return {
    displayText,
    isScrambling,
    hasScrambled,
    scramble,
  };
}
