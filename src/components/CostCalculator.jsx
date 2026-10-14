import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import {
  HiCalculator,
  HiCurrencyPound,
  HiArrowRight,
  HiCheck,
  HiCalendar,
  HiClock,
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiCreditCard,
  HiExclamationCircle,
} from 'react-icons/hi';

// Prices mirror Fresh For Less: £45 a carpeted room or staircase with any
// three of those for £99, £15 halls and landings, £90 minimum visit.
const MIN_CHARGE = 90;
const BUNDLE_SIZE = 3;
const BUNDLE_PRICE = 99;
const AREA_PRICE = 45;
const BUNDLE_SAVING = BUNDLE_SIZE * AREA_PRICE - BUNDLE_PRICE;

const WEB3FORMS_KEY = 'fae49abe-d4e1-4cdc-9ed1-a5ec3c116881';

// `bundle` marks the £45 areas that count towards "any 3 for £99".
const ITEM_GROUPS = [
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

const ALL_ITEMS = ITEM_GROUPS.flatMap((group) => group.items);

function generateDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates;
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatDateValue(date) {
  return date.toISOString().split('T')[0];
}

function calculatePrice(basket) {
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

/** "2x Carpeted room" lines for emails and the Klarna order. */
function describeLines(lines) {
  return lines
    .filter((line) => line.id !== 'bundle')
    .map((line) => `${line.qty}x ${line.name}`);
}

export default function CostCalculator() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });
  const klarnaContainerRef = useRef(null);

  const [basket, setBasket] = useState({});
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  // 'payday' or 'klarna' — the success screen must not claim a payment that
  // never happened.
  const [bookedVia, setBookedVia] = useState('payday');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    postcode: '',
    date: '',
    timeSlot: '',
  });
  const [klarnaLoading, setKlarnaLoading] = useState(false);
  const [klarnaReady, setKlarnaReady] = useState(false);
  const [klarnaError, setKlarnaError] = useState('');
  const [klarnaPaymentCategory, setKlarnaPaymentCategory] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [klarnaOrderId, setKlarnaOrderId] = useState('');
  const [podSubmitting, setPodSubmitting] = useState(false);
  const [podError, setPodError] = useState('');

  // Name and mobile come before the price: every quote is a lead that can
  // be followed up, not an anonymous basket that vanishes.
  const [unlocked, setUnlocked] = useState(false);
  const [gateError, setGateError] = useState('');
  const quoteLogged = useRef(false);

  const availableDates = useMemo(() => generateDates(), []);

  const { total, lines, minApplied, bundleApplied } = useMemo(
    () => calculatePrice(basket),
    [basket]
  );
  const totalItems = Object.values(basket).reduce((sum, qty) => sum + qty, 0);
  const canProceed = totalItems > 0;

  const setQty = (id, delta) => {
    setBasket((prev) => {
      const item = ALL_ITEMS.find((entry) => entry.id === id);
      const next = Math.max(0, Math.min(item?.max ?? 10, (prev[id] || 0) + delta));
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.postcode.trim() &&
    formData.date &&
    formData.timeSlot;

  const unlockPrice = () => {
    if (formData.name.trim().length < 2) {
      setGateError('Please add your name.');
      return;
    }
    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setGateError('Please add a valid mobile number.');
      return;
    }
    setGateError('');
    setUnlocked(true);
  };

  // One quiet email per visit once they have a priced basket: the quote with
  // their name and number, so un-booked quotes can be chased by text.
  useEffect(() => {
    if (!unlocked || total <= 0 || quoteLogged.current) return;
    const timer = setTimeout(() => {
      quoteLogged.current = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New quote (not yet booked) - Wirral Carpet Cleaning',
          from_name: 'Wirral Carpet Cleaning Website',
          name: formData.name,
          phone: formData.phone,
          itemsQuoted: describeLines(lines).join('\n'),
          estimatedCost: `£${total.toFixed(2)}`,
          note: 'Quote viewed on the website. If no booking follows, worth a text.',
        }),
      }).catch(() => {});
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, total]);

  const orderLines = useCallback(
    () => describeLines(lines).map((name, index) => ({ id: `line-${index}`, name })),
    [lines]
  );

  const initKlarnaSession = useCallback(async () => {
    setKlarnaLoading(true);
    setKlarnaError('');
    setKlarnaReady(false);

    try {
      const res = await fetch('/api/klarna/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalInPence: total * 100,
          rooms: orderLines(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      window.Klarna.Payments.init({ client_token: data.client_token });

      const category = data.payment_method_categories?.[0]?.identifier || 'pay_later';
      setKlarnaPaymentCategory(category);

      window.Klarna.Payments.load(
        {
          container: '#klarna-payments-container',
          payment_method_category: category,
        },
        (loadRes) => {
          setKlarnaLoading(false);
          if (loadRes.show_form) {
            setKlarnaReady(true);
          } else {
            setKlarnaError('Klarna is not available for this order. You can still book and pay on the day above.');
          }
        }
      );
    } catch (err) {
      setKlarnaLoading(false);
      setKlarnaError(err.message || 'Could not load payment options. You can still book and pay on the day above.');
    }
  }, [total, orderLines]);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        if (window.Klarna) {
          initKlarnaSession();
        } else {
          const checkKlarna = setInterval(() => {
            if (window.Klarna) {
              clearInterval(checkKlarna);
              initKlarnaSession();
            }
          }, 200);
          setTimeout(() => {
            clearInterval(checkKlarna);
            if (!window.Klarna) {
              setKlarnaLoading(false);
              setKlarnaError('Payment system could not be loaded. You can still book and pay on the day above.');
            }
          }, 10000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const bookingPayload = (extra) => {
    const selectedDate = availableDates.find(
      (d) => formatDateValue(d) === formData.date
    );
    return {
      access_key: WEB3FORMS_KEY,
      from_name: 'Wirral Carpet Cleaning Website',
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      postcode: formData.postcode,
      preferredDate: selectedDate ? formatDate(selectedDate) : formData.date,
      preferredTime: formData.timeSlot === 'am' ? 'Morning (AM)' : 'Afternoon (PM)',
      itemsBooked: describeLines(lines).join('\n'),
      estimatedCost: `£${total.toFixed(2)}`,
      ...extra,
    };
  };

  // Booking without prepayment: "nothing to pay until the job is done"
  // converts far better than a payment wall. The email send is checked — a
  // booking that never reached the office must not show as confirmed.
  const submitPayOnDay = async () => {
    setPodSubmitting(true);
    setPodError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(
          bookingPayload({
            subject: 'New Booking (pay on the day) - Wirral Carpet Cleaning',
            paymentMethod: 'Pay on the day',
            paymentStatus: 'NOT PAID — collect on completion',
          })
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error('send failed');
      }
      if (typeof fbq === 'function')
        fbq('track', 'Schedule', { value: total, currency: 'GBP' });
      setBookedVia('payday');
      setSubmitted(true);
    } catch {
      setPodError(
        "We couldn't send that just now — please call 0151 936 9664 and we'll book you in."
      );
    } finally {
      setPodSubmitting(false);
    }
  };

  const sendBookingEmail = async (orderId) => {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(
          bookingPayload({
            subject: 'New Paid Booking (Klarna) - Wirral Carpet Cleaning',
            paymentMethod: 'Klarna',
            klarnaOrderId: orderId || '',
            paymentStatus: 'PAID via Klarna',
          })
        ),
      });
    } catch {
      // Email failure shouldn't block payment confirmation
    }

    if (typeof fbq === 'function') fbq('track', 'Purchase', { value: total, currency: 'GBP' });
  };

  const handlePayment = async () => {
    if (!klarnaReady || paymentProcessing) return;

    setPaymentProcessing(true);
    setKlarnaError('');

    try {
      window.Klarna.Payments.authorize(
        { payment_method_category: klarnaPaymentCategory },
        {},
        async (authorizeRes) => {
          if (!authorizeRes.approved) {
            setPaymentProcessing(false);
            if (!authorizeRes.show_form) {
              setKlarnaError('Payment was not approved. You can still book and pay on the day above.');
            }
            return;
          }

          try {
            const orderRes = await fetch('/api/klarna/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                authorizationToken: authorizeRes.authorization_token,
                totalInPence: total * 100,
                rooms: orderLines(),
                customer: {
                  name: formData.name,
                  phone: formData.phone,
                },
              }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
              throw new Error(orderData.error || 'Failed to process payment');
            }

            setKlarnaOrderId(orderData.order_id);
            await sendBookingEmail(orderData.order_id);

            setPaymentProcessing(false);
            setBookedVia('klarna');
            setSubmitted(true);
          } catch (err) {
            setPaymentProcessing(false);
            setKlarnaError(err.message || 'Payment failed. You can still book and pay on the day above.');
          }
        }
      );
    } catch {
      setPaymentProcessing(false);
      setKlarnaError('Payment failed. You can still book and pay on the day above.');
    }
  };

  const resetAll = () => {
    setBasket({});
    setStep(1);
    setSubmitted(false);
    setBookedVia('payday');
    setFormData({ name: '', phone: '', address: '', postcode: '', date: '', timeSlot: '' });
    setKlarnaReady(false);
    setKlarnaError('');
    setKlarnaOrderId('');
    setKlarnaPaymentCategory('');
    setPaymentProcessing(false);
    setPodError('');
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <HiCalculator className="w-4 h-4" />
            Price &amp; Book Online
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Your Fixed Price
            <br />
            <span className="text-primary">In Seconds</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Pick what needs cleaning, choose a day, and you&rsquo;re booked —
            nothing to pay until the job is done.
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { num: 1, label: 'Select Items' },
            { num: 2, label: 'Your Details' },
            { num: 3, label: 'Confirm' },
          ].map(({ num, label }) => (
            <button
              key={num}
              onClick={() => {
                if (submitted) return;
                if (num < step) setStep(num);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step >= num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
              } ${num < step && !submitted ? 'cursor-pointer hover:bg-primary-dark' : ''}`}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {submitted && num <= step ? <HiCheck className="w-4 h-4" /> : num}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <HiCheck className="w-8 h-8 text-green-600" />
                </div>
                {bookedVia === 'klarna' ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed &amp; Paid!</h3>
                    <p className="text-gray-500">
                      Thank you, {formData.name}. Your payment has been processed via Klarna.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Booking Received!</h3>
                    <p className="text-gray-500">
                      Thank you, {formData.name}. Nothing has been paid today —
                      you pay &pound;{total.toFixed(2)} by cash or card once the
                      job is done. We&rsquo;ll text you to confirm your slot.
                    </p>
                  </>
                )}
              </div>

              {/* Submission summary */}
              <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-8">
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Name</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.name}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Phone</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.phone}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Address</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formData.address}
                    <span className="block uppercase">{formData.postcode}</span>
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Items</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {describeLines(lines).map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {(() => {
                      const d = availableDates.find((d) => formatDateValue(d) === formData.date);
                      return d ? formatDate(d) : formData.date;
                    })()}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Time</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formData.timeSlot === 'am' ? 'Morning (AM)' : 'Afternoon (PM)'}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    {bookedVia === 'klarna' ? 'Paid via Klarna' : 'To pay on the day'}
                  </span>
                  <span className="text-sm font-bold text-primary">&pound;{total.toFixed(2)}</span>
                </div>
                {klarnaOrderId && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Klarna Order</span>
                    <span className="text-xs font-mono text-gray-700">{klarnaOrderId}</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
                >
                  Start New Quote
                </button>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* FFL-style grouped item lists with quantity steppers */}
              <div className="space-y-6 mb-6">
                {ITEM_GROUPS.map((group, groupIndex) => (
                  <div
                    key={group.title}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
                    {groupIndex === 0 && (
                      <p className="mt-0.5 text-sm text-accent font-medium">
                        Any {BUNDLE_SIZE} areas (carpeted room or staircase) for
                        &pound;{BUNDLE_PRICE} — applied automatically.
                      </p>
                    )}
                    <ul className="mt-3 divide-y divide-gray-100">
                      {group.items.map((item) => {
                        const qty = basket[item.id] || 0;
                        return (
                          <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 py-3.5"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                &pound;{item.price} each &middot; {item.hint}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setQty(item.id, -1)}
                                disabled={qty === 0}
                                aria-label={`Remove one ${item.name}`}
                                className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                &minus;
                              </button>
                              <span className="w-6 text-center font-bold text-gray-900 tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(item.id, 1)}
                                disabled={qty >= item.max}
                                aria-label={`Add one ${item.name}`}
                                className={`w-9 h-9 rounded-xl border text-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                  qty > 0
                                    ? 'border-accent text-accent hover:bg-accent/10'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Price summary bar */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <HiCurrencyPound className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-bold text-gray-900">Your Fixed Price</h3>
                    </div>
                    {totalItems === 0 ? (
                      <p className="text-gray-500">
                        Add items above to see your price. Minimum visit &pound;{MIN_CHARGE}.
                      </p>
                    ) : !unlocked ? (
                      <div>
                        <p className="text-gray-700 font-medium">
                          {totalItems} item{totalItems !== 1 ? 's' : ''} selected — pop your
                          name and mobile in and your price appears instantly.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            autoComplete="name"
                            className="w-40 flex-none rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none"
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Mobile number"
                            autoComplete="tel"
                            className="w-44 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={unlockPrice}
                            className="rounded-xl bg-primary hover:bg-primary-dark px-5 py-2.5 font-semibold text-white transition-colors"
                          >
                            Show my price
                          </button>
                        </div>
                        {gateError && (
                          <p className="mt-2 text-sm text-red-600">{gateError}</p>
                        )}
                        <p className="mt-2 text-[11px] leading-snug text-gray-400">
                          We may text you with regards to your quote — no marketing
                          lists, nothing more.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {totalItems === 1 ? '1 item selected' : `${totalItems} items selected`}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-bold text-primary">
                            &pound;{total.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400">fixed price</span>
                        </div>
                        {bundleApplied && (
                          <p className="text-xs font-semibold text-accent">
                            Any {BUNDLE_SIZE} areas for &pound;{BUNDLE_PRICE} applied — saves &pound;{BUNDLE_SAVING}.
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          To be confirmed on booking.
                        </p>
                        {minApplied && (
                          <p className="text-xs text-amber-600 font-medium">
                            Minimum cleaning charge of &pound;{MIN_CHARGE} applies.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceed || !unlocked}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Book This Clean
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Summary sidebar */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Selection</h3>
                    <ul className="space-y-2 mb-4">
                      {lines.map((line) => (
                        <li key={line.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {line.id === 'bundle' ? line.name : `${line.qty}× ${line.name}`}
                          </span>
                          <span className={line.amount < 0 ? 'text-accent font-semibold' : 'text-gray-500'}>
                            {line.amount < 0 ? '−' : ''}&pound;{Math.abs(line.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Fixed Price</span>
                      <span className="text-2xl font-bold text-primary">&pound;{total.toFixed(2)}</span>
                    </div>
                    {minApplied && (
                      <p className="mt-2 text-xs text-amber-600 font-medium">
                        Minimum cleaning charge of &pound;{MIN_CHARGE} applies.
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      Nothing to pay until the job is done.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-4 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      &larr; Back to items
                    </button>
                  </div>
                </div>

                {/* Details form */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="booking-name" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <HiUser className="w-4 h-4 text-primary" /> Full Name
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <HiPhone className="w-4 h-4 text-primary" /> Mobile
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-address" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <HiLocationMarker className="w-4 h-4 text-primary" /> Address
                      </label>
                      <input
                        id="booking-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House number & street"
                        autoComplete="street-address"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-postcode" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <HiLocationMarker className="w-4 h-4 text-primary" /> Postcode
                      </label>
                      <input
                        id="booking-postcode"
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="CH63 1AA"
                        autoComplete="postal-code"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 uppercase focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date picker */}
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                      <HiCalendar className="w-4 h-4 text-primary" /> Pick a day
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableDates.slice(0, 12).map((date) => {
                        const value = formatDateValue(date);
                        const isSelected = formData.date === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, date: value }))}
                            className={`rounded-xl border-2 px-2 py-2.5 text-sm font-medium transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-100 text-gray-700 hover:border-gray-200'
                            }`}
                          >
                            {formatDate(date)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slot */}
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                      <HiClock className="w-4 h-4 text-primary" /> Morning or afternoon?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'am', label: 'Morning', time: '8am – 12pm', icon: '🌅' },
                        { id: 'pm', label: 'Afternoon', time: '12pm – 5pm', icon: '☀️' },
                      ].map((slot) => {
                        const isSelected = formData.timeSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot.id }))}
                            className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-4 transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-2xl">{slot.icon}</span>
                            <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                              {slot.label}
                            </span>
                            <span className={`text-sm ${isSelected ? 'text-primary/70' : 'text-gray-400'}`}>
                              {slot.time}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => canSubmit && setStep(3)}
                    disabled={!canSubmit}
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Continue to Confirm
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Fixed price — confirmed by text once you book.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Step 3: Confirm — pay on the day, or Klarna */
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Summary sidebar */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Booking</h3>
                    <ul className="space-y-2 mb-4">
                      {lines.map((line) => (
                        <li key={line.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {line.id === 'bundle' ? line.name : `${line.qty}× ${line.name}`}
                          </span>
                          <span className={line.amount < 0 ? 'text-accent font-semibold' : 'text-gray-500'}>
                            {line.amount < 0 ? '−' : ''}&pound;{Math.abs(line.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total</span>
                        <span className="text-xl font-bold text-primary">&pound;{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium text-gray-700 text-right">
                          {formData.address}, {formData.postcode.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-700">
                          {(() => {
                            const d = availableDates.find((d) => formatDateValue(d) === formData.date);
                            return d ? formatDate(d) : formData.date;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium text-gray-700">
                          {formData.timeSlot === 'am' ? 'Morning' : 'Afternoon'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      &larr; Back to details
                    </button>
                  </div>
                </div>

                {/* Confirm column */}
                <div className="lg:col-span-3">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900">Nothing to pay today</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Book now and pay by cash or card when the job is done
                        and you&rsquo;re happy with it.
                      </p>
                      <button
                        type="button"
                        onClick={submitPayOnDay}
                        disabled={podSubmitting}
                        className="group mt-4 w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-300 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25"
                      >
                        {podSubmitting ? 'Booking…' : (
                          <>
                            Book now — pay &pound;{total.toFixed(2)} on the day
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      {podError && (
                        <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                          <HiExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          {podError}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400 text-center">
                        We&rsquo;ll text to confirm your slot.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
                      <span className="h-px flex-1 bg-gray-200" />
                      or pay now in instalments
                      <span className="h-px flex-1 bg-gray-200" />
                    </div>

                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <HiCreditCard className="w-5 h-5 text-primary" />
                      Pay with Klarna
                    </h3>

                    {klarnaLoading && (
                      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 text-center">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading payment options...</p>
                      </div>
                    )}

                    {klarnaError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <HiExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-700">{klarnaError}</p>
                          <p className="text-xs text-red-500 mt-1">
                            Or call <a href="tel:01519369664" className="underline font-medium">0151 936 9664</a> to book over the phone.
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      id="klarna-payments-container"
                      ref={klarnaContainerRef}
                      className="min-h-[100px]"
                    />

                    {klarnaReady && (
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                        className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        {paymentProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay &amp; Book &pound;{total.toFixed(2)} with Klarna
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    )}

                    <p className="text-xs text-gray-400 text-center">
                      Secure payment powered by Klarna. We&rsquo;ll text to confirm your appointment.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
