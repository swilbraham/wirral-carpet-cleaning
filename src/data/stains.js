// Stain-removal guide data — used by /stain-removal/:slug pages
// Each entry generates a Schema.org HowTo schema for AI-search extraction.

const stains = [
  // ─────────────────────────────────────────────────────────
  {
    slug: 'red-wine',
    title: 'How to Remove Red Wine Stains From Carpet',
    metaTitle: 'How to Remove Red Wine From Carpet | Wirral Carpet Cleaning',
    metaDescription:
      'Step-by-step guide to removing fresh and dried red wine stains from carpet. DIY method that works for most spills, plus when to call in the professionals. Wirral, Liverpool & Cheshire.',
    shortDesc:
      'A spilled glass of red wine can become a permanent stain in minutes if you treat it the wrong way. Here is the right way.',
    answer:
      'To remove a red wine stain from carpet, blot (do not rub) the spill with a clean white cloth straight away, sprinkle salt or baking soda to absorb the remaining liquid, then dab with a 1:2 white-vinegar-and-water solution. For dried stains, hydrogen peroxide and washing-up liquid work for most carpet types. If the stain remains after two attempts, call a professional carpet cleaner — fresh hot-water extraction lifts even old red-wine stains.',
    totalTime: '15-30 minutes',
    estimatedCost: '£0-£5 (household items)',
    tools: ['Clean white cloths or paper towels', 'Spray bottle', 'Soft-bristled brush'],
    supplies: ['Salt or baking soda', 'White vinegar', 'Washing-up liquid', 'Hydrogen peroxide (3%) for old stains'],
    steps: [
      {
        name: 'Blot, do not rub',
        text: 'Within seconds of the spill, press a clean white cloth or paper towel firmly into the stain. Lift, refold to a clean section, and repeat. Rubbing pushes the wine deeper into the carpet fibres and grinds the pigment into the backing — never rub.',
      },
      {
        name: 'Cover with salt or baking soda',
        text: 'Sprinkle a generous layer of table salt or baking soda over the entire wet area. Both pull the remaining liquid up out of the fibres. Leave for 10–15 minutes, then vacuum up the now-pink powder.',
      },
      {
        name: 'Apply a vinegar solution',
        text: 'Mix 1 tablespoon of white vinegar, 1 tablespoon of washing-up liquid and 2 cups of warm water in a spray bottle. Spray the stain lightly — soak it, do not flood it — and dab with a clean cloth. Work from the outside of the stain inward to stop it spreading.',
      },
      {
        name: 'For dried or old stains, use hydrogen peroxide',
        text: 'Mix one part 3% hydrogen peroxide with two parts washing-up liquid. Test on a hidden area first to check the carpet does not bleach. Apply to the stain, leave for 20 minutes, blot up, then rinse with clean cool water.',
      },
      {
        name: 'Rinse and dry',
        text: 'Lightly mist the area with clean water, blot dry, and place a thick towel over the patch with a heavy book on top to draw out any remaining moisture as it dries. Allow 4–6 hours before walking on the area.',
      },
      {
        name: 'When DIY is not enough — call us',
        text: 'If the stain remains after two attempts, call Wirral Carpet Cleaning on 0151 936 9664. Our hot-water extraction equipment lifts wine pigment that home methods cannot reach. We have removed Christmas and New Year wine stains that homeowners have lived with for years. Free quotes.',
      },
    ],
    faqs: [
      {
        question: 'Can old, dried red wine stains still be removed?',
        answer:
          'Yes — most old red wine stains can be lifted with professional hot-water extraction even months or years after the spill. The success rate is around 90%. Call us with a photo of the stain on 0151 936 9664 and we will tell you honestly if we think it will fully come out.',
      },
      {
        question: 'Does white wine over red wine actually work?',
        answer:
          'Partially — white wine dilutes the red pigment which makes it easier to lift, but you still need to blot and treat the stain afterwards. Salt and baking soda are more effective and you probably already have them in the kitchen.',
      },
      {
        question: 'What about red wine on a wool carpet?',
        answer:
          'Wool is more delicate. Skip the hydrogen peroxide entirely (it can bleach), use only the vinegar method, and do not let it sit longer than 5 minutes. If the stain remains, call a professional — wool needs specific treatment to avoid felting and shrinkage.',
      },
      {
        question: 'How much does it cost to professionally remove a red wine stain?',
        answer:
          'A targeted spot-clean is included free with any room clean (from £60). If you only need the one stain treated and nothing else, we can do a stain-only call-out for £35–£50 depending on location.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'pet-urine',
    title: 'How to Remove Pet Urine From Carpet',
    metaTitle: 'How to Remove Dog & Cat Urine From Carpet | Wirral Carpet Cleaning',
    metaDescription:
      'Remove pet urine smell and stains from carpet permanently. Step-by-step DIY method, why old urine smells come back, and when to call professionals. Wirral, Liverpool & Cheshire.',
    shortDesc:
      'Pet urine soaks into the underlay and re-activates every time it gets damp — that is why the smell keeps coming back. Treating it properly means treating both layers.',
    answer:
      'To remove pet urine from carpet, blot up as much fresh urine as possible with paper towels, then saturate the area with an enzyme-based cleaner (not vinegar — vinegar is acidic and can set the stain). Enzymes break down the uric acid crystals that cause the smell to return whenever the area gets damp. For old or repeated soiling, professional sub-surface extraction reaches the underlay and the floor beneath, which is where the smell actually lives.',
    totalTime: '30 minutes (plus 24h drying)',
    estimatedCost: '£8-£15 (enzyme cleaner)',
    tools: ['Thick stack of paper towels', 'Heavy book or weight', 'Rubber gloves'],
    supplies: ['Enzyme-based pet stain cleaner (e.g. Simple Solution, Urine-Off, Bissell Pet Pro)', 'Cool water', 'Optional: baking soda for residual smell'],
    steps: [
      {
        name: 'Soak up fresh urine immediately',
        text: 'Place a thick stack of paper towels over the wet patch and stand on it (with shoes off — wear something you do not mind getting wet). The body weight forces the urine up into the towels. Replace the towels and repeat until they come up almost dry. The more you absorb now, the less penetrates the underlay.',
      },
      {
        name: 'Do NOT use vinegar, ammonia, or hot water on fresh urine',
        text: 'Vinegar is acidic and chemically locks the stain in. Ammonia smells like urine to a pet and trains them to soil the same spot again. Hot water sets the proteins. Always use a cool, enzyme-based cleaner.',
      },
      {
        name: 'Saturate with an enzyme cleaner',
        text: 'Apply enough enzyme cleaner to soak through to the underlay — the urine has gone there, the cleaner needs to follow. Read the bottle for dwell time (usually 10–15 minutes). The enzymes physically eat the uric-acid crystals; this is why enzyme cleaners are the only thing that fully removes the smell.',
      },
      {
        name: 'Blot dry, weight, and air',
        text: 'After the dwell time, blot up the cleaner with paper towels. Place a folded clean towel over the patch with a heavy book on top, and let it draw out residual moisture overnight (24 hours is fine). Open a window if you can — drying speed matters.',
      },
      {
        name: 'Optional: baking soda for residual odour',
        text: 'If the smell lingers after drying, sprinkle baking soda over the area, leave for several hours, then vacuum up. Repeat over a few days if needed.',
      },
      {
        name: 'When to call a professional carpet cleaner',
        text: 'If the smell returns within a few days of cleaning, the urine has reached the underlay or the sub-floor and home methods cannot reach it. We use sub-surface extraction with specialist enzyme treatments that flush all three layers. Call Wirral Carpet Cleaning on 0151 936 9664. We deal with this every week — judgement-free, discreet, and effective.',
      },
    ],
    faqs: [
      {
        question: 'Why does the urine smell keep coming back even after I clean?',
        answer:
          'Urine soaks through the carpet pile into the underlay and sometimes into the wooden subfloor. Surface cleaning never reaches those layers. The uric acid crystals re-activate every time the carpet gets humid (rain, mopping, even a sunny day). Professional sub-surface extraction is the only way to fully eliminate it.',
      },
      {
        question: 'Will an old urine stain come out completely?',
        answer:
          'Most urine smells can be eliminated, but if the urine has been sitting for years a permanent yellow stain may remain even after the smell goes. We are honest with you on the phone — send us a photo and we will tell you what to expect.',
      },
      {
        question: 'Are pet-urine cleaners safe for children and pets?',
        answer:
          'The enzyme cleaners we use are non-toxic, biodegradable and safe to walk on once dry (typically 2–4 hours). Pets can return to the room straight away after our visit.',
      },
      {
        question: 'How much does professional pet-urine treatment cost?',
        answer:
          'A targeted urine treatment for one room with sub-surface extraction starts from £75. If multiple rooms or repeated incidents are involved, we quote in person — usually £150–£250 for a full house treatment. Call 0151 936 9664 for a free quote.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'coffee',
    title: 'How to Remove Coffee Stains From Carpet',
    metaTitle: 'How to Remove Coffee Stains From Carpet | Wirral Carpet Cleaning',
    metaDescription:
      'Remove fresh and dried coffee stains from any carpet, with or without milk. Step-by-step home guide and when professional cleaning is the better option. Wirral, Liverpool & Cheshire.',
    shortDesc:
      'A morning coffee spill is one of the easiest stains to remove if you act in the first 10 minutes. After that it darkens permanently — here is what to do.',
    answer:
      'To remove a fresh coffee stain from carpet, blot up as much liquid as possible with a clean white cloth, then dab the area with a solution of one tablespoon of washing-up liquid, one tablespoon of white vinegar and two cups of warm water. Work from the edge of the stain inwards. For coffee with milk, treat the milk-protein component first with cold water — never hot, which sets it. Rinse and blot dry. If a brown shadow remains, professional hot-water extraction lifts the tannin pigment that home methods cannot.',
    totalTime: '10-20 minutes',
    estimatedCost: '£0 (household items)',
    tools: ['Clean white cloths', 'Spray bottle (optional)'],
    supplies: ['Washing-up liquid', 'White vinegar', 'Cool water (for milky coffee)', 'Optional: hydrogen peroxide for old stains'],
    steps: [
      {
        name: 'Blot up the spill straight away',
        text: 'Within the first minute, press a thick clean white cloth or paper towel into the spill. Apply firm pressure and lift; refold and repeat. Coloured cloths can transfer dye into your carpet — only use white. Do not rub.',
      },
      {
        name: 'For milky coffee, rinse with COLD water first',
        text: 'If the coffee had milk, the protein needs to come out before the tannin. Hot water cooks milk protein into the fibres. Lightly dampen a cloth with cold water and dab — do not pour water onto the carpet.',
      },
      {
        name: 'Apply a vinegar-and-detergent solution',
        text: 'Mix 1 tbsp washing-up liquid + 1 tbsp white vinegar + 2 cups warm water. Apply with a sponge or spray bottle. Soak the stain lightly (do not flood). Dab with a clean cloth, working from outside in to stop it spreading.',
      },
      {
        name: 'Rinse with clean water',
        text: 'Spray or dab clean water onto the area to lift the soap residue, then blot dry. Detergent left in the carpet attracts dirt and the area will re-soil within days if you skip this step.',
      },
      {
        name: 'For dried or old stains: hydrogen peroxide',
        text: 'Test 3% hydrogen peroxide on a hidden area of carpet first (some carpets bleach). If safe, mix 1 part peroxide with 2 parts washing-up liquid, apply, leave 20 minutes, blot, rinse, dry.',
      },
      {
        name: 'Weight a towel on top to dry',
        text: 'Cover with a folded clean towel and a heavy book. Leaves no water mark, draws out residual moisture, dries in 4–6 hours.',
      },
      {
        name: 'When professionals are worth calling',
        text: 'If a brown shadow remains after two DIY attempts, the tannin pigment has bonded with the fibre and home methods cannot reach it. Call Wirral Carpet Cleaning on 0151 936 9664 — most coffee stains are removed completely with a single hot-water extraction pass. £35–£50 for a stain-only visit, or free if combined with a room clean.',
      },
    ],
    faqs: [
      {
        question: 'How long do I have to clean up a coffee spill before it stains permanently?',
        answer:
          'You have about 10 minutes for a clean spot-clean to work easily. After 30 minutes the tannin starts bonding with the carpet fibres. After 24 hours the stain is set. The faster you blot, the better the outcome.',
      },
      {
        question: 'Will a coffee stain come out of a wool or natural-fibre carpet?',
        answer:
          'Yes, but skip hydrogen peroxide entirely on wool — use only the vinegar-and-detergent step, dab gently, and call a professional if anything remains. Wool is sensitive to alkaline cleaners and bleaching.',
      },
      {
        question: 'What about decaf or instant — does the method change?',
        answer:
          'No, all coffee contains tannins which are the staining compound. Treat the same way regardless of the type.',
      },
      {
        question: 'Can you remove a coffee stain that is months old?',
        answer:
          'Most of them, yes. Old coffee stains usually lift with professional hot-water extraction. Send us a photo on 0151 936 9664 — we will tell you honestly if it will fully come out.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  {
    slug: 'mud-and-dirt',
    title: 'How to Remove Mud and Dirt Stains From Carpet',
    metaTitle: 'How to Remove Mud & Dirt From Carpet | Wirral Carpet Cleaning',
    metaDescription:
      'Remove muddy footprints, garden dirt and pet paw prints from carpet without spreading the stain. The counter-intuitive first step nearly everyone gets wrong. Wirral, Liverpool & Cheshire.',
    shortDesc:
      'The mistake everyone makes with muddy carpet is treating it like a wet stain. Mud needs to dry first — here is the right method.',
    answer:
      'To remove mud from carpet, the counter-intuitive first step is to let it dry completely before doing anything else. Wet mud smears and grinds into fibres; dried mud crumbles out. Once dry, vacuum thoroughly to lift loose particles, then dab any residual mark with a solution of washing-up liquid and warm water, working from the outside in. For deep-set or repeated mud (winter hallways, after dog walks) a professional deep-clean restores the carpet far more effectively than spot-cleaning.',
    totalTime: '4-6 hours (most of which is drying time)',
    estimatedCost: '£0 (household items)',
    tools: ['Vacuum cleaner', 'Soft-bristled brush', 'Clean white cloths'],
    supplies: ['Washing-up liquid', 'Warm water', 'Optional: white vinegar for residual marks'],
    steps: [
      {
        name: 'Resist the urge to scrub — let it dry',
        text: 'The single biggest mistake people make is attacking wet mud with a wet cloth. This grinds the dirt deeper and spreads the stain to twice its original size. Cover the area loosely with paper towels to absorb surface moisture but do not press, do not scrub. Walk away for 2–4 hours and let the mud dry completely.',
      },
      {
        name: 'Crack and crumble the dried mud',
        text: 'Once fully dry, the mud should be crumbly rather than spread into the fibres. Use the back of a spoon or a soft brush to break it up. Most of it will release as small flakes.',
      },
      {
        name: 'Vacuum thoroughly',
        text: 'Vacuum the area in multiple directions — forward, backward, side to side. This is what actually removes most of the mud. Do this two or three times; do not rush.',
      },
      {
        name: 'Dab any residual mark',
        text: 'If a mark remains, mix 1 tablespoon of washing-up liquid with 2 cups of warm water. Dampen a clean white cloth and dab — do not soak — the stain. Work from the outside of the mark inward.',
      },
      {
        name: 'Rinse and blot dry',
        text: 'Lightly dab with a clean cloth dampened only with water to lift any soap residue. Then blot with a dry towel. Place a folded towel and a weight over the area to draw out moisture overnight.',
      },
      {
        name: 'When carpets are heavily soiled all over — call us',
        text: 'A whole hallway, lounge or staircase that has had wet feet, paws and trolley wheels through it for months will not come back to life with spot-cleaning. Hot-water extraction restores it to genuinely-like-new in one visit. Call Wirral Carpet Cleaning on 0151 936 9664 for a free quote — our 4-room special covers a typical family-home main floor for £150–£200.',
      },
    ],
    faqs: [
      {
        question: 'Why should I let mud dry instead of cleaning it straight away?',
        answer:
          'Wet mud is liquid plus solids — wiping spreads the liquid and grinds the solids into the carpet fibres, doubling the size of the stain. Dry mud is just solids, which crumble and vacuum up cleanly.',
      },
      {
        question: 'How often should I get carpets professionally cleaned if I have dogs?',
        answer:
          'Every 6 months is the ideal interval for homes with dogs, especially over winter. The Wirral has muddy walks year-round, and twice-yearly professional cleans extend the life of the carpet by 30–40% versus annual cleans.',
      },
      {
        question: 'Will the mud have caused permanent damage?',
        answer:
          'Almost never — carpets are designed to take wear. The exception is mud left in for months on light-coloured carpets, where the dye sometimes shadows. Even then, professional hot-water extraction recovers most of it.',
      },
      {
        question: 'Do you offer pet-friendly contracts for regular cleans?',
        answer:
          'Yes — repeat-customer dog owners get 15% off second and subsequent cleans. Most book us twice a year. Call 0151 936 9664 to set this up.',
      },
    ],
  },
];

export default stains;
