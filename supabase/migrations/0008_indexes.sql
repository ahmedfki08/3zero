-- Migration 0008: database indexes
CREATE INDEX IF NOT EXISTS idx_events_slug        ON events (slug);
CREATE INDEX IF NOT EXISTS idx_events_starts_at   ON events (starts_at);
CREATE INDEX IF NOT EXISTS idx_events_draft       ON events (draft);
CREATE INDEX IF NOT EXISTS idx_event_images_event ON event_images (event_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_event  ON event_form_fields (event_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_registrations_evt  ON event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON event_registrations (email);
CREATE INDEX IF NOT EXISTS idx_applications_email ON club_applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON club_applications (status);
