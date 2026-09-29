import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { UpcomingEvent, PastEventArchive, EventCategory, TicketStatus } from '@/types/events';
import type { PillarId } from '@/types';
import { FEATURED_EVENT, UPCOMING_EVENTS, PAST_EVENTS_ARCHIVE } from '@/content/events';

type EventWithStatusRow = Database['public']['Views']['events_with_status']['Row'];

function formatDisplayDate(startsAt: string, endsAt: string): string {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  const sMonth = s.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const eMonth = e.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const sDay = s.getDate().toString().padStart(2, '0');
  const eDay = e.getDate().toString().padStart(2, '0');
  const sYear = s.getFullYear();

  if (s.toDateString() === e.toDateString()) {
    return `${sMonth} ${sDay}, ${sYear}`;
  }
  if (sMonth === eMonth) {
    return `${sMonth} ${sDay} – ${eDay}, ${sYear}`;
  }
  return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${sYear}`;
}

function formatDisplayTime(startsAt: string, endsAt: string): string {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  const sHours = s.getUTCHours().toString().padStart(2, '0');
  const sMins = s.getUTCMinutes().toString().padStart(2, '0');
  const eHours = e.getUTCHours().toString().padStart(2, '0');
  const eMins = e.getUTCMinutes().toString().padStart(2, '0');

  const diffHours = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60));
  if (diffHours >= 24) {
    return `${sHours}:${sMins} UTC+1 · ${diffHours}H SPRINT`;
  }
  return `${sHours}:${sMins} – ${eHours}:${eMins} UTC+1`;
}

export function mapRowToUpcomingEvent(row: EventWithStatusRow): UpcomingEvent {
  const startsAt = row.starts_at || new Date().toISOString();
  const endsAt = row.ends_at || new Date().toISOString();
  const capacity = row.capacity ?? 100;
  const confirmed = row.confirmed_count ?? 0;
  const remaining = Math.max(0, capacity - confirmed);

  let rawStatus: TicketStatus = 'open';
  if (row.computed_status === 'closing-soon') rawStatus = 'closing-soon';
  else if (row.computed_status === 'full') rawStatus = 'waitlist';
  else if (row.computed_status === 'closed' || row.computed_status === 'past') rawStatus = 'closed';

  let speakers: { name: string; role: string; avatar?: string }[] = [];
  if (Array.isArray(row.speakers)) {
    speakers = row.speakers as unknown as { name: string; role: string; avatar?: string }[];
  }

  return {
    id: row.id || row.slug || '',
    slug: row.slug || '',
    title: row.title || '',
    tagline: row.tagline || '',
    category: (row.category as EventCategory) || 'Workshop',
    pillarId: (row.pillar_id as PillarId | 'all') || 'all',
    startUtc: startsAt,
    endUtc: endsAt,
    displayDate: formatDisplayDate(startsAt, endsAt),
    displayTime: formatDisplayTime(startsAt, endsAt),
    location: {
      venue: row.location_venue || 'ISIMS Campus',
      room: row.location_room || undefined,
      city: row.location_city || 'Sfax, Tunisia',
      mapUrl: row.location_map_url || undefined,
    },
    coverImage:
      row.cover_image_url ||
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    description: row.description || '',
    speakersOrLeads: speakers,
    seatsTotal: capacity,
    seatsRemaining: remaining,
    ticketStatus: rawStatus,
    barcodeNumber: row.barcode_number || `3ZERO-${row.slug?.toUpperCase().slice(0, 10)}`,
    requirements: row.requirements || undefined,
    isFeatured: row.is_featured ?? false,
  };
}

export async function fetchEvents(): Promise<{
  featured: UpcomingEvent;
  upcoming: UpcomingEvent[];
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events_with_status')
      .select('*')
      .eq('draft', false)
      .neq('computed_status', 'past')
      .order('starts_at', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch failed or returned no events, falling back to static content:', error);
      return {
        featured: FEATURED_EVENT,
        upcoming: UPCOMING_EVENTS,
      };
    }

    const events = data.map(mapRowToUpcomingEvent);
    const featured = events.find((e) => e.isFeatured) || events[0] || FEATURED_EVENT;
    const upcoming = events.filter((e) => e.id !== featured.id);

    return {
      featured,
      upcoming,
    };
  } catch (err) {
    console.error('Error in fetchEvents:', err);
    return {
      featured: FEATURED_EVENT,
      upcoming: UPCOMING_EVENTS,
    };
  }
}

export async function fetchEventBySlug(slug: string): Promise<UpcomingEvent | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events_with_status')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = [FEATURED_EVENT, ...UPCOMING_EVENTS].find((e) => e.slug === slug);
      return fallback || null;
    }

    return mapRowToUpcomingEvent(data);
  } catch {
    return [FEATURED_EVENT, ...UPCOMING_EVENTS].find((e) => e.slug === slug) || null;
  }
}

export interface ArchiveQueryOptions {
  category?: string;
  year?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ArchiveQueryResult {
  items: PastEventArchive[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export async function fetchPastEventsArchive(
  options: ArchiveQueryOptions = {}
): Promise<ArchiveQueryResult> {
  const { category = 'all', year = 'all', search = '', page = 1, limit = 6 } = options;

  let dbArchive: PastEventArchive[] = [];

  try {
    const supabase = createClient();
    const { data: pastRows, error } = await supabase
      .from('events_with_status')
      .select('*, event_images(url, alt_text, sort_order)')
      .eq('draft', false)
      .or('computed_status.eq.past,override_status.eq.past')
      .order('starts_at', { ascending: false });

    if (!error && pastRows && pastRows.length > 0) {
      dbArchive = pastRows.map((row: any) => {
        const yearStr = row.starts_at ? new Date(row.starts_at).getFullYear().toString() : '2026';
        const dateFormatted = row.starts_at
          ? new Date(row.starts_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : '2026';

        const gallery = Array.isArray(row.event_images)
          ? row.event_images
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((img: any) => ({ url: img.url, altText: img.alt_text }))
          : [];

        return {
          id: row.id,
          title: row.title,
          year: yearStr,
          dateFormatted,
          category: row.category as EventCategory,
          pillarId: (row.pillar_id || 'all') as PillarId | 'all',
          attendeeCount: row.attendee_count || row.confirmed_count || 50,
          recap: row.recap || row.description || '',
          coverImage: row.cover_image_url || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
          location: row.location_venue || 'ISIMS Campus',
          projectHighlightsCount: Array.isArray(row.highlights) ? row.highlights.length : 3,
          galleryImages: gallery.length > 0 ? gallery : undefined,
          highlights: row.highlights || undefined,
        };
      });
    }
  } catch (err) {
    console.warn('Failed to query past events from DB, fallback to static:', err);
  }

  // Merge DB archive with static archive (deduplicating by title/slug)
  const mergedMap = new Map<string, PastEventArchive>();
  dbArchive.forEach((item) => mergedMap.set(item.title.toLowerCase(), item));
  PAST_EVENTS_ARCHIVE.forEach((item) => {
    if (!mergedMap.has(item.title.toLowerCase())) {
      mergedMap.set(item.title.toLowerCase(), item);
    }
  });

  let allArchive = Array.from(mergedMap.values());

  if (category && category !== 'all') {
    allArchive = allArchive.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (year && year !== 'all') {
    allArchive = allArchive.filter((e) => e.year === year);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    allArchive = allArchive.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.recap.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  const total = allArchive.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = allArchive.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

