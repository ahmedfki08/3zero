export interface ManifestoData {
  pretitle: string;
  leadQuote: string;
  subtext: string;
  author: string;
  authorRole: string;
  coordinates: string;
}

export interface StoryChapter {
  id: 'who-we-are' | 'what-we-do' | 'where-were-going';
  number: '01' | '02' | '03';
  title: string;
  shortTitle: string;
  subtitle: string;
  lead: string;
  paragraphs: string[];
  keyHighlights: {
    title: string;
    desc: string;
  }[];
  media: {
    type: 'image';
    src: string;
    alt: string;
    caption: string;
  };
  tag: string;
  accentColor: string;
  glowColor: string;
}

export interface PolaroidPhoto {
  id: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  imageUrl: string;
  alt: string;
  tag: string;
  initialPos: {
    x: number; // percentage or px offset
    y: number;
    rotate: number; // degrees
  };
}

export const ABOUT_MANIFESTO: ManifestoData = {
  pretitle: 'MISSION DECRYPTION // ISIMS CAMPUS NODE',
  leadQuote:
    'We believe poverty, climate degradation, and exclusion are not inevitable laws of nature. They are design flaws of an outdated system — and as student engineers, we are rewriting the architecture to zero.',
  subtext:
    'Born in the lecture halls of ISIMS Sfax, the 3-Zero Club unites coders, multimedia creators, and hardware tinkerers to build decentralized, open-source solutions for our campus and beyond.',
  author: 'ISIMS 3-Zero Chapter',
  authorRole: 'Higher Institute of Computer Science & Multimedia of Sfax',
  coordinates: '34.7406° N, 10.7603° E',
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'who-we-are',
    number: '01',
    title: 'Who We Are',
    shortTitle: 'Identity',
    subtitle: 'Students who got tired of only talking about problems',
    lead: "We're computer science students, AI researchers and digital artists at ISIMS, and we all wanted our degrees to be useful to someone.",
    paragraphs: [
      "A lot of what we study stays on slides. We didn't like that, so we started turning it into things people can actually use.",
      'Nobody here is above anybody else. Members choose what to work on, vote on the big decisions, and learn from each other, whether they code, design or write.',
    ],
    keyHighlights: [
      {
        title: 'Peer-to-Peer Governance',
        desc: 'Every member has a voice. Ideas and budgets get discussed in the open.',
      },
      {
        title: 'Cross-Discipline Fusion',
        desc: 'Developers and designers sit at the same table from day one.',
      },
    ],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      alt: 'ISIMS campus, our first full meeting',
      caption: 'ISIMS campus, our first full meeting',
    },
    tag: 'WHO WE ARE',
    accentColor: '#3FA85B',
    glowColor: 'rgba(63, 168, 91, 0.25)',
  },
  {
    id: 'what-we-do',
    number: '02',
    title: 'What We Do',
    shortTitle: 'Action',
    subtitle: 'We build real things that remove real barriers',
    lead: 'We make open-source IoT sensors, small funding tools and apps that help more people use public services.',
    paragraphs: [
      'Every week we meet, pick a problem and build a first version fast. Old lab electronics become air-quality sensors and other useful little devices.',
      'Nothing stays on a desk. We test each prototype on campus first, then take it to schools, craftspeople and communities around Sfax.',
    ],
    keyHighlights: [
      {
        title: 'Open Hardware & IoT',
        desc: 'Low-cost ESP32 solar sensors and second-life e-waste.',
      },
      {
        title: 'Universal Digital Access',
        desc: 'Tunisian Sign Language ML and interfaces that are easy to read and use.',
      },
    ],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      alt: 'Hardware electronics and IoT prototyping bench',
      caption: 'Lab 2: Embedded IoT Sensors & Circular Hardware Hack',
    },
    tag: 'WHAT WE DO',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'where-were-going',
    number: '03',
    title: "Where We're Going",
    shortTitle: 'Vision',
    subtitle: 'From one campus club to a network of student chapters',
    lead: 'The plan for 2026–2030 is simple: make it easy for any university in Tunisia to start its own 3-Zero club.',
    paragraphs: [
      'We want to share our playbook, our code and our mistakes with other universities, so nobody has to begin from zero.',
      'We also want student projects to last. That means a small fund, real partners and mentors who stick around after the hackathon ends.',
    ],
    keyHighlights: [
      {
        title: 'Inter-University Federation',
        desc: 'Chapters in other schools, sharing tools and events.',
      },
      {
        title: 'Permanent Seed Fund',
        desc: 'A yearly pot of money for the best student project ideas.',
      },
    ],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      alt: 'Student founders presenting roadmap to community leaders',
      caption: 'Annual 3-Zero Showcase & Regional Expansion Summit',
    },
    tag: 'Roadmap 2026–2030',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.25)',
  },
];

