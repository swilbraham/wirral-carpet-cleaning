import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowRight,
  HiCheck,
  HiPhone,
  HiMail,
  HiGift,
} from 'react-icons/hi';
import logo from '../assets/logo.png';

const SEGMENTS = [
  { id: 0, label: '10% Off',               fullLabel: '10% Off Your Clean',               color: '#1e73be', weight: 25 },
  { id: 1, label: 'Free Stain\nTreatment',  fullLabel: 'Free Stain Treatment',             color: '#155a96', weight: 20 },
  { id: 2, label: '15% Off',               fullLabel: '15% Off Your First Clean',          color: '#04a7eb', weight: 15 },
  { id: 3, label: 'Free\nDeodoriser',       fullLabel: 'Free Deodoriser Treatment',         color: '#1e73be', weight: 15 },
  { id: 4, label: '£10 Off',               fullLabel: '£10 Off Any Service',               color: '#155a96', weight: 10 },
  { id: 5, label: '20% Off!',              fullLabel: '20% Off Your Clean',                color: '#0a1628', weight: 3  },
  { id: 6, label: 'Free Room\nFreshener',   fullLabel: 'Free Room Freshener',               color: '#04a7eb', weight: 7  },
  { id: 7, label: '£20 Off\n3+ Rooms',     fullLabel: '£20 Off When You Book 3+ Rooms',    color: '#155a96', weight: 5  },
];

const serviceLabels = {
  domestic: 'Domestic Carpet Cleaning',
  upholstery: 'Upholstery Cleaning',
  commercial: 'Commercial Carpet Cleaning',
  biohazard: 'Biohazard Cleaning',
  other: 'Other / Multiple',
};

function pickWinningSegment() {
  const totalWeight = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const segment of SEGMENTS) {
    random -= segment.weight;
    if (random <= 0) return segment;
  }
  return SEGMENTS[0];
}

/* ── SVG Wheel ── */
const WHEEL_SIZE = 400;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 4;
const SEG_ANGLE = 360 / SEGMENTS.length;

function polarToXY(angleDeg, r = RADIUS) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function segmentPath(index) {
  const a1 = index * SEG_ANGLE;
  const a2 = a1 + SEG_ANGLE;
  const p1 = polarToXY(a1);
  const p2 = polarToXY(a2);
  return `M ${CENTER} ${CENTER} L ${p1.x} ${p1.y} A ${RADIUS} ${RADIUS} 0 0 1 ${p2.x} ${p2.y} Z`;
}

