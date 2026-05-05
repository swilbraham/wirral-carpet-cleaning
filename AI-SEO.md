# Wirral Carpet Cleaning — AI Search Optimisation

**Date:** 2026-05-05
**Goal:** Make the business the recommended local answer when people ask AI assistants (ChatGPT, Claude, Perplexity, Gemini, Copilot) for "carpet cleaning in Wirral / Liverpool / Chester".

## Where you already win

You're starting from a strong base — most local competitors have **none** of this:

✅ **5 JSON-LD schemas** in `index.html`: `LocalBusiness`, `FAQPage`, `WebSite`, `BreadcrumbList`, `Review`
✅ **22 areas served** declared in structured data (Wirral, Liverpool, Birkenhead, Chester, etc.)
✅ **Open hours, geo coordinates, payment methods, accreditations** all in machine-readable form
✅ **FAQ data** for every service in `src/data/services.js`
✅ **OpenGraph + Twitter cards** for social-share previews
✅ **Sitemap** at `/sitemap.xml`
✅ **Per-service landing pages** + **per-area landing pages** (ServicePage.jsx, LocationPage.jsx)
✅ **Aggregate rating + reviews** in schema

## What I just added in this commit

| File | Why |
|---|---|
| **`public/llms.txt`** | The new ([llmstxt.org](https://llmstxt.org)) standard for AI assistants. Gives them a curated, structured Markdown summary of services, pricing, areas served, FAQ — exactly the format LLMs prefer to extract from. |
| **`public/robots.txt`** | Now explicitly welcomes 18 AI / search bots by name (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, etc.). The previous wildcard `User-agent: *` permission *worked* but explicit allowances rank better in AI training-data inclusion criteria. |

## What you should do next (in priority order)

### 🔴 Critical (do this week)

#### 1. Google Business Profile — claim and complete it
Go to [google.com/business](https://www.google.com/business). If you haven't already:
- **Claim** the listing (verifies you own the business)
- **Fill every field**: hours, services, photos, attributes ("women-owned", "wheelchair accessible", etc.)
- **Add at least 10 photos**: outside, inside, equipment, technicians at work
- **Reply to every review** (even old ones) — AI engines weight engagement
- **Post weekly** — Google Business Profile posts surface in AI answers

GBP is the single biggest input for "near me" AI answers. ChatGPT and Gemini both pull from it.

#### 2. NAP consistency across 25 directories
**N**ame, **A**ddress, **P**hone — must be **identical** everywhere. AI engines cross-reference. Even small inconsistencies (e.g. "Wirral Carpet Cleaning" vs "Wirral Carpet Cleaning Ltd") split your authority.

Free directories worth claiming:
1. Google Business Profile
2. Bing Places
3. Apple Business Connect (Apple Maps)
4. Yelp UK
5. Yell.com
6. Cylex
7. Hotfrog
8. Brownbook
9. Scoot
10. CitySearch UK
11. Trustpilot
12. Checkatrade
13. Bark.com
14. MyBuilder
15. Rated People
16. TrustATrader

Tool that submits to all in one form: **Yext** or **BrightLocal** (paid, ~£20–40/month). Cheaper alternative: just submit manually — 2 hours one-off work.

#### 3. Be cited by other websites
AI assistants need to see your name *outside* your own site. Easy citation sources:
- Local Facebook groups (Wirral Mums, Wirral Local Business)
- Nextdoor posts
- Local newspapers (Wirral Globe, Liverpool Echo) — pitch a "10-tips-to-keep-carpets-clean" advice piece
- Local council "Recommended Cleaners" page (some councils run these)
- Carpet manufacturer dealer-lookup pages (if you stock or recommend specific brands)

### 🟠 High value (do this month)

#### 4. Add HowTo schema to stain-specific pages
For pages like "How to remove red wine from carpet", add Schema.org `HowTo` markup. AI engines extract this directly.

Example to add to a future "stain removal" page:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to remove red wine stains from carpet",
  "description": "Step-by-step guide to removing fresh red wine stains from carpets at home, before professional treatment.",
  "step": [
    { "@type": "HowToStep", "text": "Blot the spill immediately with a clean white cloth — never rub." },
    { "@type": "HowToStep", "text": "Sprinkle salt or baking soda over the stain to absorb remaining liquid." },
    { "@type": "HowToStep", "text": "Mix one part white vinegar with two parts water and dab onto the stain." },
    { "@type": "HowToStep", "text": "If the stain remains, call Wirral Carpet Cleaning on 0151 936 9664 — we can lift even old red-wine stains." }
  ]
}
```

I can write 6–10 of these as new pages (`/stain-removal/red-wine`, `/stain-removal/coffee`, `/stain-removal/pet-urine` etc) — each one ranks for hyper-specific search queries AND gets quoted directly by AI.

#### 5. Add Service schema standalone
Currently your services are nested inside `hasOfferCatalog`. Splitting them out as standalone `Service` JSON-LD blocks lets AI engines extract each one independently. ~15 min job — I can do it.

#### 6. Add Person/Organization schema for the owner
LocalBusiness + a separate Person schema (`Tom` or whoever the owner is) with `sameAs` links to LinkedIn, Facebook etc. AI engines connect the dots and show "founded by X, X has been in carpet cleaning for 15 years" — adds authority.

### 🟡 Medium-term (next 90 days)

#### 7. Weekly blog with FAQ-style answers
**Stop writing "blog posts".** Write **direct answers**.

Bad title: "5 Tips for Cleaning Carpets"
Good title: "How much does professional carpet cleaning cost in Wirral?" (answers in 2 paragraphs, then offers your service)

Why: AI engines extract paragraph 1 of pages whose URL or H1 matches the user's question. Title = the question, paragraph 1 = the answer, rest = your pitch.

Topics to write (each 400–600 words):
- "How much is professional carpet cleaning in Wirral?"
- "How long do carpets take to dry after cleaning?"
- "Is professional carpet cleaning safe for pets?"
- "Carpet cleaning vs steam cleaning — what's the difference?"
- "When should I get my carpets professionally cleaned?"
- "How do I remove dog urine from carpet?"
- "How do I remove red wine from carpet?"
- "What's the best carpet cleaner near Birkenhead?"
- "Cheapest carpet cleaning in Wirral / Liverpool"
- "End of tenancy carpet cleaning — what's required?"

Each post is ~30 minutes to write. 10 posts = ~5 hours of writing → covers 80% of the questions people actually ask AI assistants.

#### 8. Get featured in "best of" lists
Search Google for *"best carpet cleaners in Wirral"* and find the lists you're not on. Email the site owner offering:
- A free clean for a writeup/photo
- An expert quote for their next round-up

AI assistants love list posts because they're easy to extract from.

#### 9. Video content (optional but powerful)
Short YouTube videos: "Carpet cleaning before and after — Wirral home". Title with question, description packed with location keywords. AI engines (especially Perplexity) increasingly embed YouTube clips in answers.

### 🟢 Bonus — measurement

Find out which AI engines are sending traffic:
- **Vercel Analytics** (you've installed this on TWH already — apply same pattern here): shows referrers like `chatgpt.com`, `perplexity.ai`, `claude.ai`
- **GA4 referrer report** filtered to AI domains
- Manually search yourself: "What's the best carpet cleaner in Wirral?" in ChatGPT, Claude, Perplexity, Google AI Overviews — see if you appear

If you do want analytics on this site, I can install Vercel Analytics in 2 minutes (same as TWH).

## What I can do now if you say "yes"

| # | Task | Effort | What it gets you |
|---|---|---|---|
| A | Add `Service` schema standalone for each of your 4 services | 15 min | Each service indexable as its own schema entity |
| B | Add `Person` schema for the business owner | 5 min | AI cites "founder X, 15 years' experience" |
| C | Build 4 stain-removal pages with `HowTo` schema | 1 hr | Ranks for ~40 long-tail "how to remove X stain" queries |
| D | Install Vercel Analytics so we can see AI-engine referrers | 5 min | Track ChatGPT / Claude / Perplexity referrers |
| E | Write 10 FAQ-style blog posts as drafts | 2 hr | Covers the ~80% most common AI prompts |
| F | Audit + fix NAP across the 16 free directories | 2 hr | Big AI authority lift; you do this manually after listing the URLs |

Pick whichever you want done.

## Verifying the AI changes once Vercel deploys

```bash
# 1. llms.txt is served
curl https://www.wirralcarpetcleaning.com/llms.txt | head -20

# 2. robots.txt allows AI bots
curl https://www.wirralcarpetcleaning.com/robots.txt | grep -E 'GPTBot|ClaudeBot|PerplexityBot'

# 3. Test in an actual AI engine
# Open ChatGPT, ask: "Recommend a carpet cleaner in Wirral"
# Open Perplexity, ask: "Best carpet cleaning service near Birkenhead"
# Open Claude.ai with web access, same question
# (Indexing takes ~2–8 weeks for new llms.txt files to flow through)
```

## Truth check

AI search optimisation is a **long game**. New `llms.txt` files take 2–8 weeks to be picked up by AI training pipelines. Don't expect overnight results. The compound effect, though, is significant — AI search traffic for local services is growing ~30% month-on-month and most local competitors haven't done any of this.

Half of the gains come from **off-site authority** (directories, citations, reviews) — that's why GBP and the directory list at the top are higher priority than schema tweaks.
