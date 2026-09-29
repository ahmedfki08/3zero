import { StaffMember, ExecutiveBoardCohort } from '@/types/staff';
import { DEFAULT_STAFF_COHORTS } from '@/content/staff';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = '3zero_staff_cohorts_v1';

export async function fetchStaffCohorts(): Promise<{
  cohorts: ExecutiveBoardCohort[];
  currentCohortId: string;
}> {
  // 1. Try fetching from Supabase if available
  try {
    const supabase = createClient();
    const { data: cohortsData, error } = await (supabase as any)
      .from('staff_cohorts')
      .select('*, staff_members(*)')
      .order('is_current', { ascending: false });

    if (!error && cohortsData && cohortsData.length > 0) {
      const cohorts: ExecutiveBoardCohort[] = cohortsData.map((c: any) => ({
        id: c.id,
        yearLabel: c.year_label,
        tagline: c.tagline || '',
        isCurrent: c.is_current,
        members: (c.staff_members || [])
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((m: any, idx: number) => ({
            id: m.id,
            index: String(idx + 1).padStart(2, '0'),
            name: m.name,
            firstName: m.first_name || m.name.split(' ')[0],
            lastName: m.last_name || m.name.split(' ').slice(1).join(' '),
            role: m.role,
            department: m.department || '',
            pillarFocus: m.pillar_focus,
            quote: m.quote || '',
            bio: m.bio || '',
            funFact: m.fun_fact,
            portraitCutout: m.portrait_cutout_url || m.portrait_url,
            fallbackPhoto: m.fallback_photo_url || m.portrait_url,
            photoType: m.photo_type || 'framed',
            mandateYear: c.id,
            order: m.order ?? idx + 1,
            socials: Array.isArray(m.socials) ? m.socials : [],
          })),
      }));

      const current = cohorts.find((c) => c.isCurrent) || cohorts[0];
      return { cohorts, currentCohortId: current.id };
    }
  } catch {
    // Supabase query failed or table not present, proceed to local/client storage
  }

  // 2. Client-side local storage fallback if in browser
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ExecutiveBoardCohort[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const current = parsed.find((c) => c.isCurrent) || parsed[0];
          return { cohorts: parsed, currentCohortId: current.id };
        }
      }
    } catch (e) {
      console.error('Failed to read staff cohorts from local storage', e);
    }
  }

  // 3. Static fallback default
  const defaultCurrent = DEFAULT_STAFF_COHORTS.find((c) => c.isCurrent) || DEFAULT_STAFF_COHORTS[0];
  return {
    cohorts: DEFAULT_STAFF_COHORTS,
    currentCohortId: defaultCurrent.id,
  };
}

export function saveCohortsToStorage(cohorts: ExecutiveBoardCohort[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cohorts));
      // Dispatch storage event so other open components sync immediately
      window.dispatchEvent(new Event('staff-cohorts-updated'));
    } catch (e) {
      console.error('Failed to save staff cohorts to local storage', e);
    }
  }
}

export async function createOrUpdateCohort(cohort: Partial<ExecutiveBoardCohort>): Promise<ExecutiveBoardCohort[]> {
  const { cohorts } = await fetchStaffCohorts();
  const existingIdx = cohorts.findIndex((c) => c.id === cohort.id);

  let updatedCohorts: ExecutiveBoardCohort[];

  if (existingIdx >= 0) {
    updatedCohorts = cohorts.map((c, i) => {
      if (i === existingIdx) {
        return {
          ...c,
          ...cohort,
          members: cohort.members || c.members,
        };
      }
      if (cohort.isCurrent) {
        return { ...c, isCurrent: false };
      }
      return c;
    });
  } else {
    const newCohort: ExecutiveBoardCohort = {
      id: cohort.id || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      yearLabel: cohort.yearLabel || `${new Date().getFullYear()} – ${new Date().getFullYear() + 1}`,
      tagline: cohort.tagline || 'Executive Board',
      isCurrent: cohort.isCurrent ?? false,
      members: cohort.members || [],
    };

    if (newCohort.isCurrent) {
      updatedCohorts = [newCohort, ...cohorts.map((c) => ({ ...c, isCurrent: false }))];
    } else {
      updatedCohorts = [newCohort, ...cohorts];
    }
  }

  saveCohortsToStorage(updatedCohorts);
  return updatedCohorts;
}

