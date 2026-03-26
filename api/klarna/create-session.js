export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { totalInPence, rooms, customerEmail } = req.body;

  if (!totalInPence || !rooms || totalInPence < 100) {
    return res.status(400).json({ error: 'Invalid order details' });
  }

  const apiUrl = process.env.KLARNA_API_URL || 'https://api.playground.klarna.com';
  const credentials = Buffer.from(
    `${process.env.KLARNA_API_USERNAME}:${process.env.KLARNA_API_PASSWORD}`
  ).toString('base64');

  const orderLines = rooms.map((room, i) => ({
    type: 'physical',
    reference: room.id,
    name: room.name,
    quantity: 1,
    unit_price: i === 0 ? 6000 : 3000,
    tax_rate: 2000,
    total_amount: i === 0 ? 6000 : 3000,
    total_tax_amount: i === 0 ? 1000 : 500,
  }));

  // If there's a combo discount, add it as a negative line
  const lineTotal = orderLines.reduce((sum, l) => sum + l.total_amount, 0);
  if (lineTotal > totalInPence) {
    const discount = lineTotal - totalInPence;
    orderLines.push({
      type: 'discount',
      reference: 'COMBO_DISCOUNT',
      name: 'Multi-room discount',
      quantity: 1,
      unit_price: -discount,
      tax_rate: 2000,
      total_amount: -discount,
      total_tax_amount: Math.round(-discount / 6),
    });
  }

  const body = {
    purchase_country: 'GB',
    purchase_currency: 'GBP',
    locale: 'en-GB',
    order_amount: totalInPence,
    order_tax_amount: Math.round(totalInPence / 6),
    order_lines: orderLines,
    intent: 'buy',
    merchant_urls: {
      confirmation: 'https://www.wirralcarpetcleaning.com/?payment=success',
    },
  };

  try {
    const response = await fetch(`${apiUrl}/payments/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Klarna session error:', data);
      return res.status(response.status).json({ error: 'Failed to create Klarna session', details: data });
    }

    return res.status(200).json({
      client_token: data.client_token,
      session_id: data.session_id,
      payment_method_categories: data.payment_method_categories,
    });
  } catch (err) {
    console.error('Klarna session error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
