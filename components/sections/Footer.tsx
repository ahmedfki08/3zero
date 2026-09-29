'use client';

import React from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../ui/SocialIcons';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F4C2A] text-white pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/60">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
              <BrandLogo size="md" />
            </div>

            <p className="text-xs text-emerald-100/80 font-sans max-w-sm leading-relaxed mt-3">
              Higher Institute of Computer Science and Multimedia of Sfax (ISIMS) Campus Club. Empowering students through open engineering, social entrepreneurship, and clean technology to realize a world of Three Zeros.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-white hover:text-[#0F4C2A] border border-emerald-700/50 flex items-center justify-center text-emerald-100 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-white hover:text-[#0F4C2A] border border-emerald-700/50 flex items-center justify-center text-emerald-100 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-white hover:text-[#0F4C2A] border border-emerald-700/50 flex items-center justify-center text-emerald-100 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: The Three Zeros Navigation */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[11px] uppercase tracking-widest text-[#4EBA6F] font-bold">
              The Three Pillars
            </div>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  01. Zero Exclusion
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  02. Zero Carbon
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  03. Zero Poverty
                </a>
              </li>
              <li>
                <a href="#telemetry" className="hover:text-white transition-colors">
                  Live Campus Telemetry
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus & University */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[11px] uppercase tracking-widest text-emerald-200 font-bold">
              University Affiliation
            </div>
            <div className="text-emerald-100/80 space-y-1 text-xs">
              <p className="text-white font-bold">ISIMS</p>
              <p>Institut Supérieur d&apos;Informatique et de Multimédia de Sfax</p>
              <p className="text-emerald-200/60">Pôle Technologique de Sfax, Route de Tunis</p>
              <p className="text-[#4EBA6F] pt-2 font-bold">University of Sfax, Tunisia</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-emerald-200/70">
          <div>
            &copy; {new Date().getFullYear()} 3-Zero Campus Club ISIMS. Open Access & Creative Commons.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
