'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffMember, StaffSocialLink } from '@/types/staff';
import {
  Globe,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface MemberDetailsProps {
  member: StaffMember | null;
  direction: number;
}

const getSocialIcon = (platform: StaffSocialLink['platform']) => {
  switch (platform) {
    case 'github':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'website':
      return <Globe className="w-4 h-4" />;
    case 'email':
      return <Mail className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

export const MemberDetails: React.FC<MemberDetailsProps> = ({ member, direction }) => {
  if (!member) {
    return (
      <div className="w-full flex items-center justify-center min-h-[300px] text-slate-400 font-mono text-sm">
        No member selected.
      </div>
    );
  }

  const contentVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 20 : -20,
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -20 : 20,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <div
      role="tabpanel"
      id={`staff-panel-${member.id}`}
      aria-labelledby={`staff-tab-${member.id}`}
      className="w-full flex flex-col justify-center min-h-[300px]"
    >
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={member.id}
          custom={direction}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          {/* ── Member Header ────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FA85B]" />
              {member.role}
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
              {member.name}
            </h3>

            <p className="text-xs sm:text-sm font-mono text-slate-500">
              {member.department}
            </p>
          </div>

          {/* ── Social Links ─────────────────────────────────────────── */}
          <div className="pt-2 flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-1">
              Connect:
            </span>
            {member.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name}'s ${social.platform}`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0F4C2A] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-200/80 hover:border-transparent hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-[#3FA85B]"
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
