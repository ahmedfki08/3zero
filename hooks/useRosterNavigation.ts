'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { StaffMember } from '@/types/staff';
import { defaultStaffConfig, StaffSectionConfig } from '@/components/sections/staff/staffConfig';

export function useRosterNavigation(
  members: StaffMember[],
  config: StaffSectionConfig = defaultStaffConfig
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = forward/down, -1 = backward/up
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or clamp index when members array changes
  useEffect(() => {
    setCurrentIndex(0);
    setDirection(1);
  }, [members]);

  const selectMember = useCallback((index: number) => {
    if (members.length === 0) return;
    if (index === currentIndex || index < 0 || index >= members.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex, members.length]);

  const selectNext = useCallback(() => {
    if (members.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  const selectPrev = useCallback(() => {
    if (members.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  // Hover with intent delay
  const handleHoverIntent = useCallback((index: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (index === currentIndex || members.length === 0) return;

    hoverTimerRef.current = setTimeout(() => {
      selectMember(index);
    }, config.hoverIntentDelayMs);
  }, [currentIndex, config.hoverIntentDelayMs, selectMember, members.length]);

  const handleHoverCancel = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // Keyboard navigation for tablist
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (members.length === 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      selectNext();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      selectPrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectMember(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectMember(members.length - 1);
    }
  }, [selectNext, selectPrev, selectMember, members.length]);

  // Swipe handling on touch
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || members.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Minimum swipe threshold (40px) and angle constraint (<45 deg horizontal)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        selectNext();
      } else {
        selectPrev();
      }
    }
  }, [selectNext, selectPrev, members.length]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const safeIndex = members.length > 0 ? Math.min(currentIndex, members.length - 1) : 0;
  const activeMember = members[safeIndex] || members[0] || null;

  return {
    currentIndex: safeIndex,
    activeMember,
    direction,
    selectMember,
    selectNext,
    selectPrev,
    handleHoverIntent,
    handleHoverCancel,
    handleKeyDown,
    onTouchStart,
    onTouchEnd,
  };
}
