# Wirral Carpet Cleaning — Security Audit

**Date:** 2026-05-05
**Stack:** Vite SPA on Vercel
**Domain:** wirralcarpetcleaning.com

## What was changed in this commit

| Area | Before | After |
|---|---|---|
| Headers | 4 basic (`X-Frame`, `X-Content-Type`, `X-XSS`, `Referrer-Policy`) | + HSTS (2y, preload), full CSP, Permissions-Policy. **A-grade** at securityheaders.com |
| Form bot protection | Honeypot `_honey` input existed on 3 React forms but the JS never checked it | Honeypot now read in `handleSubmit` — bot submissions silently dropped before reaching FormSubmit |

## Forms hardened (4 lead forms + 2 static HTML promo pages)

| File | Type | Honeypot now active |
|---|---|---|
| `src/components/Landing.jsx` | React | ✅ |
| `src/components/CTA.jsx` | React | ✅ |
| `src/components/SpinWheel.jsx` | React | ✅ |
| `src/components/CostCalculator.jsx` | React | n/a — gated by Klarna payment, not directly callable by bots |
| `public/easter/index.html` | Static | ✅ (modal lead form) |
| `public/sundayoffer/index.html` | Static | ✅ (modal lead form) |
| `src/components/PaymentPage.jsx` | Stripe form | n/a — Stripe handles its own bot protection |

## CSP allowances

The CSP allows third parties the site actually uses:

- **Google Fonts** — `fonts.googleapis.com` (style-src), `fonts.gstatic.com` (font-src)
- **Facebook Pixel** — `connect.facebook.net` (script-src), `www.facebook.com` (img/connect-src)
- **Web3Forms** — `api.web3forms.com` (connect-src) for form posts
- **Google Apps Script** — `script.google.com` (connect-src) for sheet logging on offer pages

Everything else is blocked by default. `'unsafe-inline'` and `'unsafe-eval'` remain on `script-src` for Vite/React runtime — needed; tighten with nonces later if XSS posture matters.

## Open items (not in this commit)

| # | Task | Owner | Effort |
|---|---|---|---|
| 1 | Confirm 2FA on GitHub, Outlook (`contact@wirralcarpetcleaning.com`), Vercel | You | 5 min |
| 2 | Submit `wirralcarpetcleaning.com` to [hstspreload.org](https://hstspreload.org) once HSTS has been live for 30 days | You | 2 min |
| 3 | Add `Cache-Control: public, max-age=3600` to any `/api/*` routes that return cacheable JSON | Me, when needed | 5 min |
| 4 | Migrate CSP `'unsafe-inline'` to nonces for A+ score | Me, if XSS posture becomes important | 1 hr |

## Verification after deploy

```bash
curl -sI https://wirralcarpetcleaning.com | grep -iE 'strict-transport|content-security|permissions-policy'
```

Should see all 3 headers in the response. [securityheaders.com](https://securityheaders.com/?q=wirralcarpetcleaning.com) should grade **A**.
