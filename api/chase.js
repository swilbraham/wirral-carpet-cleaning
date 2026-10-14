import { claimQuotesForChase, unclaimChase } from './_db.js';
import { sendSms, ukMobile } from './_sms.js';

/**
 * The 6-hour chase: anyone who unlocked a price, left a mobile and didn't
 * book gets one text offering 10% off. Pay-on-the-day makes redemption
 * simple — show the text, pay 10% less; no code machinery needed.
 *
 * Runs twice daily from Vercel cron (10:00 and 17:00 UTC — the most the
 * plan's cron allowance gives us), so a quote is chased at the first run
 * after it turns six hours old. Quiet hours are belt-and-braces: outside
 * 8am-8pm UK time nothing sends. One chase per quote, ever.
 */
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (req.headers.authorization !== `Bearer ${secret}`) {
      return res.status(401).json({ ok: false });
    }
  }

  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: 'numeric',
      hour12: false,
    }).format(new Date())
  );
  if (hour < 8 || hour >= 20) {
    return res.status(200).json({ ok: true, skipped: 'quiet hours' });
  }

  const quotes = await claimQuotesForChase();
  let sent = 0;

  for (const quote of quotes) {
    const to = ukMobile(quote.phone);
    if (!to) continue; // not a textable number — leave it claimed, never retry

    const totalValue = parseFloat(String(quote.total).replace(/[^0-9.]/g, ''));
    const discounted =
      Number.isFinite(totalValue) && totalValue > 0
        ? `£${(totalValue * 0.9).toFixed(2)}`
        : null;

    const firstName = String(quote.name || '').trim().split(' ')[0] || 'Hi';
    const body =
      `${firstName}, your Wirral Carpet Cleaning quote (${quote.total}) is still available. ` +
      `Book in the next 24 hours and pay 10% less` +
      (discounted ? ` — ${discounted} on the day` : '') +
      `. Just show this text. Book: https://www.wirralcarpetcleaning.com/book ` +
      `or call 0151 936 9664.`;

    const result = await sendSms(to, body);
    if (result.ok) {
      sent += 1;
    } else {
      // Twilio hiccup — give the next run another go at this one.
      await unclaimChase(quote.id);
    }
  }

  return res.status(200).json({ ok: true, claimed: quotes.length, sent });
}
