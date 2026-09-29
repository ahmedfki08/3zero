'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { UpcomingEvent } from '@/types/events';
import { TicketFront } from './TicketFront';
import { TicketBack } from './TicketBack';
import { playConfirmationBeep } from '@/lib/audio/scanSound';

interface EventTicketProps {
  event: UpcomingEvent;
  ticketIndex: number;
  onSelect: (event: UpcomingEvent) => void;
}

type TicketScanState = 'idle' | 'scanning' | 'success' | 'flipped';

export const EventTicket: React.FC<EventTicketProps> = ({
  event,
  ticketIndex,
  onSelect,
}) => {
  const [scanState, setScanState] = useState<TicketScanState>('idle');
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer sheen coordinates
  const [sheenX, setSheenX] = useState('50%');
  const [sheenY, setSheenY] = useState('50%');
  const [isHovered, setIsHovered] = useState(false);

  // Formatted ticket number
  const ticketNumber = `No. ${String(ticketIndex + 1).padStart(3, '0')}`;

  // Relative time calculation
  const relativeDays = Math.max(
    1,
    Math.round((new Date(event.startUtc).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const relativeTime = `in ${relativeDays} ${relativeDays === 1 ? 'day' : 'days'}`;

  // Holographic pointer tracker
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSheenX(`${x}%`);
    setSheenY(`${y}%`);
  };

  // Scan sequence execution
  const handleStartScan = () => {
    if (scanState !== 'idle') return;

    setScanState('scanning');

    // 1. Scan light sweeps for 800ms
    setTimeout(() => {
      setScanState('success');
      playConfirmationBeep();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(25);
        } catch {}
      }

      // 2. Success flash for 250ms -> then 3D Flip
      setTimeout(() => {
        setScanState('flipped');
      }, 250);
    }, 850);
  };

  const handleFlipBack = () => {
    setScanState('idle');
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && scanState === 'flipped') {
        handleFlipBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scanState]);

  const isFlipped = scanState === 'flipped';

  return (
    <div
      ref={cardContainerRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: '1200px',
      }}
      className="relative w-full h-[210px] sm:h-[200px] select-none"
    >
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        {isFlipped
          ? `Pass details revealed for ${event.title}`
          : `Front of pass for ${event.title}`}
      </div>

      {/* ── 3D Flippable Card Frame ─────────────────────────────────── */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: shouldReduceMotion
            ? 'none'
            : isFlipped
            ? 'rotateY(180deg)'
            : 'rotateY(0deg)',
          transition: shouldReduceMotion
            ? 'opacity 0.2s ease'
            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full h-full"
      >
        {/* ── FRONT FACE ────────────────────────────────────────────── */}
        <div
          aria-hidden={isFlipped}
          inert={isFlipped ? true : undefined}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0px)',
          }}
          className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
            shouldReduceMotion && isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <TicketFront
            event={event}
            ticketNumber={ticketNumber}
            relativeTime={relativeTime}
            isScanning={scanState === 'scanning'}
            isSuccess={scanState === 'success'}
            onScan={handleStartScan}
          />

          {/* Holographic Sheen Layer (Desktop Only) */}
          {isHovered && !shouldReduceMotion && (
            <div
              aria-hidden="true"
              style={{
                background: `radial-gradient(circle 220px at ${sheenX} ${sheenY}, rgba(74, 222, 128, 0.16), rgba(255, 255, 255, 0.12), transparent 70%)`,
              }}
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay z-30 transition-opacity duration-300"
            />
          )}
        </div>

        {/* ── BACK FACE ─────────────────────────────────────────────── */}
        <div
          aria-hidden={!isFlipped}
          inert={!isFlipped ? true : undefined}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: shouldReduceMotion ? 'none' : 'rotateY(180deg) translateZ(1px)',
          }}
          className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
            shouldReduceMotion && !isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <TicketBack
            event={event}
            onFlipBack={handleFlipBack}
            onRegister={() => onSelect(event)}
          />
        </div>
      </div>
    </div>
  );
};
