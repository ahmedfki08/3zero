'use client';
 
import React, { useEffect, useState, useTransition } from 'react';
import { ExecutiveBoardCohort } from '@/types/staff';
import { DEFAULT_STAFF_COHORTS } from '@/content/staff';
import { fetchStaffCohorts } from '@/lib/data/staff';
import { StaffSpotlight } from './StaffSpotlight';
import { Users, Calendar, History, Sparkles, ShieldCheck } from 'lucide-react';

export const StaffSection: React.FC = () => {
  const [cohorts, setCohorts] = useState<ExecutiveBoardCohort[]>(DEFAULT_STAFF_COHORTS);
  const [selectedCohortId, setSelectedCohortId] = useState<string>(() => {
    const current = DEFAULT_STAFF_COHORTS.find((c) => c.isCurrent);
    return current ? current.id : DEFAULT_STAFF_COHORTS[0]?.id || '';
  });
  const [, startTransition] = useTransition();

  const loadData = async () => {
    try {
      const { cohorts: data, currentCohortId } = await fetchStaffCohorts();
      if (data && data.length > 0) {
        setCohorts(data);
        // If the currently selected cohort does not exist in the new data, select the current or first
        setSelectedCohortId((prevId) => {
          const exists = data.some((c) => c.id === prevId);
          if (exists) return prevId;
          return currentCohortId || data[0].id;
        });
      }
    } catch (err) {
      console.error('Error fetching staff cohorts:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('staff-cohorts-updated', handleUpdate);
    return () => {
      window.removeEventListener('staff-cohorts-updated', handleUpdate);
    };
  }, []);

  const activeCohort =
    cohorts.find((c) => c.id === selectedCohortId) ||
    cohorts.find((c) => c.isCurrent) ||
    cohorts[0];

  const handleSelectCohort = (id: string) => {
    startTransition(() => {
      setSelectedCohortId(id);
    });
  };

  return (
    <section
      id="team"
      aria-labelledby="staff-section-title"
      className="relative w-full py-24 sm:py-32 bg-[#FAFCFA] border-t border-slate-100 overflow-hidden"
    >
      {/* ── Background Subtle Ambient Decor ─────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(#3FA85B0D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#3FA85B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start max-w-2xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Users className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>Leadership &amp; Governance</span>
            </div>

            <h2
              id="staff-section-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A] leading-tight"
            >
              The Minds Behind the <br />
              <span className="text-[#3FA85B]">ISIMS 3-Zero</span> Movement
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              A student-led team of visionaries, developers, and organizers driving sustainable impact. Explore our leadership mandates from our foundation to today.
            </p>
          </div>

          {/* Mandate Year Switcher & Indicator */}
          {cohorts.length > 0 && (
            <div className="flex flex-col sm:items-end gap-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                <History className="w-3.5 h-3.5 text-[#3FA85B]" />
                <span>Executive Mandates</span>
              </div>

              {/* Cohort Selector Pills */}
              <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm shadow-slate-100 flex-wrap gap-1.5 max-w-full">
                {cohorts.map((cohort) => {
                  const isSelected = cohort.id === activeCohort?.id;
                  return (
                    <button
                      key={cohort.id}
                      onClick={() => handleSelectCohort(cohort.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F4C2A] text-white shadow-md shadow-[#0F4C2A]/20 scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {cohort.isCurrent ? (
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              isSelected ? 'bg-emerald-300' : 'bg-[#3FA85B]'
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              isSelected ? 'bg-white' : 'bg-[#3FA85B]'
                            }`}
                          />
                        </span>
                      ) : (
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                      )}

                      <span>{cohort.yearLabel}</span>

                      {cohort.isCurrent && (
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md font-bold ${
                            isSelected
                              ? 'bg-emerald-800 text-emerald-100'
                              : 'bg-emerald-100 text-[#0F4C2A]'
                          }`}
                        >
                          Current
                        </span>
                      )}

                      {cohort.id === 'foundation-2024-2025' && !cohort.isCurrent && (
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md font-bold ${
                            isSelected
                              ? 'bg-emerald-800 text-emerald-100'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Foundation
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Cohort Subtext / Tagline */}
              {activeCohort?.tagline && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 font-mono mt-1">
                  <Sparkles className="w-3 h-3 text-[#3FA85B]" />
                  <span>{activeCohort.tagline}</span>
                  {!activeCohort.isCurrent && (
                    <span className="text-[11px] text-slate-400">· Historical Mandate</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Interactive Spotlight Stage ─────────────────────────────── */}
      {activeCohort ? (
        <StaffSpotlight
          key={activeCohort.id}
          members={activeCohort.members || []}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
          No executive board records available.
        </div>
      )}
    </section>
  );
};
