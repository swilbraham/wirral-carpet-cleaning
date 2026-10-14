import { adminData, addCode, deleteCode } from './_db.js';

const attempts = new Map(); // per-instance brute-force damper

function allow(key, max, windowMs) {
  const now = Date.now();
  const hits = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  attempts.set(key, hits);
  return true;
}

/** Admin data (GET) and discount-code management (POST), behind the password. */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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

  if (req.method === 'POST') {
    const action = String(req.body?.action || '');
    if (action === 'add-code') {
      const code = String(req.body?.code || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 20);
      const pct = Math.round(Number(req.body?.pct));
      if (code.length < 3) {
        return res.status(400).json({ error: 'Codes need at least 3 letters or numbers.' });
      }
      if (!Number.isFinite(pct) || pct < 1 || pct > 90) {
        return res.status(400).json({ error: 'Percentage must be between 1 and 90.' });
      }
      const result = await addCode(code, pct);
      if (!result.ok) return res.status(400).json({ error: result.reason });
      return res.status(200).json({ ok: true });
    }
    if (action === 'delete-code') {
      await deleteCode(String(req.body?.code || '').trim().toUpperCase().slice(0, 20));
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  const data = await adminData();
  if (!data) {
    return res.status(503).json({ error: 'DATABASE_URL is not set in Vercel.' });
  }
  return res.status(200).json({ ok: true, ...data });
}
