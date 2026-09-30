import { createClient } from '@/lib/supabase/client';

export interface EventFormField {
  id: string;
  event_id?: string;
  label: string;
  field_key: string;
  type: string; // 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'checkbox'
  required: boolean;
  sort_order: number;
}

const STORAGE_PREFIX = '3zero_event_form_fields_';

export async function fetchEventFormFields(eventId: string): Promise<EventFormField[]> {
  if (!eventId) return [];

  // 1. Try Supabase
  try {
    const supabase = createClient();
    
    // Resolve UUID if slug passed
    let targetId = eventId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
    if (!isUuid) {
      const { data: eventData } = await (supabase as any)
        .from('events')
        .select('id')
        .or(`slug.eq.${eventId},id.eq.${eventId}`)
        .single();
      if (eventData) {
        targetId = eventData.id;
      }
    }

    const { data, error } = await (supabase as any)
      .from('event_form_fields')
      .select('*')
      .eq('event_id', targetId)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      // Also cache in local storage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`${STORAGE_PREFIX}${eventId}`, JSON.stringify(data));
        } catch {}
      }
      return data;
    }
  } catch {
    // Continue to local storage
  }

  // 2. Client local storage fallback
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${eventId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as EventFormField[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.sort_order - b.sort_order);
        }
      }
    } catch {}
  }

  return [];
}

export async function saveEventFormField(
  eventId: string,
  field: Omit<EventFormField, 'id'> & { id?: string }
): Promise<EventFormField[]> {
  const current = await fetchEventFormFields(eventId);
  let updated: EventFormField[];

  const newField: EventFormField = {
    id: field.id || `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event_id: eventId,
    label: field.label,
    field_key: field.field_key,
    type: field.type || 'text',
    required: field.required ?? false,
    sort_order: field.sort_order ?? current.length + 1,
  };

  const existingIdx = current.findIndex(
    (f) => (field.id && f.id === field.id) || f.field_key === field.field_key
  );

  if (existingIdx >= 0) {
    updated = current.map((f, i) => (i === existingIdx ? newField : f));
  } else {
    updated = [...current, newField];
  }

  // Save to Supabase
  try {
    const supabase = createClient();
    await (supabase as any).from('event_form_fields').upsert({
      id: newField.id.startsWith('field_') ? undefined : newField.id,
      event_id: eventId,
      label: newField.label,
      field_key: newField.field_key,
      type: newField.type,
      required: newField.required,
      sort_order: newField.sort_order,
    });
  } catch {}

  // Save to local storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${eventId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('event-fields-updated', { detail: { eventId } }));
    } catch {}
  }

  return updated;
}

export async function deleteEventFormField(
  eventId: string,
  fieldId: string
): Promise<EventFormField[]> {
  const current = await fetchEventFormFields(eventId);
  const updated = current.filter((f) => f.id !== fieldId);

  // Delete from Supabase
  try {
    const supabase = createClient();
    await (supabase as any).from('event_form_fields').delete().eq('id', fieldId);
  } catch {}

  // Update local storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${eventId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('event-fields-updated', { detail: { eventId } }));
    } catch {}
  }

  return updated;
}