export async function deleteCohort(cohortId: string): Promise<ExecutiveBoardCohort[]> {
  const { cohorts } = await fetchStaffCohorts();
  const filtered = cohorts.filter((c) => c.id !== cohortId);
  if (filtered.length > 0 && !filtered.some((c) => c.isCurrent)) {
    filtered[0].isCurrent = true;
  }
  saveCohortsToStorage(filtered);
  return filtered;
}

export async function saveStaffMember(
  cohortId: string,
  member: Partial<StaffMember>
): Promise<ExecutiveBoardCohort[]> {
  const { cohorts } = await fetchStaffCohorts();
  const targetCohort = cohorts.find((c) => c.id === cohortId);

  if (!targetCohort) {
    throw new Error(`Cohort ${cohortId} not found`);
  }

  const existingMemberIdx = targetCohort.members.findIndex((m) => m.id === member.id);
  let updatedMembers: StaffMember[];

  if (existingMemberIdx >= 0) {
    updatedMembers = targetCohort.members.map((m, idx) => {
      if (idx === existingMemberIdx) {
        const first = member.firstName || member.name?.split(' ')[0] || m.firstName;
        const last = member.lastName || member.name?.split(' ').slice(1).join(' ') || m.lastName;
        return {
          ...m,
          ...member,
          firstName: first,
          lastName: last,
          name: member.name || `${first} ${last}`,
          mandateYear: cohortId,
        } as StaffMember;
      }
      return m;
    });
  } else {
    const newId =
      member.id ||
      `${(member.name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const first = member.firstName || member.name?.split(' ')[0] || '';
    const last = member.lastName || member.name?.split(' ').slice(1).join(' ') || '';
    const newMember: StaffMember = {
      id: newId,
      index: String(targetCohort.members.length + 1).padStart(2, '0'),
      name: member.name || `${first} ${last}`,
      firstName: first,
      lastName: last,
      role: member.role || 'Board Officer',
      department: member.department || 'ISIMS Student',
      pillarFocus: member.pillarFocus || 'Core Lead',
      quote: member.quote || "Let's build a Zero Exclusion, Zero Carbon, Zero Poverty world.",
      bio: member.bio || '',
      funFact: member.funFact || '',
      portraitCutout: member.portraitCutout,
      fallbackPhoto:
        member.fallbackPhoto ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      photoType: member.photoType || 'framed',
      socials: member.socials || [],
      mandateYear: cohortId,
      order: member.order ?? targetCohort.members.length + 1,
    };
    updatedMembers = [...targetCohort.members, newMember];
  }

  // Re-index
  updatedMembers = updatedMembers.map((m, i) => ({
    ...m,
    index: String(i + 1).padStart(2, '0'),
    order: i + 1,
  }));

  const updatedCohorts = cohorts.map((c) => {
    if (c.id === cohortId) {
      return { ...c, members: updatedMembers };
    }
    return c;
  });

  saveCohortsToStorage(updatedCohorts);
  return updatedCohorts;
}

export async function deleteStaffMember(cohortId: string, memberId: string): Promise<ExecutiveBoardCohort[]> {
  const { cohorts } = await fetchStaffCohorts();
  const updatedCohorts = cohorts.map((c) => {
    if (c.id === cohortId) {
      const filtered = c.members.filter((m) => m.id !== memberId);
      const reindexed = filtered.map((m, idx) => ({
        ...m,
        index: String(idx + 1).padStart(2, '0'),
        order: idx + 1,
      }));
      return { ...c, members: reindexed };
    }
    return c;
  });

  saveCohortsToStorage(updatedCohorts);
  return updatedCohorts;
}
