'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenPillarModal?: (pillarId: 'poverty' | 'carbon' | 'exclusion') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPillarModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'py-5 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-4">
              <Link href="#hero" className="group flex items-center">
                <BrandLogo size="sm" />
              </Link>

              {/* ISIMS Sfax Pill */}
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-[11px] font-mono text-slate-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA85B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FA85B]" />
                </span>
                <span className="text-[#0F4C2A] font-bold">ISIMS</span>
                <span className="text-slate-300">•</span>
                <span>SFAX</span>
              </div>
            </div>

            {/* Middle: Pillars & Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-slate-200/90 shadow-sm backdrop-blur-md">
              <button
                onClick={() => onOpenPillarModal?.('exclusion')}
                className="px-3.5 py-1.5 text-xs font-mono rounded-full text-slate-700 hover:text-[#0F4C2A] hover:bg-[#E8F7EE] transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
                <span>01 Exclusion</span>
              </button>
              <button
                onClick={() => onOpenPillarModal?.('carbon')}
                className="px-3.5 py-1.5 text-xs font-mono rounded-full text-slate-700 hover:text-[#0F4C2A] hover:bg-[#E8F7EE] transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
                <span>02 Carbon</span>
              </button>
              <button
                onClick={() => onOpenPillarModal?.('poverty')}
                className="px-3.5 py-1.5 text-xs font-mono rounded-full text-slate-700 hover:text-[#0F4C2A] hover:bg-[#E8F7EE] transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
                <span>03 Poverty</span>
              </button>

              <div className="h-3.5 w-px bg-slate-200 mx-1" />

              <Link
                href="#about"
                className="px-3 py-1.5 text-xs font-mono rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              >
                About
              </Link>
              <Link
                href="#projects"
                className="px-3 py-1.5 text-xs font-mono rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              >
                Projects
              </Link>
              <Link
                href="#events"
                className="px-3 py-1.5 text-xs font-mono rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              >
                Roadmap
              </Link>
              <Link
                href="#sponsors"
                className="px-3 py-1.5 text-xs font-mono rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              >
                Partners
              </Link>
            </nav>

            {/* Right: CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="#join"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-[#3FA85B] text-white hover:bg-[#0F4C2A] shadow-sm hover:shadow-[0_4px_16px_rgba(63,168,91,0.3)] transition-all duration-300 transform active:scale-95"
              >
                <span>Join Movement</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed inset-x-0 top-16 z-40 p-4 md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-xl"
          >
            <div className="flex flex-col gap-2 pt-2 pb-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPillarModal?.('exclusion');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 font-mono text-sm"
              >
                <span>01 Zero Exclusion</span>
                <ArrowUpRight className="w-4 h-4 text-[#3FA85B]" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPillarModal?.('carbon');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 font-mono text-sm"
              >
                <span>02 Zero Carbon</span>
                <ArrowUpRight className="w-4 h-4 text-[#3FA85B]" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPillarModal?.('poverty');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 font-mono text-sm"
              >
                <span>03 Zero Poverty</span>
                <ArrowUpRight className="w-4 h-4 text-[#3FA85B]" />
              </button>

              <div className="h-px bg-slate-200 my-2" />

              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-sm font-mono text-slate-700"
              >
                About ISIMS Campus
              </Link>
              <Link
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-sm font-mono text-slate-700"
              >
                Initiatives & Projects
              </Link>
              <Link
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-sm font-mono text-slate-700"
              >
                Campus Event Roadmap
              </Link>
              <Link
                href="#sponsors"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-sm font-mono text-slate-700"
              >
                Sponsors & Partners
              </Link>

              <Link
                href="#join"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full text-center py-3 rounded-xl font-mono text-xs font-bold uppercase bg-[#3FA85B] text-white"
              >
                Join Movement
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
