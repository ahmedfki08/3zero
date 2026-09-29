-- Migration 0001: events table
CREATE TABLE IF NOT EXISTS events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  tagline          text,
  description      text,
  category         text NOT NULL CHECK (category IN (
                     'Hackathon','Workshop','Symposium','Tech Talk','Fieldwork','Ideation Jam')),
  pillar_id        text CHECK (pillar_id IN ('exclusion','carbon','poverty','all')),
  starts_at        timestamptz NOT NULL,
  ends_at          timestamptz NOT NULL,
  timezone         text NOT NULL DEFAULT 'Africa/Tunis',
  location_venue   text,
  location_room    text,
  location_city    text DEFAULT 'Sfax, Tunisia',
  location_map_url text,
  cover_image_url  text,
  capacity         int CHECK (capacity > 0),
  barcode_number   text,
  requirements     text[],
  speakers         jsonb DEFAULT '[]',
  draft            boolean NOT NULL DEFAULT false,
  override_status  text CHECK (override_status IN ('closed')),
  is_featured      boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ends_after_starts CHECK (ends_at > starts_at)
);
