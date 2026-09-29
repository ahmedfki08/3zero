'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface LogoSvgProps {
  id?: string;
  className?: string;
  isDrawing?: boolean;
  strokeColor?: string;
  fillColor?: string;
  accentColor?: string;
  onDrawComplete?: () => void;
}

/**
 * Standardized SVG Logo Component
 * Sized with a normalized viewBox="0 0 1000 320"
 * Contains the master <defs> vector shape that can be sliced or referenced via <use href="#master-logo-shape" />
 */
export const Logo: React.FC<LogoSvgProps> = ({
  id = 'master-logo-shape',
  className = '',
  isDrawing = false,
  strokeColor = '#3FA85B',
  fillColor = '#0F4C2A',
  accentColor = '#3FA85B',
  onDrawComplete,
}) => {
  return (
    <svg
      viewBox="0 0 1000 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto select-none ${className}`}
      aria-label="3 ZERO Campus Club ISIMS Logo"
    >
      <defs>
        {/* Master Logo Definition: Can be replaced with any custom SVG path group */}
        <g id={id}>
          {/* Main "ZERO" Wordmark Graphic */}
          <g id="wordmark-zero">
            {/* Letter Z */}
            <path
              d="M 60 40 L 220 40 L 220 78 L 118 202 L 225 202 L 225 242 L 60 242 L 60 204 L 165 80 L 60 80 Z"
              fill={fillColor}
            />
            {/* Letter E */}
            <path
              d="M 250 40 L 390 40 L 390 80 L 302 80 L 302 120 L 375 120 L 375 158 L 302 158 L 302 202 L 395 202 L 395 242 L 250 242 Z"
              fill={fillColor}
            />
            {/* Letter R */}
            <path
              d="M 420 40 L 530 40 C 565 40 585 60 585 92 C 585 118 570 135 545 142 L 590 242 L 535 242 L 498 150 L 472 150 L 472 242 L 420 242 Z M 472 78 L 472 115 L 520 115 C 532 115 540 108 540 96 C 540 84 532 78 520 78 Z"
              fill={fillColor}
            />
            {/* Letter O / 0 Oval */}
            <path
              d="M 675 36 C 735 36 775 80 775 141 C 775 202 735 246 675 246 C 615 246 575 202 575 141 C 575 80 615 36 675 36 Z M 675 80 C 648 80 630 105 630 141 C 630 177 648 202 675 202 C 702 202 720 177 720 141 C 720 105 702 80 675 80 Z"
              fill={accentColor}
            />
          </g>

          {/* Right Stacked Pillar Words: EXCLUSION, CARBON, POVERTY */}
          <g id="pillars-subtext" fill={accentColor} fontFamily="var(--font-oswald), sans-serif" fontWeight="900">
            <text x="800" y="80" fontSize="38" letterSpacing="2">
              EXCLUSION
            </text>
            <text x="800" y="142" fontSize="38" letterSpacing="2">
              CARBON
            </text>
            <text x="800" y="204" fontSize="38" letterSpacing="2">
              POVERTY
            </text>
          </g>

          {/* Bottom Bar: CAMPUS CLUB + ISIMS badge */}
          <g id="bottom-bar">
            {/* CAMPUS CLUB text */}
            <text
              x="60"
              y="290"
              fill={fillColor}
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="900"
              fontSize="34"
              letterSpacing="6"
            >
              CAMPUS CLUB
            </text>

            {/* ISIMS Pill background */}
            <rect x="520" y="260" width="420" height="38" rx="6" fill="#0F4C2A" />

            {/* ISIMS Text */}
            <text
              x="730"
              y="288"
              fill="#FFFFFF"
              fontFamily="var(--font-mono), monospace"
              fontWeight="900"
              fontSize="24"
              letterSpacing="8"
              textAnchor="middle"
            >
              ISIMS SFAX
            </text>
          </g>
        </g>
      </defs>

      {/* When isDrawing mode is active, render stroked paths with pathLength animation */}
      {isDrawing ? (
        <g stroke={strokeColor} strokeWidth="3" fill="none">
          {/* Animated Stroke Outline */}
          <motion.path
            d="M 60 40 L 220 40 L 220 78 L 118 202 L 225 202 L 225 242 L 60 242 L 60 204 L 165 80 L 60 80 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 250 40 L 390 40 L 390 80 L 302 80 L 302 120 L 375 120 L 375 158 L 302 158 L 302 202 L 395 202 L 395 242 L 250 242 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 420 40 L 530 40 C 565 40 585 60 585 92 C 585 118 570 135 545 142 L 590 242 L 535 242 L 498 150 L 472 150 L 472 242 L 420 242 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 675 36 C 735 36 775 80 775 141 C 775 202 735 246 675 246 C 615 246 575 202 575 141 C 575 80 615 36 675 36 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.45, ease: 'easeInOut' }}
            onAnimationComplete={onDrawComplete}
          />
        </g>
      ) : (
        /* Standard Static / Defs Reference */
        <use href={`#${id}`} />
      )}
    </svg>
  );
};
