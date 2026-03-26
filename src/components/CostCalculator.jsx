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

const FIRST_CARPET_PRICE = 60;
const ADDITIONAL_CARPET_PRICE = 30;

const rooms = [
  { id: 'living-room', name: 'Living Room', icon: '🛋️' },
  { id: 'master-bedroom', name: 'Master Bedroom', icon: '🛏️' },
  { id: 'bedroom-2', name: 'Bedroom 2', icon: '🛏️' },
  { id: 'bedroom-3', name: 'Bedroom 3', icon: '🛏️' },
  { id: 'bedroom-4', name: 'Bedroom 4', icon: '🛏️' },
  { id: 'bedroom-5', name: 'Bedroom 5', icon: '🛏️' },
  { id: 'bedroom-6', name: 'Bedroom 6', icon: '🛏️' },
  { id: 'hallway', name: 'Hallway', icon: '🚪' },
  { id: 'stairs', name: 'Stairs', icon: '📶' },
  { id: 'landing', name: 'Landing', icon: '🏠' },
  { id: 'dining-room', name: 'Dining Room', icon: '🍽️' },
  { id: 'study', name: 'Study / Office', icon: '💻' },
  { id: 'conservatory', name: 'Conservatory', icon: '☀️' },
  { id: 'playroom', name: 'Playroom', icon: '🧸' },
  { id: 'other', name: 'Other', icon: '📋' },
];

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

function calculatePrice(selectedRooms) {
  if (selectedRooms.length === 0) return { total: 0, breakdown: [] };

  const breakdown = [];
  let count = 0;

  selectedRooms.forEach((id) => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    count++;
    const price = count === 1 ? FIRST_CARPET_PRICE : ADDITIONAL_CARPET_PRICE;
    breakdown.push({ name: room.name, price, icon: room.icon });
  });

  let total = breakdown.reduce((sum, item) => sum + item.price, 0);

  // Silent combo discount: hall+stairs, stairs+landing, or hall+stairs+landing = -£30
  const hasHall = selectedRooms.includes('hallway');
  const hasStairs = selectedRooms.includes('stairs');
  const hasLanding = selectedRooms.includes('landing');
  if ((hasHall && hasStairs) || (hasStairs && hasLanding)) {
    total = Math.max(0, total - 30);
  }

  return { total, breakdown };
}

