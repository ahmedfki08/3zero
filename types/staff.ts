export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'email'
  | 'facebook'
  | 'instagram';

export interface StaffSocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface StaffMember {
  id: string;
  index: string; // "01", "02", etc.
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  pillarFocus?: 'Zero Net Carbon' | 'Zero Poverty' | 'Zero Exclusion' | 'Core Lead';
  quote: string;
  bio: string;
  funFact?: string;
  portraitCutout?: string; // Path to transparent PNG/WebP cutout
  fallbackPhoto?: string;  // Regular photo fallback if cutout not present
  photoType: 'cutout' | 'framed';
  socials: StaffSocialLink[];
  mandateYear?: string;    // e.g. "2025-2026", "2024-2025"
  order?: number;
}

export interface ExecutiveBoardCohort {
  id: string;              // e.g. "2025-2026", "2024-2025"
  yearLabel: string;       // e.g. "2025 – 2026", "2024 – 2025"
  tagline: string;         // e.g. "Current Mandate", "Foundation Team"
  isCurrent?: boolean;
  members: StaffMember[];
}

