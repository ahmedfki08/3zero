'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { UpcomingEvent, EventRegistrationPayload } from '@/types/events';
import { submitRegistration } from '@/lib/data/registrations';
import { fetchEventFormFields, EventFormField } from '@/lib/data/eventFields';
import {
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  RotateCcw,
} from 'lucide-react';

interface EventRegistrationModalProps {
  event: UpcomingEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<EventRegistrationPayload>({
    eventId: '',
    fullName: '',
    email: '',
    affiliation: 'ISIMS Student',
    studentIdOrOrg: '',
    majorOrField: '',
    motivationNotes: '',
  });

  const [customFields, setCustomFields] = useState<EventFormField[]>([]);
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});
  const [isLoadingFields, setIsLoadingFields] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({
      eventId: event?.id || '',
      fullName: '',
      email: '',
      affiliation: 'ISIMS Student',
      studentIdOrOrg: '',
      majorOrField: '',
      motivationNotes: '',
    });
    const initialAnswers: Record<string, any> = {};
    customFields.forEach((f) => {
      initialAnswers[f.field_key] = f.type === 'checkbox' ? false : '';
    });
    setCustomAnswers(initialAnswers);
    setTicketId('');
  };

  // Load event custom form fields
  useEffect(() => {
    if (!event) return;

    setFormData((prev) => ({ ...prev, eventId: event.id }));
    setIsSuccess(false);

    let isMounted = true;
    const loadFields = async () => {
      setIsLoadingFields(true);
      try {
        const fields = await fetchEventFormFields(event.id);
        if (isMounted) {
          setCustomFields(fields);
          const initialAnswers: Record<string, any> = {};
          fields.forEach((f) => {
            initialAnswers[f.field_key] = f.type === 'checkbox' ? false : '';
          });
          setCustomAnswers(initialAnswers);
        }
      } catch (err) {
        console.error('Failed to load event form fields:', err);
      } finally {
        if (isMounted) setIsLoadingFields(false);
      }
    };

    loadFields();

    const handleUpdate = () => loadFields();
    window.addEventListener('event-fields-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('event-fields-updated', handleUpdate);
    };
  }, [event]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    // Validate required custom fields
    for (const field of customFields) {
      if (field.required) {
        const val = customAnswers[field.field_key];
        if (val === undefined || val === null || val === '' || (field.type === 'checkbox' && !val)) {
          alert(`Please complete the required field: "${field.label}"`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitRegistration({
        eventId: event.id,
        fullName: formData.fullName,
        email: formData.email,
        affiliation: formData.affiliation,
        studentIdOrOrg: formData.studentIdOrOrg,
        majorOrField: formData.majorOrField,
        motivationNotes: formData.motivationNotes,
        customResponses: customAnswers,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Registration failed. Please check your information and try again.');
        return;
      }

      setIsSuccess(true);
      setTicketId(result.ticketId || `3Z-PASS-${Math.floor(100000 + Math.random() * 900000)}`);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3FA85B', '#0F4C2A', '#4EBA6F', '#10B981'],
        });
      } catch {}
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Full-screen overlay — centres the modal, scrollable on very small phones */}
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal — flex column so header is sticky and body scrolls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-10 my-3 sm:my-8 flex flex-col overflow-hidden"
          style={{ maxHeight: 'calc(100dvh - 1.5rem)' }}
        >
          {/* ── Sticky Header ── */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-[#FAFCFA] rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3FA85B]" />
              <span className="text-xs font-mono font-bold text-[#0F4C2A] uppercase tracking-wider">
                Pass Admission Registration
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Event Summary Banner */}
                  <div className="p-4 rounded-2xl bg-[#E8F7EE]/60 border border-[#3FA85B]/20 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C2A] bg-white/80 px-2 py-0.5 rounded-full border border-[#3FA85B]/20 inline-block">
                      {event.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight font-sans">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#3FA85B]" />
                        {event.displayDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.location.venue}{event.location.room ? ` · ${event.location.room}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Core Required Inputs */}
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Yassine Trabelsi"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B]"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="student@isims.usf.tn"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B]"
                        />
                      </div>
                    </div>

                    {/* Custom / Default Fields */}
                    {isLoadingFields ? (
                      <div className="py-4 text-center text-xs font-mono text-slate-400 animate-pulse">
                        Loading form fields…
                      </div>
                    ) : customFields.length > 0 ? (
                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        {customFields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                              {field.label}{' '}
                              {field.required && <span className="text-rose-500">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                              <textarea
                                rows={3}
                                required={field.required}
                                placeholder={`Enter your ${field.label.toLowerCase()}…`}
                                value={customAnswers[field.field_key] || ''}
                                onChange={(e) =>
                                  setCustomAnswers({ ...customAnswers, [field.field_key]: e.target.value })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B] resize-none"
                              />
                            ) : field.type === 'checkbox' ? (
                              <label className="flex items-start gap-3 cursor-pointer text-sm font-sans text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 select-none">
                                <input
                                  type="checkbox"
                                  required={field.required}
                                  checked={!!customAnswers[field.field_key]}
                                  onChange={(e) =>
                                    setCustomAnswers({ ...customAnswers, [field.field_key]: e.target.checked })
                                  }
                                  className="w-4 h-4 mt-0.5 rounded text-[#0F4C2A] focus:ring-[#3FA85B] shrink-0 accent-[#3FA85B]"
                                />
                                <span className="leading-snug">{field.label}</span>
                              </label>
                            ) : (
                              <input
                                type={
                                  field.type === 'number'
                                    ? 'number'
                                    : field.type === 'tel'
                                    ? 'tel'
                                    : field.type === 'email'
                                    ? 'email'
                                    : 'text'
                                }
                                required={field.required}
                                placeholder={`Enter ${field.label.toLowerCase()}…`}
                                value={customAnswers[field.field_key] || ''}
                                onChange={(e) =>
                                  setCustomAnswers({ ...customAnswers, [field.field_key]: e.target.value })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B]"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Default fallback fields when admin hasn't configured custom questions */
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                              Affiliation
                            </label>
                            <select
                              value={formData.affiliation}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  affiliation: e.target.value as EventRegistrationPayload['affiliation'],
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B] bg-white"
                            >
                              <option value="ISIMS Student">ISIMS Student</option>
                              <option value="External Student">External Student</option>
                              <option value="Faculty / Researcher">Faculty / Researcher</option>
                              <option value="Industry / Guest">Industry / Guest</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                              Major / Field
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Computer Science, IoT"
                              value={formData.majorOrField}
                              onChange={(e) => setFormData({ ...formData, majorOrField: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                            Motivation / Track Notes (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="What would you like to build or learn during this session?"
                            value={formData.motivationNotes}
                            onChange={(e) =>
                              setFormData({ ...formData, motivationNotes: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3FA85B]/30 focus:border-[#3FA85B] resize-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Error banner if submission failed */}
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
                      <span className="font-bold">⚠</span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-[#3FA85B] text-xs font-mono font-bold uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Reserving Spot…</span>
                      ) : (
                        <>
                          <span>Confirm Pass</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Success / Ticket Confirmation ── */
                <div className="text-center space-y-6 py-4">
                  <div className="w-14 h-14 rounded-full bg-[#E8F7EE] text-[#0F4C2A] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8 text-[#3FA85B]" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 font-sans">Pass Confirmed!</h3>
                    <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-sm mx-auto mt-1">
                      Your seat is reserved for{' '}
                      <strong className="text-slate-900">{event.title}</strong>. A confirmation has been sent to{' '}
                      <strong className="text-slate-900">{formData.email}</strong>.
                    </p>
                  </div>

                  {/* Digital Ticket Pass Stub */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white text-left space-y-3 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2">
                      <span className="text-[10px] font-mono text-[#3FA85B] font-bold uppercase">
                        3-ZERO ISIMS ACCESS PASS
                      </span>
                      <span className="text-xs font-mono font-bold text-white/80">{ticketId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Attendee</span>
                      <p className="text-sm font-mono font-bold text-white">{formData.fullName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Date &amp; Time</span>
                        <span>{event.displayDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Venue</span>
                        <span className="truncate block">{event.location.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Register Another Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-[#3FA85B] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
