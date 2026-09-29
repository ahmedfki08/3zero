'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { POLAROID_PHOTOS } from '@/content/about';
import { Camera, Sparkles, RotateCcw, Move, MapPin, Calendar, Sparkle } from 'lucide-react';

export const PolaroidWall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topZIndex, setTopZIndex] = useState<number>(20);
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    POLAROID_PHOTOS.forEach((p, idx) => {
      initial[p.id] = idx + 1;
    });
    return initial;
  });
  const [resetKey, setResetKey] = useState<number>(0);

  const bringToFront = (id: string) => {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setZIndices((prev) => ({
      ...prev,
      [id]: nextZ,
    }));
  };

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="relative py-24 sm:py-32 bg-[#FAFCFA] border-t border-slate-200/80 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3FA85B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-3 font-bold">
              <Camera className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>COMMUNITY ARCHIVE // 9 INTERACTIVE POLAROIDS</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              CAMPUS <span className="text-[#3FA85B]">MOMENTS & LABS</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm">
              <Move className="w-3.5 h-3.5 text-[#3FA85B] animate-pulse" />
              <span>Drag any card, throw it around, then hit Tidy Board to reset.</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-[#3FA85B] text-slate-700 hover:text-[#0F4C2A] text-xs font-mono font-bold shadow-sm transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>Tidy Board</span>
            </button>
          </div>
        </div>

        {/* Polaroid Drag Board Container */}
        <div
          ref={containerRef}
          key={resetKey}
          className="relative w-full rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-4 sm:p-8 lg:p-10 overflow-hidden select-none"
        >
          {/* Branded Center Watermark: Official Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 select-none z-0 p-4 sm:p-6">
            <div className="relative w-full max-w-[400px] sm:max-w-[720px] md:max-w-[920px] h-36 sm:h-64 md:h-80">
              <Image
                src="/logo.png"
                alt="3 ZERO Campus Club ISIMS Logo"
                fill
                sizes="(max-width: 768px) 500px, 900px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Structured 3x3 Polaroid Board with Natural Tilts and Full Drag Freedom */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 place-items-center">
            {POLAROID_PHOTOS.map((photo, idx) => {
              const currentZ = zIndices[photo.id] || idx + 1;

              return (
                <motion.div
                  key={photo.id}
                  drag
                  dragConstraints={containerRef}
                  dragElastic={0.15}
                  dragTransition={{
                    power: 0.25,
                    timeConstant: 220,
                  }}
                  onDragStart={() => bringToFront(photo.id)}
                  onPointerDown={() => bringToFront(photo.id)}
                  whileHover={{ scale: 1.04, cursor: 'grab' }}
                  whileDrag={{ scale: 1.08, cursor: 'grabbing', rotate: 0 }}
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    rotate: photo.initialPos.rotate,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    rotate: photo.initialPos.rotate,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 22,
                    delay: idx * 0.05,
                  }}
                  style={{
                    zIndex: currentZ,
                  }}
                  className="relative w-full max-w-[280px] xs:max-w-[310px] bg-white p-3.5 xs:p-4 pb-5 xs:pb-6 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-slate-200/90 group"
                >
                  {/* Tape decoration on top edge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 border border-amber-200/60 rounded-sm transform -rotate-1 opacity-75 pointer-events-none shadow-sm" />

                  {/* Polaroid Photo Frame */}
                  <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-100">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.alt}
                      fill
                      sizes="350px"
                      className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge tag on top right */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white font-bold tracking-wide">
                      {photo.tag}
                    </div>
                  </div>

                  {/* Polaroid Caption and Handwriting Style */}
                  <div className="px-1 space-y-1.5">
                    <div className="text-sm font-bold text-slate-900 font-sans line-clamp-1">
                      {photo.title}
                    </div>
                    <p className="text-xs text-slate-600 font-serif italic line-clamp-2 leading-relaxed">
                      “{photo.caption}”
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <MapPin className="w-3 h-3 text-[#3FA85B]" />
                        {photo.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Calendar className="w-3 h-3 text-[#3FA85B]" />
                        {photo.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
