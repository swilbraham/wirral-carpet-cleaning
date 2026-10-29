/**
 * Field encryption for the placement form.
 *
 * A work-experience form carries a child's name, their parent's number and
 * their medical details — special category data under UK GDPR. Neon encrypts
 * at rest, but that protects the disk, not a leaked connection string, a
 * borrowed backup or a careless query in a console. So the answers are sealed
 * before they are written and opened only by the admin endpoint, behind the
 * password.
 *
 * AES-256-GCM: the tag means a tampered row fails to open rather than opening
 * wrong. The key lives in WCC_FORM_KEY (64 hex characters) and nowhere else;
 * with no key the form refuses submissions outright rather than storing a
 * child's medical history in plain text.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function formKey() {
  const raw = String(process.env.WCC_FORM_KEY || '').trim();
  if (!/^[0-9a-fA-F]{64}$/.test(raw)) return null;
  return Buffer.from(raw, 'hex');
}

export function sealed(value) {
  const key = formKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), body.toString('base64')].join('.');
}

export function opened(packed) {
  const key = formKey();
  if (!key || !packed) return null;
  try {
    const [iv, tag, body] = String(packed).split('.');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(body, 'base64')),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(plain);
  } catch {
    // A row that will not open is a row that was tampered with or encrypted
    // under a different key. Either way it is not shown.
    return null;
  }
}
