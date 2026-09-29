'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  X,
  Calendar,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface EventRow {
  id: string | null;
  slug: string | null;
  title: string | null;
  category: string | null;
  pillar_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  capacity: number | null;
  draft: boolean | null;
  computed_status: string | null;
  confirmed_count: number | null;
}

interface EventsTableClientProps {
  initialEvents: EventRow[];
}

export const EventsTableClient: React.FC<EventsTableClientProps> = ({
  initialEvents,
}) => {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'archive' | 'draft'>('all');

  // Deletion modal state
  const [eventToDelete, setEventToDelete] = useState<EventRow | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toggle draft state
  const handleToggleDraft = async (id: string, currentDraft: boolean) => {
    // Optimistic UI update
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, draft: !currentDraft } : e))
    );

    const supabase = createClient();
    const { error } = await supabase
      .from('events')
      .update({ draft: !currentDraft })
      .eq('id', id);

    if (error) {
      console.error('Failed to toggle draft status:', error);
      // Revert on error
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, draft: currentDraft } : e))
      );
    } else {
      router.refresh();
    }
  };

  // Delete event confirmation
  const handleDeleteEvent = async () => {
    if (!eventToDelete || !eventToDelete.id) return;

    // If event has registrations, require typing title to confirm
    const hasRegistrations = (eventToDelete.confirmed_count ?? 0) > 0;
    if (hasRegistrations && confirmTitle.trim() !== eventToDelete.title?.trim()) {
      setDeleteError('Please type the exact event title to confirm deletion.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete.id);

      if (error) {
        setDeleteError(error.message);
        setIsDeleting(false);
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setEventToDelete(null);
      setConfirmTitle('');
      setIsDeleting(false);
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete event');
      setIsDeleting(false);
    }
  };

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.category && e.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.slug && e.slug.toLowerCase().includes(searchQuery.toLowerCase()));

    const isPast = e.computed_status === 'past';

    const matchType =
      filterType === 'all' ||
      (filterType === 'upcoming' && !e.draft && !isPast) ||
      (filterType === 'archive' && !e.draft && isPast) ||
      (filterType === 'draft' && e.draft);

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4">
      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, slug or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'archive', label: 'Past Archive' },
            { id: 'draft', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Container ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FAFCFA] text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-6">Event Details</th>
                <th className="py-3.5 px-4">Type / Format</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Turnout / Capacity</th>
                <th className="py-3.5 px-4">Status &amp; Visibility</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No events match your current filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const startsFormatted = evt.starts_at
                    ? new Date(evt.starts_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'TBD';

                  const isLive = !evt.draft;
                  const isPast = evt.computed_status === 'past';

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Event Details */}
                      <td className="py-4 px-6 min-w-[240px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-sans text-sm">
                              {evt.title}
                            </span>
                            {isPast && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[9px] font-bold uppercase">
                                Archive
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block">
                            /{evt.slug}
                          </span>
                        </div>
                      </td>

                      {/* Category & Pillar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                          {evt.category || 'General'}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{startsFormatted}</span>
                        </div>
                      </td>

                      {/* Passes / Capacity */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Users className="w-3.5 h-3.5 text-[#3FA85B]" />
                          <span className="font-bold">{evt.confirmed_count ?? 0}</span>
                          <span className="text-slate-400">/ {evt.capacity ?? '∞'}</span>
                        </div>
                      </td>

                      {/* Visibility & Status Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDraft(evt.id!, !!evt.draft)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              isLive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {isLive ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-600" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-amber-600" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/events/${evt.id}/edit`}
                            title="Edit Event &amp; Form Fields"
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/events?event=${evt.slug}`}
                            target="_blank"
                            title="Preview on Public Site"
                            className="p-2 rounded-xl text-slate-500 hover:text-[#0F4C2A] hover:bg-[#E8F7EE] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setEventToDelete(evt);
                              setConfirmTitle('');
                              setDeleteError(null);
                            }}
                            title="Delete Event"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Deletion Safety Modal ────────────────────────────────────── */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-sans">
                Delete Event?
              </h3>
              <p className="text-xs font-sans text-slate-500 max-w-xs mx-auto">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900 font-mono">{eventToDelete.title}</strong>?
              </p>
            </div>

            {(eventToDelete.confirmed_count ?? 0) > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-sans text-rose-800 space-y-2">
                <p className="font-bold">
                  ⚠️ This event already has {eventToDelete.confirmed_count} confirmed registrations!
                </p>
                <p className="text-[11px] text-rose-600">
                  Deleting will cancel all linked registrations. To proceed, type the exact event title below:
                </p>
                <input
                  type="text"
                  placeholder={eventToDelete.title || ''}
                  value={confirmTitle}
                  onChange={(e) => setConfirmTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}

            {deleteError && (
              <p className="text-xs font-sans text-rose-600 text-center font-bold">
                {deleteError}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteEvent}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold uppercase transition-colors shadow-sm flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
