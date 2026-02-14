import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Heswall, Wirral',
    text: 'Absolutely brilliant job on our living room carpet. We had two dogs and the smell was getting embarrassing. The team were professional, on time and the results were incredible. Looks and smells brand new!',
    rating: 5,
    service: 'Carpet Cleaning',
  },
  {
    name: 'James T.',
    location: 'Liverpool City Centre',
    text: 'We use Wirral Carpet Cleaning for our restaurant on a regular contract. They work around our hours, never disrupt service and the carpets always look spotless. Highly recommend for any commercial premises.',
    rating: 5,
    service: 'Commercial Cleaning',
  },
  {
    name: 'Karen B.',
    location: 'Neston, Cheshire',
    text: 'Had a 3-piece suite that I was ready to replace. They cleaned it and it came up like new — saved me a fortune. The technician was really knowledgeable and explained everything. Fantastic value.',
    rating: 5,
    service: 'Upholstery Cleaning',
  },
  {
    name: 'David P.',
    location: 'Birkenhead, Wirral',
    text: 'Called about a biohazard situation at a rental property. They responded within hours, were incredibly discreet and handled everything professionally. Cannot fault them at all.',
    rating: 5,
    service: 'Biohazard Cleaning',
  },
  {
    name: 'Linda W.',
    location: 'Chester, Cheshire',
    text: 'Third time using them now and consistently excellent. They got red wine out of a cream carpet — I genuinely didn\'t think it was possible. Magic workers!',
    rating: 5,
    service: 'Carpet Cleaning',
  },
  {
    name: 'Mark H.',
    location: 'Wallasey, Wirral',
    text: 'Moved into a new house and the previous owners left the carpets in a state. Wirral Carpet Cleaning transformed every room. Worth every penny and then some.',
    rating: 5,
    service: 'Carpet Cleaning',
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <HiStar key={i} className="w-5 h-5 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <StarRating rating={testimonial.rating} />
      <p className="mt-4 mb-6 text-gray-600 leading-relaxed">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-400">{testimonial.location}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {testimonial.service}
        </span>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-medium mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Don't Just Take
            <br />
            <span className="text-primary">Our Word For It</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Hundreds of satisfied customers across Merseyside and Cheshire trust us
            to keep their homes and businesses spotless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {currentTestimonials.map((testimonial, i) => (
            <TestimonialCard
              key={`${currentPage}-${i}`}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous reviews"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentPage ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next reviews"
          >
            <HiChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
