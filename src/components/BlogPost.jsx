import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import {
  HiArrowRight,
  HiPhone,
  HiCurrencyPound,
  HiClock,
  HiCalendar,
} from 'react-icons/hi';
import posts from '../data/blog';

// Render inline **bold** within a paragraph or list item.
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-5">
          {renderInline(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700 leading-relaxed text-lg marker:text-accent">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700 leading-relaxed text-lg marker:text-accent marker:font-bold">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-bold text-gray-900"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-gray-700">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div className="my-6 p-5 rounded-xl bg-amber-50 border-l-4 border-amber-400">
          <p className="text-gray-800 leading-relaxed">
            {renderInline(block.text)}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  // Schemas — Article + FAQPage (when faqs present) + BreadcrumbList
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Wirral Carpet Cleaning Limited',
      url: 'https://www.wirralcarpetcleaning.com',
    },
    publisher: {
      '@type': 'LocalBusiness',
      '@id': 'https://www.wirralcarpetcleaning.com/#business',
      name: 'Wirral Carpet Cleaning Limited',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wirralcarpetcleaning.com/logo.png',
      },
    },
    mainEntityOfPage: `https://www.wirralcarpetcleaning.com/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.wirralcarpetcleaning.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.wirralcarpetcleaning.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.wirralcarpetcleaning.com/blog/${post.slug}`,
      },
    ],
  };

  // Optional FAQ schema (only if the post defined a faqs array)
  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link
          rel="canonical"
          href={`https://www.wirralcarpetcleaning.com/blog/${post.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta
          property="og:url"
          content={`https://www.wirralcarpetcleaning.com/blog/${post.slug}`}
        />
        <meta property="article:published_time" content={post.publishedDate} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-900 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/blog" className="hover:text-white transition-colors">
              ← All articles
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1">
              <HiCalendar className="w-4 h-4" />
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1">
              <HiClock className="w-4 h-4" />
              {post.readingTime} read
            </span>
          </div>
        </div>
      </section>

      {/* Quick answer (the bit AI engines extract) */}
      <section className="py-10 bg-amber-50 border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              Quick Answer
            </div>
            <p className="text-gray-800 leading-relaxed text-lg">
              {post.quickAnswer}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Get a free, fixed-price quote within an hour
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Wirral, Liverpool, Birkenhead, Chester and the surrounding
            Merseyside &amp; Cheshire area. Free, no obligation, no follow-up
            sales calls.
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

      {/* Related posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            More articles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-accent hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {p.quickAnswer}
                </p>
                <span className="inline-flex items-center gap-1 text-accent font-medium text-sm">
                  Read article
                  <HiArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold transition-colors"
            >
              See all articles
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
