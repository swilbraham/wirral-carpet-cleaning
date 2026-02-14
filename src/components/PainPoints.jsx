import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiExclamationCircle,
  HiEmojiSad,
  HiCurrencyPound,
  HiBan,
} from 'react-icons/hi';

const painPoints = [
  {
    icon: HiExclamationCircle,
    title: 'Stubborn Stains',
    description:
      'Wine spills, pet accidents, coffee marks — everyday stains that shop-bought products just push deeper into the fibres.',
  },
  {
    icon: HiEmojiSad,
    title: 'Allergens & Odours',
    description:
      'Dust mites, pet dander and trapped odours build up over time, affecting air quality and triggering allergies in your home or office.',
  },
  {
    icon: HiCurrencyPound,
    title: 'Costly Replacements',
    description:
      'Replacing carpets and upholstery is expensive. Without proper cleaning, wear and discolouration mean premature replacement costs.',
  },
  {
    icon: HiBan,
    title: 'DIY Disasters',
    description:
      'Rental machines and supermarket products often leave residue that attracts more dirt, making the problem worse in the long run.',
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
      className="group relative p-6 md:p-8 rounded-2xl bg-white border border-gray-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center mb-5 transition-colors">
        <item.icon className="w-6 h-6 text-red-500" />
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Dirty Carpets Are More Than
            <br />
            <span className="text-red-500">Just an Eyesore</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            From hidden allergens to stubborn stains, neglected carpets and upholstery
            create problems that go far beyond appearance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item, i) => (
            <AnimatedCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
