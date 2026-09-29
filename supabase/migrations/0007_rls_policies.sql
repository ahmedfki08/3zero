-- Migration 0007: RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_applications ENABLE ROW LEVEL SECURITY;

-- events policies
CREATE POLICY "Allow public read for non-draft events" ON events
  FOR SELECT TO anon, authenticated
  USING (draft = false);

CREATE POLICY "Allow authenticated full access to events" ON events
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- event_images policies
CREATE POLICY "Allow public read for event_images" ON event_images
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_images.event_id AND events.draft = false));

CREATE POLICY "Allow authenticated full access to event_images" ON event_images
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- event_form_fields policies
CREATE POLICY "Allow public read for event_form_fields" ON event_form_fields
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_form_fields.event_id AND events.draft = false));

CREATE POLICY "Allow authenticated full access to event_form_fields" ON event_form_fields
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- event_registrations policies
CREATE POLICY "Allow anon and auth insert registrations" ON event_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_registrations.event_id AND events.draft = false));

CREATE POLICY "Allow authenticated full access to event_registrations" ON event_registrations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- club_applications policies
CREATE POLICY "Allow anon and auth insert applications" ON club_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to club_applications" ON club_applications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
