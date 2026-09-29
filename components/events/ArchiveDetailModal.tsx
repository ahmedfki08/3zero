'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PastEventArchive } from '@/types/events';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ArchiveDetailModalProps {
  event: PastEventArchive | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveDetailModal: React.FC<ArchiveDetailModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [event]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const gallery = event.galleryImages && event.galleryImages.length > 0
    ? event.galleryImages
    : [{ url: event.coverImage, altText: event.title }];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-4 max-h-[85vh] h-[85vh] sm:h-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-[#FAFCFA] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3FA85B]" />
              <span className="text-xs font-mono font-bold text-[#0F4C2A] uppercase tracking-wider">
                HISTORICAL SPRINT ARCHIVE · {event.year}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain">
            {/* Title & Metadata Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold border border-[#3FA85B]/20">
                  {event.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  {event.dateFormatted}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.attendeeCount} Builders &amp; Researchers</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                {event.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <MapPin className="w-4 h-4 text-[#3FA85B]" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Photo Gallery Lightbox */}
            <div className="space-y-3">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <Image
                  src={gallery[selectedPhotoIndex].url}
                  alt={gallery[selectedPhotoIndex].altText || event.title}
                  fill
                  className="object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                {gallery[selectedPhotoIndex].altText && (
                  <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-white/90 truncate">
                    {gallery[selectedPhotoIndex].altText}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? 'border-[#3FA85B] shadow-md scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recap Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Sprint Summary &amp; Outcomes
              </h4>
              <p className="text-sm sm:text-base font-sans text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {event.recap}
              </p>
            </div>

            {/* Key Deliverables / Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Key Accomplishments
                </h4>
                <div className="space-y-2">
                  {event.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-slate-700"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#E8F7EE] text-[#0F4C2A] flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                        ✓
                      </div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#FAFCFA] flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-slate-400">
              3-ZERO CAMPUS CLUB · ISIMS
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
