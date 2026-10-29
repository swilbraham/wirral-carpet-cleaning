import { getPlacementByToken, savePlacementSection } from './_db.js';
import { formKey, sealed } from './_crypto.js';
import { sendSms, ukMobile } from './_sms.js';

/**
 * The work-experience placement form: /api/placement
 *
 * GET  ?token=…  what this link opens — the student's name, which half of the
 *                form it is, and whether it has already been completed.
 * POST            the completed half, sealed before it touches the database.
 *
 * The token is the authentication, as with the quote pages, so a wrong one
 * simply 404s. Nothing here ever returns the other party's answers, and the
 * notification to the office deliberately carries no detail: a text saying a
 * child is asthmatic is a text sitting unencrypted on somebody's lock screen.
 */

const OFFICE_MOBILE = process.env.WCC_OFFICE_MOBILE || '';

/** Trim, cap, and keep only what a form field should contain. */
function field(value, max = 400) {
  return String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

const attempts = new Map();

function allow(key, max, windowMs) {
  const now = Date.now();
  const hits = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  attempts.set(key, hits);
  return true;
}

/** The questions each half answers, so both ends agree on the shape. */
const SCHOOL_FIELDS = [
  'coordinatorName', 'coordinatorPhone', 'coordinatorEmail',
  'safeguardingContact', 'safeguardingPhone',
  'placementHours', 'endDate',
  'supervisionArrangements', 'placementRestrictions', 'reportingProcedure',
  'schoolConfirms', 'declarationName', 'declarationDate',
];

const PARENT_FIELDS = [
  'parentName', 'relationship', 'parentPhone', 'parentPhoneAlt', 'parentEmail',
  'emergencyName', 'emergencyPhone', 'collectionArrangements',
  'healthNone', 'allergies', 'medication', 'supportNeeds', 'taskRestrictions',
  'agreePlacement', 'agreeTravel', 'agreePhotography',
  'firstAidConsent', 'excludedTasks',
  'declarationName', 'declarationDate', 'studentName',
];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!allow(`placement:${ip}`, 40, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts — wait a few minutes.' });
  }

  const token = field(req.method === 'GET' ? req.query?.token : req.body?.token, 64);
  if (!/^[a-f0-9]{24,64}$/.test(token)) {
    return res.status(404).json({ error: 'That link is not valid.' });
  }

  const placement = await getPlacementByToken(token);
  if (!placement) return res.status(404).json({ error: 'That link is not valid.' });

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, ...placement });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (placement.expired) {
    return res.status(410).json({ error: 'That link has expired — ask Wirral Carpet Cleaning for a new one.' });
  }
  if (placement.done) {
    return res.status(409).json({ error: 'That section has already been completed.' });
  }

  // Fail closed. Without the key this would be storing a child's medical
  // details in plain text, which is worse than not taking the form at all.
  if (!formKey()) {
    console.error('WCC_FORM_KEY is missing — placement submission refused.');
    return res.status(503).json({
      error: "The form isn't ready to accept submissions yet. Please ring 0151 936 9664.",
    });
  }

  const wanted = placement.role === 'school' ? SCHOOL_FIELDS : PARENT_FIELDS;
  const answers = {};
  for (const key of wanted) {
    answers[key] = field(req.body?.[key], key === 'supervisionArrangements' ? 2000 : 600);
  }

  if (!answers.declarationName) {
    return res.status(400).json({ error: 'Please type your name as your signature.' });
  }
  if (placement.role === 'parent' && answers.firstAidConsent !== 'yes' && answers.firstAidConsent !== 'no') {
    return res.status(400).json({ error: 'Please answer the first aid consent question.' });
  }

  // Kept with the answers rather than in a log: it is evidence that this
  // declaration was made, and it belongs under the same lock as the rest.
  const record = {
    ...answers,
    submittedAt: new Date().toISOString(),
    submittedFrom: ip,
    userAgent: field(req.headers['user-agent'], 200),
  };

  const saved = await savePlacementSection(token, placement.role, sealed(record));
  if (!saved.ok) return res.status(409).json({ error: saved.reason });

  // No names, no detail. Just "go and look".
  const mobile = ukMobile(OFFICE_MOBILE);
  if (mobile) {
    await sendSms(
      mobile,
      `Wirral Carpet Cleaning: the ${placement.role === 'school' ? 'school' : 'parent/guardian'} ` +
        `section of a placement form has been completed. Open the admin to view it.`
    ).catch(() => {});
  }

  return res.status(200).json({ ok: true });
}
