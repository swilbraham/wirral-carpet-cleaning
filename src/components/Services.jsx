import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiCheck, HiArrowRight } from 'react-icons/hi';
import services from '../data/services';

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl ${service.iconBg} backdrop-blur-sm bg-white/80 flex items-center justify-center`}>
          <service.icon className={`w-6 h-6 ${service.iconColor}`} />
        </div>
        {/* Pricing badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm">
          <span className="text-sm font-bold text-gray-900">{service.price}</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
        <p className="text-gray-500 leading-relaxed mb-6">{service.shortDescription}</p>

        <ul className="space-y-3 mb-6">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          to={`/services/${service.slug}`}
          className={`inline-flex items-center gap-2 text-sm font-semibold ${service.iconColor} group-hover:gap-3 transition-all`}
        >
          Learn More
          <HiArrowRight className="w-4 h-4" />
        </Link>
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
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
