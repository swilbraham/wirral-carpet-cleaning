/**
 * The one price list — the public calculator and the admin quote builder
 * both read from here, so a price change lands everywhere at once.
 *
 * Prices mirror Fresh For Less: £45 a carpeted room or staircase with any
 * three of those for £99, £15 halls and landings, £90 minimum visit.
 */
export const MIN_CHARGE = 90;
export const BUNDLE_SIZE = 3;
export const BUNDLE_PRICE = 99;
export const AREA_PRICE = 45;
export const BUNDLE_SAVING = BUNDLE_SIZE * AREA_PRICE - BUNDLE_PRICE;

// `bundle` marks the £45 areas that count towards "any 3 for £99".
export const ITEM_GROUPS = [
  {
    title: 'Carpets & stairs',
    items: [
      { id: 'room', name: 'Carpeted room', hint: 'Bedroom, lounge, dining room', price: 45, bundle: true, max: 10 },
      { id: 'stairs', name: 'Staircase', hint: 'One flight, up to 14 steps', price: 45, bundle: true, max: 4 },
      { id: 'landing', name: 'Landing', hint: 'Upstairs landing area', price: 15, max: 4 },
      { id: 'hallway', name: 'Hallway', hint: 'Entrance hall or corridor', price: 15, max: 4 },
      { id: 'rug-small', name: 'Rug (small)', hint: 'Up to 2m x 3m', price: 30, max: 6 },
      { id: 'rug-large', name: 'Rug (large)', hint: 'Over 2m x 3m', price: 55, max: 6 },
    ],
  },
  {
    title: 'Upholstery',
    items: [
      { id: 'sofa-2', name: '2-Seater Sofa', hint: 'Fabric upholstery clean', price: 75, max: 4 },
      { id: 'sofa-3', name: '3-Seater Sofa', hint: 'Fabric upholstery clean', price: 105, max: 4 },
      { id: 'corner-5', name: 'Corner Sofa (5 seats)', hint: 'L-shaped or corner suite', price: 165, max: 3 },
      { id: 'corner-7', name: 'Corner Sofa (6-7 seats)', hint: 'Larger L-shaped or corner suite', price: 210, max: 3 },
      { id: 'armchair', name: 'Armchair', hint: 'Single fabric chair', price: 45, max: 6 },
      { id: 'footstool', name: 'Footstool', hint: 'Pouffe or ottoman', price: 25, max: 6 },
      { id: 'dining-chair', name: 'Dining Chair', hint: 'Fabric seat pad or fully upholstered', price: 20, max: 12 },
      { id: 'mattress-single', name: 'Single Mattress', hint: 'Steam clean & deodorise', price: 30, max: 4 },
      { id: 'mattress-double', name: 'Double Mattress', hint: 'Steam clean & deodorise', price: 40, max: 4 },
    ],
  },
];

export const ALL_ITEMS = ITEM_GROUPS.flatMap((group) => group.items);

export function calculatePrice(basket) {
  const lines = [];
  let bundleAreas = 0;

  ALL_ITEMS.forEach((item) => {
    const qty = basket[item.id] || 0;
    if (qty === 0) return;
    if (item.bundle) bundleAreas += qty;
    lines.push({ id: item.id, name: item.name, qty, amount: qty * item.price });
  });

  let total = lines.reduce((sum, line) => sum + line.amount, 0);

  // Any three £45 areas (rooms or stairs) for £99, applied automatically.
  const bundleApplied = bundleAreas >= BUNDLE_SIZE;
  if (bundleApplied) {
    lines.push({
      id: 'bundle',
      name: `Any ${BUNDLE_SIZE} areas for £${BUNDLE_PRICE}`,
      qty: 1,
      amount: -BUNDLE_SAVING,
    });
    total -= BUNDLE_SAVING;
  }

  const minApplied = total > 0 && total < MIN_CHARGE;
  if (minApplied) total = MIN_CHARGE;

  return { total, lines, minApplied, bundleApplied };
}

/** "2x Carpeted room" lines for emails, texts and the Klarna order. */
export function describeLines(lines) {
  return lines
    .filter((line) => line.id !== 'bundle')
    .map((line) => `${line.qty}x ${line.name}`);
}
