export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authorizationToken, totalInPence, rooms, customer } = req.body;

  if (!authorizationToken || !totalInPence || !rooms) {
    return res.status(400).json({ error: 'Missing required fields' });
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
    merchant_reference1: customer?.name || '',
    merchant_reference2: customer?.phone || '',
  };

  try {
    const response = await fetch(
      `${apiUrl}/payments/v1/authorizations/${authorizationToken}/order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Klarna order error:', data);
      return res.status(response.status).json({ error: 'Failed to create Klarna order', details: data });
    }

    return res.status(200).json({
      order_id: data.order_id,
      fraud_status: data.fraud_status,
    });
  } catch (err) {
    console.error('Klarna order error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
