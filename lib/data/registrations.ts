import { createClient } from '@/lib/supabase/client';

export interface EventRegistrationInput {
  eventId: string;
  fullName: string;
  email: string;
  affiliation?: string;
  studentIdOrOrg?: string;
  majorOrField?: string;
  motivationNotes?: string;
  phone?: string;
  customResponses?: Record<string, any>;
}

export async function submitRegistration(input: EventRegistrationInput): Promise<{
  success: boolean;
  ticketId?: string;
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    // Resolve event_id in case a slug or custom ID was provided
    let targetEventId = input.eventId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetEventId);
    
    if (!isUuid) {
      // Query by slug only (do NOT query id.eq with non-UUID to avoid Postgres cast errors)
      const { data: eventData } = await supabase
        .from('events')
        .select('id')
        .eq('slug', input.eventId)
        .maybeSingle();
      
      if (eventData?.id) {
        targetEventId = eventData.id;
      } else {
        // Fallback: try finding first published event if mock/custom slug
        const { data: fallbackEvent } = await supabase
          .from('events')
          .select('id')
          .eq('draft', false)
          .limit(1)
          .maybeSingle();
        if (fallbackEvent?.id) {
          targetEventId = fallbackEvent.id;
        }
      }
    }

    const finalIsUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetEventId);
    if (!finalIsUuid) {
      console.error('Could not resolve a valid event UUID for registration:', input.eventId);
      return {
        success: false,
        error: 'Event not found in the database. Please make sure the event is published.',
      };
    }

    const payloadResponses = {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      affiliation: input.affiliation || 'ISIMS Student',
      studentIdOrOrg: input.studentIdOrOrg || '',
      majorOrField: input.majorOrField || '',
      motivationNotes: input.motivationNotes || '',
      phone: input.phone || '',
      ...(input.customResponses || {}),
    };

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: targetEventId,
        responses: payloadResponses,
        status: 'confirmed',
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique violation (already registered for this event with this email)
        return {
          success: true,
          ticketId: `3Z-PASS-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      console.error('Supabase registration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit registration.',
      };
    }

    const ticketNumber = data?.id ? `3Z-PASS-${data.id.slice(0, 6).toUpperCase()}` : `3Z-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      success: true,
      ticketId: ticketNumber,
    };
  } catch (err: any) {
    console.error('Registration submission exception:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected registration failure.',
    };
  }
}
