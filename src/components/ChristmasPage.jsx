import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiPhone, HiCalendar, HiCheck, HiSparkles, HiClock } from 'react-icons/hi';

/**
 * The Christmas campaign page — /christmas. Same design language as the
 * rest of the site (navy hero, blue accents, white sections); the snow and
 * the copy carry the festive feel, not a novelty palette.
 *
 * The SANTA10 code it advertises must exist in Admin → Codes (10%).
 */
const SNOWFLAKES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 41) % 100}%`,
  size: 8 + ((i * 7) % 10),
  duration: 10 + ((i * 13) % 10),
  delay: -((i * 17) % 12),
  drift: ((i % 5) - 2) * 16,
}));

const POINTS = [
  'Guest-ready carpets & sofas before the big day',
  'Any 3 areas — rooms or stairs — for £99',
  'Dry in hours, not days — tree back in place same day',
  'Nothing to pay until the job is done',
];

const SPOTS = [
  ['Red wine', 'Gone before the in-laws see it'],
  ['Gravy & grease', 'Lifted from carpets and dining chairs'],
  ['Muddy paw prints', 'Hallways and stairs brought back'],
  ['Chocolate & sticky fingers', 'Sofas and armchairs refreshed'],
];

export default function ChristmasPage() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Christmas Carpet Cleaning Offer | Wirral Carpet Cleaning</title>
        <meta
          name="description"
          content="Get your carpets and sofas guest-ready for Christmas. Any 3 areas for £99, dry in hours, nothing to pay until the job's done. Pre-Christmas slots across Wirral, Liverpool & Chester go fast — book online in a minute."
        />
        <link rel="canonical" href="https://www.wirralcarpetcleaning.com/christmas" />
      </Helmet>

      {/* Hero — the site's navy, with snow */}
      <section className="relative overflow-hidden bg-dark pt-28 pb-20 md:pt-36">
        <style>{`
          @keyframes wccSnow {
            0% { transform: translate3d(0, -5vh, 0); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translate3d(var(--drift), 110vh, 0); opacity: 0.3; }
          }
        `}</style>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {SNOWFLAKES.map((flake) => (
            <span
              key={flake.id}
              className="absolute top-0 select-none text-white/50"
              style={{
                left: flake.left,
                fontSize: `${flake.size}px`,
                animation: `wccSnow ${flake.duration}s linear infinite`,
                animationDelay: `${flake.delay}s`,
                '--drift': `${flake.drift}px`,
              }}
            >
              ❄
            </span>
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-light">
              <HiSparkles /> Christmas offer — 10% off online bookings
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
              Guest-ready carpets
              <span className="block text-accent-light">before Christmas</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-300">
              The family&rsquo;s coming and the carpets have had a year of life
              on them. One visit and the house is ready for the big day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/book"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg sm:w-auto"
              >
                <HiCalendar /> Get my price &amp; book online
              </Link>
              <a
                href="tel:01519369664"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <HiPhone /> 0151 936 9664
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
              <HiClock /> Pre-Christmas slots fill fast — December always books out.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offer */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                The offer
              </p>
              <p className="mt-3 text-4xl font-black text-gray-900">
                10% off
                <span className="block mt-1 text-lg font-semibold text-gray-500">
                  every online booking before Christmas
                </span>
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Use code{' '}
                <span className="rounded-lg bg-primary/10 px-2 py-1 font-mono font-bold text-primary">
                  SANTA10
                </span>{' '}
                at the end of the price calculator — it comes straight off the
                price you pay on the day.
              </p>
              <Link
                to="/book"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Price my clean <HiCalendar />
              </Link>
            </div>

            <ul className="space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <HiCheck className="h-4 w-4 text-green-600" />
                  </span>
                  <span className="font-medium text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The festive mess list */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900">
            Whatever Christmas throws at your carpets
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Professional hot-water extraction lifts the stains the big day
            leaves behind — and the ones already there.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SPOTS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm"
              >
                <p className="font-bold text-primary">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-gray-500">
            Serving Wirral, Liverpool, Chester &amp; Merseyside · Fully insured ·
            Pay on the day by cash or card
          </p>
        </div>
      </section>
    </div>
  );
}
