'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface BackgroundCurvesProps {
  progress: MotionValue<number>;
}

export const BackgroundCurves: React.FC<BackgroundCurvesProps> = ({ progress }) => {
  // Smooth scroll-driven stroke and opacity transforms
  const path1Length = useTransform(progress, [0, 0.75], [0.2, 1]);
  const path2Length = useTransform(progress, [0.08, 0.85], [0.15, 1]);
  const path3Length = useTransform(progress, [0.15, 0.90], [0.1, 1]);
  const path4Length = useTransform(progress, [0.22, 0.95], [0.05, 1]);
  const path5Length = useTransform(progress, [0.05, 0.80], [0.25, 1]);

  const curveOpacity = useTransform(progress, [0, 0.5, 1], [0.35, 0.75, 0.55]);
  const glowScale = useTransform(progress, [0, 0.6, 1], [0.85, 1.3, 1.05]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10"
    >
      {/* Soft Ambient Radial Glow Fields */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[650px] rounded-full bg-gradient-to-tr from-[#3FA85B]/12 via-[#22c55e]/15 to-transparent blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 w-[600px] h-[450px] rounded-full bg-gradient-to-br from-[#10B981]/10 via-[#3FA85B]/10 to-transparent blur-[120px]"
      />

      {/* Dynamic Animated Flowing SVG Curves */}
      <motion.svg
        style={{ opacity: curveOpacity }}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F4C2A" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#3FA85B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="curveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3FA85B" stopOpacity="0.2" />
            <stop offset="55%" stopColor="#10B981" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0F4C2A" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="curveGradient3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0F4C2A" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3FA85B" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3FA85B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="fillGradient2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ribbon Area 1 (Soft bottom undulating fill) */}
        <motion.path
          d="M-100,550 C320,400 680,750 1100,500 C1320,380 1500,460 1600,480 L1600,950 L-100,950 Z"
          fill="url(#fillGradient)"
          animate={{
            d: [
              'M-100,550 C320,400 680,750 1100,500 C1320,380 1500,460 1600,480 L1600,950 L-100,950 Z',
              'M-100,510 C360,450 640,690 1140,460 C1360,340 1480,510 1600,520 L1600,950 L-100,950 Z',
              'M-100,550 C320,400 680,750 1100,500 C1320,380 1500,460 1600,480 L1600,950 L-100,950 Z',
            ],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ribbon Area 2 (Opposite flow) */}
        <motion.path
          d="M-100,720 C250,600 620,840 1020,680 C1280,560 1480,700 1600,640 L1600,950 L-100,950 Z"
          fill="url(#fillGradient2)"
          animate={{
            d: [
              'M-100,720 C250,600 620,840 1020,680 C1280,560 1480,700 1600,640 L1600,950 L-100,950 Z',
              'M-100,680 C290,660 580,780 1080,640 C1320,530 1450,730 1600,670 L1600,950 L-100,950 Z',
              'M-100,720 C250,600 620,840 1020,680 C1280,560 1480,700 1600,640 L1600,950 L-100,950 Z',
            ],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Contour Path 1 (Upper Wave - Gentle S-curve) */}
        <motion.path
          d="M-100,240 C240,120 540,420 960,220 C1220,90 1420,290 1600,190"
          stroke="url(#curveGradient1)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ pathLength: path1Length }}
          animate={{
            y: [-16, 16, -16],
            x: [-10, 10, -10],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Contour Path 2 (Middle Arc - Dashed Tech line) */}
        <motion.path
          d="M-100,420 C320,560 740,240 1140,460 C1380,580 1490,410 1600,440"
          stroke="url(#curveGradient2)"
          strokeWidth="1.8"
          strokeDasharray="6 10"
          strokeLinecap="round"
          style={{ pathLength: path2Length }}
          animate={{
            y: [14, -18, 14],
            x: [12, -12, 12],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Contour Path 3 (Lower Horizon - Broad sweep) */}
        <motion.path
          d="M-100,660 C380,500 760,820 1200,560 C1400,440 1520,610 1600,540"
          stroke="url(#curveGradient1)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: path3Length }}
          animate={{
            y: [-10, 14, -10],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Contour Path 4 (Diagonal Cross - High-speed subtle trail) */}
        <motion.path
          d="M-100,160 C400,340 820,120 1250,380 C1450,480 1540,280 1600,320"
          stroke="url(#curveGradient3)"
          strokeWidth="1.4"
          strokeOpacity="0.5"
          style={{ pathLength: path4Length }}
          animate={{
            y: [12, -10, 12],
            x: [-15, 15, -15],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Contour Path 5 (Deep Lower Ribbon) */}
        <motion.path
          d="M-100,780 C280,680 660,890 1100,740 C1350,640 1480,820 1600,760"
          stroke="url(#curveGradient2)"
          strokeWidth="1.6"
          strokeDasharray="12 18"
          strokeLinecap="round"
          style={{ pathLength: path5Length }}
          animate={{
            y: [-8, 10, -8],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
};