export default function CostCalculator() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });
  const klarnaContainerRef = useRef(null);

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    postcode: '',
    date: '',
    timeSlot: '',
  });

  // Klarna state
  const [klarnaLoading, setKlarnaLoading] = useState(false);
  const [klarnaReady, setKlarnaReady] = useState(false);
  const [klarnaError, setKlarnaError] = useState('');
  const [klarnaPaymentCategory, setKlarnaPaymentCategory] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [klarnaOrderId, setKlarnaOrderId] = useState('');

  const availableDates = useMemo(() => generateDates(), []);

  const { total, breakdown } = useMemo(
    () => calculatePrice(selectedRooms),
    [selectedRooms]
  );

  const toggleRoom = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canProceed = selectedRooms.length > 0;
  const canSubmit =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.postcode.trim() &&
    formData.date &&
    formData.timeSlot;

  // Initialize Klarna session when entering step 3
  const initKlarnaSession = useCallback(async () => {
    setKlarnaLoading(true);
    setKlarnaError('');
    setKlarnaReady(false);

    const roomData = selectedRooms.map((id) => {
      const room = rooms.find((r) => r.id === id);
      return { id, name: room?.name || id };
    });

    try {
      const res = await fetch('/api/klarna/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalInPence: total * 100,
          rooms: roomData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Initialize Klarna Payments
      window.Klarna.Payments.init({
        client_token: data.client_token,
      });

      // Use first available payment category
      const category = data.payment_method_categories?.[0]?.identifier || 'pay_later';
      setKlarnaPaymentCategory(category);

      // Load the Klarna widget
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
            setKlarnaError('Klarna is not available for this order. Please contact us to arrange payment.');
          }
        }
      );
    } catch (err) {
      setKlarnaLoading(false);
      setKlarnaError(err.message || 'Could not load payment options. Please contact us to arrange payment.');
    }
  }, [selectedRooms, total]);

  useEffect(() => {
    if (step === 3) {
      // Small delay to ensure the container div is rendered
      const timer = setTimeout(() => {
        if (window.Klarna) {
          initKlarnaSession();
        } else {
          // Wait for Klarna script to load
          const checkKlarna = setInterval(() => {
            if (window.Klarna) {
              clearInterval(checkKlarna);
              initKlarnaSession();
            }
          }, 200);
          // Timeout after 10s
          setTimeout(() => {
            clearInterval(checkKlarna);
            if (!window.Klarna) {
              setKlarnaLoading(false);
              setKlarnaError('Payment system could not be loaded. Please contact us to arrange payment.');
            }
          }, 10000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step, initKlarnaSession]);

  const handlePayment = async () => {
    if (!klarnaReady || paymentProcessing) return;

    setPaymentProcessing(true);
    setKlarnaError('');

    try {
      // Authorize the payment with Klarna
      window.Klarna.Payments.authorize(
        { payment_method_category: klarnaPaymentCategory },
        {},
        async (authorizeRes) => {
          if (!authorizeRes.approved) {
            setPaymentProcessing(false);
            if (!authorizeRes.show_form) {
              setKlarnaError('Payment was not approved. Please try again or contact us.');
            }
            return;
          }

          // Create the order on our backend
          const roomData = selectedRooms.map((id) => {
            const room = rooms.find((r) => r.id === id);
            return { id, name: room?.name || id };
          });

          try {
            const orderRes = await fetch('/api/klarna/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                authorizationToken: authorizeRes.authorization_token,
                totalInPence: total * 100,
                rooms: roomData,
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

            // Also send the booking email via FormSubmit
            await sendBookingEmail(orderData.order_id);

            setPaymentProcessing(false);
            setSubmitted(true);
          } catch (err) {
            setPaymentProcessing(false);
            setKlarnaError(err.message || 'Payment failed. Please contact us.');
          }
        }
      );
    } catch (err) {
      setPaymentProcessing(false);
      setKlarnaError('Payment failed. Please contact us.');
    }
  };

  const sendBookingEmail = async (orderId) => {
    const roomList = selectedRooms
      .map((id) => rooms.find((r) => r.id === id)?.name)
      .filter(Boolean);

    const selectedDate = availableDates.find(
      (d) => formatDateValue(d) === formData.date
    );

    const jsonData = {
      name: formData.name,
      phone: formData.phone,
      postcode: formData.postcode,
      preferredDate: selectedDate ? formatDate(selectedDate) : formData.date,
      preferredTime: formData.timeSlot === 'am' ? 'Morning (AM)' : 'Afternoon (PM)',
      roomsRequested: roomList.join('\n'),
      totalRooms: `${selectedRooms.length} room${selectedRooms.length !== 1 ? 's' : ''}`,
      estimatedCost: `£${total.toFixed(2)}`,
      paymentMethod: 'Klarna',
      klarnaOrderId: orderId || '',
      paymentStatus: 'PAID via Klarna',
      _subject: 'New Paid Booking (Klarna) - Wirral Carpet Cleaning',
      _captcha: 'false',
      _template: 'table',
    };

    try {
      await fetch('https://formsubmit.co/ajax/contact@wirralcarpetcleaning.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
    } catch {
      // Email failure shouldn't block payment confirmation
    }

    if (typeof fbq === 'function') fbq('track', 'Purchase', { value: total, currency: 'GBP' });
  };

  const resetAll = () => {
    setSelectedRooms([]);
    setStep(1);
    setSubmitted(false);
    setFormData({ name: '', phone: '', postcode: '', date: '', timeSlot: '' });
    setKlarnaReady(false);
    setKlarnaError('');
    setKlarnaOrderId('');
    setKlarnaPaymentCategory('');
    setPaymentProcessing(false);
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
            Price Estimator
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Get Your Estimated Price
            <br />
            <span className="text-primary">In Seconds</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            All prices are estimates — final price to be confirmed on booking.
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { num: 1, label: 'Select Rooms' },
            { num: 2, label: 'Your Details' },
            { num: 3, label: 'Payment' },
          ].map(({ num, label }) => (
            <button
              key={num}
              onClick={() => {
                if (submitted) return;
                if (num < step) setStep(num);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step >= num
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              } ${num < step && !submitted ? 'cursor-pointer hover:bg-primary-dark' : ''}`}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {submitted && num <= step ? (
                  <HiCheck className="w-4 h-4" />
                ) : (
                  num
                )}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed & Paid!</h3>
                <p className="text-gray-500">
                  Thank you, {formData.name}. Your payment has been processed via Klarna.
                </p>
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
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Postcode</span>
                  <span className="text-sm font-semibold text-gray-900 uppercase">{formData.postcode}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Rooms</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {selectedRooms.map((id) => {
                      const room = rooms.find((r) => r.id === id);
                      return room ? (
                        <span key={id} className="block">{room.icon} {room.name}</span>
                      ) : null;
                    })}
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
                  <span className="text-sm font-medium text-gray-500">Payment</span>
                  <span className="text-sm font-semibold text-green-600">Paid via Klarna</span>
                </div>
                {klarnaOrderId && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Order ID</span>
                    <span className="text-xs font-mono text-gray-400">{klarnaOrderId}</span>
                  </div>
                )}
                <div className="px-5 py-4 flex justify-between items-center bg-primary/5">
                  <span className="text-sm font-bold text-gray-900">Total Paid</span>
                  <span className="text-xl font-bold text-primary">&pound;{total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mb-6">
                We&rsquo;ll call to confirm your appointment time. If you have any questions, call us on 0151 936 9664.
              </p>

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
              {/* Room selection grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                {rooms.map((room) => {
                  const isSelected = selectedRooms.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => toggleRoom(room.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <HiCheck className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <span className="text-2xl">{room.icon}</span>
                      <span
                        className={`text-sm font-medium text-center ${
                          isSelected ? 'text-primary' : 'text-gray-700'
                        }`}
                      >
                        {room.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Price summary bar */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <HiCurrencyPound className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-bold text-gray-900">Your Estimated Price</h3>
                    </div>
                    {selectedRooms.length === 0 ? (
                      <p className="text-gray-500">
                        Select rooms above to see your estimated price. First room from &pound;{FIRST_CARPET_PRICE}.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {selectedRooms.length === 1
                            ? '1 room selected'
                            : `${selectedRooms.length} rooms selected`}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-bold text-primary">
                            &pound;{total.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400">estimated total</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          To be confirmed on booking.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceed}
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
                      {breakdown.map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-700">
                            <span>{item.icon}</span>
                            {item.name}
                          </span>
                          <span className="text-gray-500">&pound;{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Estimated Total</span>
                      <span className="text-2xl font-bold text-primary">
                        &pound;{total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      To be confirmed on booking.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-4 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      &larr; Edit selection
                    </button>
                  </div>
                </div>

                {/* Booking form */}
                <div className="lg:col-span-3">
                  <div className="space-y-6">
                    <input type="text" name="_honey" style={{ display: 'none' }} />

                    {/* Personal details */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <HiUser className="w-5 h-5 text-primary" />
                        Your Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="calc-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="calc-name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Smith"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="calc-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                              <HiPhone className="w-4 h-4 inline mr-1" />
                              Contact Number
                            </label>
                            <input
                              type="tel"
                              id="calc-phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="07123 456789"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="calc-postcode" className="block text-sm font-medium text-gray-700 mb-1.5">
                              <HiLocationMarker className="w-4 h-4 inline mr-1" />
                              Postcode
                            </label>
                            <input
                              type="text"
                              id="calc-postcode"
                              name="postcode"
                              required
                              value={formData.postcode}
                              onChange={handleInputChange}
                              placeholder="CH63 1AA"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date selection */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <HiCalendar className="w-5 h-5 text-primary" />
                        Choose a Date
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {availableDates.map((date) => {
                          const val = formatDateValue(date);
                          const isSelected = formData.date === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, date: val }))}
                              className={`p-3 rounded-xl border-2 text-center transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <span
                                className={`block text-xs font-medium ${
                                  isSelected ? 'text-primary' : 'text-gray-400'
                                }`}
                              >
                                {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                              </span>
                              <span
                                className={`block text-lg font-bold ${
                                  isSelected ? 'text-primary' : 'text-gray-900'
                                }`}
                              >
                                {date.getDate()}
                              </span>
                              <span
                                className={`block text-xs ${
                                  isSelected ? 'text-primary' : 'text-gray-400'
                                }`}
                              >
                                {date.toLocaleDateString('en-GB', { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slot */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <HiClock className="w-5 h-5 text-primary" />
                        Preferred Time
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'am', label: 'Morning', time: '8am – 12pm', icon: '🌅' },
                          { value: 'pm', label: 'Afternoon', time: '12pm – 5pm', icon: '☀️' },
                        ].map((slot) => {
                          const isSelected = formData.timeSlot === slot.value;
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, timeSlot: slot.value }))
                              }
                              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                  : 'border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <span className="text-2xl">{slot.icon}</span>
                              <span
                                className={`font-semibold ${
                                  isSelected ? 'text-primary' : 'text-gray-900'
                                }`}
                              >
                                {slot.label}
                              </span>
                              <span
                                className={`text-sm ${
                                  isSelected ? 'text-primary/70' : 'text-gray-400'
                                }`}
                              >
                                {slot.time}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Continue to Payment */}
                    <button
                      type="button"
                      onClick={() => canSubmit && setStep(3)}
                      disabled={!canSubmit}
                      className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                      <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      Estimated price — to be confirmed on booking.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Step 3: Klarna Payment */
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                    <ul className="space-y-2 mb-4">
                      {breakdown.map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-700">
                            <span>{item.icon}</span>
                            {item.name}
                          </span>
                          <span className="text-gray-500">&pound;{item.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        &pound;{total.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Name</span>
                        <span className="font-medium text-gray-700">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone</span>
                        <span className="font-medium text-gray-700">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span className="font-medium text-gray-700">
                          {(() => {
                            const d = availableDates.find((d) => formatDateValue(d) === formData.date);
                            return d ? formatDate(d) : formData.date;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time</span>
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

                {/* Klarna payment widget */}
                <div className="lg:col-span-3">
                  <div className="space-y-6">
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
                            Call us on <a href="tel:01519369664" className="underline font-medium">0151 936 9664</a> to book over the phone.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Klarna widget renders here */}
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
                        className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        {paymentProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Book &amp; Pay &pound;{total.toFixed(2)}
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    )}

                    <p className="text-xs text-gray-400 text-center">
                      Secure payment powered by Klarna. We&rsquo;ll call to confirm your appointment.
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
