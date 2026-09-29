import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ApplicationsTableClient } from '@/components/admin/submissions/ApplicationsTableClient';
import { UserCheck } from 'lucide-react';

export default async function AdminApplicationsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from('club_applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#0F4C2A] text-xs font-mono font-bold mb-2">
          <UserCheck className="w-3.5 h-3.5 text-[#3FA85B]" />
          <span>STUDENT RECRUITMENT LOG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
          CAMPUS ONBOARDING APPLICATIONS
        </h1>
        <p className="text-xs sm:text-sm font-sans text-slate-500 mt-1">
          Review candidate student profiles, inspect pillar interests, update decision statuses, and export roster files.
        </p>
      </div>

      <ApplicationsTableClient initialApplications={applications || []} />
    </div>
  );
}
