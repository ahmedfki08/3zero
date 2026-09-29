'use client';

import React from 'react';
import { ThreePanelStory } from './about/ThreePanelStory';
import { PolaroidWall } from './about/PolaroidWall';

export const AboutUs: React.FC = () => {
  return (
    <section
      id="about"
      className="relative bg-[#FAFCFA] border-b border-slate-200/80"
    >
      {/* Part 1: Three-Panel Split Story (Structure) */}
      <ThreePanelStory />

      {/* Part 2: Draggable Polaroid Wall (Personality) */}
      <PolaroidWall />
    </section>
  );
};
