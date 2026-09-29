'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid credentials. Please verify your admin email and password.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during sign in.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071A0E] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(63,168,91,0.25) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xl mb-2 backdrop-blur-xl">
            <Image
              src="/club-badge-logo.png"
              alt="3-Zero ISIMS"
              width={180}
              height={50}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3FA85B]/15 border border-[#3FA85B]/30 text-[#4ADE80] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISIMS COMMAND CONSOLE</span>
            </div>
            <h1 className="text-2xl font-black font-sans tracking-tight text-white uppercase">
              ADMINISTRATOR LOGIN
            </h1>
            <p className="text-xs font-mono text-emerald-200/60">
              Access restricted to authorized faculty &amp; chapter officers.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B2513]/80 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-200/80 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-300/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@3zero-isims.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 text-sm font-sans focus:outline-none focus:border-[#3FA85B] focus:ring-1 focus:ring-[#3FA85B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-200/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-300/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 text-sm font-sans focus:outline-none focus:border-[#3FA85B] focus:ring-1 focus:ring-[#3FA85B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#3FA85B] hover:bg-[#4EBA6F] text-[#071A0E] text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#3FA85B]/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] font-mono text-emerald-200/40">
          <span>Higher Institute of Computer Science &amp; Multimedia of Sfax</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071A0E] flex items-center justify-center text-white">
          <Loader2 className="w-6 h-6 animate-spin text-[#3FA85B]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
