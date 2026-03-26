import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import {
  HiCheck,
  HiArrowRight,
  HiPhone,
  HiCurrencyPound,
  HiChevronDown,
} from 'react-icons/hi';
import { useState } from 'react';
import services from '../data/services';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <HiChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) return <Navigate to="/" replace />;

  const otherServices = services.filter((s) => s.slug !== slug);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        <link
          rel="canonical"
          href={`https://www.wirralcarpetcleaning.com/services/${service.slug}`}
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gray-900 py-20 md:py-28">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={`${service.title} in Wirral and Merseyside`}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${service.iconBg} text-sm font-medium mb-4`}
          >
            <service.icon className={`w-4 h-4 ${service.iconColor}`} />
            <span className={service.iconColor}>{service.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            {service.heroText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:01519369664"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold transition-colors"
            >
              <HiPhone className="w-5 h-5" />
              Call 0151 936 9664
            </a>
            <Link
              to="/#calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              <HiCurrencyPound className="w-5 h-5" />
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5">
            {service.longDescription.map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Our Process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Why Choose Us
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4"
              >
                <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              <span className="text-gray-700 font-medium">Fully insured</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              <span className="text-gray-700 font-medium">DBS-checked technicians</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              <span className="text-gray-700 font-medium">Eco-friendly products</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
              <HiCheck className={`w-5 h-5 ${service.iconColor} shrink-0`} />
              <span className="text-gray-700 font-medium">15+ years experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiCurrencyPound className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Pricing
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {service.pricingNote}
          </p>
          <Link
            to="/#calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
          >
            Get Your Estimated Price
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Our Other Services
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <span className="text-sm text-primary font-medium">{s.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Book Your {service.title}?
          </h2>
          <p className="text-white/80 mb-8">
            Get a free, no-obligation quote today. Call us or use our online
            price estimator.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:01519369664"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <HiPhone className="w-5 h-5" />
              0151 936 9664
            </a>
            <Link
              to="/#calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              Get a Quote Online
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
