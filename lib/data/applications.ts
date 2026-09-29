import { createClient } from '@/lib/supabase/client';

export interface ClubApplicationInput {
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  yearOfStudy?: string;
  pillarFocus: 'exclusion' | 'carbon' | 'poverty';
  motivation?: string;
}

export async function submitClubApplication(input: ClubApplicationInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('club_applications').insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone || null,
      department: input.department || null,
      year_of_study: input.yearOfStudy || null,
      pillar_focus: input.pillarFocus,
      motivation: input.motivation || null,
      status: 'pending',
    });

    if (error) {
      // 23505 = unique_violation — email already applied, treat as success
      if (error.code === '23505') {
        return { success: true };
      }
      console.error('Supabase club application error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Club application exception:', err);
    return { success: false, error: err?.message ?? 'Unknown error' };
  }
}
