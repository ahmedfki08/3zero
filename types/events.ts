import { PillarId } from './index';

export type EventCategory =
  | 'Hackathon'
  | 'Workshop'
  | 'Symposium'
  | 'Tech Talk'
  | 'Fieldwork'
  | 'Ideation Jam';

export type TicketStatus = 'open' | 'closing-soon' | 'waitlist' | 'closed';

export interface UpcomingEvent {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: EventCategory;
  pillarId: PillarId | 'all';
  startUtc: string; // ISO string e.g. "2026-10-15T09:00:00Z"
  endUtc: string;   // ISO string e.g. "2026-10-16T18:00:00Z"
  displayDate: string; // "Oct 15 - 16, 2026"
  displayTime: string; // "09:00 - 18:00 UTC+1"
  location: {
    venue: string;
    room?: string;
    city: string;
    mapUrl?: string;
  };
  coverImage: string;
  description: string;
  speakersOrLeads: {
    name: string;
    role: string;
    avatar?: string;
  }[];
  seatsTotal: number;
  seatsRemaining: number;
  ticketStatus: TicketStatus;
  barcodeNumber: string;
  requirements?: string[];
  isFeatured?: boolean;
}

export interface PastEventArchive {
  id: string;
  title: string;
  year: string;
  dateFormatted: string;
  category: EventCategory;
  pillarId: PillarId | 'all';
  attendeeCount: number;
  recap: string;
  coverImage: string;
  location: string;
  projectHighlightsCount?: number;
  galleryImages?: {
    url: string;
    altText?: string;
  }[];
  highlights?: string[];
}

export interface EventRegistrationPayload {
  eventId: string;
  fullName: string;
  email: string;
  affiliation: 'ISIMS Student' | 'External Student' | 'Faculty / Researcher' | 'Industry / Guest';
  studentIdOrOrg?: string;
  majorOrField?: string;
  motivationNotes?: string;
}
