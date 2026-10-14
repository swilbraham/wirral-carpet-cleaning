/**
 * Texts for the booking flow, via the same Twilio account as Fresh For Less.
 *
 * Two messages per booking: one to the owner (always, to the fixed
 * OWNER_MOBILE — the booking email's fast twin) and one confirmation to the
 * customer. Quotes text the owner only — a browsing customer hasn't asked to
 * be messaged yet; the chase is a human decision.
 *
 * The customer number is the only caller-supplied destination, so it is
 * held to UK mobiles and the endpoint is rate-limited per instance — this
 * must not become anyone's free SMS gateway.
 */

import { recordEvent } from './_db.js';

const sent = new Map(); // per-instance rate limit: key -> [timestamps]

function allow(key, max, windowMs) {
  const now = Date.now();
  const hits = (sent.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  sent.set(key, hits);
  return true;
}

/** "07700 900123" -> "+447700900123"; null for anything not a UK mobile. */
function ukMobile(raw) {
  const digits = String(raw || '').replace(/[^0-9+]/g, '');
  let normalised = digits;
  if (normalised.startsWith('07')) normalised = `+44${normalised.slice(1)}`;
  if (normalised.startsWith('447')) normalised = `+${normalised}`;
  if (!/^\+447\d{9}$/.test(normalised)) return null;
  return normalised;
}

async function sendSms(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM;
  if (!sid || !token || !from) return { ok: false, reason: 'not configured' };

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, reason: detail.slice(0, 200) };
  }
  return { ok: true };
}

const text = (value, max = 160) => String(value ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const kind = text(req.body.kind, 20);
  if (!['booking', 'booking-paid', 'quote'].includes(kind)) {
    return res.status(400).json({ error: 'Unknown kind' });
  }

  const ip =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!allow(`ip:${ip}`, 8, 60 * 60 * 1000)) {
    return res.status(429).json({ ok: false });
  }

  const name = text(req.body.name, 60);
  const phone = text(req.body.phone, 20);
  const address = text(req.body.address, 120);
  const postcode = text(req.body.postcode, 10).toUpperCase();
  const date = text(req.body.date, 24);
  const time = text(req.body.time, 20);
  const items = text(req.body.items, 220);
  const total = text(req.body.total, 12);

  // The permanent record — this is what the admin page reads. Texts and
  // emails are the fast copies; this is the one that lasts.
  await recordEvent({
    kind,
    name,
    phone,
    address,
    postcode,
    slotDate: /^\d{4}-\d{2}-\d{2}$/.test(text(req.body.dateIso, 10))
      ? text(req.body.dateIso, 10)
      : null,
    slotTime: time,
    items,
    total,
  });

  const results = { owner: false, customer: false };

  // The office text: fixed destination, so this one is always safe to send.
  const owner = ukMobile(process.env.OWNER_MOBILE);
  if (owner) {
    const headline =
      kind === 'quote'
        ? `QUOTE viewed (not booked): ${total}`
        : kind === 'booking-paid'
          ? `NEW BOOKING (PAID Klarna): ${total}`
          : `NEW BOOKING (pay on day): ${total}`;
    const lines = [
      `WCC ${headline}`,
      `${name} ${phone}`,
      kind === 'quote' ? items : `${address}, ${postcode}`,
      kind === 'quote' ? '' : `${date} ${time} — ${items}`,
    ].filter(Boolean);
    results.owner = (await sendSms(owner, lines.join('\n'))).ok;
  }

  // Customer confirmation: bookings only, UK mobiles only, once per number.
  if (kind !== 'quote') {
    const customer = ukMobile(phone);
    if (customer && allow(`cust:${customer}`, 2, 24 * 60 * 60 * 1000)) {
      const body =
        kind === 'booking-paid'
          ? `Wirral Carpet Cleaning: booking received for ${date} (${time}), paid via Klarna. ` +
            `We'll confirm your slot shortly. Questions? 0151 936 9664`
          : `Wirral Carpet Cleaning: booking received for ${date} (${time}). ` +
            `Nothing paid today — ${total} by cash or card when the job's done. ` +
            `We'll confirm your slot shortly. Questions? 0151 936 9664`;
      results.customer = (await sendSms(customer, body)).ok;
    }
  }

  // Presence booleans only — never values. Enough to see which variable a
  // silent failure is missing.
  return res.status(200).json({
    ok: true,
    ...results,
    configured: {
      twilio: Boolean(
        process.env.TWILIO_ACCOUNT_SID &&
          process.env.TWILIO_AUTH_TOKEN &&
          process.env.TWILIO_SMS_FROM
      ),
      ownerMobile: Boolean(ukMobile(process.env.OWNER_MOBILE)),
    },
  });
}
