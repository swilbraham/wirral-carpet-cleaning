/** Shared Twilio bits for the notify and chase endpoints. Import-only. */

/** "07700 900123" -> "+447700900123"; null for anything not a UK mobile. */
export function ukMobile(raw) {
  const digits = String(raw || '').replace(/[^0-9+]/g, '');
  let normalised = digits;
  if (normalised.startsWith('07')) normalised = `+44${normalised.slice(1)}`;
  if (normalised.startsWith('447')) normalised = `+${normalised}`;
  if (!/^\+447\d{9}$/.test(normalised)) return null;
  return normalised;
}

export async function sendSms(to, body) {
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
