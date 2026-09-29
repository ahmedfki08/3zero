'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const portalAttr = target.closest('[data-cursor-portal]');
      const clickable = target.closest('button, a, input, [role="button"]');

      if (portalAttr) {
        setIsHovered(true);
        setCursorText('ENTER ZERO');
      } else if (clickable) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isClient || isTouch) return null;

  return (
    <>
      {/* Outer Halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#3FA85B]/40 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider text-emerald-300 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - (cursorText ? 42 : isHovered ? 24 : 16),
          y: mousePosition.y - (cursorText ? 42 : isHovered ? 24 : 16),
          width: cursorText ? 84 : isHovered ? 48 : 32,
          height: cursorText ? 84 : isHovered ? 48 : 32,
          borderColor: cursorText ? '#3FA85B' : isHovered ? '#4EBA6F' : 'rgba(63, 168, 91, 0.3)',
          backgroundColor: cursorText ? 'rgba(6, 12, 8, 0.85)' : isHovered ? 'rgba(63, 168, 91, 0.12)' : 'transparent',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 250,
          mass: 0.5,
        }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-bold text-center px-1 leading-tight text-[8.5px] text-[#4EBA6F]"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-[#3FA85B]"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          width: 6,
          height: 6,
          opacity: cursorText ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 450,
          mass: 0.1,
        }}
      />
    </>
  );
};
