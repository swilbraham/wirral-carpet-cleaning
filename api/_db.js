/**
 * One table holds everything the booking flow produces: quotes viewed and
 * bookings made, discriminated by `kind`. Customer history and "due a
 * reminder" are both queries over it — no second system to keep in step.
 *
 * The underscore filename keeps this out of Vercel's function routing; it is
 * import-only. With no DATABASE_URL the exports no-op, so the site works
 * (emails and texts only) before the database exists.
 */
import { neon } from '@neondatabase/serverless';

let schemaReady = null;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

async function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = db`
      CREATE TABLE IF NOT EXISTS wcc_events (
        id         serial PRIMARY KEY,
        kind       text NOT NULL,
        name       text NOT NULL DEFAULT '',
        phone      text NOT NULL DEFAULT '',
        address    text NOT NULL DEFAULT '',
        postcode   text NOT NULL DEFAULT '',
        slot_date  date,
        slot_time  text NOT NULL DEFAULT '',
        items      text NOT NULL DEFAULT '',
        total      text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
  }
  await schemaReady;
}

/** Store one quote or booking. Failures are swallowed — a record must never
 *  block a booking that has already emailed and texted successfully. */
export async function recordEvent(event) {
  const db = sql();
  if (!db) return false;
  try {
    await ensureSchema(db);
    await db`
      INSERT INTO wcc_events (kind, name, phone, address, postcode, slot_date, slot_time, items, total)
      VALUES (${event.kind}, ${event.name}, ${event.phone}, ${event.address},
              ${event.postcode}, ${event.slotDate || null}, ${event.slotTime},
              ${event.items}, ${event.total})`;
    return true;
  } catch (err) {
    console.error('recordEvent failed', err);
    return false;
  }
}

/** Everything the admin page shows, in one round of queries. */
export async function adminData() {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);

  const [upcoming, past, quotes, customers, due] = await Promise.all([
    db`
      SELECT id, kind, name, phone, address, postcode, slot_time, items, total,
             to_char(slot_date, 'Dy DD Mon YYYY') AS slot_date,
             to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY HH24:MI') AS booked_at
        FROM wcc_events
       WHERE kind LIKE 'booking%' AND slot_date >= CURRENT_DATE
       ORDER BY slot_date, slot_time`,
    db`
      SELECT id, kind, name, phone, address, postcode, slot_time, items, total,
             to_char(slot_date, 'Dy DD Mon YYYY') AS slot_date,
             to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY HH24:MI') AS booked_at
        FROM wcc_events
       WHERE kind LIKE 'booking%' AND slot_date < CURRENT_DATE
       ORDER BY slot_date DESC
       LIMIT 100`,
    db`
      SELECT id, name, phone, postcode, items, total,
             to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS created_at,
             EXISTS (
               SELECT 1 FROM wcc_events b
                WHERE b.kind LIKE 'booking%' AND b.phone = wcc_events.phone
                  AND b.created_at >= wcc_events.created_at - interval '1 hour'
             ) AS booked
        FROM wcc_events
       WHERE kind = 'quote' AND created_at > now() - interval '30 days'
       ORDER BY created_at DESC
       LIMIT 100`,
    db`
      SELECT name, phone,
             count(*)::int AS bookings,
             to_char(max(slot_date), 'Mon YYYY') AS last_clean,
             max(postcode) AS postcode
        FROM wcc_events
       WHERE kind LIKE 'booking%' AND phone <> ''
       GROUP BY name, phone
       ORDER BY max(slot_date) DESC NULLS LAST
       LIMIT 200`,
    db`
      SELECT name, phone, max(postcode) AS postcode,
             to_char(max(slot_date), 'Mon YYYY') AS last_clean
        FROM wcc_events
       WHERE kind LIKE 'booking%' AND phone <> ''
       GROUP BY name, phone
      HAVING max(slot_date) < CURRENT_DATE - interval '9 months'
       ORDER BY max(slot_date)
       LIMIT 50`,
  ]);

  return { upcoming, past, quotes, customers, due };
}
