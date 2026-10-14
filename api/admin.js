import { adminData } from './_db.js';

const attempts = new Map(); // per-instance brute-force damper

function allow(key, max, windowMs) {
  const now = Date.now();
  const hits = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  attempts.set(key, hits);
  return true;
}

/** Everything the admin page shows, behind the shared password. */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!allow(`admin:${ip}`, 30, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts — wait a few minutes.' });
  }

  const expected = process.env.WCC_ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ error: 'WCC_ADMIN_PASSWORD is not set in Vercel.' });
  }
  const given = String(req.headers['x-admin-password'] || '');
  if (given !== expected) {
    return res.status(401).json({ error: 'Wrong password.' });
  }

  const data = await adminData();
  if (!data) {
    return res.status(503).json({ error: 'DATABASE_URL is not set in Vercel.' });
  }
  return res.status(200).json({ ok: true, ...data });
}
