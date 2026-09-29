'use client';

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateBarcode } from '@/lib/barcode/generateBarcode';
import { playSweepTick } from '@/lib/audio/scanSound';

interface BarcodeScannerProps {
  seed: string;
  isScanning: boolean;
  isSuccess: boolean;
  barcodeNumber: string;
  className?: string;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  seed,
  isScanning,
  isSuccess,
  barcodeNumber,
  className = '',
}) => {
  const barcodeData = useMemo(() => generateBarcode(seed, 120, 28), [seed]);

  useEffect(() => {
    if (!isScanning) return;
    const t1 = setTimeout(() => playSweepTick(), 150);
    const t2 = setTimeout(() => playSweepTick(), 450);
    const t3 = setTimeout(() => playSweepTick(), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isScanning]);

  return (
    <div className={`relative w-full flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/90 overflow-hidden ${className}`}>
      {/* ── Responsive SVG Barcode ─────────────────────────────────── */}
      <div className="relative w-full h-7 flex items-center justify-center overflow-hidden px-1">
        <svg
          viewBox={`0 0 ${barcodeData.totalWidth} ${barcodeData.height}`}
          className={`w-full h-full transition-all duration-200 ${
            isSuccess ? 'filter drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : ''
          }`}
          preserveAspectRatio="none"
        >
          {barcodeData.bars.map((bar, idx) => (
            <rect
              key={idx}
              x={bar.x}
              y={0}
              width={bar.width}
              height={barcodeData.height}
              fill={isSuccess ? '#16A34A' : '#1E293B'}
              className="transition-colors duration-200"
            />
          ))}
        </svg>

        {/* ── Laser Beam Sweep Line ─────────────────────────────────── */}
        {isScanning && (
          <motion.div
            initial={{ left: '-10%' }}
            animate={{ left: ['-10%', '110%', '-10%', '110%'] }}
            transition={{
              duration: 0.85,
              ease: 'easeInOut',
            }}
            className="absolute top-0 bottom-0 w-1 bg-[#3FA85B] shadow-[0_0_10px_#3FA85B,0_0_18px_#4ADE80] z-20 pointer-events-none"
          >
            <div className="absolute inset-y-0 -left-2 -right-2 bg-[#3FA85B]/20 blur-sm" />
          </motion.div>
        )}

        {/* ── Success Flash ─────────────────────────────────────────── */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#3FA85B]/30 pointer-events-none"
          />
        )}
      </div>

      {/* Serial Number */}
      <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mt-1 truncate max-w-full text-center">
        {barcodeNumber}
      </span>
    </div>
  );
};
