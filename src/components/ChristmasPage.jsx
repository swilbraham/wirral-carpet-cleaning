import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiPhone, HiCalendar, HiCheck, HiSparkles, HiClock } from 'react-icons/hi';

/**
 * The Christmas campaign page — /christmas. Standalone like /landing, built
 * to be the destination for seasonal ads and Facebook posts: guest-ready
 * carpets before the big day, pre-Christmas urgency, straight into /book.
 *
 * The SANTA10 code it advertises must exist in Admin → Codes (10%).
 */
const SNOWFLAKES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 41) % 100}%`,
  size: 8 + ((i * 7) % 12),
  duration: 9 + ((i * 13) % 11),
  delay: -((i * 17) % 12),
  drift: ((i % 5) - 2) * 18,
}));

const POINTS = [
  'Guest-ready carpets & sofas before the big day',
  'Any 3 areas — rooms or stairs — for £99',
  'Dry in hours, not days (tree back in place same day)',
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
    <div className="relative min-h-screen overflow-hidden bg-[#0b2818] text-white">
      <Helmet>
        <title>Christmas Carpet Cleaning Offer | Wirral Carpet Cleaning</title>
        <meta
          name="description"
          content="Get your carpets and sofas guest-ready for Christmas. Any 3 areas for £99, dry in hours, nothing to pay until the job's done. Pre-Christmas slots across Wirral, Liverpool & Chester go fast — book online in a minute."
        />
        <link rel="canonical" href="https://www.wirralcarpetcleaning.com/christmas" />
      </Helmet>

      {/* Snow */}
      <style>{`
        @keyframes wccSnow {
          0% { transform: translate3d(0, -5vh, 0); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translate3d(var(--drift), 105vh, 0); opacity: 0.4; }
        }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {SNOWFLAKES.map((flake) => (
          <span
            key={flake.id}
            className="absolute top-0 select-none text-white/70"
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

      <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
          Wirral Carpet Cleaning
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-4xl font-black leading-tight md:text-5xl"
        >
          Guest-ready carpets
          <span className="block text-amber-300">before Christmas 🎄</span>
        </motion.h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-emerald-100">
          The family&rsquo;s coming, the tree&rsquo;s going up, and the carpets
          have had a year of life on them. One visit and the whole house smells
          like Christmas — not the dog.
        </p>

        {/* Offer card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-lg rounded-3xl border-2 border-amber-300/60 bg-white/5 p-8 backdrop-blur"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-wide text-emerald-950">
            <HiSparkles /> Christmas offer
          </p>
          <p className="mt-4 text-5xl font-black text-white">
            10% off
            <span className="block mt-1 text-lg font-semibold text-emerald-100">
              every online booking before Christmas
            </span>
          </p>
          <p className="mt-3 text-sm text-emerald-200">
            Use code{' '}
            <span className="rounded-lg bg-white/10 px-2 py-1 font-mono font-bold text-amber-300">
              SANTA10
            </span>{' '}
            at the end of the price calculator.
          </p>
          <ul className="mt-6 space-y-2 text-left">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-emerald-50">
                <HiCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/book"
              className="group flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-4 text-lg font-bold text-emerald-950 transition-all hover:bg-amber-300 hover:shadow-xl"
            >
              <HiCalendar /> Get my price &amp; book online
            </Link>
            <a
              href="tel:01519369664"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/25 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              <HiPhone /> 0151 936 9664
            </a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-200">
            <HiClock /> Pre-Christmas slots fill fast — December always books out.
          </p>
        </motion.div>

        {/* The festive mess list */}
        <h2 className="mt-16 text-2xl font-black">
          Whatever Christmas throws at your carpets
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SPOTS.map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
            >
              <p className="font-bold text-amber-300">{title}</p>
              <p className="mt-1 text-sm text-emerald-100">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-emerald-200">
          Serving Wirral, Liverpool, Chester &amp; Merseyside · Fully insured ·
          Pay on the day by cash or card
        </p>
        <p className="mt-6 text-xs text-emerald-300/60">
          <Link to="/" className="underline">wirralcarpetcleaning.com</Link>
        </p>
      </div>
    </div>
  );
}
