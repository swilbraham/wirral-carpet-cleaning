import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import {
  HiLocationMarker,
  HiPhone,
  HiArrowRight,
  HiCheck,
  HiCurrencyPound,
} from 'react-icons/hi';
import locations from '../data/locations';
import services from '../data/services';

export default function LocationPage() {
  const { slug } = useParams();
  const location = locations.find((l) => l.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!location) return <Navigate to="/" replace />;

  const nearbyLocations = location.nearby
    .map((name) => locations.find((l) => l.name === name))
    .filter(Boolean);

  const metaTitle = `Carpet Cleaning in ${location.name} | Wirral Carpet Cleaning`;
  const metaDescription = `Professional carpet cleaning, upholstery cleaning & biohazard cleaning in ${location.name}, ${location.county}. 15+ years experience, fully insured. Free quotes — 0151 936 9664.`;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Wirral Carpet Cleaning Limited',
    url: `https://www.wirralcarpetcleaning.com/areas/${location.slug}`,
    telephone: '+441519369664',
    areaServed: {
      '@type': 'City',
      name: location.name,
    },
    description: `Professional carpet and upholstery cleaning services in ${location.name}, ${location.county}.`,
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link
          rel="canonical"
          href={`https://www.wirralcarpetcleaning.com/areas/${location.slug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-900 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            <HiLocationMarker className="w-4 h-4" />
            {location.name}, {location.county}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Carpet Cleaning in{' '}
            <span className="text-primary">{location.name}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Professional carpet, upholstery and biohazard cleaning services
            for homes and businesses in {location.name}.
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

      {/* About this area */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Carpet Cleaning Services in {location.name}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {location.description}
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            All our technicians are fully insured, DBS-checked and use
            eco-friendly cleaning products that are safe for children, pets
            and allergy sufferers. We provide free, no-obligation quotes and
            there is no payment taken until the job is complete.
          </p>
        </div>
      </section>

      {/* Services in this area */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Services Available in {location.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <service.icon
                      className={`w-6 h-6 ${service.iconColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {service.shortDescription}
                    </p>
                    <span className="text-sm font-semibold text-primary">
                      {service.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Why {location.name} Chooses Us
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              '15+ years experience',
              'Fully insured',
              'DBS-checked technicians',
              'Eco-friendly products',
              'No hidden fees',
              'Free, no-obligation quotes',
              'Fast drying times',
              'Satisfaction guaranteed',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4"
              >
                <HiCheck className="w-5 h-5 text-primary shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiCurrencyPound className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Carpet Cleaning Prices in {location.name}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Domestic carpet cleaning from <strong>&pound;60</strong> for the
            first room, additional rooms from <strong>&pound;30</strong> each.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Upholstery cleaning from <strong>&pound;50</strong>. Commercial
            and biohazard cleaning quoted individually.
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

      {/* Nearby areas */}
      {nearbyLocations.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              We Also Cover Nearby Areas
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  to={`/areas/${loc.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  <HiLocationMarker className="w-4 h-4" />
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Get a Free Quote in {location.name}
          </h2>
          <p className="text-white/80 mb-8">
            Call us today or use our online price estimator for an instant
            quote. No obligation, no hidden fees.
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
