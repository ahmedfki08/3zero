'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { scrollToTarget } from '@/lib/scroll';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeId,
  triggerRef,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  useLockBodyScroll(isOpen);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (!menuRef.current) return;
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on first link in menu
    const timer = setTimeout(() => {
      if (menuRef.current) {
        const firstLink = menuRef.current.querySelector<HTMLElement>('a[href], button');
        firstLink?.focus();
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, type: string) => {
    if (type === 'anchor') {
      e.preventDefault();
      const targetId = href.replace('#', '');
      onClose();
      triggerRef.current?.focus();
      setTimeout(() => {
        scrollToTarget(targetId, { offset: 76 });
      }, 150);
    } else {
      onClose();
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
    },
    open: {
      opacity: 1,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const containerVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 24 },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          id="mobile-menu-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Menu"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-40 bg-[#FAFCFA] text-[#0F172A] flex flex-col justify-between pt-24 pb-8 px-6 sm:px-10 overflow-y-auto"
        >
          {/* Ambient flowing green glow in background */}
          <div
            aria-hidden="true"
            className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#3FA85B]/15 to-transparent blur-3xl pointer-events-none"
          />

          <motion.div
            variants={containerVariants}
            className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full py-6 space-y-8"
          >
            {/* Navigation links */}
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              {siteConfig.nav.items.map((item, idx) => {
                const isActive = activeId === (item.id || item.href.replace('#', ''));
                return (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href, item.type)}
                      aria-current={isActive ? 'page' : undefined}
                      className="group flex items-center justify-between min-h-[52px] py-2 text-2xl sm:text-3xl font-bold font-sans tracking-tight border-b border-slate-100 hover:text-[#0F4C2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B] rounded-lg px-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-medium text-[#3FA85B]">
                          0{idx + 1}
                        </span>
                        <span className={isActive ? 'text-[#0F4C2A] underline decoration-[#3FA85B] decoration-2 underline-offset-8' : ''}>
                          {item.label}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#3FA85B] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA in Mobile Menu */}
            <motion.div variants={itemVariants} className="pt-4">
              <Link
                href={siteConfig.nav.cta.href}
                onClick={(e) => handleLinkClick(e, siteConfig.nav.cta.href, siteConfig.nav.cta.type)}
                className="flex items-center justify-center gap-2 w-full min-h-[52px] py-3.5 px-6 rounded-full text-base font-mono font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#0F4C2A] to-[#3FA85B] shadow-lg shadow-[#3FA85B]/25 active:scale-98 transition-transform"
              >
                <span>{siteConfig.nav.cta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom info & Social links */}
          <motion.div
            variants={itemVariants}
            className="max-w-lg mx-auto w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500"
          >
            <div className="text-center sm:text-left">
              <span className="text-[#0F4C2A] font-bold">{siteConfig.university.shortName}</span>
              <span className="mx-2">•</span>
              <span>{siteConfig.university.country}</span>
            </div>

            <div className="flex items-center gap-4">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0F4C2A] transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-medium"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
