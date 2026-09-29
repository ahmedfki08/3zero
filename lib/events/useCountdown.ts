'use client';

import { useState, useEffect, useRef } from 'react';

export interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  isMounted: boolean;
  isHappeningNow: boolean;
  isEnded: boolean;
}

// Global timer subscribers map
type Subscriber = (now: number) => void;
const subscribers = new Set<Subscriber>();
let globalIntervalId: NodeJS.Timeout | null = null;

function ensureTimerRunning() {
  if (globalIntervalId !== null || typeof window === 'undefined') return;

  const tick = () => {
    if (document.hidden) return; // Pause when tab is inactive
    const now = Date.now();
    subscribers.forEach((fn) => fn(now));
  };

  globalIntervalId = setInterval(tick, 1000);

  // Resume immediately on visibility return
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      tick();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

function checkStopTimer() {
  if (subscribers.size === 0 && globalIntervalId !== null) {
    clearInterval(globalIntervalId);
    globalIntervalId = null;
  }
}

export function useCountdown(startUtc: string, endUtc?: string): CountdownTime {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  const targetStartTime = useRef(new Date(startUtc).getTime()).current;
  const targetEndTime = useRef(endUtc ? new Date(endUtc).getTime() : targetStartTime + 86400000).current;

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(Date.now());

    const updateSubscriber: Subscriber = (now) => {
      setCurrentTime(now);
    };

    subscribers.add(updateSubscriber);
    ensureTimerRunning();

    return () => {
      subscribers.delete(updateSubscriber);
      checkStopTimer();
    };
  }, []);

  if (!isMounted) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      totalSeconds: 0,
      isMounted: false,
      isHappeningNow: false,
      isEnded: false,
    };
  }

  const diffToStart = Math.max(0, targetStartTime - currentTime);
  const totalSeconds = Math.floor(diffToStart / 1000);

  const isHappeningNow = currentTime >= targetStartTime && currentTime <= targetEndTime;
  const isEnded = currentTime > targetEndTime;

  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return {
    days: d.toString().padStart(2, '0'),
    hours: h.toString().padStart(2, '0'),
    minutes: m.toString().padStart(2, '0'),
    seconds: s.toString().padStart(2, '0'),
    totalSeconds,
    isMounted: true,
    isHappeningNow,
    isEnded,
  };
}
