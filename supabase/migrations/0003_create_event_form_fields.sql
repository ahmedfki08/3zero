-- Migration 0003: event_form_fields table
CREATE TABLE IF NOT EXISTS event_form_fields (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  label      text NOT NULL,
  field_key  text NOT NULL,
  type       text NOT NULL CHECK (type IN (
               'text','email','tel','select','radio','checkbox','textarea','number')),
  required   boolean NOT NULL DEFAULT false,
  options    jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, field_key)
);
