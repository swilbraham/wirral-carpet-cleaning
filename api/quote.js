import { getQuoteByToken } from './_db.js';

/** The public quote page's data: /api/quote?token=… — the token IS the
 *  auth, so a wrong or missing one just 404s. Read-only. */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const token = String(req.query?.token || '').trim();
  if (!/^[a-f0-9]{16,64}$/.test(token)) {
    return res.status(404).json({ error: 'Quote not found.' });
  }
  const quote = await getQuoteByToken(token);
  if (!quote) return res.status(404).json({ error: 'Quote not found.' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, ...quote });
}
