export type PillarId = 'poverty' | 'carbon' | 'exclusion';

export interface PillarMetric {
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
}

export interface PillarData {
  id: PillarId;
  code: '01' | '02' | '03';
  title: string;
  subTitle: string;
  tagline: string;
  description: string;
  color: {
    primary: string;
    glow: string;
    gradient: string;
    badge: string;
    accent: string;
    border: string;
  };
  manifesto: {
    headline: string;
    coreProblem: string;
    ourSolution: string;
    quote: string;
  };
  metrics: PillarMetric[];
  focusAreas: {
    title: string;
    desc: string;
    iconName: string;
  }[];
  activeProjectsCount: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  pillarId: PillarId;
  pillarLabel: string;
  status: 'Active' | 'Beta' | 'Completed' | 'Ideation';
  summary: string;
  impactScore: string;
  leadStudent: string;
  techStack: string[];
  metricsAchieved: string;
  githubUrl?: string;
  demoUrl?: string;
  coverGradient: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Symposium' | 'Green Action' | 'Mentorship' | 'Tech Talk';
  pillarId: PillarId | 'all';
  date: string;
  time: string;
  location: string;
  seatsTotal: number;
  seatsRemaining: number;
  speakerOrLead: string;
  description: string;
  isUpcoming: boolean;
}

export interface TelemetryStat {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix: string;
  caption: string;
  pillarId: PillarId | 'general';
}

export interface SponsorTier {
  id: string;
  name: string;
  investment: string;
  featured: boolean;
  color: string;
  benefits: string[];
  ctaLabel: string;
}

export interface TeamMember {
  name: string;
  role: string;
  pillar?: PillarId;
  department: string;
  avatarInitials: string;
}
