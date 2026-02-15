import { motion } from 'framer-motion';
import { HiPhone, HiArrowRight, HiShieldCheck, HiClock, HiStar } from 'react-icons/hi';
import heroImage from '../assets/hero-living-room.jpg';

const stats = [
  { icon: HiStar, value: '5★', label: 'Rated Service' },
  { icon: HiClock, value: '15+', label: 'Years Experience' },
  { icon: HiShieldCheck, value: '100%', label: 'Satisfaction Guarantee' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary/95 to-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(4,167,235,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(30,115,190,0.2),_transparent_60%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Decorative geometric shapes */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-accent text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Trusted across Merseyside &amp; Cheshire
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Professional Cleaning
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                That Transforms
              </span>
              <br />
              Your Space
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed"
            >
              Expert carpet, upholstery and biohazard cleaning for homes and businesses.
              We restore what others can't — serving Liverpool, Wirral, Chester and
              communities throughout Merseyside and Cheshire.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
              >
                Get a Free Quote
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="tel:01519369664"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 glass hover:bg-white/15 text-white rounded-xl text-lg font-semibold transition-all"
              >
                <HiPhone className="w-5 h-5" />
                0151 936 9664
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="text-2xl md:text-3xl font-bold text-white">{value}</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-400">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
              <img
                src={heroImage}
                alt="Beautifully clean living room with fresh carpets"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 glass-light rounded-xl px-5 py-3 shadow-lg">
              <p className="text-sm font-semibold text-gray-900">Trusted by 1,000+ customers</p>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="w-4 h-4 text-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
