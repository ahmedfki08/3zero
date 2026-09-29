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
    title: 'Hardware Circularity Lab',
    caption: 'Old lab PCs turned into light Linux learning stations.',
    date: 'Oct 2025',
    location: 'ISIMS Lab 4',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    alt: 'Students hacking computer hardware together',
    tag: 'CIRCULAR LAB',
    initialPos: { x: -28, y: -18, rotate: -4 },
  },
  {
    id: 'photo-2',
    title: 'SignStream Hackathon',
    caption: '48 hours to build a Tunisian Sign Language translator.',
    date: 'Dec 2025',
    location: 'Ampli ISIMS',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    alt: 'Team coding late night at hackathon table',
    tag: 'HACKATHON',
    initialPos: { x: -10, y: -26, rotate: 3 },
  },
  {
    id: 'photo-3',
    title: 'Sfax Medina Outreach',
    caption: 'We sat with leather artisans and helped them put their work online.',
    date: 'Jan 2026',
    location: 'Medina of Sfax',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    alt: 'Students interviewing craftspeople in old city',
    tag: 'FIELDWORK',
    initialPos: { x: 20, y: -22, rotate: -2 },
  },
  {
    id: 'photo-7',
    title: 'AI Computer Vision Lab',
    caption: 'Testing live gesture and sign recognition, with lots of bugs.',
    date: 'May 2026',
    location: 'ISIMS AI Hub',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    alt: 'Real time computer vision interface on monitor',
    tag: 'VISION AI',
    initialPos: { x: -14, y: -2, rotate: -3 },
  },
  {
    id: 'photo-8',
    title: 'Community Micro-Grant Review',
    caption: 'Students judged small business ideas and picked who to back.',
    date: 'Jun 2026',
    location: 'Coworking Sfax',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    alt: 'Students reviewing business project on laptop',
    tag: 'VENTURE SEED',
    initialPos: { x: 2, y: 0, rotate: 2 },
  },
  {
    id: 'photo-9',
    title: 'Open Source Code Sprint',
    caption: 'A full day of pull requests, reviews and docs for open projects.',
    date: 'Jul 2026',
    location: 'ISIMS North Hall',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    alt: 'Hackers and developers collaborating with laptops',
    tag: 'CODE SPRINT',
    initialPos: { x: 16, y: -2, rotate: -1 },
  },
  {
    id: 'photo-4',
    title: 'Solar Telemetry Deployment',
    caption: 'Setting up a solar-powered sensor on the rooftop.',
    date: 'Oct 2026',
    location: 'ISIMS Rooftop',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    alt: 'Solar panel and environmental sensor setup',
    tag: 'ROOFTOP LAB',
    initialPos: { x: -24, y: 20, rotate: 4 },
  },
  {
    id: 'photo-5',
    title: 'UI/UX Accessibility Workshop',
    caption: 'Learning to design screens that everyone can read and tap.',
    date: 'Nov 2026',
    location: 'ISIMS',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    alt: 'Inclusive design user testing session',
    tag: 'INCLUSION',
    initialPos: { x: -2, y: 22, rotate: -3 },
  },
  {
    id: 'photo-6',
    title: 'Campus Pitch Day',
    caption: 'Teams get three minutes to convince the room.',
    date: 'Dec 2026',
    location: 'ISIMS',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    alt: 'Student pitching on stage with slides',
    tag: 'PITCH NIGHT',
    initialPos: { x: 24, y: 18, rotate: 3 },
  },
];
