import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  HiArrowRight,
  HiPhone,
  HiCurrencyPound,
  HiChevronDown,
  HiCheckCircle,
  HiClock,
  HiSparkles,
} from 'react-icons/hi';
import stains from '../data/stains';

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

export default function StainRemovalPage() {
  const { slug } = useParams();
  const stain = stains.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!stain) return <Navigate to="/" replace />;

  // Schema.org HowTo — extracted directly by AI engines
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: stain.title,
    description: stain.shortDesc,
    totalTime: stain.totalTime,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'GBP',
      value: stain.estimatedCost,
    },
    tool: stain.tools.map((t) => ({ '@type': 'HowToTool', name: t })),
    supply: stain.supplies.map((s) => ({ '@type': 'HowToSupply', name: s })),
    step: stain.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: stain.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.wirralcarpetcleaning.com/' },
      { '@type': 'ListItem', position: 2, name: 'Stain Removal Guides', item: 'https://www.wirralcarpetcleaning.com/stain-removal' },
      { '@type': 'ListItem', position: 3, name: stain.title, item: `https://www.wirralcarpetcleaning.com/stain-removal/${stain.slug}` },
    ],
  };

  const otherStains = stains.filter((s) => s.slug !== slug);

  return (
    <>
      <Helmet>
        <title>{stain.metaTitle}</title>
        <meta name="description" content={stain.metaDescription} />
        <link
          rel="canonical"
          href={`https://www.wirralcarpetcleaning.com/stain-removal/${stain.slug}`}
        />
        <meta property="og:title" content={stain.metaTitle} />
        <meta property="og:description" content={stain.metaDescription} />
        <meta property="og:url" content={`https://www.wirralcarpetcleaning.com/stain-removal/${stain.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gray-900 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gray-900 to-accent/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <HiSparkles className="w-4 h-4" />
            <span>Stain Removal Guide</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {stain.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            {stain.shortDesc}
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
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Quick answer (the bit AI engines extract) */}
      <section className="py-12 bg-amber-50 border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              Quick Answer
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">{stain.answer}</p>
          </div>
        </div>
      </section>

      {/* Time / cost / tools summary */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <HiClock className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-xs text-gray-500 mb-1">Total time</div>
              <div className="font-bold text-gray-900 text-sm">
                {stain.totalTime}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <HiCurrencyPound className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-xs text-gray-500 mb-1">Cost</div>
              <div className="font-bold text-gray-900 text-sm">
                {stain.estimatedCost}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <HiSparkles className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-xs text-gray-500 mb-1">Tools</div>
              <div className="font-bold text-gray-900 text-sm">
                {stain.tools.length} items
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <HiCheckCircle className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-xs text-gray-500 mb-1">Steps</div>
              <div className="font-bold text-gray-900 text-sm">
                {stain.steps.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you need */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Tools</h2>
              <ul className="space-y-2">
                {stain.tools.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-gray-600">
                    <HiCheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Supplies</h2>
              <ul className="space-y-2">
                {stain.supplies.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-gray-600">
                    <HiCheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-step (the HowTo content) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Step-by-Step Method
          </h2>
          <ol className="space-y-6">
            {stain.steps.map((step, i) => (
              <li
                key={step.name}
                className="bg-white rounded-xl border-l-4 border-accent shadow-sm p-6"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {step.name}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed pl-11">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Did the stain not lift? We'll get it out.
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Hot-water extraction lifts pigment that home methods cannot reach. We
            cover Wirral, Liverpool, Birkenhead, Chester and the surrounding
            Merseyside &amp; Cheshire area. Free quotes, no obligation.
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
              Get a Free Quote
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {stain.faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other stain guides */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            More Stain-Removal Guides
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStains.map((s) => (
              <Link
                key={s.slug}
                to={`/stain-removal/${s.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-accent hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{s.shortDesc}</p>
                <span className="inline-flex items-center gap-1 text-accent font-medium text-sm">
                  Read guide
                  <HiArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
