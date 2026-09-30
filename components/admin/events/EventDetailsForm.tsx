'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface EventDetailsFormProps {
  initialData?: any;
  isNew?: boolean;
}

export const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  initialData,
  isNew = false,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    tagline: initialData?.tagline || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Hackathon',
    pillar_id: initialData?.pillar_id || 'all',
    starts_at: initialData?.starts_at
      ? new Date(initialData.starts_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    ends_at: initialData?.ends_at
      ? new Date(initialData.ends_at).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    timezone: initialData?.timezone || 'Africa/Tunis',
    location_venue: initialData?.location_venue || 'ISIMS Campus',
    location_room: initialData?.location_room || '',
    location_city: initialData?.location_city || 'Sfax, Tunisia',
    capacity: initialData?.capacity || 100,
    barcode_number: initialData?.barcode_number || '',
    draft: initialData?.draft ?? false,
    cover_image_url: initialData?.cover_image_url || '',
    override_status: initialData?.override_status || '',
    attendee_count: initialData?.attendee_count ?? '',
    recap: initialData?.recap || '',
  });

  const [speakers, setSpeakers] = useState<{ name: string; role: string }[]>(
    Array.isArray(initialData?.speakers) ? initialData.speakers : []
  );

  const [requirements, setRequirements] = useState<string[]>(
    Array.isArray(initialData?.requirements) ? initialData.requirements : []
  );

  const [highlights, setHighlights] = useState<string[]>(
    Array.isArray(initialData?.highlights) ? initialData.highlights : []
  );

  const [newRequirement, setNewRequirement] = useState('');
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [newSpeakerRole, setNewSpeakerRole] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Auto slugify title if new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (isNew && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  const handleAddSpeaker = () => {
    if (!newSpeakerName.trim()) return;
    setSpeakers([...speakers, { name: newSpeakerName.trim(), role: newSpeakerRole.trim() || 'Speaker' }]);
    setNewSpeakerName('');
    setNewSpeakerRole('');
  };

  const handleRemoveSpeaker = (idx: number) => {
    setSpeakers(speakers.filter((_, i) => i !== idx));
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setRequirements([...requirements, newRequirement.trim()]);
    setNewRequirement('');
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;

    setIsSaving(true);
    setFeedback(null);

    const payload = {
      ...formData,
      capacity: formData.capacity ? Number(formData.capacity) : null,
      attendee_count: formData.attendee_count !== '' ? Number(formData.attendee_count) : null,
      override_status: formData.override_status ? formData.override_status : null,
      recap: formData.recap || null,
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: new Date(formData.ends_at).toISOString(),
      speakers: speakers,
      requirements: requirements,
      highlights: highlights,
      barcode_number: formData.barcode_number || `3ZERO-${formData.slug.toUpperCase().slice(0, 10)}`,
    };

    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase
          .from('events')
          .insert(payload)
          .select('id')
          .single();

        if (error) throw error;

        setFeedback({ type: 'success', msg: 'Event successfully created!' });
        if (data?.id) {
          router.push(`/admin/events/${data.id}/edit`);
        }
      } else {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', initialData.id);

        if (error) throw error;

        setFeedback({ type: 'success', msg: 'Event details updated successfully!' });
        router.refresh();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to save event.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-sans flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#3FA85B]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* ── Main Logistics Card ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-400 tracking-wider">
          1. General Overview &amp; Branding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Sfax 3-Zero Campus Hackathon 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. sfax-3zero-hackathon-2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#3FA85B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
            Short Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. 48 Hours of Open-Source Engineering for Zero Carbon & Zero Exclusion"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
            Full Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed overview of the sprint, objectives, schedule, and cohort collaboration..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
          />
        </div>

        {/* Category & Pillar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Format / Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B] bg-white"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Symposium">Symposium</option>
              <option value="Tech Talk">Tech Talk</option>
              <option value="Fieldwork">Fieldwork</option>
              <option value="Ideation Jam">Ideation Jam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              3-Zero Pillar Alignment
            </label>
            <select
              value={formData.pillar_id}
              onChange={(e) => setFormData({ ...formData, pillar_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B] bg-white"
            >
              <option value="all">All 3 Zeros (Comprehensive)</option>
              <option value="exclusion">01 · Zero Exclusion</option>
              <option value="carbon">02 · Zero Net Carbon</option>
              <option value="poverty">03 · Zero Poverty</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Schedule & Venue ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-400 tracking-wider">
          2. Schedule, Location &amp; Capacity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Start Date &amp; Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.starts_at}
              onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              End Date &amp; Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.ends_at}
              onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#3FA85B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Venue
            </label>
            <input
              type="text"
              value={formData.location_venue}
              onChange={(e) => setFormData({ ...formData, location_venue: e.target.value })}
              placeholder="e.g. ISIMS Campus"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Room / Lab
            </label>
            <input
              type="text"
              value={formData.location_room}
              onChange={(e) => setFormData({ ...formData, location_room: e.target.value })}
              placeholder="e.g. Amphi Principal / Lab 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Capacity (Seats)
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              placeholder="100"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#3FA85B]"
            />
          </div>
        </div>

        {/* Status Override */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Status Behavior Override
            </label>
            <select
              value={formData.override_status}
              onChange={(e) => setFormData({ ...formData, override_status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B] bg-white"
            >
              <option value="">Auto (Computed by dates & capacity)</option>
              <option value="past">Past Event (Show in Archive)</option>
              <option value="closed">Closed (Stop registrations)</option>
              <option value="open">Force Open</option>
            </select>
          </div>

          {/* Draft Toggle */}
          <div className="flex items-center gap-3 sm:pt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.draft}
                onChange={(e) => setFormData({ ...formData, draft: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
            <span className="text-xs font-mono font-bold text-slate-700">
              {formData.draft ? 'Saved as Draft' : 'Published Live'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Speakers & Requirements ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-400 tracking-wider">
          3. Speakers, Leads &amp; Requirements
        </h3>

        {/* Speakers */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
            Lead Architects &amp; Faculty Speakers
          </label>

          <div className="space-y-2">
            {speakers.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
              >
                <div>
                  <strong className="text-slate-900">{s.name}</strong>
                  <span className="text-slate-500 ml-2">({s.role})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpeaker(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Speaker Name"
              value={newSpeakerName}
              onChange={(e) => setNewSpeakerName(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
            />
            <input
              type="text"
              placeholder="Role / Title"
              value={newSpeakerRole}
              onChange={(e) => setNewSpeakerRole(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
            />
            <button
              type="button"
              onClick={handleAddSpeaker}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold whitespace-nowrap cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
            Participant Prerequisites / Kit
          </label>

          <div className="space-y-2">
            {requirements.map((req, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans"
              >
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. Laptop with Python 3.10+, Student ID card..."
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequirement(); } }}
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold whitespace-nowrap cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 4: Past Event Archive Details ───────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase text-slate-400 tracking-wider">
            4. Past Event Retrospective &amp; Archive Details
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F4C2A] font-mono text-[10px] font-bold">
            Used for Past Archive view
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Actual Attendee Count (Turnout)
            </label>
            <input
              type="number"
              min="0"
              value={formData.attendee_count}
              onChange={(e) => setFormData({ ...formData, attendee_count: e.target.value })}
              placeholder="e.g. 140"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#3FA85B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
            Post-Event Recap / Retrospective
          </label>
          <textarea
            rows={4}
            value={formData.recap}
            onChange={(e) => setFormData({ ...formData, recap: e.target.value })}
            placeholder="Summarize the outcome, key student projects delivered, impact created, awards given..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#3FA85B]"
          />
        </div>

        {/* Highlights */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
            Milestones &amp; Key Highlights
          </label>

          <div className="space-y-2">
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-sans text-emerald-950"
              >
                <span>⭐ {h}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. 14 working prototypes submitted to campus faculty"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#3FA85B]"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-mono font-bold whitespace-nowrap cursor-pointer"
            >
              + Add Highlight
            </button>
          </div>
        </div>
      </div>

      {/* ── Submit Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 text-center cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F4C2A] hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Event...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isNew ? 'Create Event' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
