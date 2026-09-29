'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  UserCheck,
  Download,
  Mail,
  Phone,
  GraduationCap,
  FileSpreadsheet,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Ban,
  Layers,
} from 'lucide-react';

interface ApplicationRow {
  id: string;
  submitted_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  year_of_study: string | null;
  pillar_focus: string | null;
  motivation: string | null;
  status: string;
}

interface ApplicationsTableClientProps {
  initialApplications: ApplicationRow[];
}

const PAGE_SIZE = 10;

export const ApplicationsTableClient: React.FC<ApplicationsTableClientProps> = ({
  initialApplications,
}) => {
  const router = useRouter();

  const [applications, setApplications] = useState<ApplicationRow[]>(initialApplications);
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal Drawer
  const [activeItem, setActiveItem] = useState<ApplicationRow | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Filter & Search
  const filteredApplications = useMemo(() => {
    return applications.filter((row) => {
      const matchPillar = selectedPillar === 'all' || row.pillar_focus === selectedPillar;
      const matchStatus = selectedStatus === 'all' || row.status === selectedStatus;

      const matchSearch =
        searchQuery.trim() === '' ||
        row.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.department && row.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.motivation && row.motivation.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchPillar && matchStatus && matchSearch;
    });
  }, [applications, selectedPillar, selectedStatus, searchQuery]);

  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filteredApplications.slice(startIndex, startIndex + PAGE_SIZE);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('club_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
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
      type: 'applications',
      format,
      pillar: selectedPillar,
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
              placeholder="Search by student name, email, department..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          {/* Pillar & Status Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pillar Dropdown */}
            <select
              value={selectedPillar}
              onChange={(e) => {
                setSelectedPillar(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-[#3FA85B]"
            >
              <option value="all">All 3-Zero Pillars</option>
              <option value="exclusion">01 · Zero Exclusion</option>
              <option value="carbon">02 · Zero Net Carbon</option>
              <option value="poverty">03 · Zero Poverty</option>
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
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
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
                <th className="py-3.5 px-6">Applicant</th>
                <th className="py-3.5 px-4">Pillar Focus</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Review Status</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No club applications match your filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Applicant */}
                      <td className="py-4 px-6 min-w-[200px]">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block font-mono text-sm">
                            {row.full_name}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-mono">
                            {row.email}
                          </span>
                        </div>
                      </td>

                      {/* Pillar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                            row.pillar_focus === 'exclusion'
                              ? 'bg-blue-100 text-blue-800'
                              : row.pillar_focus === 'carbon'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {row.pillar_focus || 'general'}
                        </span>
                      </td>

                      {/* Specialization */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <span className="font-sans text-slate-800 block truncate max-w-[200px]">
                          {row.department || 'ISIMS Student'}
                        </span>
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                        {new Date(row.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            row.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.status === 'reviewed'
                              ? 'bg-blue-100 text-blue-800'
                              : row.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
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
            <strong className="text-slate-900">{totalItems}</strong> applicants
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

      {/* ── Applicant Details Drawer ────────────────────────────────── */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-[#FAFCFA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#3FA85B]" />
                <span className="text-xs font-mono font-bold uppercase text-[#0F4C2A]">
                  Membership Application Review
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-mono">
                    {activeItem.full_name}
                  </h3>
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100">
                    {activeItem.pillar_focus} pillar
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Email</span>
                    <span className="text-slate-900 font-bold truncate block">{activeItem.email}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Department</span>
                    <span className="text-slate-900 font-bold truncate block">{activeItem.department || 'ISIMS'}</span>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-1.5">
                <span className="font-mono font-bold uppercase text-slate-400 text-[10px]">
                  Pitch &amp; Skills Motivation
                </span>
                <p className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 leading-relaxed font-sans text-xs">
                  {activeItem.motivation || 'No motivation notes provided.'}
                </p>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-mono font-bold uppercase text-slate-400 text-[10px]">
                  Cohort Decision Status
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {['pending', 'reviewed', 'accepted', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(activeItem.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                        activeItem.status === st
                          ? 'bg-[#0F4C2A] text-white shadow-xs font-black'
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
