import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiPhone, HiClipboardCheck, HiSparkles, HiThumbUp } from 'react-icons/hi';

const steps = [
  {
    icon: HiPhone,
    step: '01',
    title: 'Get in Touch',
    description:
      'Call us or fill in the quote form. Tell us about your cleaning needs and we\'ll provide a free, no-obligation estimate.',
  },
  {
    icon: HiClipboardCheck,
    step: '02',
    title: 'We Assess & Plan',
    description:
      'Our technician inspects the area, identifies fabric types and stains, and recommends the best treatment approach.',
  },
  {
    icon: HiSparkles,
    step: '03',
    title: 'Deep Clean',
    description:
      'Using professional-grade equipment and eco-friendly solutions, we deep clean every fibre — leaving no residue behind.',
  },
  {
    icon: HiThumbUp,
    step: '04',
    title: 'Enjoy the Results',
    description:
      'Walk-through inspection to ensure you\'re completely satisfied. Your space is left fresh, clean and revitalised.',
  },
];

function StepCard({ step, index, total }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector line (hidden on last item and on mobile) */}
      {index < total - 1 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
      )}

      <div className="relative text-center group">
        {/* Step number + icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-shadow">
            <step.icon className="w-8 h-8 text-white" />
          </div>
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shadow-md">
            {step.step}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
        <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section id="process" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Four Simple Steps to
            <br />
            <span className="text-primary">Spotless Results</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            We make the whole process hassle-free — from first contact to final inspection.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
