'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavItem } from '@/config/site';
import { scrollToTarget } from '@/lib/scroll';

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  item,
  isActive,
  onNavigate,
  className = '',
}) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion || !linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.type === 'anchor') {
      e.preventDefault();
      const targetId = item.id || item.href.replace('#', '');
      scrollToTarget(targetId, { offset: 76 });
      onNavigate?.();
    }
  };

  return (
    <motion.div
      animate={{ x: mousePos.x, y: mousePos.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.2 }}
      className="relative inline-flex items-center"
    >
      <Link
        ref={linkRef}
        href={item.href}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-current={isActive ? 'page' : undefined}
        className={`relative z-10 px-4 py-2 text-xs font-mono tracking-wider uppercase font-semibold transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] focus-visible:ring-offset-2 ${
          isActive
            ? 'text-[#0F4C2A] font-bold'
            : 'text-slate-600 hover:text-slate-900'
        } ${className}`}
      >
        {/* Active Pill Gliding Indicator */}
        {isActive && (
          <motion.span
            layoutId="activeNavIndicator"
            className="absolute inset-0 bg-[#E8F7EE] border border-[#3FA85B]/30 rounded-full -z-10 shadow-xs"
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30,
            }}
          />
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          {item.label}
          {isActive && (
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#3FA85B] animate-pulse"
            />
          )}
        </span>
      </Link>
    </motion.div>
  );
};
