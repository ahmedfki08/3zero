'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';
import {
  EventFormField,
  saveEventFormField,
  deleteEventFormField,
  fetchEventFormFields,
} from '@/lib/data/eventFields';

interface EventFormFieldsManagerProps {
  eventId: string;
  initialFields: EventFormField[];
}

export const EventFormFieldsManager: React.FC<EventFormFieldsManagerProps> = ({
  eventId,
  initialFields,
}) => {
  const router = useRouter();

  const [fields, setFields] = useState<EventFormField[]>(
    [...initialFields].sort((a, b) => a.sort_order - b.sort_order)
  );

  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState('text');
  const [newRequired, setNewRequired] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto generate field_key from label
  const handleLabelChange = (val: string) => {
    setNewLabel(val);
    setNewKey(
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^_+|_+$/g, '')
    );
  };

  // Add field
  const handleAddField = async () => {
    if (!newLabel.trim() || !newKey.trim()) return;

    // Check duplicate key
    if (fields.some((f) => f.field_key === newKey.trim())) {
      setStatusMsg({ type: 'error', text: `Field key "${newKey}" already exists on this event.` });
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);

    const newOrder = fields.length + 1;

    try {
      const updated = await saveEventFormField(eventId, {
        label: newLabel.trim(),
        field_key: newKey.trim(),
        type: newType,
        required: newRequired,
        sort_order: newOrder,
      });

      setFields(updated);
      setNewLabel('');
      setNewKey('');
      setNewType('text');
      setNewRequired(false);
      setStatusMsg({ type: 'success', text: 'Registration field added!' });
      router.refresh();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add form field.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete field
  const handleDeleteField = async (fieldId: string) => {
    try {
      const updated = await deleteEventFormField(eventId, fieldId);
      setFields(updated);
      setStatusMsg({ type: 'success', text: 'Field removed from event.' });
      router.refresh();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete field' });
    }
  };

  // Toggle required
  const handleToggleRequired = async (fieldItem: EventFormField) => {
    const updatedRequired = !fieldItem.required;
    try {
      const updated = await saveEventFormField(eventId, {
        ...fieldItem,
        required: updatedRequired,
      });
      setFields(updated);
      router.refresh();
    } catch {}
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 font-mono uppercase">
          Custom Registration Form Builder
        </h3>
        <p className="text-xs font-sans text-slate-500 mt-0.5">
          Define questions asked when attendees claim their pass for this specific event.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-sans flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#3FA85B]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Existing Fields List */}
      <div className="space-y-3">
        <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
          Active Form Fields ({fields.length})
        </label>

        {fields.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl p-4 text-xs font-mono text-slate-400">
            No custom fields configured. Default fields (Full Name, Email) will be used.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 truncate font-sans">
                      {field.label}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>key: {field.field_key}</span>
                      <span>•</span>
                      <span className="uppercase text-slate-600 font-bold">{field.type}</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggleRequired(field)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      field.required
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {field.required ? 'Mandatory' : 'Optional'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteField(field.id)}
                    title="Remove Field"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Field Builder Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#3FA85B]" />
          <span>Add Custom Form Question</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
              Field Label
            </label>
            <input
              type="text"
              placeholder="e.g. GitHub Username / Portfolio"
              value={newLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
              Field Key
            </label>
            <input
              type="text"
              placeholder="github_username"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
              Input Type
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-sans"
            >
              <option value="text">Text (Single Line)</option>
              <option value="email">Email</option>
              <option value="tel">Phone / WhatsApp</option>
              <option value="textarea">Textarea (Multi-line)</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox (Yes/No)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-700">
            <input
              type="checkbox"
              checked={newRequired}
              onChange={(e) => setNewRequired(e.target.checked)}
              className="rounded text-[#0F4C2A] focus:ring-[#3FA85B]"
            />
            <span>Mark as Mandatory / Required</span>
          </label>

          <button
            type="button"
            disabled={isSaving || !newLabel.trim()}
            onClick={handleAddField}
            className="px-4 py-2 rounded-xl bg-[#0F4C2A] hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Add Field</span>
          </button>
        </div>
      </div>
    </div>
  );
};
