/**
 * Discount-code check. Codes live here, server-side, so they can't be read
 * out of the page source — a code spreads by flyer and word of mouth, not
 * by view-source.
 */
const CODES = {
  WCC201: 20,
};

const tries = new Map(); // per-instance brute-force damper

function allow(key, max, windowMs) {
  const now = Date.now();
  const hits = (tries.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  tries.set(key, hits);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!allow(`code:${ip}`, 20, 60 * 60 * 1000)) {
    return res.status(429).json({ ok: false, error: 'Too many tries — call us instead.' });
  }

  const code = String(req.body?.code || '').trim().toUpperCase().slice(0, 20);
  const pct = CODES[code];
  if (!pct) {
    return res.status(200).json({ ok: false, error: "That code isn't valid." });
  }
  return res.status(200).json({ ok: true, code, pct });
}
