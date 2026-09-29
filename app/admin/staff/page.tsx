'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffMember, ExecutiveBoardCohort, SocialPlatform, StaffSocialLink } from '@/types/staff';
import {
  fetchStaffCohorts,
  createOrUpdateCohort,
  deleteCohort,
  saveStaffMember,
  deleteStaffMember,
} from '@/lib/data/staff';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  CheckCircle2,
  X,
  Globe,
  Mail,
  Calendar,
  Layers,
  Upload,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

const PILLAR_OPTIONS: Array<StaffMember['pillarFocus']> = [
  'Core Lead',
  'Zero Net Carbon',
  'Zero Poverty',
  'Zero Exclusion',
];

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'linkedin',
  'github',
  'instagram',
  'facebook',
  'twitter',
  'website',
  'email',
];

export default function AdminStaffPage() {
  const [cohorts, setCohorts] = useState<ExecutiveBoardCohort[]>([]);
  const [activeCohortId, setActiveCohortId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<StaffMember> | null>(null);
  const [editingCohort, setEditingCohort] = useState<Partial<ExecutiveBoardCohort> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStaffCohorts();
      setCohorts(data.cohorts);
      setActiveCohortId(data.currentCohortId || data.cohorts[0]?.id || '');
    } catch (err) {
      console.error(err);
      showNotification('Failed to load executive board cohorts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const activeCohort = cohorts.find((c) => c.id === activeCohortId) || cohorts[0];

  // ── Member Management ──────────────────────────────────────────────────────────
  const handleOpenAddMember = () => {
    setEditingMember({
      name: '',
      firstName: '',
      lastName: '',
      role: '',
      department: 'Software & Cloud Engineering, ISIMS',
      pillarFocus: 'Core Lead',
      quote: "Let's build a Zero Exclusion, Zero Carbon, Zero Poverty world.",
      bio: '',
      funFact: '',
      portraitCutout: '',
      fallbackPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      photoType: 'framed',
      socials: [
        { platform: 'linkedin', url: '' },
        { platform: 'github', url: '' },
      ],
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: StaffMember) => {
    setEditingMember({ ...member, socials: member.socials ? [...member.socials] : [] });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !activeCohortId) return;

    try {
      const updatedCohorts = await saveStaffMember(activeCohortId, editingMember);
      setCohorts(updatedCohorts);
      setIsMemberModalOpen(false);
      setEditingMember(null);
      showNotification('Board member saved successfully!');
    } catch (err: any) {
      showNotification(err.message || 'Error saving member', 'error');
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this cohort?`)) return;

    try {
      const updatedCohorts = await deleteStaffMember(activeCohortId, memberId);
      setCohorts(updatedCohorts);
      showNotification('Board member deleted.');
    } catch (err: any) {
      showNotification(err.message || 'Error deleting member', 'error');
    }
  };

  const handleMoveMember = async (index: number, direction: 'up' | 'down') => {
    if (!activeCohort) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeCohort.members.length) return;

    const newMembers = [...activeCohort.members];
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIdx];
    newMembers[targetIdx] = temp;

    // reindex
    const reindexed = newMembers.map((m, i) => ({
      ...m,
      index: String(i + 1).padStart(2, '0'),
      order: i + 1,
    }));

    const updated = cohorts.map((c) => (c.id === activeCohort.id ? { ...c, members: reindexed } : c));
    setCohorts(updated);
    await createOrUpdateCohort({ id: activeCohort.id, members: reindexed });
  };

  // ── Cohort (Mandate Year) Management ──────────────────────────────────────────
  const handleOpenAddCohort = () => {
    setEditingCohort({
      id: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      yearLabel: `${new Date().getFullYear()} – ${new Date().getFullYear() + 1}`,
      tagline: 'Executive Board',
      isCurrent: cohorts.length === 0,
    });
    setIsCohortModalOpen(true);
  };

  const handleOpenEditCohort = (cohort: ExecutiveBoardCohort) => {
    setEditingCohort({ ...cohort });
    setIsCohortModalOpen(true);
  };

  const handleSaveCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCohort) return;

    try {
      const updatedCohorts = await createOrUpdateCohort(editingCohort);
      setCohorts(updatedCohorts);
      if (editingCohort.id) {
        setActiveCohortId(editingCohort.id);
      }
      setIsCohortModalOpen(false);
      setEditingCohort(null);
      showNotification('Mandate cohort saved!');
    } catch (err: any) {
      showNotification(err.message || 'Error saving cohort', 'error');
    }
  };

  const handleDeleteCohort = async (cohortId: string, label: string) => {
    if (cohorts.length <= 1) {
      alert('You must keep at least one mandate cohort.');
      return;
    }
    if (!confirm(`Are you sure you want to delete the "${label}" cohort and all its member records?`)) return;

    try {
      const updated = await deleteCohort(cohortId);
      setCohorts(updated);
      setActiveCohortId(updated[0]?.id || '');
      showNotification('Cohort deleted.');
    } catch (err: any) {
      showNotification(err.message || 'Error deleting cohort', 'error');
    }
  };

  // Socials editor helper
  const handleAddSocial = () => {
    if (!editingMember) return;
    const current = editingMember.socials || [];
    setEditingMember({
      ...editingMember,
      socials: [...current, { platform: 'linkedin', url: '' }],
    });
  };

  const handleUpdateSocial = (index: number, field: keyof StaffSocialLink, val: string) => {
    if (!editingMember || !editingMember.socials) return;
    const next = [...editingMember.socials];
    next[index] = { ...next[index], [field]: val };
    setEditingMember({ ...editingMember, socials: next });
  };

  const handleRemoveSocial = (index: number) => {
    if (!editingMember || !editingMember.socials) return;
    const next = editingMember.socials.filter((_, i) => i !== index);
    setEditingMember({ ...editingMember, socials: next });
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#3FA85B]/10 text-[#3FA85B] border border-[#3FA85B]/20">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Management Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Executive Board &amp; Leadership
          </h1>
          <p className="text-xs sm:text-sm font-mono text-emerald-100/60 mt-1">
            Edit photos, names, roles and departments for all executive boards starting from the foundation team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAddCohort}
            className="px-4 py-2.5 rounded-xl border border-emerald-700/60 hover:border-[#3FA85B] bg-[#0A2E16] text-emerald-200 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>+ Add Mandate Year</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddMember}
            disabled={!activeCohort}
            className="px-5 py-2.5 rounded-xl bg-[#3FA85B] hover:bg-[#32934D] text-[#071A0E] text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#3FA85B]/20 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Board Member</span>
          </button>
        </div>
      </div>

      {/* ── Notification Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border text-xs font-mono font-bold flex items-center gap-3 shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-[#3FA85B]/60 text-emerald-200'
                : 'bg-red-950/80 border-red-500/60 text-red-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#3FA85B]" />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cohort / Mandate Year Tabs ────────────────────────────────────────── */}
      <div className="bg-[#0A2614] p-4 sm:p-5 rounded-3xl border border-emerald-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Mandate Years / Cohorts
            </span>
            <span className="text-[10px] font-mono text-emerald-400/60 bg-white/5 px-2 py-0.5 rounded-md">
              {cohorts.length} Mandate{cohorts.length > 1 ? 's' : ''}
            </span>
          </div>

          {activeCohort && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEditCohort(activeCohort)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-[#3FA85B]" />
                <span>Edit Mandate Info</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteCohort(activeCohort.id, activeCohort.yearLabel)}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Mandate</span>
              </button>
            </div>
          )}
        </div>

        {/* Cohort Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {cohorts.map((cohort) => {
            const isActive = cohort.id === activeCohortId;
            return (
              <button
                key={cohort.id}
                type="button"
                onClick={() => setActiveCohortId(cohort.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
                  isActive
                    ? 'bg-[#3FA85B] text-[#071A0E] font-black border-[#3FA85B] shadow-md shadow-[#3FA85B]/20'
                    : 'bg-[#071A0E]/70 hover:bg-white/5 text-emerald-100/70 border-emerald-900/60'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${isActive ? 'text-[#071A0E]' : 'text-[#3FA85B]'}`} />
                <span>{cohort.yearLabel}</span>
                {cohort.tagline && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                      isActive ? 'bg-black/20 text-[#071A0E]' : 'bg-white/10 text-emerald-300'
                    }`}
                  >
                    {cohort.tagline}
                  </span>
                )}
                {cohort.isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" title="Active on live site" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Cohort Roster List / Cards ─────────────────────────────────── */}
      {activeCohort && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-sans text-white">
                {activeCohort.yearLabel} Executive Roster
              </span>
              <span className="text-xs font-mono text-emerald-400">
                ({activeCohort.members.length} Member{activeCohort.members.length > 1 ? 's' : ''})
              </span>
            </div>

            <span className="text-xs font-mono text-emerald-400/50 hidden sm:inline-block">
              Drag or use arrows to set member order on the live website
            </span>
          </div>

          {activeCohort.members.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0A2614] border border-dashed border-emerald-800/60 space-y-4">
              <Users className="w-10 h-10 text-emerald-600 mx-auto opacity-70" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-mono">No board members yet in this cohort</h3>
                <p className="text-xs text-emerald-200/60 font-mono">
                  Click below to add the president, leads, and officers for {activeCohort.yearLabel}.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddMember}
                className="px-5 py-2.5 rounded-xl bg-[#3FA85B] text-[#071A0E] text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add First Member</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeCohort.members.map((member, index) => (
                <div
                  key={member.id}
                  className="rounded-3xl bg-[#082212] border border-emerald-900/70 p-5 flex flex-col justify-between space-y-4 hover:border-[#3FA85B]/40 transition-all duration-200 group shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Portrait Thumbnail */}
                    <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-[#0F3319] border border-emerald-700/40 shrink-0">
                      <Image
                        src={member.portraitCutout || member.fallbackPhoto || '/logo.png'}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 font-bold">
                        {member.index}
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-[#4ADE80] uppercase tracking-wider block truncate">
                          {member.pillarFocus || 'Executive'}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400/50">
                          #{member.order ?? index + 1}
                        </span>
                      </div>

                      <h3 className="text-base font-black font-sans text-white truncate group-hover:text-emerald-300 transition-colors">
                        {member.name}
                      </h3>

                      <p className="text-xs font-mono text-emerald-200/80 line-clamp-1">
                        {member.role}
                      </p>

                      <p className="text-[10px] font-mono text-emerald-300/50 truncate">
                        {member.department}
                      </p>
                    </div>
                  </div>

                  {/* Quote Snippet */}
                  {member.quote && (
                    <p className="text-[11px] font-serif italic text-emerald-100/70 line-clamp-2 px-1 border-l-2 border-[#3FA85B]/40 pl-2.5">
                      “{member.quote}”
                    </p>
                  )}

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs">
                    {/* Order buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMember(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMember(index, 'down')}
                        disabled={index === activeCohort.members.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit & Delete buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMember(member)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#3FA85B] hover:text-[#071A0E] text-emerald-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-300 border border-red-800/40 transition-colors cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Member Editor Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMemberModalOpen && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMemberModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#082212] border border-emerald-800/80 p-6 sm:p-8 shadow-2xl space-y-6 text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#4ADE80]">
                    {activeCohort?.yearLabel} Mandate
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-sans text-white">
                    {editingMember.id ? 'Edit Executive Member' : 'Add Executive Member'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-emerald-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveMember} className="space-y-5 font-mono text-xs">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const parts = name.trim().split(' ');
                        setEditingMember({
                          ...editingMember,
                          name,
                          firstName: parts[0] || '',
                          lastName: parts.slice(1).join(' ') || '',
                        });
                      }}
                      placeholder="e.g. Youssef Triki"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Executive Role *</label>
                    <input
                      type="text"
                      required
                      value={editingMember.role || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      placeholder="e.g. Club President & Lead Architect"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>
                </div>

                {/* Department & Pillar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Department / Major</label>
                    <input
                      type="text"
                      value={editingMember.department || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                      placeholder="e.g. Software & Cloud Engineering, ISIMS"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Pillar Focus</label>
                    <select
                      value={editingMember.pillarFocus || 'Core Lead'}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          pillarFocus: e.target.value as StaffMember['pillarFocus'],
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white focus:outline-none focus:border-[#3FA85B]"
                    >
                      {PILLAR_OPTIONS.map((p) => (
                        <option key={p} value={p} className="bg-[#082212] text-white">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Photos / Portrait URL */}
                <div className="space-y-3 p-4 rounded-2xl bg-black/30 border border-emerald-900/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Portrait &amp; Photo</span>
                    <span className="text-[10px] text-emerald-400/60">Paste public URL or image link</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-emerald-200/70 mb-1">
                        Portrait Cutout (Transparent PNG preferred)
                      </label>
                      <input
                        type="text"
                        value={editingMember.portraitCutout || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, portraitCutout: e.target.value })}
                        placeholder="/staff/youssef.png or https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-emerald-800/60 text-white placeholder:text-emerald-800 focus:outline-none focus:border-[#3FA85B]"
                      />
                    </div>

                    <div>
                      <label className="block text-emerald-200/70 mb-1">
                        Fallback Photo (Square or portrait photo)
                      </label>
                      <input
                        type="text"
                        value={editingMember.fallbackPhoto || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, fallbackPhoto: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-emerald-800/60 text-white placeholder:text-emerald-800 focus:outline-none focus:border-[#3FA85B]"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  {(editingMember.portraitCutout || editingMember.fallbackPhoto) && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#0F3319] border border-emerald-600/40">
                        <Image
                          src={editingMember.portraitCutout || editingMember.fallbackPhoto || '/logo.png'}
                          alt="Preview"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[11px] text-emerald-300/70">Photo preview loaded</span>
                    </div>
                  )}
                </div>

                {/* Quote, Bio & Fun Fact */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Quote / Board Motto</label>
                    <input
                      type="text"
                      value={editingMember.quote || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, quote: e.target.value })}
                      placeholder="Let's build a Zero Exclusion, Zero Carbon, Zero Poverty world."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Bio / Responsibilities</label>
                    <textarea
                      rows={2}
                      value={editingMember.bio || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                      placeholder="Brief summary of their contribution and background..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-200/80 mb-1 font-bold">Fun Fact (Optional)</label>
                    <input
                      type="text"
                      value={editingMember.funFact || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, funFact: e.target.value })}
                      placeholder="e.g. Built a solar weather station on the roof..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white placeholder:text-emerald-700 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3 p-4 rounded-2xl bg-black/30 border border-emerald-900/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Social Media &amp; Profiles</span>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="text-[#4ADE80] hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Profile</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingMember.socials?.map((social, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <select
                          value={social.platform}
                          onChange={(e) => handleUpdateSocial(sIdx, 'platform', e.target.value as SocialPlatform)}
                          className="px-3 py-2 rounded-xl bg-black/50 border border-emerald-800/60 text-white focus:outline-none focus:border-[#3FA85B]"
                        >
                          {SOCIAL_PLATFORMS.map((p) => (
                            <option key={p} value={p} className="bg-[#082212]">
                              {p.toUpperCase()}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={social.url}
                          onChange={(e) => handleUpdateSocial(sIdx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-emerald-800/60 text-white placeholder:text-emerald-800 focus:outline-none focus:border-[#3FA85B]"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(sIdx)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-950/40"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMemberModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#3FA85B] hover:bg-[#32934D] text-[#071A0E] font-black uppercase tracking-wider shadow-md shadow-[#3FA85B]/20"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Cohort Editor Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCohortModalOpen && editingCohort && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCohortModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-md w-full rounded-3xl bg-[#082212] border border-emerald-800/80 p-6 sm:p-8 shadow-2xl space-y-6 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                <h2 className="text-xl font-black font-sans text-white">
                  {editingCohort.id ? 'Edit Mandate Year' : 'Add Mandate Year'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCohortModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-emerald-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCohort} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-emerald-200/80 mb-1 font-bold">Mandate ID (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={editingCohort.id || ''}
                    onChange={(e) => setEditingCohort({ ...editingCohort, id: e.target.value })}
                    placeholder="e.g. 2026-2027"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white focus:outline-none focus:border-[#3FA85B]"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200/80 mb-1 font-bold">Display Label *</label>
                  <input
                    type="text"
                    required
                    value={editingCohort.yearLabel || ''}
                    onChange={(e) => setEditingCohort({ ...editingCohort, yearLabel: e.target.value })}
                    placeholder="e.g. 2026 – 2027"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white focus:outline-none focus:border-[#3FA85B]"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200/80 mb-1 font-bold">Tagline</label>
                  <input
                    type="text"
                    value={editingCohort.tagline || ''}
                    onChange={(e) => setEditingCohort({ ...editingCohort, tagline: e.target.value })}
                    placeholder="e.g. Current Executive Board / Foundation Team"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/60 text-white focus:outline-none focus:border-[#3FA85B]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isCurrentCohort"
                    checked={editingCohort.isCurrent ?? false}
                    onChange={(e) => setEditingCohort({ ...editingCohort, isCurrent: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3FA85B] accent-[#3FA85B] bg-black/40 border-emerald-800"
                  />
                  <label htmlFor="isCurrentCohort" className="text-emerald-200 font-bold cursor-pointer">
                    Set as Current / Default Board on Website
                  </label>
                </div>

                <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCohortModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-emerald-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#3FA85B] text-[#071A0E] font-black uppercase tracking-wider"
                  >
                    Save Mandate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
