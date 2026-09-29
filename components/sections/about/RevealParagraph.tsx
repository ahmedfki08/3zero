'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface RevealParagraphProps {
  text: string;
  progress: MotionValue<number>;
  range?: [number, number]; // Scroll progress window [start, end]
  className?: string;
}

interface RevealWordProps {
  word: string;
  index: number;
  totalWords: number;
  progress: MotionValue<number>;
  range: [number, number];
}

const RevealWord: React.FC<RevealWordProps> = ({
  word,
  index,
  totalWords,
  progress,
  range,
}) => {
  const [start, end] = range;
  const wordStart = start + (index / totalWords) * (end - start);
  const wordEnd = start + ((index + 1) / totalWords) * (end - start);
  const arrivalMid = (wordStart + wordEnd) * 0.5;

  // 1. Opacity: 0 -> 1 as particles arrive
  const opacity = useTransform(progress, [wordStart, wordEnd], [0, 1]);

  // 2. Blur to Sharp transition
  const blurVal = useTransform(progress, [wordStart, wordEnd], [6, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  // 3. Subtle upward settle
  const y = useTransform(progress, [wordStart, wordEnd], [8, 0]);

  // 4. Momentary soft emerald glow flash right at arrival
  const textShadow = useTransform(progress, (p) => {
    if (p < wordStart || p > wordEnd + 0.04) return 'none';
    const dist = Math.abs(p - arrivalMid);
    const flashIntensity = Math.max(0, 1 - dist / 0.025);
    return flashIntensity > 0.05
      ? `0 0 ${16 * flashIntensity}px rgba(63, 168, 91, ${0.9 * flashIntensity})`
      : 'none';
  });

  const isKeyword =
    word.includes('3-Zero') ||
    word.includes('ISIMS') ||
    word.includes('zero') ||
    word.includes('Zero') ||
    word.includes('vanguard') ||
    word.includes('poverty') ||
    word.includes('carbon') ||
    word.includes('exclusion');

  return (
    <motion.span
      data-word-idx={index}
      style={{
        opacity,
        filter,
        y,
        textShadow,
      }}
      className={`inline-block mr-[0.34em] select-text will-change-transform transition-colors ${isKeyword
        ? 'font-bold text-[#0F4C2A]'
        : 'font-normal text-slate-900'
        }`}
    >
      {word}
    </motion.span>
  );
};

export const RevealParagraph: React.FC<RevealParagraphProps> = ({
  text,
  progress,
  range = [0.50, 0.80],
  className = '',
}) => {
  const words = text.split(' ');

  return (
    <p
      className={`font-[family-name:var(--font-space-grotesk)] text-lg sm:text-2xl md:text-3xl leading-relaxed select-text ${className}`}
    >
      {words.map((word, idx) => (
        <RevealWord
          key={`${word}-${idx}`}
          word={word}
          index={idx}
          totalWords={words.length}
          progress={progress}
          range={range}
        />
      ))}
    </p>
  );
};
