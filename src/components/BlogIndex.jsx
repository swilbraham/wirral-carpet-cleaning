import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { HiArrowRight, HiClock, HiPhone, HiCurrencyPound } from 'react-icons/hi';
import posts from '../data/blog';

export default function BlogIndex() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // CollectionPage schema lists all posts — helps AI engines map the topic cluster
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wirral Carpet Cleaning — Carpet Cleaning Advice & Guides',
    description:
      'Honest carpet-cleaning advice from a 15-year-trade family business in Wirral. Pricing, methods, drying times, pet-friendly cleaning, end-of-tenancy and more.',
    url: 'https://www.wirralcarpetcleaning.com/blog',
    publisher: {
      '@type': 'LocalBusiness',
      '@id': 'https://www.wirralcarpetcleaning.com/#business',
    },
    hasPart: posts.map((p) => ({
      '@type': 'Article',
      headline: p.title,
      url: `https://www.wirralcarpetcleaning.com/blog/${p.slug}`,
      datePublished: p.publishedDate,
      description: p.metaDescription,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Carpet Cleaning Advice & Guides | Wirral Carpet Cleaning</title>
        <meta
          name="description"
          content="Honest carpet-cleaning advice from a 15-year-trade Wirral family business. Pricing, methods, drying times, pet-friendly cleaning, end-of-tenancy and more."
        />
        <link
          rel="canonical"
          href="https://www.wirralcarpetcleaning.com/blog"
        />
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gray-900 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gray-900 to-accent/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Carpet Cleaning Advice
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Honest answers to common carpet questions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Costs, methods, drying times, pet households, end-of-tenancy and
            more — written by people who actually clean carpets every day in
            Wirral, Liverpool and Chester.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <time dateTime={p.publishedDate}>
                    {new Date(p.publishedDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <HiClock className="w-3 h-3" />
                    {p.readingTime}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors">
                  {p.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4 line-clamp-3">
                  {p.quickAnswer}
                </p>
                <span className="inline-flex items-center gap-1 text-accent font-medium text-sm">
                  Read full answer
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need a quote rather than a how-to?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Free, no-obligation written quote within an hour. Wirral, Liverpool,
            Birkenhead, Chester and the wider Merseyside area.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:01519369664"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold transition-colors"
            >
              <HiPhone className="w-5 h-5" />
              Call 0151 936 9664
            </a>
            <Link
              to="/#calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-semibold transition-colors"
            >
              <HiCurrencyPound className="w-5 h-5" />
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
