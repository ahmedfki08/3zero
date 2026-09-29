'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPONSOR_TIERS } from '@/content/club-data';
import { SponsorTier } from '@/types';
import { Award, Check, Sparkles, Send, X, ArrowUpRight } from 'lucide-react';

export const SponsorDeck: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<SponsorTier | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setSelectedTier(null);
      setCompanyName('');
      setEmail('');
    }, 2500);
  };

  return (
    <section id="sponsors" className="py-24 bg-[#FAFCFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-4 font-bold">
            <Award className="w-3.5 h-3.5 text-[#3FA85B]" />
            <span>PARTNERSHIP DECK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            POWER STUDENT <span className="text-[#3FA85B]">SOCIAL INNOVATION</span>
          </h2>

          <p className="mt-3 text-sm font-sans text-slate-600">
            Work with ISIMS 3-Zero to meet motivated engineering and multimedia students, test real sustainable technology, and support projects with measurable results.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {SPONSOR_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.featured
                  ? 'bg-white border-2 border-[#3FA85B] shadow-xl shadow-[#3FA85B]/10 scale-105 z-10'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:border-[#3FA85B]/40'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3FA85B] text-white text-[10px] font-mono font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-sm">
                  Recommended Tier
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-[#0F4C2A] font-bold">
                  {tier.name}
                </div>

                <div className="text-3xl font-black font-mono text-slate-900">
                  {tier.investment}
                </div>

                <div className="h-px bg-slate-100 my-4" />

                {/* Benefits List */}
                <ul className="space-y-3">
                  {tier.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                      <Check className="w-4 h-4 text-[#3FA85B] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedTier(tier)}
                className={`mt-8 w-full py-3 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  tier.featured
                    ? 'bg-[#3FA85B] text-white hover:bg-[#0F4C2A] shadow-md shadow-[#3FA85B]/20'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <span>{tier.ctaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTier(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-lg w-full rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#3FA85B] font-bold">
                    Partnership Inquiry
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    {selectedTier.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTier(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inquirySent ? (
                <div className="p-6 rounded-2xl bg-[#E8F7EE] border border-[#3FA85B]/30 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-[#3FA85B] mx-auto" />
                  <h4 className="text-lg font-bold text-[#0F4C2A] font-mono">
                    Inquiry Transmitted
                  </h4>
                  <p className="text-xs text-slate-600">
                    The ISIMS 3-Zero Executive Board will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech Solutions"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sponsor@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#3FA85B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold uppercase bg-[#3FA85B] text-white hover:bg-[#0F4C2A] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Proposal Request</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
