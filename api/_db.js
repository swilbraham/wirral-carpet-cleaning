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
      )`.then(
      () => db`ALTER TABLE wcc_events ADD COLUMN IF NOT EXISTS chased_at timestamptz`
    ).then(
      () => db`
        CREATE TABLE IF NOT EXISTS wcc_codes (
          code       text PRIMARY KEY,
          pct        int NOT NULL CHECK (pct BETWEEN 1 AND 90),
          created_at timestamptz NOT NULL DEFAULT now()
        )`
    ).then(
      // The launch code predates the table; keep it working.
      () => db`INSERT INTO wcc_codes (code, pct) VALUES ('WCC201', 20)
               ON CONFLICT (code) DO NOTHING`
    ).then(
      // Set when the office marks a quote booked (they phoned instead).
      // Purely a flag: nothing is ever sent because of it.
      () => db`ALTER TABLE wcc_events ADD COLUMN IF NOT EXISTS manual_booked_at timestamptz`
    ).then(
      // Office quotes: the secret in the /quote/<token> link, and when the
      // quote was last texted to the customer.
      () => db`ALTER TABLE wcc_events ADD COLUMN IF NOT EXISTS token text`
    ).then(
      () => db`ALTER TABLE wcc_events ADD COLUMN IF NOT EXISTS quote_sent_at timestamptz`
    ).then(
      // Work-experience placements. The two sections are sealed separately
      // because they are completed by different people at different times, and
      // the school has no business reading the parent's medical disclosures.
      () => db`
        CREATE TABLE IF NOT EXISTS wcc_placements (
          id             serial PRIMARY KEY,
          student_name   text NOT NULL,
          school         text NOT NULL DEFAULT '',
          start_date     date,
          school_token   text NOT NULL UNIQUE,
          parent_token   text NOT NULL UNIQUE,
          school_sealed  text,
          parent_sealed  text,
          school_done_at timestamptz,
          parent_done_at timestamptz,
          expires_at     timestamptz NOT NULL DEFAULT now() + interval '60 days',
          created_at     timestamptz NOT NULL DEFAULT now()
        )`
    );
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

/**
 * Quotes 6+ hours old that never booked and were never chased, claimed by
 * stamping chased_at before any text goes out — a cron retry can't offer
 * the same person 10% twice. The 48-hour lower bound stops the first run
 * (or a long outage) texting a stale backlog.
 */
export async function claimQuotesForChase(limit = 15) {
  const db = sql();
  if (!db) return [];
  await ensureSchema(db);
  return db`
    UPDATE wcc_events SET chased_at = now()
     WHERE id IN (
       SELECT q.id FROM wcc_events q
        WHERE q.kind = 'quote'
          AND q.phone <> ''
          AND q.chased_at IS NULL
          AND q.manual_booked_at IS NULL
          AND q.created_at <= now() - interval '6 hours'
          AND q.created_at > now() - interval '48 hours'
          AND NOT EXISTS (
            SELECT 1 FROM wcc_events b
             WHERE b.kind LIKE 'booking%' AND b.phone = q.phone
               AND b.created_at >= q.created_at - interval '1 hour'
          )
        ORDER BY q.created_at
        LIMIT ${limit}
     )
     RETURNING id, name, phone, items, total`;
}

/** Stamp a quote as chased — the admin sent the offer by hand. */
export async function markQuoteChased(id) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`UPDATE wcc_events SET chased_at = now() WHERE id = ${id} AND kind = 'quote'`;
}

/** Un-stamp a claim whose text failed, so the next run tries again. */
export async function unclaimChase(id) {
  const db = sql();
  if (!db) return;
  await db`UPDATE wcc_events SET chased_at = NULL WHERE id = ${id}`;
}

/**
 * Mark a quote booked by hand — they phoned instead of clicking. Only this
 * flag changes: no text, no email, and the chase skips them from now on.
 */
export async function setQuoteBooked(id, booked) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`
    UPDATE wcc_events
       SET manual_booked_at = ${booked ? new Date().toISOString() : null}
     WHERE id = ${id} AND kind = 'quote'`;
}

/**
 * A quote the office types in by hand — someone phoned or messaged for a
 * price. It behaves exactly like a website quote: it shows on the admin
 * list and the 10% chase picks it up 6 hours later (unless marked booked).
 */
export async function addQuote(q) {
  const db = sql();
  if (!db) return { ok: false, reason: 'No database configured.' };
  await ensureSchema(db);
  try {
    const rows = await db`
      INSERT INTO wcc_events (kind, name, phone, postcode, address, items, total, token)
      VALUES ('quote', ${q.name}, ${q.phone}, ${q.postcode}, ${q.address || ''},
              ${q.items}, ${q.total}, ${q.token})
      RETURNING id`;
    return { ok: true, id: rows[0].id };
  } catch (err) {
    console.error('addQuote failed', err);
    return { ok: false, reason: 'Could not save the quote.' };
  }
}

/** One quote by id — what the text-the-quote action works from. */
export async function getQuote(id) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);
  const rows = await db`
    SELECT id, name, phone, postcode, items, total, token
      FROM wcc_events WHERE id = ${id} AND kind = 'quote'`;
  return rows[0] ?? null;
}

/** Amend who the quote is for — name, mobile, postcode, address. */
export async function updateQuoteDetails(id, d) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`
    UPDATE wcc_events
       SET name = ${d.name}, phone = ${d.phone},
           postcode = ${d.postcode}, address = ${d.address}
     WHERE id = ${id} AND kind = 'quote'`;
}

/** Give an older quote a link token so it can be texted out. */
export async function setQuoteToken(id, token) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`UPDATE wcc_events SET token = ${token}
            WHERE id = ${id} AND kind = 'quote' AND token IS NULL`;
}

export async function markQuoteSent(id) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`UPDATE wcc_events SET quote_sent_at = now() WHERE id = ${id}`;
}

/** The public quote page's lookup — the token is the whole secret. */
export async function getQuoteByToken(token) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);
  const rows = await db`
    SELECT name, postcode, items, total,
           to_char(created_at AT TIME ZONE 'Europe/London', 'DD Month YYYY') AS created
      FROM wcc_events
     WHERE kind = 'quote' AND token = ${token} AND token IS NOT NULL`;
  return rows[0] ?? null;
}

/** Change a quote's price — the chase text reads it from here, so an
 *  amended price is what any later 10% offer is calculated against. */
export async function setQuoteTotal(id, total) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`UPDATE wcc_events SET total = ${total} WHERE id = ${id} AND kind = 'quote'`;
}

/** The percentage for a live code, or null. */
export async function findCode(code) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);
  const rows = await db`SELECT pct FROM wcc_codes WHERE code = ${code}`;
  return rows[0]?.pct ?? null;
}

export async function listCodes() {
  const db = sql();
  if (!db) return [];
  await ensureSchema(db);
  return db`
    SELECT code, pct,
           to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY') AS created_at
      FROM wcc_codes ORDER BY created_at DESC`;
}

export async function addCode(code, pct) {
  const db = sql();
  if (!db) return { ok: false, reason: 'No database configured.' };
  await ensureSchema(db);
  try {
    await db`INSERT INTO wcc_codes (code, pct) VALUES (${code}, ${pct})`;
    return { ok: true };
  } catch (err) {
    if (String(err?.message || '').includes('duplicate')) {
      return { ok: false, reason: `${code} already exists — delete it first to change the percentage.` };
    }
    return { ok: false, reason: 'Could not save that code.' };
  }
}

export async function deleteCode(code) {
  const db = sql();
  if (!db) return;
  await ensureSchema(db);
  await db`DELETE FROM wcc_codes WHERE code = ${code}`;
}

/** Everything the admin page shows, in one round of queries. */
export async function adminData({ quoteDays = 30 } = {}) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);

  const [upcoming, past, quotes, customers, due, codes] = await Promise.all([
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
      SELECT id, name, phone, postcode, address, items, total, token,
             to_char(quote_sent_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS quote_sent_at,
             to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS created_at,
             to_char(chased_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS chased_at,
             (manual_booked_at IS NOT NULL) AS manual_booked,
             (manual_booked_at IS NOT NULL OR EXISTS (
               SELECT 1 FROM wcc_events b
                WHERE b.kind LIKE 'booking%' AND b.phone = wcc_events.phone
                  AND b.created_at >= wcc_events.created_at - interval '1 hour'
             )) AS booked
        FROM wcc_events
       WHERE kind = 'quote'
         AND created_at > now() - (${String(quoteDays)} || ' days')::interval
       ORDER BY created_at DESC
       LIMIT ${quoteDays > 90 ? 1000 : 200}`,
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
    db`
      SELECT code, pct,
             to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY') AS created_at
        FROM wcc_codes ORDER BY created_at DESC`,
  ]);

  return { upcoming, past, quotes, customers, due, codes };
}


