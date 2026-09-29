'use client';

import { ArrowUpRight } from 'lucide-react';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToTarget } from '@/lib/scroll';

interface NavbarProps {
  onOpenPillarModal?: (pillarId: 'poverty' | 'carbon' | 'exclusion') => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { isVisible } = useScrollDirection({
    threshold: 40,
    delta: 8,
  });

  const trackedSectionIds = ['hero', 'about', 'events', 'team', 'sponsors', 'join'];
  const activeSectionId = useScrollSpy(trackedSectionIds);
  const activeId = pathname === '/events' ? 'events' : activeSectionId;

  // Close on click outside (using pointerdown / mousedown with check)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use setTimeout so the current click event that opened it doesn't immediately close it
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Keyboard navigation & Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navLinks = [
    { label: 'HOME', id: 'hero', route: '/' },
    { label: 'WHAT WE DO', id: 'about', route: '/#about' },
    { label: 'UPCOMING', id: 'events', route: '/#events', isAnchor: true },
    { label: 'ALL EVENTS', id: 'events-page', route: '/events', isPage: true },
    { label: 'WHO WE ARE', id: 'team', route: '/#team' },
    { label: 'SPONSORS', id: 'sponsors', route: '/#sponsors' },
    { label: 'JOIN MOVEMENT', id: 'join', route: '/#join', isCta: true },
  ] as Array<{ label: string; id: string; route?: string; isCta?: boolean; isPage?: boolean; isAnchor?: boolean }>;

  const handleNavigate = (link: { id: string; route?: string; isPage?: boolean; isAnchor?: boolean }) => {
    setIsOpen(false);

    if (link.isPage) {
      if (pathname === '/events') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/events');
      }
      return;
    }

    if (link.isAnchor) {
      if (pathname !== '/') {
        router.push('/#events');
      } else {
        scrollToTarget('events', { offset: 80 });
      }
      return;
    }

    if (pathname === '/events') {
      if (link.route) {
        router.push(link.route);
      } else {
        router.push(`/#${link.id}`);
      }
      return;
    }

    scrollToTarget(link.id, { offset: 80 });
  };

  const shouldShow = isVisible || isOpen;

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F3319] focus:text-white focus:rounded-xl focus:shadow-xl text-xs font-mono"
      >
        Skip to main content
      </a>

      {/* Floating Centered Pill Dock */}
      <header
        ref={containerRef}
        style={{
          transform: shouldShow ? 'translate(-50%, 0)' : 'translate(-50%, -120%)',
        }}
        className={`fixed top-4 sm:top-6 left-1/2 z-50 transition-transform duration-300 ease-out will-change-transform ${className}`}
      >
        <div className="relative flex flex-col items-center">
          {/* Single Pill: Menu / Close Trigger Button */}
          <div className="flex items-center">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="floating-dropdown-menu"
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
              className="flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 h-12 sm:h-13 rounded-2xl bg-[#062e15]/75 hover:bg-[#083a1c]/85 backdrop-blur-2xl border border-[#3FA85B]/40 hover:border-[#3FA85B]/80 shadow-[0_8px_32px_rgba(6,46,21,0.45)] text-white font-mono font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B]"
            >
              {/* Animated Text Roll/Slide between MENU and CLOSE */}
              <div className="relative overflow-hidden h-5 flex items-center justify-center min-w-[50px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'menu'}
                    initial={{ y: isOpen ? 14 : -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: isOpen ? -14 : 14, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block font-mono tracking-widest text-xs sm:text-sm"
                  >
                    {isOpen ? 'CLOSE' : 'MENU'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Animated Dot Matrix Morph */}
              <div className="w-4.5 h-3.5 flex items-center justify-center relative pointer-events-none">
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    /* Morph into Close Dots */
                    <motion.div
                      key="close-dots"
                      initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
                    </motion.div>
                  ) : (
                    /* 2x3 Dot Matrix (:::) */
                    <motion.div
                      key="menu-dots"
                      initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="grid grid-cols-3 gap-0.75 sm:gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/95" />
                      <span className="w-1 h-1 rounded-full bg-[#3FA85B]" />
                      <span className="w-1 h-1 rounded-full bg-white/95" />
                      <span className="w-1 h-1 rounded-full bg-[#3FA85B]" />
                      <span className="w-1 h-1 rounded-full bg-white/95" />
                      <span className="w-1 h-1 rounded-full bg-[#3FA85B]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </div>

          {/* Floating Dropdown Card Panel with Spring Blur Expansion */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="floating-dropdown-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site Navigation"
                initial={{ opacity: 0, scale: 0.9, y: -16, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.93, y: -14, filter: 'blur(8px)' }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 26,
                  mass: 0.65,
                }}
                style={{ transformOrigin: 'top center' }}
                className="absolute top-full mt-3 w-[calc(100vw-32px)] max-w-[320px] sm:w-[330px] rounded-3xl bg-[#052410]/85 hover:bg-[#052410]/92 backdrop-blur-3xl border border-[#3FA85B]/40 shadow-[0_24px_70px_rgba(3,25,11,0.6)] p-5 sm:p-7 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Ambient Soft Radial Green Glow inside Card */}
                <div
                  aria-hidden="true"
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full bg-radial from-[#3FA85B]/25 to-transparent blur-2xl pointer-events-none"
                />

                {/* Vertical Links List */}
                <nav className="relative z-10 flex flex-col items-center w-full space-y-1">
                  {navLinks.map((link, idx) => {
                    const isActive = link.isPage
                      ? pathname === '/events'
                      : link.isAnchor
                        ? activeId === 'events' && pathname === '/'
                        : activeId === link.id;

                    return (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: idx * 0.035,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="w-full"
                      >
                        {/* Divider label before UPCOMING */}
                        {link.isAnchor && (
                          <div className="flex items-center gap-2 pb-1 pt-0.5">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[9px] font-mono tracking-widest text-emerald-400/60 uppercase select-none">
                              Events
                            </span>
                            <div className="flex-1 h-px bg-white/10" />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleNavigate(link)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`group relative flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${link.isCta
                              ? 'mt-3 py-3 bg-gradient-to-r from-[#0F4C2A]/90 to-[#3FA85B]/90 hover:from-[#0F4C2A] hover:to-[#3FA85B] text-white shadow-lg shadow-[#3FA85B]/20 hover:scale-[1.02] active:scale-98'
                              : link.isPage
                                ? isActive
                                  ? 'text-[#4ADE80] font-black bg-emerald-500/10 border border-emerald-500/20'
                                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-500/8 border border-transparent hover:border-emerald-500/15 active:scale-98'
                                : isActive
                                  ? 'text-[#4ADE80] font-black bg-white/8'
                                  : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-98'
                            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B]`}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isActive && !link.isCta && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                            )}
                            <span>{link.label}</span>

                            {/* #section badge — homepage scroll anchor */}
                            {link.isAnchor && (
                              <span className="px-1.5 py-0.5 rounded-md bg-white/8 border border-white/12 text-[8px] font-mono tracking-wider text-white/40 normal-case leading-none">
                                section
                              </span>
                            )}

                            {/* PAGE badge — full route */}
                            {link.isPage && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-[8px] font-mono tracking-wider text-emerald-400 normal-case leading-none">
                                page <ArrowUpRight className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </span>
                        </button>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Subtitle / Footer info inside dropdown */}
                <div className="relative z-10 pt-5 mt-2 border-t border-white/10 w-full flex items-center justify-between text-[10px] font-mono text-emerald-200/60 select-none">
                  <span>ISIMS SFAX</span>
                  <span>•</span>
                  <span>TUNISIA</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
