-- Migration 0006: computed status view
CREATE OR REPLACE VIEW events_with_status AS
SELECT
  e.*,
  COALESCE(COUNT(r.id) FILTER (WHERE r.status = 'confirmed'), 0)::int AS confirmed_count,
  CASE
    WHEN e.draft = true OR e.override_status IS NOT NULL
      THEN COALESCE(e.override_status, 'closed')
    WHEN e.ends_at < now()
      THEN 'past'
    WHEN e.capacity IS NOT NULL
      AND COUNT(r.id) FILTER (WHERE r.status = 'confirmed') >= e.capacity
      THEN 'full'
    WHEN e.starts_at - now() < INTERVAL '7 days'
      OR (e.capacity IS NOT NULL
          AND COUNT(r.id) FILTER (WHERE r.status = 'confirmed') >= e.capacity * 0.85)
      THEN 'closing-soon'
    ELSE 'open'
  END AS computed_status
FROM events e
LEFT JOIN event_registrations r ON r.event_id = e.id
GROUP BY e.id;
