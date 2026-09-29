'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { StaffMember } from '@/types/staff';
import { defaultStaffConfig, StaffSectionConfig } from './staffConfig';
import { useRosterNavigation } from '@/hooks/useRosterNavigation';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { RosterList } from './RosterList';
import { PortraitStage } from './PortraitStage';
import { MemberDetails } from './MemberDetails';

interface StaffSpotlightProps {
  members: StaffMember[];
  config?: StaffSectionConfig;
}

export const StaffSpotlight: React.FC<StaffSpotlightProps> = ({
  members,
  config = defaultStaffConfig,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    currentIndex,
    activeMember,
    direction,
    selectMember,
    handleHoverIntent,
    handleHoverCancel,
    handleKeyDown,
    onTouchStart,
    onTouchEnd,
  } = useRosterNavigation(members, config);

  const parallax = usePointerParallax(containerRef, config);

  // Determine adjacent members to preload images for instant swaps
  const preloadList =
    members.length > 0
      ? [
          members[(currentIndex - 1 + members.length) % members.length],
          members[(currentIndex + 1) % members.length],
        ].filter(Boolean)
      : [];

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* ── Hidden Image Preloaders for Instant Adjacent Swaps ──────── */}
      <div className="hidden" aria-hidden="true">
        {preloadList.map((m) => {
          const src = m.fallbackPhoto || m.portraitCutout;
          return src ? (
            <Image
              key={`preload-${m.id}`}
              src={src}
              alt=""
              width={10}
              height={10}
              priority={false}
            />
          ) : null;
        })}
      </div>

      {/* ── Main 3-Column Desktop Grid Layout / Stacked on Mobile ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Interactive Roster List (4 cols) */}
        <div className="order-2 lg:order-1 lg:col-span-4 w-full">
          <RosterList
            members={members}
            currentIndex={currentIndex}
            onSelect={selectMember}
            onHoverIntent={handleHoverIntent}
            onHoverCancel={handleHoverCancel}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Center Column: Portrait Stage with Parallax & Depth Layers (4 cols) */}
        <div className="order-1 lg:order-2 lg:col-span-4 w-full flex justify-center">
          <PortraitStage
            member={activeMember}
            totalMembers={members.length}
            direction={direction}
            parallax={parallax}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </div>

        {/* Right Column: Member Details, Quotes & Socials (4 cols) */}
        <div className="order-3 lg:order-3 lg:col-span-4 w-full">
          <MemberDetails member={activeMember} direction={direction} />
        </div>
      </div>
    </div>
  );
};
