import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiSparkles,
  HiHome,
  HiOfficeBuilding,
  HiShieldCheck,
  HiCheck,
  HiArrowRight,
} from 'react-icons/hi';
import carpetImg from '../assets/carpet.jpg';
import upholsteryImg from '../assets/upholstery.jpg';
import commercialImg from '../assets/commercial-cleaning.jpg';
import biohazardImg from '../assets/bio.jpeg';

const services = [
  {
    icon: HiSparkles,
    title: 'Carpet Cleaning',
    description:
      'Deep hot-water extraction that removes embedded dirt, stains and allergens — restoring your carpets to like-new condition.',
    features: [
      'Deep stain removal',
      'Hot-water extraction',
      'Fast drying times',
      'Pet-safe products',
    ],
    accent: 'from-primary to-primary-light',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    image: carpetImg,
  },
  {
    icon: HiHome,
    title: 'Upholstery Cleaning',
    description:
      'Specialist fabric cleaning for sofas, chairs and mattresses. We treat every piece with the care it deserves.',
    features: [
      'All fabric types',
      'Colour-safe cleaning',
      'Odour elimination',
      'Stain protection',
    ],
    accent: 'from-accent to-accent-light',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    image: upholsteryImg,
  },
  {
    icon: HiOfficeBuilding,
    title: 'Commercial Cleaning',
    description:
      'Keep your business premises pristine. Contract and one-off services for offices, restaurants, hotels and more.',
    features: [
      'Flexible scheduling',
      'Minimal disruption',
      'Contract options',
      'All commercial spaces',
    ],
    accent: 'from-primary-dark to-primary',
    iconBg: 'bg-primary-dark/10',
    iconColor: 'text-primary-dark',
    image: commercialImg,
  },
  {
    icon: HiShieldCheck,
    title: 'Biohazard Cleaning',
    description:
      'Certified biohazard and trauma cleaning. Discreet, compassionate service when you need it most.',
    features: [
      'Certified & compliant',
      'Discreet service',
      'Rapid response',
      '24/7 availability',
    ],
    accent: 'from-emerald-500 to-emerald-400',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    image: biohazardImg,
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl bg-white border border-gray-100 hover:border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
    >
      {/* Service image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={`${service.title} service in Wirral and Merseyside`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`} />
        <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl ${service.iconBg} backdrop-blur-sm bg-white/80 flex items-center justify-center`}>
          <service.icon className={`w-6 h-6 ${service.iconColor}`} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
        <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>

        <ul className="space-y-3 mb-6">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`inline-flex items-center gap-2 text-sm font-semibold ${service.iconColor} group-hover:gap-3 transition-all`}
        >
          Get a Quote
          <HiArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Professional Cleaning
            <br />
            <span className="text-primary">Services in Merseyside &amp; Cheshire</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            From domestic carpet cleaning to commercial upholstery care and specialist biohazard remediation,
            we have the expertise and equipment to handle any cleaning challenge across Wirral, Liverpool and Chester.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
