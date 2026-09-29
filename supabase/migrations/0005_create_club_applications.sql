-- Migration 0005: club_applications table
CREATE TABLE IF NOT EXISTS club_applications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  full_name       text NOT NULL,
  email           text NOT NULL,
  phone           text,
  department      text,
  year_of_study   text,
  pillar_focus    text CHECK (pillar_focus IN ('exclusion','carbon','poverty')),
  motivation      text,
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','reviewed','accepted','rejected')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);
