import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If on login page or unauthenticated, let the login page or middleware handle it
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-sans antialiased text-slate-900">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar userEmail={user.email} />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader userEmail={user.email} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