function Wheel({ rotation, onComplete, isSpinning }) {
  return (
    <div className="relative inline-block">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
        <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-[#31d4ff] drop-shadow-lg" />
      </div>

      {/* Glow ring */}
      <div className="rounded-full shadow-[0_0_60px_rgba(4,167,235,0.3)]">
        <motion.svg
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className="w-72 h-72 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem]"
          animate={{ rotate: rotation }}
          transition={
            isSpinning
              ? { duration: 5, ease: [0.15, 0.6, 0.25, 1] }
              : { duration: 0 }
          }
          onAnimationComplete={onComplete}
        >
          {SEGMENTS.map((seg, i) => {
            const midAngle = i * SEG_ANGLE + SEG_ANGLE / 2;
            const tp = polarToXY(midAngle, RADIUS * 0.6);
            const lines = seg.label.split('\n');

            return (
              <g key={seg.id}>
                <path
                  d={segmentPath(i)}
                  fill={seg.color}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                />
                <text
                  x={tp.x}
                  y={tp.y}
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="'Space Grotesk', sans-serif"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${tp.x}, ${tp.y})`}
                >
                  {lines.map((line, li) => (
                    <tspan
                      key={li}
                      x={tp.x}
                      dy={li === 0 ? `${-(lines.length - 1) * 0.55}em` : '1.15em'}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          {/* Centre hub */}
          <circle cx={CENTER} cy={CENTER} r="32" fill="#0a1628" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
          <text
            x={CENTER}
            y={CENTER}
            fill="white"
            fontSize="12"
            fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            SPIN
          </text>
        </motion.svg>
      </div>
    </div>
  );
}

/* ── Confetti ── */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        y: -(Math.random() * 350 + 120),
        rot: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.5,
        color: ['#04a7eb', '#31d4ff', '#1e73be', '#fbbf24', '#22c55e', '#f472b6'][i % 6],
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color, left: '50%', top: '40%' }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{ opacity: [1, 1, 0], x: p.x, y: p.y, rotate: p.rot, scale: p.scale }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ── Main Component ── */
export default function SpinWheel() {
  const [phase, setPhase] = useState('idle'); // idle | spinning | won | form | submitted
  const [winningSegment, setWinningSegment] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSpin = useCallback(() => {
    if (phase !== 'idle') return;
    const winner = pickWinningSegment();
    setWinningSegment(winner);
    setPhase('spinning');

    const segCenter = winner.id * SEG_ANGLE + SEG_ANGLE / 2;
    const alignTo = 360 - segCenter;
    const jitter = (Math.random() - 0.5) * (SEG_ANGLE * 0.55);
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    setRotation((prev) => prev + fullSpins + alignTo + jitter);
  }, [phase]);

  const handleSpinComplete = useCallback(() => {
    if (phase === 'spinning') setPhase('won');
  }, [phase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const jsonData = {};
    data.forEach((value, key) => {
      if (!key.startsWith('_')) jsonData[key] = value;
    });
    jsonData.offer = winningSegment.fullLabel;
    setSubmittedData({ ...jsonData });

    jsonData['_subject'] = `Spin & Win: ${winningSegment.fullLabel} - Wirral Carpet Cleaning`;
    jsonData['_captcha'] = 'false';
    jsonData['_template'] = 'table';

    try {
      await fetch('https://formsubmit.co/ajax/contact@wirralcarpetcleaning.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(jsonData),
      });
    } catch {
      // submit anyway
    }

    setPhase('submitted');
    form.reset();
  };

  const resetAll = () => {
    setPhase('idle');
    setWinningSegment(null);
    setSubmittedData(null);
  };

  /* shared input classes */
  const inputCls =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors';

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary/95 to-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(4,167,235,0.15),_transparent_60%)]" />
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-center pt-8 pb-4">
        <a href="/">
          <img src={logo} alt="Wirral Carpet Cleaning" className="h-14 md:h-16 w-auto" />
        </a>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* ── IDLE / SPINNING ── */}
          {(phase === 'idle' || phase === 'spinning') && (
            <motion.div
              key="wheel-phase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
                <HiGift className="w-4 h-4" />
                Exclusive Offer
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Spin to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                  Win a Discount!
                </span>
              </h1>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Every spin&rsquo;s a winner. Try your luck and claim an exclusive carpet or upholstery cleaning offer.
              </p>

              <div className="flex justify-center mb-8">
                <Wheel
                  rotation={rotation}
                  onComplete={handleSpinComplete}
                  isSpinning={phase === 'spinning'}
                />
              </div>

              <button
                onClick={handleSpin}
                disabled={phase === 'spinning'}
                className="group inline-flex items-center gap-2 px-10 py-4 bg-accent hover:bg-accent-light text-white rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phase === 'spinning' ? (
                  'Spinning...'
                ) : (
                  <>
                    SPIN THE WHEEL
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── WON ── */}
          {phase === 'won' && (
            <motion.div
              key="won-phase"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center relative"
            >
              <Confetti />

              <div className="flex justify-center mb-6">
                <Wheel rotation={rotation} onComplete={() => {}} isSpinning={false} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-medium mb-4">
                  <HiCheck className="w-4 h-4" />
                  You Won!
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Congratulations!
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                    {winningSegment?.fullLabel}
                  </span>
                </p>

                <button
                  onClick={() => setPhase('form')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/25"
                >
                  Claim Your Offer
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── FORM ── */}
          {phase === 'form' && (
            <motion.div
              key="form-phase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Offer banner */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Claim Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                    Offer
                  </span>
                </h2>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/20 mt-2">
                  <HiGift className="w-5 h-5 text-accent" />
                  <span className="text-accent font-bold text-lg">{winningSegment?.fullLabel}</span>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Fill in your details below and we&rsquo;ll be in touch to arrange your discounted clean.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
                <input type="text" name="_honey" style={{ display: 'none' }} />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="sw-name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input type="text" id="sw-name" name="name" required placeholder="John Smith" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="sw-email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input type="email" id="sw-email" name="email" required placeholder="john@example.com" className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="sw-phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input type="tel" id="sw-phone" name="phone" placeholder="07123 456789" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="sw-postcode" className="block text-sm font-medium text-gray-300 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="sw-postcode"
                      name="postcode"
                      placeholder="CH63 1AA"
                      className={`${inputCls} uppercase`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sw-service" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Required
                  </label>
                  <select id="sw-service" name="service" className={inputCls}>
                    <option value="domestic" className="bg-gray-800">Domestic Carpet Cleaning</option>
                    <option value="upholstery" className="bg-gray-800">Upholstery Cleaning</option>
                    <option value="commercial" className="bg-gray-800">Commercial Carpet Cleaning</option>
                    <option value="biohazard" className="bg-gray-800">Biohazard Cleaning</option>
                    <option value="other" className="bg-gray-800">Other / Multiple</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sw-message" className="block text-sm font-medium text-gray-300 mb-2">
                    Tell Us About Your Needs
                  </label>
                  <textarea
                    id="sw-message"
                    name="message"
                    rows={3}
                    placeholder="e.g. 3-bed house, living room and hallway carpets..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-accent/25"
                >
                  Claim My Offer
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-gray-500 text-center">
                  No spam, no obligation. We typically respond within 2 hours.
                </p>
              </form>
            </motion.div>
          )}

          {/* ── SUBMITTED ── */}
          {phase === 'submitted' && submittedData && (
            <motion.div
              key="submitted-phase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <HiCheck className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Offer Claimed!</h3>
                <p className="text-gray-400 text-sm">Here&rsquo;s a summary of what you submitted:</p>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/5 mb-6 max-w-lg mx-auto">
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Offer Won</span>
                  <span className="text-sm font-bold text-accent">{submittedData.offer}</span>
                </div>
                {submittedData.name && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Name</span>
                    <span className="text-sm font-semibold text-white">{submittedData.name}</span>
                  </div>
                )}
                {submittedData.email && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Email</span>
                    <span className="text-sm font-semibold text-white">{submittedData.email}</span>
                  </div>
                )}
                {submittedData.phone && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Phone</span>
                    <span className="text-sm font-semibold text-white">{submittedData.phone}</span>
                  </div>
                )}
                {submittedData.postcode && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Postcode</span>
                    <span className="text-sm font-semibold text-white uppercase">{submittedData.postcode}</span>
                  </div>
                )}
                {submittedData.service && (
                  <div className="px-5 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Service</span>
                    <span className="text-sm font-semibold text-white">
                      {serviceLabels[submittedData.service] || submittedData.service}
                    </span>
                  </div>
                )}
                {submittedData.message && (
                  <div className="px-5 py-3">
                    <span className="text-sm text-gray-400 block mb-1">Message</span>
                    <span className="text-sm text-white/80 leading-relaxed">{submittedData.message}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">We typically respond within 2 hours.</p>

              <div className="text-center">
                <button onClick={resetAll} className="text-accent text-sm font-medium hover:text-accent-light transition-colors">
                  Spin again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Wirral Carpet Cleaning" className="h-8 w-auto" />
            <span className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Wirral Carpet Cleaning Limited</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:01519369664" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <HiPhone className="w-4 h-4" />
              0151 936 9664
            </a>
            <a href="mailto:contact@wirralcarpetcleaning.com" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <HiMail className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
