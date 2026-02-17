import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiSparkles,
  HiHeart,
  HiShieldCheck,
  HiHome,
} from 'react-icons/hi';

const reasons = [
  {
    icon: HiSparkles,
    title: 'Revive Your Carpets',
    description:
      'Professional deep cleaning lifts embedded dirt and restores your carpets to their original colour and softness — they\'ll look and feel like new again.',
  },
  {
    icon: HiHeart,
    title: 'Healthier Home',
    description:
      'Remove dust mites, allergens, bacteria and pet dander that build up over time. Clean carpets and upholstery mean cleaner air for your family.',
  },
  {
    icon: HiShieldCheck,
    title: 'Protect Your Investment',
    description:
      'Regular professional cleaning extends the life of your carpets and furniture by years, saving you thousands on premature replacements.',
  },
  {
    icon: HiHome,
    title: 'Fresh & Inviting Spaces',
    description:
      'Eliminate trapped odours and stale smells. Freshly cleaned carpets and sofas transform the feel of any room — perfect before guests or a new season.',
  },
];

function AnimatedCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 md:p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors">
        <item.icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
      <p className="text-gray-500 leading-relaxed">{item.description}</p>
    </motion.div>
  );
}

export default function PainPoints() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Clean?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            The Benefits of Professional
            <br />
            <span className="text-primary">Carpet &amp; Upholstery Cleaning</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Regular professional cleaning doesn&rsquo;t just make your home look great —
            it protects your health, your furnishings and your investment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, i) => (
            <AnimatedCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
