'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownDisplayProps {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isMounted: boolean;
  isHappeningNow?: boolean;
}

interface DigitBoxProps {
  label: string;
  value: string;
  isMounted: boolean;
}

const RollingDigit: React.FC<{ char: string }> = ({ char }) => {
  return (
    <div className="relative h-8 sm:h-9 w-4 sm:w-5 overflow-hidden flex items-center justify-center font-mono font-black text-lg sm:text-xl text-slate-900">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 18, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center select-none"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const DigitBox: React.FC<DigitBoxProps> = ({ label, value, isMounted }) => {
  const chars = value.split('');

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center px-1.5 py-1 rounded-lg bg-white/95 border border-slate-200/90 shadow-xs">
        {isMounted ? (
          chars.map((c, i) => <RollingDigit key={i} char={c} />)
        ) : (
          <div className="h-8 sm:h-9 w-8 sm:w-10 bg-slate-100/80 animate-pulse rounded" />
        )}
      </div>
      <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase mt-1">
        {label}
      </span>
    </div>
  );
};

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  days,
  hours,
  minutes,
  seconds,
  isMounted,
  isHappeningNow,
}) => {
  if (isHappeningNow) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8F7EE] border border-[#3FA85B]/40 shadow-xs">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA85B] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3FA85B]" />
        </span>
        <span className="text-xs font-mono font-bold tracking-wider text-[#0F4C2A] uppercase">
          EVENT HAPPENING NOW · LIVE AT ISIMS
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <DigitBox label="DAYS" value={days} isMounted={isMounted} />
      <span className="font-mono text-base font-bold text-[#3FA85B] -mt-4 select-none">:</span>
      <DigitBox label="HOURS" value={hours} isMounted={isMounted} />
      <span className="font-mono text-base font-bold text-[#3FA85B] -mt-4 select-none">:</span>
      <DigitBox label="MINS" value={minutes} isMounted={isMounted} />
      <span className="font-mono text-base font-bold text-[#3FA85B] -mt-4 select-none">:</span>
      <DigitBox label="SECS" value={seconds} isMounted={isMounted} />
    </div>
  );
};
