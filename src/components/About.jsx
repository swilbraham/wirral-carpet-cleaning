import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiShieldCheck,
  HiUserGroup,
  HiLocationMarker,
  HiBadgeCheck,
  HiClock,
  HiHeart,
} from 'react-icons/hi';

const credentials = [
  { icon: HiBadgeCheck, label: 'Fully Insured' },
  { icon: HiShieldCheck, label: 'DBS Checked' },
  { icon: HiUserGroup, label: 'Trained Technicians' },
  { icon: HiHeart, label: 'Eco-Friendly Products' },
  { icon: HiClock, label: '15+ Years Experience' },
  { icon: HiLocationMarker, label: 'Locally Owned' },
];

const areas = [
  'Liverpool',
  'Birkenhead',
  'Wallasey',
  'Heswall',
  'West Kirby',
  'Bebington',
  'Bromborough',
  'Ellesmere Port',
  'Chester',
  'Neston',
  'Hoylake',
  'New Brighton',
  'Bootle',
  'Southport',
  'St Helens',
  'Warrington',
  'Runcorn',
  'Widnes',
  'Crosby',
  'Formby',
];

export default function About() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });
  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-50px' });

  return (
    <section id="about" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Your Local Cleaning
            <br />
            <span className="text-primary">Experts Since Day One</span>
          </h2>
        </motion.div>

        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 40 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Left: Story & Credentials */}
          <div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Wirral Carpet Cleaning Limited is a family-run business serving homes
              and businesses throughout Merseyside and Cheshire. With over 15 years
              of hands-on experience, we combine professional-grade equipment with
              genuine care for every job — big or small.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We believe in honest pricing, reliable service and results that speak
              for themselves. Every member of our team is fully trained, DBS checked
              and committed to leaving your space cleaner and healthier.
            </p>

            {/* Credential grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {credentials.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Areas We Cover */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HiLocationMarker className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Areas We Cover</h3>
            </div>
            <p className="text-gray-500 mb-6">
              We serve domestic and commercial customers across Merseyside and Cheshire,
              including:
            </p>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors cursor-default"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Don't see your area? Get in touch — we likely cover it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
