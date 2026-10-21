import { randomBytes } from 'node:crypto';
import {
  adminData,
  addCode,
  addQuote,
  deleteCode,
  getQuote,
  markQuoteChased,
  markQuoteSent,
  setQuoteBooked,
  setQuoteToken,
  setQuoteTotal,
  updateQuoteDetails,
} from './_db.js';
import { sendSms, ukMobile } from './_sms.js';

const SITE = 'https://www.wirralcarpetcleaning.com';

function newToken() {
  return randomBytes(12).toString('hex');
}

/** The quote text: details, the link, and how to book. */
async function textQuote(quote) {
  const to = ukMobile(quote.phone);
  if (!to) return { ok: false, reason: "That mobile number isn't textable — check it starts 07." };
  const firstName = String(quote.name || '').trim().split(' ')[0] || 'Hi';
  const items = String(quote.items || '').slice(0, 120);
  const body =
    `${firstName}, your Wirral Carpet Cleaning quote: ` +
    (items ? `${items} — ` : '') +
    `${quote.total}. Pay on the day, nothing upfront. ` +
    `View your quote & book: ${SITE}/quote/${quote.token} or call 0151 936 9664.`;
  const result = await sendSms(to, body);
  if (!result.ok) {
    return { ok: false, reason: 'The text failed to send — try again in a minute.' };
  }
  await markQuoteSent(quote.id);
  return { ok: true };
}

/** "90", "£90", "90.50" → "£90" / "£90.50"; null when it isn't a price. */
function asPrice(raw) {
  const n = Number(String(raw ?? '').replace(/[£,\s]/g, ''));
  if (!Number.isFinite(n) || n <= 0 || n > 10000) return null;
  return `£${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

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
    if (action === 'add-quote' || action === 'update-quote') {
      const name = String(req.body?.name || '').trim().slice(0, 80);
      const phone = String(req.body?.phone || '').trim().slice(0, 20);
      const postcode = String(req.body?.postcode || '').trim().toUpperCase().slice(0, 10);
      const address = String(req.body?.address || '').trim().slice(0, 200);
      if (!name) return res.status(400).json({ error: 'A name is needed.' });
      if (action === 'update-quote') {
        const id = Math.round(Number(req.body?.id));
        if (!Number.isFinite(id) || id <= 0) {
          return res.status(400).json({ error: 'Bad quote id.' });
        }
        await updateQuoteDetails(id, { name, phone, postcode, address });
        return res.status(200).json({ ok: true });
      }
      const items = String(req.body?.items || '').trim().slice(0, 400);
      const total = asPrice(req.body?.total);
      if (!total) return res.status(400).json({ error: 'Enter a price, e.g. 90 or 90.50.' });
      const token = newToken();
      const result = await addQuote({ name, phone, postcode, address, items, total, token });
      if (!result.ok) return res.status(400).json({ error: result.reason });
      if (req.body?.sendText) {
        const sent = await textQuote({ id: result.id, name, phone, items, total, token });
        if (!sent.ok) {
          return res.status(200).json({ ok: true, warning: `Quote saved, but: ${sent.reason}` });
        }
        return res.status(200).json({ ok: true, texted: true });
      }
      return res.status(200).json({ ok: true });
    }
    if (action === 'send-discount') {
      const id = Math.round(Number(req.body?.id));
      const pct = Math.round(Number(req.body?.pct));
      if (!Number.isFinite(id) || id <= 0) {
        return res.status(400).json({ error: 'Bad quote id.' });
      }
      if (!Number.isFinite(pct) || pct < 5 || pct > 50) {
        return res.status(400).json({ error: 'Pick a discount between 5% and 50%.' });
      }
      const quote = await getQuote(id);
      if (!quote) return res.status(404).json({ error: 'Quote not found.' });
      const to = ukMobile(quote.phone);
      if (!to) {
        return res.status(400).json({ error: "That mobile number isn't textable — check it starts 07." });
      }
      const totalValue = parseFloat(String(quote.total).replace(/[^0-9.]/g, ''));
      const discounted =
        Number.isFinite(totalValue) && totalValue > 0
          ? `£${(totalValue * (1 - pct / 100)).toFixed(2)}`
          : null;
      const firstName = String(quote.name || '').trim().split(' ')[0] || 'Hi';
      const body =
        `${firstName}, your Wirral Carpet Cleaning quote (${quote.total}) is still available. ` +
        `Book in the next 24 hours and pay ${pct}% less` +
        (discounted ? ` — ${discounted} on the day` : '') +
        `. Just show this text. Book: ${SITE}/book or call 0151 936 9664.`;
      const sent = await sendSms(to, body);
      if (!sent.ok) {
        return res.status(400).json({ error: 'The text failed to send — try again in a minute.' });
      }
      // Stamped so the 6-hour auto-chase doesn't offer them a second deal.
      await markQuoteChased(id);
      return res.status(200).json({ ok: true });
    }
    if (action === 'send-quote') {
      const id = Math.round(Number(req.body?.id));
      if (!Number.isFinite(id) || id <= 0) {
        return res.status(400).json({ error: 'Bad quote id.' });
      }
      let quote = await getQuote(id);
      if (!quote) return res.status(404).json({ error: 'Quote not found.' });
      if (!quote.token) {
        await setQuoteToken(id, newToken());
        quote = await getQuote(id);
      }
      const sent = await textQuote(quote);
      if (!sent.ok) return res.status(400).json({ error: sent.reason });
      return res.status(200).json({ ok: true, texted: true });
    }
    if (action === 'set-total') {
      const id = Math.round(Number(req.body?.id));
      const total = asPrice(req.body?.total);
      if (!Number.isFinite(id) || id <= 0) {
        return res.status(400).json({ error: 'Bad quote id.' });
      }
      if (!total) return res.status(400).json({ error: 'Enter a price, e.g. 90 or 90.50.' });
      await setQuoteTotal(id, total);
      return res.status(200).json({ ok: true });
    }
    if (action === 'mark-booked') {
      const id = Math.round(Number(req.body?.id));
      if (!Number.isFinite(id) || id <= 0) {
        return res.status(400).json({ error: 'Bad quote id.' });
      }
      // A flag and nothing else — no text, no email, ever.
      await setQuoteBooked(id, req.body?.booked !== false);
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
