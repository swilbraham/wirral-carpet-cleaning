import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiCheck } from 'react-icons/hi';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type');
  const isBookingFee = type === 'booking_fee';

  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Payment Successful | Wirral Carpet Cleaning</title>
      </Helmet>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <HiCheck className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Payment Successful
            </h1>

            {isBookingFee ? (
              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  Thank you for your &pound;20.00 booking fee. This will be deducted from your final payment.
                </p>
                <p className="text-gray-600 leading-relaxed font-medium">
                  We will be in contact to confirm the date and time.
                </p>
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                Thank you for your payment. We appreciate your business.
              </p>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
              >
                Return Home
              </button>
              <p className="text-xs text-gray-400">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Questions? Call us on{' '}
              <a href="tel:01519369664" className="text-primary hover:underline font-medium">
                0151 936 9664
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
