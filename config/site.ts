export interface NavItem {
  label: string;
  href: string;
  type: 'anchor' | 'route';
  id?: string; // Target element id if anchor
}

export interface SocialLinkItem {
  platform: 'github' | 'linkedin' | 'instagram' | 'x' | 'discord' | 'facebook';
  label: string;
  url: string;
  handle?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  university: {
    name: string;
    shortName: string;
    fullName: string;
    campus: string;
    city: string;
    country: string;
    locationText: string;
    affiliationText: string;
  };
  contact: {
    email: string;
    clubRoom: string;
  };
  nav: {
    items: NavItem[];
    cta: {
      label: string;
      href: string;
      type: 'anchor' | 'route';
      showUpcomingEventPreview: boolean;
    };
  };
  socials: SocialLinkItem[];
  footer: {
    wordmark: string;
    tagline: string;
    credit: string;
    showNewsletter: boolean;
  };
  tunables: {
    scrollThreshold: number; // px scrolled before switching from transparent to compact
    hideScrollDelta: number; // px delta required to trigger smart hide/show
    wordmarkLetterStagger: number; // seconds between letter reveals
    disableBackdropBlur: boolean; // low-power GPU fallback toggle
    headerHeight: number; // px offset for smooth scrolling
  };
}

export const siteConfig: SiteConfig = {
  name: '3-Zero Campus Club ISIMS',
  shortName: '3-Zero ISIMS',
  tagline: 'Zero Exclusion · Zero Carbon · Zero Poverty',
  description:
    'ISIMS 3-Zero is a student club at the Higher Institute of Computer Science and Multimedia of Sfax. We work toward zero exclusion, zero carbon and zero poverty through engineering, design and community work.',
  url: 'https://3zero-isims.tn',
  university: {
    name: 'ISIMS',
    shortName: 'ISIMS Sfax',
    fullName: "Institut Supérieur d'Informatique et de Multimédia de Sfax",
    campus: 'Pôle Technologique de Sfax',
    city: 'Sfax',
    country: 'Tunisia',
    locationText: 'Pôle Technologique de Sfax, Route de Tunis km 10, Sfax, Tunisia',
    affiliationText: 'University of Sfax, Tunisia',
  },
  contact: {
    email: 'contact@3zero-isims.tn',
    clubRoom: 'Lab 3 / Innovation Hub, ISIMS Campus',
  },
  nav: {
    items: [
      {
        label: 'About',
        href: '#about',
        type: 'anchor',
        id: 'about',
      },
      {
        label: 'Events',
        href: '/events',
        type: 'route',
        id: 'events',
      },
      {
        label: 'Team',
        href: '#team',
        type: 'anchor',
        id: 'team',
      },
    ],
    cta: {
      label: 'Join us',
      href: '#join',
      type: 'anchor',
      showUpcomingEventPreview: true,
    },
  },
  socials: [
    {
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/3zero_campus_club_isims/',
      handle: '@3zero_campus_club_isims',
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61587395894739',
      handle: '3-Zero Campus Club ISIMS',
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/company/3-zero-campus-club-isims',
      handle: '3-Zero Campus Club ISIMS',
    },
  ],
  footer: {
    wordmark: '3 ZERO',
    tagline: 'ISIMS 3-Zero is a student club at the Higher Institute of Computer Science and Multimedia of Sfax. We work toward zero exclusion, zero carbon and zero poverty through engineering, design and community work.',
    credit: 'Made by students, for students',
    showNewsletter: true,
  },
  tunables: {
    scrollThreshold: 40,
    hideScrollDelta: 8,
    wordmarkLetterStagger: 0.07,
    disableBackdropBlur: false,
    headerHeight: 76,
  },
};
