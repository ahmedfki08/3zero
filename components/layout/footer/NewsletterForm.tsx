'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Adapter function for subscribing to newsletter / event updates.
 * Easily replaceable with a Supabase Edge Function or client call later.
 */
export async function subscribeToUpdates(email: string): Promise<{
  success: boolean;
  message?: string;
}> {
  // Simulate network latency & validation
  await new Promise((resolve) => setTimeout(resolve, 800));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // Mock successful subscription
  return {
    success: true,
    message: 'You are now subscribed to upcoming 3-Zero club workshops & events!',
  };
}

export const NewsletterForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  if (!siteConfig.footer.showNewsletter) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silently drop spam submissions triggered by bots filling hidden honeypot
    if (honeypot) return;

    if (!email.trim()) {
      setStatus('error');
      setFeedbackMessage('Please provide your email address.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await subscribeToUpdates(email);
      if (res.success) {
        setStatus('success');
        setFeedbackMessage(res.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(res.message || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Something went wrong. Please check your connection.');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-xs font-mono font-bold tracking-wider uppercase text-[#4ADE80]">
        Stay in the loop
      </div>
      <p className="text-xs text-emerald-100/75 leading-relaxed max-w-sm">
        Get news about events and new projects. No spam, we promise.
      </p>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        {/* Honeypot field (hidden from humans, trapped by bots) */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="newsletter-botcheck">Do not fill this</label>
          <input
            id="newsletter-botcheck"
            type="text"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="relative flex items-center max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="student@isims.u-sfax.tn"
            disabled={status === 'loading' || status === 'success'}
            aria-label="Email address for event updates"
            className="w-full px-3.5 py-2.5 pe-12 bg-emerald-950/60 text-white placeholder-emerald-400/50 text-xs font-mono rounded-xl border border-emerald-700/60 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            aria-label="Submit newsletter subscription"
            className="absolute inset-inline-end-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#3FA85B] hover:bg-[#4ADE80] text-[#0F4C2A] hover:text-black font-bold flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Feedback Alert State */}
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] font-mono text-rose-300"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{feedbackMessage}</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300"
              role="status"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#4ADE80]" />
              <span>{feedbackMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
