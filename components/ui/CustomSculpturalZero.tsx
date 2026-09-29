'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PillarId } from '@/types';

interface CustomSculpturalZeroProps {
  pillarId: PillarId;
  isHovered: boolean;
  borderGradient: {
    start: string;
    mid: string;
    end: string;
    glow: string;
  };
}

export const CustomSculpturalZero: React.FC<CustomSculpturalZeroProps> = ({
  pillarId,
  isHovered,
  borderGradient,
}) => {
  const gradId = `numeral-zero-grad-${pillarId}`;
  const strokeGradId = `numeral-zero-stroke-${pillarId}`;

  return (
    <div className="relative w-24 h-36 xs:w-32 xs:h-48 sm:w-48 sm:h-64 md:w-56 md:h-76 lg:w-64 lg:h-88 flex items-center justify-center select-none transform-gpu will-change-transform">
      {/* 1. Volumetric Ambient Glow (GPU Accelerated) */}
      <div
        className="absolute inset-4 rounded-[90px] blur-2xl pointer-events-none transition-all duration-500 ease-out transform-gpu will-change-transform"
        style={{
          backgroundColor: borderGradient.glow,
          opacity: isHovered ? 0.55 : 0.08,
          transform: isHovered ? 'scale(1.12)' : 'scale(0.95)',
        }}
      />

      {/* 2. REFINED SLEEK NUMERAL ZERO */}
      <svg
        viewBox="0 0 200 280"
        className="w-full h-full relative z-10 overflow-visible transform-gpu"
      >
        <defs>
          {/* Rich Gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderGradient.start} />
            <stop offset="45%" stopColor={borderGradient.mid} />
            <stop offset="100%" stopColor={borderGradient.end} />
          </linearGradient>

          {/* Specular Stroke Gradient */}
          <linearGradient id={strokeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isHovered ? '0.85' : '0.4'} />
            <stop offset="50%" stopColor={borderGradient.mid} stopOpacity={isHovered ? '0.7' : '0.2'} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={isHovered ? '0.45' : '0.15'} />
          </linearGradient>
        </defs>

        {/* 3. REFINED ZERO BODY */}
        <path
          d="M 100,12 C 154,12 182,54 182,140 C 182,226 154,268 100,268 C 46,268 18,226 18,140 C 18,54 46,12 100,12 Z M 100,48 C 138,48 154,80 154,140 C 154,200 138,232 100,232 C 62,232 46,200 46,140 C 46,80 62,48 100,48 Z"
          fillRule="evenodd"
          fill={`url(#${gradId})`}
          stroke={`url(#${strokeGradId})`}
          strokeWidth={isHovered ? '1.8' : '1.2'}
          className="transition-all duration-300 transform-gpu"
        />

        {/* 4. GPU-ACCELERATED ULTRA-SMOOTH INNER ORBITAL LIGHT BEAM */}
        <g
          className="pointer-events-none transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          {/* Outer soft bloom stroke (hardware rasterized without CPU filter) */}
          <path
            d="M 100,48 C 138,48 154,80 154,140 C 154,200 138,232 100,232 C 62,232 46,200 46,140 C 46,80 62,48 100,48 Z"
            fill="none"
            stroke={borderGradient.start}
            strokeWidth="5"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeDasharray="80 280"
            className="animate-orbital-light"
          />

          {/* Crisp primary colored beam */}
          <path
            d="M 100,48 C 138,48 154,80 154,140 C 154,200 138,232 100,232 C 62,232 46,200 46,140 C 46,80 62,48 100,48 Z"
            fill="none"
            stroke={borderGradient.start}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="70 290"
            className="animate-orbital-light"
          />

          {/* Bright white specular core head */}
          <path
            d="M 100,48 C 138,48 154,80 154,140 C 154,200 138,232 100,232 C 62,232 46,200 46,140 C 46,80 62,48 100,48 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="24 336"
            className="animate-orbital-light"
          />
        </g>
      </svg>
    </div>
  );
};
