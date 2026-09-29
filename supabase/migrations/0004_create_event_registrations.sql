-- Migration 0004: event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  responses    jsonb NOT NULL DEFAULT '{}',
  status       text NOT NULL DEFAULT 'confirmed'
                 CHECK (status IN ('confirmed','waitlisted','cancelled')),
  email        text GENERATED ALWAYS AS (responses->>'email') STORED,
  UNIQUE (event_id, email)
);
