'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PillarId } from '@/types';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, UserPlus, Send, Loader2 } from 'lucide-react';
import { submitClubApplication } from '@/lib/data/applications';

interface JoinMovementProps {
  initialPillar?: PillarId | null;
}

export const JoinMovement: React.FC<JoinMovementProps> = ({ initialPillar }) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId>('carbon');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studyField, setStudyField] = useState('Computer Science');
  const [pitchOrMotivation, setPitchOrMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPillar) {
      setSelectedPillar(initialPillar);
    }
  }, [initialPillar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitClubApplication({
        fullName,
        email,
        pillarFocus: selectedPillar as 'exclusion' | 'carbon' | 'poverty',
        department: studyField,
        motivation: pitchOrMotivation,
      });

      if (!result.success) {
        setSubmitError(result.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setIsSubmitted(true);

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
      setSubmitError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join" className="py-24 bg-white border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-4 font-bold">
            <UserPlus className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>CAMPUS ONBOARDING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            JOIN THE <span className="text-[#3FA85B]">MOVEMENT</span>
          </h2>

          <p className="mt-3 text-sm font-sans text-slate-600">
            Whether you code, design, manage projects or just want to help, we have a place for you. Tell us a bit about yourself and we&apos;ll reply soon.
          </p>
        </div>

        {/* Form Container */}
        <div className="clean-card p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 relative bg-white">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8F7EE] text-[#0F4C2A] flex items-center justify-center mx-auto border border-[#3FA85B]/30">
                <CheckCircle2 className="w-8 h-8 text-[#3FA85B]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-mono">
                Thank you!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                We got your application and someone from the team will write to you very soon.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFullName('');
                  setEmail('');
                  setPitchOrMotivation('');
                }}
                className="mt-4 px-6 py-2 rounded-full text-xs font-mono bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold cursor-pointer"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pillar Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 mb-2 font-bold">
                  Choose your main pillar
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'exclusion', label: 'Zero Exclusion' },
                    { id: 'carbon', label: 'Zero Carbon' },
                    { id: 'poverty', label: 'Zero Poverty' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPillar(p.id as PillarId)}
                      className={`p-3.5 rounded-2xl text-xs font-mono text-left border transition-all cursor-pointer ${
                        selectedPillar === p.id
                          ? 'bg-[#E8F7EE] border-[#3FA85B] text-[#0F4C2A] font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Amina Mansour"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">University / student email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@isims.usf.tn"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B]"
                  />
                </div>
              </div>

              {/* Field of Study */}
              <div className="font-mono text-xs">
                <label className="block text-slate-600 mb-1">ISIMS specialization / program</label>
                <select
                  value={studyField}
                  onChange={(e) => setStudyField(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B]"
                >
                  <option value="Computer Science (Licence / Mastère)">Computer Science (Licence / Mastère)</option>
                  <option value="Multimedia & Digital Arts">Multimedia & Digital Arts</option>
                  <option value="Computer Engineering & Networks">Computer Engineering & Networks</option>
                  <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
                  <option value="Other Faculty / University of Sfax">Other Faculty / University of Sfax</option>
                </select>
              </div>

              {/* Motivation */}
              <div className="font-mono text-xs">
                <label className="block text-slate-600 mb-1">
                  What do you want to bring to 3-Zero?
                </label>
                <textarea
                  rows={3}
                  value={pitchOrMotivation}
                  onChange={(e) => setPitchOrMotivation(e.target.value)}
                  placeholder="Tell us about your skills, your ideas, or something you'd like to learn."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B] resize-none"
                />
              </div>

              {/* Error message */}
              {submitError && (
                <p className="text-xs font-mono text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  ⚠ {submitError}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider bg-[#3FA85B] text-white hover:bg-[#0F4C2A] disabled:opacity-60 shadow-md shadow-[#3FA85B]/20 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit membership application</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