// ---------------------------------------------------------------------------
// Work-experience placements
// ---------------------------------------------------------------------------

/** Start a placement and mint the two one-per-person links. */
export async function addPlacement({ studentName, school, startDate, schoolToken, parentToken }) {
  const db = sql();
  if (!db) return { ok: false, reason: 'No database configured.' };
  await ensureSchema(db);
  const [row] = await db`
    INSERT INTO wcc_placements (student_name, school, start_date, school_token, parent_token)
    VALUES (${studentName}, ${school}, ${startDate || null}, ${schoolToken}, ${parentToken})
    RETURNING id`;
  return { ok: true, id: row.id };
}

/**
 * The placement behind a link, and which half of the form it opens.
 *
 * Returns only what that person needs to see — the student's name and the
 * dates. Never the other party's answers: a school link must not become a way
 * to read a parent's medical disclosures.
 */
export async function getPlacementByToken(token) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);
  const [row] = await db`
    SELECT id, student_name, school,
           to_char(start_date, 'DD Mon YYYY') AS start_date,
           (school_token = ${token}) AS is_school,
           (school_done_at IS NOT NULL) AS school_done,
           (parent_done_at IS NOT NULL) AS parent_done,
           (expires_at < now()) AS expired
      FROM wcc_placements
     WHERE school_token = ${token} OR parent_token = ${token}
     LIMIT 1`;
  if (!row) return null;
  return {
    id: row.id,
    role: row.is_school ? 'school' : 'parent',
    studentName: row.student_name,
    school: row.school,
    startDate: row.start_date,
    done: row.is_school ? row.school_done : row.parent_done,
    expired: row.expired,
  };
}

