import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EventEditorClient } from '@/components/admin/events/EventEditorClient';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: event, error: eventError },
    { data: images },
    { data: formFields },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('event_images').select('*').eq('event_id', id).order('sort_order', { ascending: true }),
    supabase.from('event_form_fields').select('*').eq('event_id', id).order('sort_order', { ascending: true }),
  ]);

  if (eventError || !event) {
    notFound();
  }

  return (
    <EventEditorClient
      event={event}
      images={images || []}
      formFields={formFields || []}
    />
  );
}