export const POLAROID_PHOTOS: PolaroidPhoto[] = [
  {
    id: 'photo-1',
    title: 'EcoFest Regional Panel',
    caption: 'Inter-chapter keynote and roundtable on Zero Exclusion and Zero Carbon actions.',
    date: '19 Apr 2026',
    location: 'ISIMS Amphitheatre',
    imageUrl: '/board/ecofest-panel-2026.jpg',
    alt: 'EcoFest regional conference panel presentation at ISIMS',
    tag: 'ECOFEST 4.0',
    initialPos: { x: -22, y: -12, rotate: -3 },
  },
  {
    id: 'photo-2',
    title: 'Problem Analysis & Pitch',
    caption: 'Deconstructing real-world ecological challenges into actionable student solutions.',
    date: '19 Apr 2026',
    location: 'ISIMS Lab 2',
    imageUrl: '/board/ecofest-analysis-pitch.jpg',
    alt: 'Students pitching problem analysis at EcoFest conference',
    tag: 'PITCH LAB',
    initialPos: { x: 18, y: -16, rotate: 2.5 },
  },
  {
    id: 'photo-3',
    title: 'Campus Courtyard Action Day',
    caption: 'The 3-Zero crew turning environmental commitment into direct campus courtyard action.',
    date: 'Spring 2026',
    location: 'ISIMS Courtyard',
    imageUrl: '/board/campus-clean-day.jpg',
    alt: '3-Zero campus club members during outdoor courtyard action day',
    tag: 'COMMUNITY',
    initialPos: { x: -14, y: 10, rotate: 3 },
  },
  {
    id: 'photo-4',
    title: 'Inategration day with racing sim',
    caption: 'Showcasing custom computing builds, sensors, and racing sim test stations on opening day.',
    date: '18 Feb 2026',
    location: 'ISIMS Innovation Hall',
    imageUrl: '/board/opening-day-sim-lab.jpg',
    alt: 'Interactive tech simulation station and club banner during opening day',
    tag: 'OPENING DAY',
    initialPos: { x: 16, y: 12, rotate: -2 },
  },
  {
    id: 'photo-5',
    title: 'Social Lean Canvas Workshop',
    caption: 'Masterclass with Iyed Zarrougui on structuring 9-block sustainable business models for green ventures.',
    date: '25 Feb 2026',
    location: 'ISIMS',
    imageUrl: '/board/social-lean-canvas-workshop.jpg',
    alt: 'Social Lean Canvas workshop poster featuring Iyed Zarrougui',
    tag: 'MASTERCLASS',
    initialPos: { x: 0, y: -2, rotate: -1 },
  },
  {
    id: 'photo-6',
    title: 'EcoFest Certificate Honors',
    caption: 'Celebrating student delegates and project leads at the EcoFest 4.0 closing ceremony.',
    date: '19 Apr 2026',
    location: 'ISIMS Amphitheatre',
    imageUrl: '/board/ecofest-cert-ceremony.jpg',
    alt: 'Delegates and students receiving certificates at EcoFest 4.0',
    tag: 'CEREMONY',
    initialPos: { x: -18, y: 4, rotate: 2 },
  },
  {
    id: 'photo-7',
    title: 'Campus Action & Maintenance',
    caption: 'Hands-on stewardship: transforming and maintaining student common spaces together.',
    date: 'Spring 2026',
    location: 'ISIMS Main Hall',
    imageUrl: '/board/campus-hallway-clean.jpg',
    alt: 'Members participating in campus improvement action',
    tag: 'ZERO CARBON',
    initialPos: { x: 12, y: -8, rotate: -3 },
  },
  {
    id: 'photo-8',
    title: 'Opening Day',
    caption: 'Student hardware bench featuring custom rig showcase and Social Lean Canvas interactive tools.',
    date: '18 Feb 2026',
    location: 'ISIMS Open Hall',
    imageUrl: '/board/opening-day-rig-display.jpg',
    alt: 'Custom computer hardware build on display during opening day',
    tag: 'TECH LAB',
    initialPos: { x: -8, y: 16, rotate: 1.5 },
  },
  {
    id: 'photo-9',
    title: 'Delegate Recognition Award',
    caption: 'Awarding certificate of participation and leadership during the regional summit.',
    date: '19 Apr 2026',
    location: 'ISIMS Amphitheatre',
    imageUrl: '/board/ecofest-cert-award.jpg',
    alt: 'Handover of certificate to participant at EcoFest',
    tag: 'AWARDS',
    initialPos: { x: 22, y: 8, rotate: -2.5 },
  },
];