/**
 * Store a completed section.
 *
 * The WHERE clause is the guard: a link only writes its own half, and only
 * while that half is unanswered, so a forwarded link cannot overwrite what was
 * submitted — a change has to come through the office.
 */
export async function savePlacementSection(token, role, sealedBlob) {
  const db = sql();
  if (!db) return { ok: false, reason: 'No database configured.' };
  await ensureSchema(db);

  const rows = role === 'school'
    ? await db`
        UPDATE wcc_placements
           SET school_sealed = ${sealedBlob}, school_done_at = now()
         WHERE school_token = ${token} AND school_done_at IS NULL AND expires_at > now()
        RETURNING id, student_name`
    : await db`
        UPDATE wcc_placements
           SET parent_sealed = ${sealedBlob}, parent_done_at = now()
         WHERE parent_token = ${token} AND parent_done_at IS NULL AND expires_at > now()
        RETURNING id, student_name`;

  if (rows.length === 0) {
    return { ok: false, reason: 'That form has already been completed, or the link has expired.' };
  }
  return { ok: true, id: rows[0].id, studentName: rows[0].student_name };
}

/** The list for the admin tab — names and progress only, nothing sealed. */
export async function listPlacements() {
  const db = sql();
  if (!db) return [];
  await ensureSchema(db);
  return db`
    SELECT id, student_name, school, school_token, parent_token,
           to_char(start_date, 'DD Mon YYYY') AS start_date,
           (school_done_at IS NOT NULL) AS school_done,
           (parent_done_at IS NOT NULL) AS parent_done,
           to_char(school_done_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS school_done_at,
           to_char(parent_done_at AT TIME ZONE 'Europe/London', 'DD Mon HH24:MI') AS parent_done_at,
           to_char(expires_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY') AS expires_at,
           to_char(created_at AT TIME ZONE 'Europe/London', 'DD Mon YYYY') AS created_at
      FROM wcc_placements
     ORDER BY created_at DESC
     LIMIT 50`;
}

/** One placement's sealed sections, for the admin endpoint to open. */
export async function getPlacementSealed(id) {
  const db = sql();
  if (!db) return null;
  await ensureSchema(db);
  const [row] = await db`
    SELECT id, student_name, school, school_sealed, parent_sealed
      FROM wcc_placements WHERE id = ${id} LIMIT 1`;
  return row || null;
}

/** Remove a placement and everything in it, once it is no longer needed. */
export async function deletePlacement(id) {
  const db = sql();
  if (!db) return false;
  await ensureSchema(db);
  await db`DELETE FROM wcc_placements WHERE id = ${id}`;
  return true;
}
