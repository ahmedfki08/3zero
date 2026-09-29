'use client';

import React, { useState } from 'react';
import { PillarId } from '@/types';
import { Navbar } from '@/components/layout/navbar/Navbar';
import { HeroLogo } from '@/components/layout/navbar/HeroLogo';
import { ParticleLogoReveal } from '@/components/sections/about/ParticleLogoReveal';
import { HeroPortals } from '@/components/sections/HeroPortals';
import { AboutUs } from '@/components/sections/AboutUs';
import { ImpactTelemetry } from '@/components/sections/ImpactTelemetry';
import { ProjectsMatrix } from '@/components/sections/ProjectsMatrix';
import { EventsTimeline } from '@/components/sections/EventsTimeline';
import { StaffSection } from '@/components/sections/staff/StaffSection';
import { SponsorDeck } from '@/components/sections/SponsorDeck';
import { JoinMovement } from '@/components/sections/JoinMovement';
import { Footer } from '@/components/layout/footer/Footer';

export default function HomePage() {
  const [joinInitialPillar, setJoinInitialPillar] = useState<PillarId | null>(null);

  const handleOpenJoinForm = (pillarId: PillarId) => {
    setJoinInitialPillar(pillarId);
    const joinEl = document.getElementById('join');
    if (joinEl) {
      joinEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFCFA] text-[#0F172A] flex flex-col selection:bg-[#3FA85B] selection:text-white">
      {/* Navigation */}
      <Navbar onOpenPillarModal={handleOpenJoinForm} />

      {/* Hero Logo: large fixed top-left, slides up on scroll */}
      <HeroLogo />

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Hero: WebGL Particle Logo Reveal & Campus Chapter Opening Hook */}
        <ParticleLogoReveal />

        {/* The 3 Zeros: Interactive Sculptural Dimensions */}
        <HeroPortals onOpenJoinForm={handleOpenJoinForm} />

        {/* About Us: ISIMS Campus Chapter */}
        <AboutUs />

        {/* Upcoming Roadmap & Workshops */}
        <EventsTimeline />

        {/* Chapter Leadership / Staff Roster Spotlight */}
        <StaffSection />

        {/* Partnership & Sponsorship Deck */}
        <SponsorDeck />

        {/* Student Onboarding & Cohort Application */}
        <JoinMovement initialPillar={joinInitialPillar} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
