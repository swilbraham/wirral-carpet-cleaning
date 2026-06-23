// Blog posts — used by /blog and /blog/:slug routes.
// Each post emits Article + FAQPage (when faqs present) + BreadcrumbList schemas.
//
// Body block types:
//   { type: 'h2', text }
//   { type: 'h3', text }
//   { type: 'p',  text }                       // paragraph (supports inline **bold**)
//   { type: 'ul', items: [...] }               // unordered list
//   { type: 'ol', items: [...] }               // ordered list
//   { type: 'table', headers: [...], rows: [[...]] }  // simple data table
//   { type: 'callout', text }                  // amber 'tip' callout

const posts = [
  // ─────────────────────────────────────────────────────────
  {
    slug: 'carpet-cleaning-cost-wirral',
    title: 'How much does carpet cleaning cost in Wirral?',
    metaTitle: 'How much does carpet cleaning cost in Wirral? | Wirral Carpet Cleaning',
    metaDescription:
      'Professional carpet cleaning in Wirral starts from £60 for the first room. Full pricing breakdown, what affects the cost, and how to get the best value. Free quotes from Wirral Carpet Cleaning.',
    publishedDate: '2026-04-14',
    readingTime: '4 min',
    quickAnswer:
      'Professional carpet cleaning in Wirral starts from £60 for the first room, with additional rooms from £30 each. A typical 3-bedroom semi with hall, stairs and landing is £120–£180 fully cleaned. Most jobs are completed in 1–2 hours and the carpets are dry in 2–4 hours. We provide a free written quote with no obligation — call 0151 936 9664 or use the online calculator.',
    body: [
      { type: 'h2', text: 'What affects the price' },
      { type: 'p', text: 'There are five things that move the needle on a carpet cleaning quote:' },
      {
        type: 'ol',
        items: [
          '**Number of rooms** — straightforward; £60 first, £30 each after.',
          '**Room size** — anything over 4×4 metres usually adds a small uplift.',
          '**Carpet condition** — heavily soiled, stained or pet-affected carpets need pre-treatment. Add £5–£20 per area.',
          '**Carpet type** — wool, sisal and silk-blend carpets need specialist methods. We quote these in person.',
          '**Stairs** — counted as one "room" on most pricing schedules, irrespective of the number of steps.',
        ],
      },
      { type: 'h2', text: "What's included as standard" },
      {
        type: 'p',
        text: 'Every clean includes pre-vacuum, pre-treatment of stains and high-traffic areas, hot-water extraction, fast-dry process and a satisfaction guarantee. We never charge extra for fuel, parking or call-out fees within the Wirral, Liverpool, Birkenhead and Chester areas.',
      },
      { type: 'h2', text: 'How we compare to the average' },
      {
        type: 'p',
        text: 'A 2024 survey of UK domestic carpet cleaning prices put the national average at £35–£50 per room. Our £30 per additional room sits at the lower end while using the same hot-water extraction equipment as the high-end cleaners — we\'re a small family-run business with low overheads, not a national franchise paying for ad budgets.',
      },
      { type: 'h2', text: 'What you should never pay extra for' },
      {
        type: 'p',
        text: 'If a quote includes any of these as a separate line item, get a second quote: "fuel surcharge", "after-hours fee" within standard hours, "stain assessment fee", "equipment fee". These are sales tactics. A quote is a quote.',
      },
      { type: 'h2', text: 'How to get an honest price' },
      {
        type: 'p',
        text: 'The fastest path: text or WhatsApp us a photo of each room you want cleaned, with rough dimensions, to **0151 936 9664**. We\'ll come back with a fixed price within an hour. No call needed unless you\'d prefer one. Free quotes — no obligation, no follow-up sales calls.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'how-long-carpets-take-to-dry',
    title: 'How long do carpets take to dry after cleaning?',
    metaTitle: 'How long do carpets take to dry after cleaning? | Wirral Carpet Cleaning',
    metaDescription:
      'Most professionally-cleaned carpets are dry within 2–4 hours. What affects drying time, how to speed it up safely, and when to worry. Wirral Carpet Cleaning explains.',
    publishedDate: '2026-04-21',
    readingTime: '3 min',
    quickAnswer:
      'Most professionally-cleaned carpets are dry within 2–4 hours when cleaned with hot-water extraction. The exact time depends on three things: the equipment used, the humidity in the room, and the carpet type. Wool and high-pile carpets can take up to 6 hours; low-pile synthetic carpets can be touch-dry in under 2 hours. Renting a domestic carpet cleaner from a supermarket typically leaves carpets wet for 12–24 hours.',
    body: [
      { type: 'h2', text: 'Why our carpets dry faster' },
      {
        type: 'p',
        text: 'We use truck-mount-grade extraction equipment that pulls the cleaning solution back out of the carpet at far higher pressure than a domestic machine. The carpet leaves wet, not soaked.',
      },
      { type: 'h2', text: 'What you can do to speed it up' },
      {
        type: 'ul',
        items: [
          '**Open windows** on opposite sides of the room for cross-flow ventilation',
          '**Run a fan** at floor level — this halves the drying time',
          '**Switch on heating** in winter — warmer air absorbs moisture faster',
          '**Avoid replacing furniture** for at least 4 hours; placing wood, metal or foam directly back onto a damp carpet can cause stain transfer or warp the furniture base',
        ],
      },
      { type: 'h2', text: 'What you should not do' },
      {
        type: 'p',
        text: "Don't walk on the carpet barefoot or in socks — both transfer skin oils that bond to fibres and create new dirty patches. Wear shoe covers (we leave a pack with you) or wait until it's dry. Don't blast a hairdryer on it; spot-drying creates uneven moisture content that can cause shrinkage.",
      },
      { type: 'h2', text: 'When drying time is a problem' },
      {
        type: 'p',
        text: 'If after 8 hours the carpet still feels noticeably wet, the cleaner has used too much solution and not enough extraction. This is the single most common complaint about cheap carpet cleaning — the carpet ends up smelling musty for a week. Always ask before booking what equipment your cleaner uses.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'carpet-cleaning-safe-for-pets',
    title: 'Is professional carpet cleaning safe for pets?',
    metaTitle: 'Is professional carpet cleaning safe for pets? | Wirral Carpet Cleaning',
    metaDescription:
      'Professional carpet cleaning is safe for pets, children and allergy sufferers — when the right products are used. What to look for, what to avoid, and how to keep pets comfortable on cleaning day.',
    publishedDate: '2026-04-28',
    readingTime: '4 min',
    quickAnswer:
      'Yes — professional carpet cleaning is safe for pets, children and allergy sufferers when the cleaner uses eco-friendly, non-toxic products. The cleaning solution is rinsed out by the same machine that applies it, so almost no residue is left behind. Pets can return to the cleaned room as soon as the carpets are dry — typically 2–4 hours.',
    body: [
      { type: 'h2', text: 'What we use' },
      { type: 'p', text: 'All of our cleaning products are:' },
      {
        type: 'ul',
        items: [
          '**Non-toxic and biodegradable**',
          '**Hypoallergenic** — no fragrances, dyes, optical brighteners or volatile compounds',
          '**pH-neutral** for carpet fibre and pet skin',
          '**Recommended by veterinary practices** that we clean for in the Wirral area',
        ],
      },
      {
        type: 'p',
        text: 'We don\'t use the older "shampoo" method that leaves detergent foam in the carpet — that\'s the residue that triggers reactions when pets lick or roll on the carpet.',
      },
      { type: 'h2', text: 'Cleaning-day tips for pet owners' },
      {
        type: 'ol',
        items: [
          '**Confine pets** to a separate room before we arrive. Most pets find unfamiliar humans + machine noise stressful — easier on them to sit it out elsewhere.',
          "**Brief us on any pet allergies** when you book. We'll switch to fragrance-free formulas and avoid any specific irritant.",
          '**Walk the dog** before we start. Pets do better with a tired-out energy state and an empty bladder before a long stay-in-the-bedroom.',
          '**Provide water** in the confined room. Stress dehydrates animals fast.',
          "**Let pets back in once the carpet is touch-dry.** They'll re-mark the territory by walking, rolling and sniffing — this is normal. The smell of cleaning is mild and fades within a few hours.",
        ],
      },
      { type: 'h2', text: 'What to avoid in DIY products' },
      {
        type: 'p',
        text: "If you're spot-cleaning between professional visits, avoid: bleach (toxic, bleaches carpet), Febreze and similar masking sprays (uses zinc compounds that can irritate pets), and most pet-shop \"stain-and-odour\" sprays that contain ammonia (smells like urine to pets and trains them to soil the same spot).",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'carpet-cleaning-vs-steam-cleaning',
    title: "Carpet cleaning vs steam cleaning — what's the difference?",
    metaTitle: "Carpet cleaning vs steam cleaning — what's the difference? | Wirral Carpet Cleaning",
    metaDescription:
      'Steam cleaning and hot-water extraction are not the same. The difference matters for results, drying time and which carpet types are safe to clean. Wirral Carpet Cleaning explains.',
    publishedDate: '2026-05-05',
    readingTime: '4 min',
    quickAnswer:
      '"Carpet cleaning" is a category; "steam cleaning" is one method within it. What most people call steam cleaning is actually hot-water extraction — water heated to 60–80°C is injected under pressure and immediately extracted, taking dirt with it. True steam cleaning (above 100°C, water vapour only) is rare in carpet work because it can shrink wool and damage some adhesives. The terms are often used interchangeably in the trade, which causes confusion.',
    body: [
      { type: 'h2', text: 'Hot-water extraction' },
      {
        type: 'p',
        text: "This is the **industry standard** — recommended by all major carpet manufacturers and the only method that maintains most carpet warranties. A heated cleaning solution is sprayed under high pressure into the carpet pile, agitated briefly, and then a powerful vacuum extracts the now-dirty solution. Removes around 95% of embedded soil, allergens, dust mites and bacteria.",
      },
      { type: 'h2', text: 'Dry compound cleaning' },
      {
        type: 'p',
        text: "A different method entirely. Dry powder is brushed into the carpet, absorbs dirt, and is then vacuumed up. Carpets are walkable straight away. The downside is it doesn't reach embedded grime — fine for refreshing carpets between deep cleans, not as a substitute.",
      },
      { type: 'h2', text: 'Bonnet cleaning' },
      {
        type: 'p',
        text: "Used in commercial settings — a rotating absorbent pad on a buffer. Quick and the carpet is dry immediately, but it only cleans the top of the carpet pile, not the base. We don't use bonnet cleaning for domestic work.",
      },
      { type: 'h2', text: 'Shampoo (old-style)' },
      {
        type: 'p',
        text: 'Foamy detergent worked into the carpet, vacuumed up after drying. Mostly extinct because it leaves residue that re-attracts dirt. If a quote mentions "shampooing" specifically, ask for a different method.',
      },
      { type: 'h2', text: 'Which is best for your carpet?' },
      {
        type: 'p',
        text: 'For 95% of UK domestic carpets — synthetic or wool, low to medium pile — **hot-water extraction is the right choice**. For specific cases (silk-blend carpets, antique rugs, water-sensitive jute backing), we switch to low-moisture or dry methods. We always identify carpet type during the pre-clean assessment.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'when-to-get-carpets-cleaned',
    title: 'When should I get my carpets professionally cleaned?',
    metaTitle: 'When should I get my carpets professionally cleaned? | Wirral Carpet Cleaning',
    metaDescription:
      "How often to professionally clean carpets — broken down by household type, lifestyle and the manufacturer warranty schedule. Wirral Carpet Cleaning's expert guide.",
    publishedDate: '2026-05-12',
    readingTime: '4 min',
    quickAnswer:
      "Most homes need professional carpet cleaning every 12–18 months. Homes with pets, smokers or young children should aim for every 6 months. Many carpet manufacturers void warranty if professional cleaning records can't be shown — usually requiring at least once every 18 months. End-of-tenancy and post-event (Christmas, parties) are common one-off triggers regardless of the schedule.",
    body: [
      { type: 'h2', text: 'The schedule, by household type' },
      {
        type: 'table',
        headers: ['Household', 'Frequency'],
        rows: [
          ['Single or couple, no pets, low traffic', 'Every 18–24 months'],
          ['Family, no pets, average traffic', 'Every 12 months'],
          ['Family with one pet', 'Every 9 months'],
          ['Family with multiple pets or young children', 'Every 6 months'],
          ['Smoker household', 'Every 6–9 months'],
          ['Allergy / asthma sufferer in household', 'Every 6 months'],
          ['Commercial premises (offices, restaurants)', 'Every 3–6 months'],
        ],
      },
      { type: 'h2', text: 'Why frequency matters' },
      {
        type: 'p',
        text: 'Carpets accumulate damage in three ways: **abrasion** (grit walked in from outside), **biological soiling** (skin cells, body oils, pet dander) and **chemical soiling** (cooking oil aerosols, smoke). All three reduce carpet life. Vacuuming removes the surface layer; only hot-water extraction removes the embedded layers. Carpets professionally cleaned on schedule typically last 30–40% longer.',
      },
      { type: 'h2', text: "Signs it's overdue" },
      {
        type: 'ul',
        items: [
          "A musty smell that won't lift after vacuuming",
          'Visible "traffic lanes" — darker patches in walking areas',
          'Allergy or sinus flare-ups for household members',
          'Pet smells that come back when the room is humid',
          'A general dullness — comparing visible patches behind furniture vs the open floor will tell you',
        ],
      },
      { type: 'h2', text: 'Best time of year' },
      {
        type: 'p',
        text: "**February or September** are the cheapest months — Q1 and post-summer are slow seasons for carpet cleaners and most of us discount by 10–15%. Avoid December (everyone's pre-Christmas list) and January (everyone's post-Christmas).",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'best-carpet-cleaner-birkenhead',
    title: "What's the best carpet cleaner near Birkenhead?",
    metaTitle: "What's the best carpet cleaner near Birkenhead? | Wirral Carpet Cleaning",
    metaDescription:
      "Looking for a reliable carpet cleaner in Birkenhead? Here's what to look for, what to avoid, and an honest comparison of local options. Wirral Carpet Cleaning explains.",
    publishedDate: '2026-05-19',
    readingTime: '5 min',
    quickAnswer:
      "The best carpet cleaner in Birkenhead is one that is (1) fully insured, (2) uses hot-water extraction equipment, (3) provides a written quote with no hidden fees, (4) is NCCA-trained or accredited, and (5) has a track record of local reviews. Wirral Carpet Cleaning Limited covers Birkenhead and the surrounding Wirral peninsula, has been trading 15+ years, holds public liability insurance, and is rated 5★ on Google. 0151 936 9664 for a free quote.",
    body: [
      { type: 'h2', text: 'How to evaluate any carpet cleaner' },
      { type: 'p', text: "Ask any cleaner you're considering these five questions:" },
      {
        type: 'ol',
        items: [
          '**"Are you insured?"** — they should say yes and offer to send the certificate. Public liability of at least £1m is standard.',
          '**"What method do you use?"** — answer should mention hot-water extraction (or call it steam cleaning interchangeably). If they only mention dry cleaning or shampooing, get a second quote.',
          '**"Will the price include pre-treatment of stains?"** — should be yes for stains visible in your photo at quote stage. Some firms quote a low base price and add £5–£20 per stain on the day. That\'s a sales tactic.',
          '**"How long will the carpet take to dry?"** — should be 2–4 hours for hot-water extraction. If they say 6+ hours, their equipment is under-spec.',
          '**"How do I pay and do I need to be home?"** — should be flexible. Cash, card or bank transfer; you can leave the keys with a neighbour or with us if you trust us; same-day or next-day invoicing.',
        ],
      },
      { type: 'h2', text: 'Red flags' },
      {
        type: 'ul',
        items: [
          "Won't give a fixed quote in writing",
          'Pressures you to book before they leave',
          'Calls themselves "Cheapest in Wirral" or similar — race to the bottom usually means cutting corners',
          'No insurance',
          'No fixed business address or company number',
          'Asks for cash-only',
        ],
      },
      { type: 'h2', text: "Why we're a fair recommendation" },
      {
        type: 'p',
        text: "We're family-run, based locally, and our team are NCCA-trained. We don't subcontract — the same person who quotes is the person who cleans. We've cleaned in most postcodes around Birkenhead (CH41, CH42, CH43, CH44) and most of our work is repeat business or word-of-mouth. We won't oversell.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'end-of-tenancy-carpet-cleaning',
    title: 'What does end-of-tenancy carpet cleaning include?',
    metaTitle: 'What does end-of-tenancy carpet cleaning include? | Wirral Carpet Cleaning',
    metaDescription:
      'End-of-tenancy carpet cleaning — what\'s included, what landlords legally can and cannot require, deposit-deductions you can dispute, and getting the cheapest compliant clean.',
    publishedDate: '2026-05-26',
    readingTime: '5 min',
    quickAnswer:
      'End-of-tenancy carpet cleaning includes deep hot-water extraction of all carpeted rooms, stain treatment, deodorising and a printed receipt for landlord/inventory company submission. UK law (Tenant Fees Act 2019) means a landlord cannot require a specific cleaner, only a "professional" clean — any reputable carpet-cleaning firm is fine. Typical cost for a 2-bed flat: £100–£140.',
    body: [
      { type: 'h2', text: "What's actually required" },
      {
        type: 'p',
        text: 'The Tenant Fees Act 2019 banned landlords charging tenants a "professional cleaning fee" by default. They can deduct cleaning costs from your deposit only if the property is left in significantly worse condition than when you moved in (allowing for fair wear and tear). Most disputes that go to deposit-protection scheme adjudication find in favour of the tenant on cleaning charges — but providing a professional carpet-cleaning receipt removes the argument entirely.',
      },
      { type: 'h2', text: 'What we include' },
      {
        type: 'ul',
        items: [
          'All carpeted rooms in the property',
          'Stairs and landing (if carpeted)',
          'Pre-treatment of stains, including pet stains and smoking residue',
          'Deodorising',
          '**A dated receipt with company name, registration number and insurance details** that satisfies any tenancy inventory check',
          'Email copy for forwarding to the agent',
        ],
      },
      { type: 'h2', text: "What you don't need" },
      {
        type: 'ul',
        items: [
          '"Specialist deep clean" upgrades — standard hot-water extraction is what\'s required',
          "Furniture moving — most agents don't expect you to clean under fitted/heavy furniture",
          'Sofa / mattress cleaning — only if specified in the inventory',
          "Same-day \"guaranteed-pass\" services — the receipt itself is what passes you, not the cleaner's branding",
        ],
      },
      { type: 'h2', text: 'Tips to keep cost down' },
      {
        type: 'ol',
        items: [
          '**Book mid-week** — we offer 10% off Tuesday–Thursday',
          "**Combine with other cleaning** — if you've also booked an end-of-tenancy general clean, our prices drop slightly",
          '**Get the receipt before paying anything** — so you can attach it to your deposit-return request',
          '**Keep before and after photos** — for any later dispute',
        ],
      },
      { type: 'h2', text: 'What if the landlord still tries to deduct?' },
      {
        type: 'p',
        text: 'Submit the receipt to the deposit-protection scheme (DPS, MyDeposits or TDS) along with your check-out report. The scheme sides with the tenant in the vast majority of "we needed our own cleaner" disputes.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'remove-old-carpet-stains',
    title: 'Can you remove old, set-in carpet stains?',
    metaTitle: 'Can you remove old, set-in carpet stains? | Wirral Carpet Cleaning',
    metaDescription:
      'Most "permanent" carpet stains can still be lifted by professional hot-water extraction even years later. What works, what doesn\'t, and how to send us a photo for an honest assessment.',
    publishedDate: '2026-06-02',
    readingTime: '4 min',
    quickAnswer:
      'Yes — most "permanent" stains can still be removed by professional hot-water extraction even years after the original spill. Success rate varies by stain type: red wine and coffee around 90% recovery, pet urine 70–80%, mystery old stains 50–70%. Some stains will lighten significantly without disappearing entirely, and we always tell you honestly upfront what to expect.',
    body: [
      { type: 'h2', text: 'Why old stains are harder' },
      { type: 'p', text: 'Three things happen as a stain ages:' },
      {
        type: 'ol',
        items: [
          '**Oxidation** — exposure to air, light and time darkens organic stains. Coffee that started light brown becomes near-black after a year.',
          '**Dye-bonding** — the stain pigment chemically bonds with the carpet fibre. Synthetic carpets resist this better than wool.',
          '**Embedded soiling** — the sticky stain attracts dust, skin cells and other dirt over time, building a layer that needs separate treatment.',
        ],
      },
      { type: 'h2', text: 'Our process for old stains' },
      {
        type: 'p',
        text: 'We always **assess and test** before committing to a removal. The standard sequence:',
      },
      {
        type: 'ol',
        items: [
          'Identify the stain type if possible (the customer often knows; we ask)',
          'Test a hidden area for colour-fastness with our planned solvent',
          'Apply specialist pre-treatment — different chemistry for tannin (coffee, tea, wine), protein (urine, blood, food), oil-based (cooking oil, makeup) and dye-based (ink, hair colour) stains',
          'Hot-water extraction at 70°C with high-pressure rinse',
          'If 80% removed, we re-treat once more. If less, we discuss honestly whether a third pass will help or risk the carpet',
        ],
      },
      { type: 'h2', text: "What we can't promise" },
      {
        type: 'ul',
        items: [
          'Old hair-dye stains often remain as a faint shadow',
          'Bleach damage is irreversible (the dye is gone, no chemistry brings it back)',
          'Burn marks are physical damage to the fibre, not a stain',
          'Dye transfer from rugs (red rug runs onto cream carpet) is sometimes only partially recoverable',
        ],
      },
      { type: 'h2', text: 'Send us a photo first' },
      {
        type: 'p',
        text: "Before we book a job, we always offer to look at a photo. Text or WhatsApp **0151 936 9664** with a picture of the stain plus a 50p coin for scale. We come back within the hour with an honest assessment and price.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'carpet-cleaning-with-pets',
    title: 'How often should I clean carpets if I have a dog?',
    metaTitle: 'How often should I clean carpets if I have a dog? | Wirral Carpet Cleaning',
    metaDescription:
      "Pet households need professional carpet cleaning every 6–9 months. Why pets are harder on carpet, how to keep them fresh between cleans, and our pet-friendly contract pricing.",
    publishedDate: '2026-06-09',
    readingTime: '4 min',
    quickAnswer:
      "Households with one dog should professionally clean carpets every 6–9 months; households with multiple dogs, every 6 months. Vacuum twice a week minimum (dog hair and dander build up faster than human-only households) and treat any urine accidents with an enzyme cleaner immediately. Twice-yearly deep cleans extend carpet life by 30–40% in pet households versus annual cleans.",
    body: [
      { type: 'h2', text: 'Why dogs are harder on carpet' },
      {
        type: 'ul',
        items: [
          '**Hair and dander** — accumulates 3–4× faster than non-pet households',
          '**Outside dirt** — paws bring in mud, road salt and garden bacteria',
          '**Saliva** — dogs lick carpets in resting spots; saliva contains enzymes that break down carpet fibres',
          '**Urine accidents** — even one untreated incident can permanently soak the underlay',
          '**Body oils** — dogs have higher skin oil production than cats; these oils transfer to carpet on contact and attract dust',
        ],
      },
      { type: 'h2', text: 'Between professional cleans' },
      {
        type: 'ol',
        items: [
          '**Vacuum twice a week** with a HEPA-filter pet vacuum',
          '**Spot-treat urine immediately** with an enzyme cleaner — never vinegar, never hot water',
          '**Wipe paws** at the door — a microfibre mat by the back door catches 80% of incoming dirt',
          '**Bath the dog regularly** — clean dog = less oil and dander deposited',
          '**Use a covered dog bed** with washable cover — concentrates the dander in one place',
        ],
      },
      { type: 'h2', text: 'Our pet-friendly approach' },
      {
        type: 'p',
        text: 'We use enzyme-based cleaning solutions that are non-toxic to pets, biodegradable and safe to walk on as soon as they\'re dry. Pets can return to the cleaned room within 2–4 hours. We also offer:',
      },
      {
        type: 'ul',
        items: [
          '**Pet-friendly contracts** — 15% discount on second and subsequent cleans booked within 12 months',
          '**Sub-surface extraction** for repeat urine soiling — reaches the underlay and subfloor where surface methods cannot',
          '**Deodorising treatment** as standard, not a paid extra',
        ],
      },
      { type: 'h2', text: 'When to call before the schedule' },
      { type: 'p', text: "Don't wait for the calendar if you notice:" },
      {
        type: 'ul',
        items: [
          'A persistent pet smell, especially when the room is humid',
          'Visible darker patches in dog rest areas',
          'Pet allergic-reaction symptoms in family members',
          'New pet, especially a puppy or rescue',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'diy-vs-professional-carpet-cleaning',
    title: 'Should I rent a carpet cleaner or hire a professional?',
    metaTitle: 'Should I rent a carpet cleaner or hire a professional? | Wirral Carpet Cleaning',
    metaDescription:
      "Honest comparison of renting a Vax/Bissell vs hiring a professional carpet cleaner. The true total cost, results comparison, and when DIY makes genuine sense. Wirral Carpet Cleaning explains.",
    publishedDate: '2026-06-16',
    readingTime: '5 min',
    quickAnswer:
      "Hire a professional if any of these apply: you have multiple rooms to clean, pet stains, set-in stains, allergies in the household, or a wool carpet. Rent a domestic machine only for very specific small spot-cleans on synthetic carpets where you're not concerned about long drying times. The honest economics: a professional clean for £150 is similar to renting (£40 + £15 solution + 5–6 hours of your time + 12 hours of damp carpet), with a far better outcome.",
    body: [
      { type: 'h2', text: 'What domestic rental machines actually do' },
      {
        type: 'p',
        text: 'The Vax / Bissell / Rug Doctor machines you can rent at supermarkets are **low-pressure, low-heat** versions of professional equipment. They:',
      },
      {
        type: 'ul',
        items: [
          'Use cooler water (around 40°C vs our 70°C) — less effective at dissolving grease and protein stains',
          "Apply more solution than they extract — that's why carpets stay damp for 12–24 hours",
          "Don't reach the carpet base — only the top half of the pile is meaningfully cleaned",
          'Lack pre-spray and stain-treatment capability — limited to whatever solution is in the cartridge',
        ],
      },
      { type: 'h2', text: "What they're acceptable for" },
      {
        type: 'ul',
        items: [
          'One small spot stain on a low-pile synthetic carpet',
          'A "freshen up" before a viewing or visitor — appearance only',
          'A test before deciding to hire a pro for the rest',
        ],
      },
      { type: 'h2', text: "What they're not acceptable for" },
      {
        type: 'ul',
        items: [
          "**Whole-house cleans** — you'll be exhausted and the result won't match a pro",
          '**Pet urine** — domestic units cannot reach the underlay where the smell lives',
          '**Wool, sisal or jute-backed carpets** — risk of shrinking, browning or backing damage',
          '**Heavily soiled carpets** — domestic machines redistribute dirt rather than removing it',
          '**Allergy households** — too much residue left behind',
        ],
      },
      { type: 'h2', text: 'True cost comparison' },
      {
        type: 'table',
        headers: ['Cost component', 'Rental', 'Professional'],
        rows: [
          ['Equipment / clean', '£25–£40', '£150 (3-bed clean)'],
          ['Solution / treatment', '£10–£15', 'Included'],
          ['Stain treatment', '£8', 'Included'],
          ['Your time', '5–6 hours', '0 hours'],
          ['Drying time', '12–24 hours', '2–4 hours'],
          ['**Total**', '**~£60 + a weekend**', '**£150**'],
        ],
      },
      {
        type: 'p',
        text: "For a £90 difference you save the labour, the wet carpet weekend and get a substantially better result. For one room only, rental might just edge it on cost — but if you're going to do the lounge anyway, asking us to do the whole floor is usually £30–£50 incremental.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'home-carpet-cleaning-remedies',
    title: 'Home carpet cleaning remedies: do they actually work?',
    metaTitle: 'Home carpet cleaning remedies: do they work? | Wirral Carpet Cleaning',
    metaDescription:
      'The honest truth about home carpet cleaning remedies — baking soda, vinegar, washing-up liquid, shaving foam and more. What buys you time, what does nothing, and what quietly ruins your carpet.',
    publishedDate: '2026-06-23',
    readingTime: '5 min',
    quickAnswer:
      "Home remedies can buy you time on a small, fresh spill — blotting with a little washing-up liquid, or baking soda for odours — but that is all they do. They only touch the surface of the pile, so they can never lift a set-in stain or a pet smell, which live deep in the carpet and underlay. Several popular 'hacks' (shaving foam, salt, neat vinegar) do little or actively damage the fibres. For anything beyond a fresh splash, a professional clean is faster, safer and works out cheaper than a ruined carpet. Send us a photo on 0151 936 9664 and we'll tell you honestly whether it's worth a go at home.",
    body: [
      {
        type: 'p',
        text: 'There are a lot of carpet-cleaning "hacks" floating around Facebook and TikTok. Some are harmless, a few genuinely help in the first few minutes of a spill, and several will quietly wreck a good carpet. Here is the honest picture from 15+ years of cleaning carpets across Wirral — including the jobs we get called to **after** a home remedy has gone wrong.',
      },
      {
        type: 'callout',
        text: 'The single most important thing: blot, never scrub, and never use hot water. Scrubbing frays the pile and pushes the stain deeper; heat permanently sets wine, coffee, blood and pet stains. If you do nothing else, get that right.',
      },
      { type: 'h2', text: 'Home remedies: an honest reality check' },
      {
        type: 'p',
        text: 'These are the ones people ask us about most. The pattern is the same throughout — they can help a fresh splash, but none of them is a substitute for a proper clean:',
      },
      {
        type: 'table',
        headers: ['Remedy', 'Does it work?', 'The catch'],
        rows: [
          ['Baking soda', 'Partly', 'Absorbs odour and fresh grease, but only masks smells it cannot remove. Must be vacuumed out fully or it dulls the pile'],
          ['A little washing-up liquid + cool water', 'On fresh spills only', 'Fine for a fresh food or drink splash. Use too much and the soapy residue left behind actually attracts more dirt'],
          ['White vinegar', 'Limited', '**Damages wool, sisal and silk** — the acid harms natural fibres. The smell lingers and it does nothing for set-in stains'],
          ['Club soda', 'Briefly', 'The fizz can help float a fresh wine or coffee spill in the first minutes. Useless once the stain has dried'],
          ['Salt on wine', 'Not really', 'A myth. It soaks up a little liquid but does not clean — you still have a stain to deal with afterwards'],
          ['Shaving foam', 'No', "Popular online, poor in practice — it's mostly soap and tends to leave a residue without lifting the stain"],
          ['Hydrogen peroxide / "oxi" hacks', 'Risky', '**Can bleach the colour straight out of your carpet.** We are regularly called to permanent white patches caused by these'],
        ],
      },
      { type: 'h2', text: 'The "remedies" that quietly ruin carpets' },
      {
        type: 'p',
        text: 'These are the ones worth a clear warning. We see the damage from all of them, and none of it can be undone:',
      },
      {
        type: 'ul',
        items: [
          '**Bleach or oxi powders on coloured carpet** — permanent white patches that no one can reverse.',
          '**Vinegar on wool** — browning and fibre damage that often only shows up days later.',
          '**Hot water on pet urine or blood** — heat locks the stain and the smell in for good.',
          '**Over-wetting** — a soaked patch dries slowly, wicks the stain back to the surface as a brown ring, and can rot the underlay.',
          '**Scrubbing** — distorts the pile so the patch always looks different, even once the stain itself is gone.',
        ],
      },
      { type: 'h2', text: 'Why home methods can only ever do so much' },
      {
        type: 'p',
        text: 'Every cupboard remedy treats the **top of the pile only**. They physically cannot reach the base of the carpet or the underlay underneath — which is exactly where pet accidents, drink spills and years of foot traffic actually sit. That is the honest limit. A home remedy might tide a fresh splash over, but it will never deep-clean a carpet, and a botched attempt often makes our job (and your bill) bigger.',
      },
      {
        type: 'p',
        text: 'Our hot-water extraction runs at around 70°C under pressure and pulls the dirt, the moisture and the stain back out in one pass — reaching the part of the carpet a cloth and a kettle never can. A typical room is cleaned in well under an hour and dry within 2–4 hours.',
      },
      { type: 'h2', text: 'The honest rule of thumb' },
      {
        type: 'p',
        text: 'A fresh, small splash on a synthetic carpet — blot it and you may be fine. **Anything else is a job for a professional**, and trying to DIY it usually costs more in the end:',
      },
      {
        type: 'ul',
        items: [
          'The stain is older than a day, or has been "treated" already and come back',
          "There's a lingering smell, especially pet urine — it lives in the underlay",
          'A whole room or the stairs need doing, not just a spot',
          'The carpet is wool, sisal or a silk blend',
          'A home remedy has left a ring, a patch, a bleached spot or a sticky area',
        ],
      },
      { type: 'h2', text: 'Not sure? Send us a photo first — for free' },
      {
        type: 'p',
        text: "Before you spend a Saturday scrubbing (or risk one of the remedies above), just send us a picture. Text or WhatsApp **0151 936 9664** with a photo of the mark and we'll tell you honestly whether it's a quick blot at home or one for us — plus a fixed price if it is. Free advice, no obligation, across Wirral, Liverpool, Birkenhead, Prenton and Chester.",
      },
    ],
  },
];

export default posts;
