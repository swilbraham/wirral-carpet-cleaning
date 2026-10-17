import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiCheck, HiPhone, HiCalendar } from 'react-icons/hi';

/**
 * The page a texted quote links to: /quote/<token>. The token is the whole
 * secret — guess it wrong and you get a polite dead end. Read-only; booking
 * happens by phone or through /book like everyone else.
 */
export default function QuotePage() {
  const { token } = useParams();
  const [quote, setQuote] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/quote?token=${encodeURIComponent(token || '')}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setState('missing');
          return;
        }
        setQuote(json);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const firstName = quote?.name ? quote.name.trim().split(' ')[0] : '';
  const items = quote?.items
    ? String(quote.items)
        .split(', ')
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <Helmet>
        <title>Your Quote | Wirral Carpet Cleaning</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-lg mx-auto">
        {state === 'loading' && (
          <p className="text-center text-gray-500">Fetching your quote…</p>
        )}

        {(state === 'missing' || state === 'error') && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {state === 'missing' ? "We couldn't find that quote" : 'Something went wrong'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {state === 'missing'
                ? 'The link may be old or mistyped — but a fresh price takes under a minute.'
                : 'Try again in a moment, or get a fresh price below.'}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                to="/book"
                className="rounded-xl bg-primary hover:bg-primary-dark px-6 py-3 font-semibold text-white transition-colors"
              >
                Get an instant price
              </Link>
              <a
                href="tel:01519369664"
                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-primary"
              >
                Call 0151 936 9664
              </a>
            </div>
          </div>
        )}

        {state === 'ready' && quote && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-primary px-6 py-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Wirral Carpet Cleaning
              </p>
              <h1 className="text-2xl font-bold">
                {firstName ? `${firstName}, here's your quote` : 'Your quote'}
              </h1>
              <p className="mt-1 text-sm text-white/80">Prepared {quote.created}</p>
            </div>

            <div className="p-6">
              {items.length > 0 && (
                <ul className="space-y-2">
                  {items.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-gray-700">
                      <HiCheck className="mt-0.5 shrink-0 text-green-600" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 flex items-baseline justify-between">
                <span className="font-semibold text-gray-700">Your price</span>
                <span className="text-3xl font-bold text-primary">{quote.total}</span>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <HiCheck className="text-green-600" /> Pay on the day — cash or card, nothing upfront
                </li>
                <li className="flex items-center gap-2">
                  <HiCheck className="text-green-600" /> Fully insured, professional hot-water extraction
                </li>
                <li className="flex items-center gap-2">
                  <HiCheck className="text-green-600" /> Dry in hours, not days
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="tel:01519369664"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-6 py-3.5 font-semibold text-white transition-colors"
                >
                  <HiPhone /> Call to book — 0151 936 9664
                </a>
                <Link
                  to="/book"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3.5 font-semibold text-gray-700 transition-colors hover:border-primary"
                >
                  <HiCalendar /> Book online
                </Link>
              </div>
              <p className="mt-3 text-center text-xs text-gray-400">
                Just mention this quote when you book — the price above is the
                price you pay.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
