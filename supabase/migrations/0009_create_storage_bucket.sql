-- Migration 0009: event-media storage bucket & policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

CREATE POLICY "Public Read Event Media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'event-media');

CREATE POLICY "Authenticated Upload Event Media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-media');

CREATE POLICY "Authenticated Update Event Media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'event-media');

CREATE POLICY "Authenticated Delete Event Media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'event-media');
