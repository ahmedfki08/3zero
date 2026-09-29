'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { SocialLinks } from './SocialLinks';
import { BackToTop } from './BackToTop';
import { FooterWordmark } from './FooterWordmark';
import { scrollToTarget } from '@/lib/scroll';

const NAV_LINKS = [
  { label: 'About',    href: '#about',    anchor: true },
  { label: 'Events',   href: '/events',   anchor: false },
  { label: 'Team',     href: '#team',     anchor: true },
  { label: 'Sponsors', href: '#sponsors', anchor: true },
  { label: 'Join',     href: '#join',     anchor: true },
];

export const Footer: React.FC = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, anchor: boolean, href: string) => {
    if (anchor) {
      e.preventDefault();
      scrollToTarget(href.replace('#', ''), { offset: 76 });
    }
  };

  return (
    <footer
      className="relative bg-[#081f10] text-white overflow-hidden border-t border-emerald-900/60 selection:bg-[#4ADE80] selection:text-[#0A331C]"
      aria-label="Site Footer"
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-radial from-[#3FA85B]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-16 right-0 w-80 h-56 rounded-full bg-radial from-[#10B981]/12 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── 3-column main row ─────────────────────────────── */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-b border-emerald-900/50 items-start">

          {/* LEFT — Logo + description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85">
              <Image
                src="/club-badge-logo.png"
                alt="3-Zero Campus Club ISIMS"
                width={180}
                height={55}
                className="h-10 sm:h-12 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-xs text-emerald-100/60 leading-relaxed max-w-[240px]">
              {siteConfig.description}
            </p>
          </div>

          {/* CENTER — Navigation */}
          <div className="flex flex-col items-start md:items-center gap-5">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col items-start md:items-center gap-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={(e) => handleNav(e, l.anchor, l.href)}
                      className="text-xs font-mono text-emerald-300/60 hover:text-white transition-colors duration-150 tracking-widest uppercase"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* RIGHT — Social icons + Back to 000 */}
          <div className="flex md:justify-end items-start">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400/50">
                Follow us
              </span>
              <SocialLinks />
              <BackToTop />
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div className="py-5 text-center text-[11px] font-mono text-emerald-400/35">
          © 2026 3-Zero Campus Club ISIMS · {siteConfig.footer.credit}.
        </div>

        {/* Wordmark */}
        <FooterWordmark />
      </div>
    </footer>
  );
};


