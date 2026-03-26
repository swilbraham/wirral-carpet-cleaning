import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HiCreditCard, HiLocationMarker, HiArrowRight, HiExclamationCircle } from 'react-icons/hi';

export default function PaymentPage() {
  const [paymentType, setPaymentType] = useState('booking_fee');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    address.trim().length > 0 &&
    (paymentType === 'booking_fee' || (paymentType === 'full' && Number(amount) >= 20));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType,
          amount: paymentType === 'booking_fee' ? 20 : Number(amount),
          address: address.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Could not connect to payment provider. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Make a Payment | Wirral Carpet Cleaning</title>
        <meta name="description" content="Pay your booking fee or full carpet cleaning payment securely with card or Klarna." />
      </Helmet>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <HiCreditCard className="w-4 h-4" />
              Secure Payment
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Make a Payment
            </h1>
            <p className="text-gray-500">
              Pay securely with card or Klarna. All payments are processed by Stripe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
            {/* Payment type selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Payment Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('booking_fee')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentType === 'booking_fee'
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`block text-lg font-bold ${paymentType === 'booking_fee' ? 'text-primary' : 'text-gray-900'}`}>
                    &pound;20.00
                  </span>
                  <span className={`block text-sm mt-1 ${paymentType === 'booking_fee' ? 'text-primary/70' : 'text-gray-500'}`}>
                    Booking Fee
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('full')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentType === 'full'
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`block text-lg font-bold ${paymentType === 'full' ? 'text-primary' : 'text-gray-900'}`}>
                    Full Payment
                  </span>
                  <span className={`block text-sm mt-1 ${paymentType === 'full' ? 'text-primary/70' : 'text-gray-500'}`}>
                    Enter amount
                  </span>
                </button>
              </div>

              {paymentType === 'booking_fee' && (
                <p className="mt-3 text-sm text-gray-500 bg-white rounded-lg border border-gray-100 px-4 py-3">
                  Your &pound;20.00 booking fee will be <strong>deducted from your final payment</strong> due on the day.
                </p>
              )}
            </div>

            {/* Amount input (full payment only) */}
            {paymentType === 'full' && (
              <div>
                <label htmlFor="pay-amount" className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">&pound;</span>
                  <input
                    type="number"
                    id="pay-amount"
                    min="20"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-lg font-semibold placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                {amount && Number(amount) < 20 && (
                  <p className="mt-1.5 text-sm text-red-500">Minimum payment is &pound;20.00</p>
                )}
              </div>
            )}

            {/* Address (payment reference) */}
            <div>
              <label htmlFor="pay-address" className="block text-sm font-semibold text-gray-900 mb-1.5">
                <HiLocationMarker className="w-4 h-4 inline mr-1" />
                Your Address (payment reference)
              </label>
              <input
                type="text"
                id="pay-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 12 High Street, Birkenhead, CH41 1AA"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <HiExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  Pay {paymentType === 'booking_fee' ? '\u00A320.00' : amount ? `\u00A3${Number(amount).toFixed(2)}` : ''} Now
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="text-xs text-gray-400">Powered by Stripe</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-400">Card &amp; Klarna accepted</span>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
