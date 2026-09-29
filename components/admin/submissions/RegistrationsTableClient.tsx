'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Ticket,
  User,
  Mail,
  GraduationCap,
  FileSpreadsheet,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Ban,
} from 'lucide-react';

interface RegistrationRow {
  id: string;
  event_id: string;
  submitted_at: string;
  email: string | null;
  status: string;
  responses: any;
  events?: {
    id: string;
    title: string;
    category: string;
    slug: string;
  } | null;
}

interface RegistrationsTableClientProps {
  initialRegistrations: RegistrationRow[];
  eventsList: { id: string; title: string }[];
}

const PAGE_SIZE = 10;

export const RegistrationsTableClient: React.FC<RegistrationsTableClientProps> = ({
  initialRegistrations,
  eventsList,
}) => {
  const router = useRouter();

  const [registrations, setRegistrations] = useState<RegistrationRow[]>(initialRegistrations);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal Drawer
  const [activeItem, setActiveItem] = useState<RegistrationRow | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Filter & Search
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((row) => {
      const matchEvent = selectedEventId === 'all' || row.event_id === selectedEventId;
      const matchStatus = selectedStatus === 'all' || row.status === selectedStatus;

      const responses = (row.responses || {}) as Record<string, any>;
      const matchSearch =
        searchQuery.trim() === '' ||
        (row.email && row.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (responses.fullName && String(responses.fullName).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.events?.title && row.events.title.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchEvent && matchStatus && matchSearch;
    });
  }, [registrations, selectedEventId, selectedStatus, searchQuery]);

  const totalItems = filteredRegistrations.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filteredRegistrations.slice(startIndex, startIndex + PAGE_SIZE);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('event_registrations')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (activeItem && activeItem.id === id) {
        setActiveItem({ ...activeItem, status: newStatus });
      }
      router.refresh();
    }
    setIsUpdatingStatus(false);
  };

  // Export URL builder
  const getExportUrl = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams({
      type: 'registrations',
      format,
      eventId: selectedEventId,
      status: selectedStatus,
      q: searchQuery,
    });
    return `/api/admin/export?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* ── Filter Controls Bar ─────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by attendee name, email, event..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          {/* Event & Status Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Event Dropdown */}
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-[#3FA85B]"
            >
              <option value="all">All Events &amp; Sprints</option>
              {eventsList.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#3FA85B]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Export Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <a
                href={getExportUrl('csv')}
                download
                title="Export filtered view as CSV"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-mono font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>CSV</span>
              </a>

              <a
                href={getExportUrl('xlsx')}
                download
                title="Export filtered view as Excel"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-mono font-bold shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Container ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FAFCFA] text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-6">Attendee</th>
                <th className="py-3.5 px-4">Event Pass</th>
                <th className="py-3.5 px-4">Affiliation / Major</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((row) => {
                  const responses = (row.responses || {}) as Record<string, any>;
                  const attendeeName = responses.fullName || 'Anonymous';
                  const email = row.email || responses.email || '—';
                  const affiliation = responses.affiliation || 'Student';

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Attendee */}
                      <td className="py-4 px-6 min-w-[200px]">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block font-mono text-sm">
                            {attendeeName}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-mono">
                            {email}
                          </span>
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <span className="font-sans font-bold text-slate-800 block truncate max-w-[220px]">
                          {row.events?.title || 'Unknown Event'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {row.events?.category || 'Sprint'}
                        </span>
                      </td>

                      {/* Affiliation */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px]">
                          {affiliation}
                        </span>
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                        {new Date(row.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            row.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.status === 'waitlisted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveItem(row)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ─────────────────────────────────────── */}
        <div className="p-4 border-t border-slate-100 bg-[#FAFCFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{paginatedItems.length}</strong> of{' '}
            <strong className="text-slate-900">{totalItems}</strong> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Registration Details Modal / Drawer ─────────────────────── */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-[#FAFCFA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#3FA85B]" />
                <span className="text-xs font-mono font-bold uppercase text-[#0F4C2A]">
                  Pass Registration Details
                </span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 space-y-5 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Event
                </span>
                <p className="text-sm font-bold text-slate-900 font-sans">
                  {activeItem.events?.title || 'Unknown Event'}
                </p>
                <span className="text-[11px] font-mono text-[#0F4C2A]">
                  Pass ID: {activeItem.id}
                </span>
              </div>

              {/* Responses Map */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold uppercase text-slate-400 text-[10px] tracking-wider">
                  Submission Answers
                </h4>

                <div className="space-y-2 font-mono">
                  {Object.entries(activeItem.responses || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-white border border-slate-100 flex flex-col gap-0.5"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-xs text-slate-800 break-words font-sans">
                        {String(val || '—')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-mono font-bold uppercase text-slate-400 text-[10px]">
                  Change Admission Status
                </span>
                <div className="flex items-center gap-2">
                  {['confirmed', 'waitlisted', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(activeItem.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                        activeItem.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-[#FAFCFA] flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold uppercase"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
