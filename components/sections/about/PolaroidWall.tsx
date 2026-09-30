'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { POLAROID_PHOTOS } from '@/content/about';
import {
  Camera,
  RotateCcw,
  Move,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Layers,
  LayoutGrid,
  Shuffle,
  Sparkles,
} from 'lucide-react';

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

  // Mobile state: active index & mobile view mode
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mobileViewMode, setMobileViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Lightbox modal state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

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

  const handleNextMobile = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % POLAROID_PHOTOS.length);
  }, []);

  const handlePrevMobile = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + POLAROID_PHOTOS.length) % POLAROID_PHOTOS.length);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % POLAROID_PHOTOS.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + POLAROID_PHOTOS.length) % POLAROID_PHOTOS.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  const activePhoto = POLAROID_PHOTOS[activeIndex];
  const selectedPhoto = selectedPhotoIndex !== null ? POLAROID_PHOTOS[selectedPhotoIndex] : null;

  return (
    <div className="relative py-16 sm:py-24 lg:py-32 bg-[#FAFCFA] border-t border-slate-200/80 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[#3FA85B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-3 font-bold">
              <Camera className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>COMMUNITY ARCHIVE // {POLAROID_PHOTOS.length} MOMENTS & LABS</span>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase">
              CAMPUS <span className="text-[#3FA85B]">MOMENTS & LABS</span>
            </h3>
          </div>

          {/* Desktop & Tablet Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm">
              <Move className="w-3.5 h-3.5 text-[#3FA85B] animate-pulse" />
              <span>Drag any polaroid, or click to enlarge</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-[#3FA85B] text-slate-700 hover:text-[#0F4C2A] text-xs font-mono font-bold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              title="Reset cards positions"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>Tidy Board</span>
            </button>
          </div>

          {/* Mobile Quick Mode Toggle */}
          <div className="flex sm:hidden items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobileViewMode === 'carousel'
                    ? 'bg-white text-[#0F4C2A] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>Swipe Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  mobileViewMode === 'grid'
                    ? 'bg-white text-[#0F4C2A] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>Mini Grid</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500 font-semibold">
              {mobileViewMode === 'carousel' ? `${activeIndex + 1} / ${POLAROID_PHOTOS.length}` : `${POLAROID_PHOTOS.length} items`}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< sm): Sleek, responsive, compact height without scroll-lock */}
        {/* ========================================================================= */}
        <div className="block sm:hidden">
          {mobileViewMode === 'carousel' ? (
            <div className="relative flex flex-col items-center">
              {/* Swipeable Single Card Stage */}
              <div className="relative w-full max-w-[320px] aspect-[4/5] min-h-[400px] flex items-center justify-center my-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePhoto.id}
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: activePhoto.initialPos.rotate }}
                    exit={{ opacity: 0, scale: 0.92, y: -15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 60) handlePrevMobile();
                      else if (info.offset.x < -60) handleNextMobile();
                    }}
                    onClick={() => setSelectedPhotoIndex(activeIndex)}
                    className="relative w-full bg-white p-4 pb-6 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] border border-slate-200/90 cursor-pointer active:scale-98 transition-transform"
                  >
                    {/* Washi tape decoration */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/90 border border-amber-200/70 rounded-sm transform -rotate-1 shadow-sm pointer-events-none" />

                    {/* Image frame */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-100">
                      <Image
                        src={activePhoto.imageUrl}
                        alt={activePhoto.alt}
                        fill
                        sizes="320px"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white font-bold tracking-wide">
                        {activePhoto.tag}
                      </div>

                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-slate-800 p-1.5 rounded-lg shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="space-y-1.5">
                      <div className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">
                        {activePhoto.title}
                      </div>
                      <p className="text-xs text-slate-600 font-serif italic line-clamp-2 leading-relaxed">
                        “{activePhoto.caption}”
                      </p>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#3FA85B]" />
                          {activePhoto.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#3FA85B]" />
                          {activePhoto.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Carousel Controls */}
              <div className="flex items-center justify-between w-full max-w-[320px] mt-4 px-2">
                <button
                  type="button"
                  onClick={handlePrevMobile}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
                  aria-label="Previous polaroid"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {POLAROID_PHOTOS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeIndex ? 'w-6 bg-[#3FA85B]' : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextMobile}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
                  aria-label="Next polaroid"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-2 text-[11px] font-mono text-slate-400">
                Swipe left / right or tap card to inspect
              </div>
            </div>
          ) : (
            /* Mobile Mini Grid View */
            <div className="grid grid-cols-2 gap-3 pt-2">
              {POLAROID_PHOTOS.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="bg-white p-2.5 pb-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.alt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono text-white font-bold">
                      {photo.tag}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {photo.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-[#3FA85B]" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP & TABLET VIEW (>= sm): Interactive Free-Draggable Corkboard Wall */}
        {/* ========================================================================= */}
        <div
          ref={containerRef}
          key={resetKey}
          className="hidden sm:block relative w-full rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-6 sm:p-8 lg:p-12 overflow-hidden select-none min-h-[640px]"
        >
          {/* Center Watermark: Official Club Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none z-0 p-6">
            <div className="relative w-full max-w-[500px] md:max-w-[700px] h-44 sm:h-64 md:h-72">
              <Image
                src="/logo.png"
                alt="3 ZERO Campus Club ISIMS Logo"
                fill
                sizes="(max-width: 768px) 500px, 800px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 5-Card Adaptive Layout (3 on top row, 2 centered on bottom row) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 place-items-center">
            {POLAROID_PHOTOS.map((photo, idx) => {
              const currentZ = zIndices[photo.id] || idx + 1;
              const isLastTwoOnLg = idx >= 3;

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
                    delay: idx * 0.06,
                  }}
                  style={{
                    zIndex: currentZ,
                  }}
                  className="relative w-full max-w-[290px] sm:max-w-[310px] bg-white p-3.5 sm:p-4 pb-5 sm:pb-6 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-slate-200/90 group"
                >
                  {/* Tape decoration on top edge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 border border-amber-200/60 rounded-sm transform -rotate-1 opacity-75 pointer-events-none shadow-sm" />

                  {/* Polaroid Photo Frame */}
                  <div
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-100 cursor-pointer"
                  >
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

                    {/* Enlarge prompt on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-slate-900 text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#3FA85B]" />
                        Zoom
                      </span>
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

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL: Crisp viewing of authentic photos & details   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhoto && selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo View */}
              <div className="relative w-full md:w-3/5 bg-slate-950 flex items-center justify-center min-h-[280px] sm:min-h-[400px]">
                <div className="relative w-full h-[300px] sm:h-[450px] md:h-[550px]">
                  <Image
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Next / Previous modal navigation buttons */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(
                      (selectedPhotoIndex - 1 + POLAROID_PHOTOS.length) % POLAROID_PHOTOS.length
                    );
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((selectedPhotoIndex + 1) % POLAROID_PHOTOS.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Metadata & Story Sidebar */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-[#3FA85B]" />
                    <span>{selectedPhoto.tag}</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
                    {selectedPhoto.title}
                  </h4>

                  <p className="text-sm sm:text-base text-slate-600 font-serif italic leading-relaxed mb-6">
                    “{selectedPhoto.caption}”
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-[#3FA85B]" />
                      {selectedPhoto.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-[#3FA85B]" />
                      {selectedPhoto.date}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2">
                    <span>ARCHIVE NODE #{selectedPhotoIndex + 1}</span>
                    <span>ISIMS CHAPTER</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
