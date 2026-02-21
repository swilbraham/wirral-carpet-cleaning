import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const faqs = [
  {
    question: 'How much does carpet cleaning cost?',
    answer:
      'Carpet cleaning prices vary depending on the size of the area and condition of the carpets. We offer free, no-obligation quotes tailored to your specific needs. Contact us on 0151 936 9664 or fill in our quote form for a personalised estimate.',
  },
  {
    question: 'How long does professional carpet cleaning take to dry?',
    answer:
      'Most carpets are dry within 2–4 hours after our hot-water extraction cleaning. We use professional-grade equipment that extracts maximum moisture, ensuring fast drying times. We recommend good ventilation to speed up the process.',
  },
  {
    question: 'Do you clean sofas and upholstery as well as carpets?',
    answer:
      'Yes, we specialise in upholstery cleaning including sofas, armchairs, dining chairs and mattresses. We use colour-safe, fabric-appropriate cleaning methods for all upholstery types — from delicate fabrics to hard-wearing commercial materials.',
  },
  {
    question: 'What areas do you cover for carpet cleaning?',
    answer:
      'We serve the entire Wirral peninsula, Liverpool, Chester and surrounding areas across Merseyside and Cheshire. This includes Birkenhead, Prenton, Wallasey, Heswall, West Kirby, Bebington, Bromborough, Ellesmere Port, Neston, Hoylake, Southport, St Helens, Warrington and more.',
  },
  {
    question: 'Are your carpet cleaning products safe for pets and children?',
    answer:
      'Absolutely. We use eco-friendly, non-toxic cleaning solutions that are completely safe for pets, children and allergy sufferers. All our products are professionally formulated and leave no harmful residue behind.',
  },
  {
    question: 'Can you remove stubborn stains from carpets?',
    answer:
      'Yes, our professional-grade hot-water extraction equipment and specialist stain treatments can remove most stubborn stains including red wine, coffee, pet accidents, ink and more. We assess every stain individually and apply the most effective treatment.',
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border border-gray-100 rounded-xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </h3>
        <HiChevronDown
          className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 md:px-6 pb-5 md:pb-6 text-gray-500 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section id="faq" aria-label="Frequently asked questions" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Common questions about our carpet cleaning and upholstery cleaning services
            across Wirral, Liverpool and Merseyside.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
