import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  HiCheck,
  HiPhone,
  HiChevronDown,
  HiAcademicCap,
  HiHome,
  HiUserGroup,
  HiBadgeCheck,
  HiCurrencyPound,
  HiArrowRight,
} from 'react-icons/hi';

const days = [
  {
    day: 'Day 1',
    title: 'Foundations on the Job',
    points: [
      'Van setup and equipment walkthrough',
      'Customer introductions and site etiquette',
      'Carpet inspections and fibre identification',
      'Pre-vacuuming and preparation',
      'Mixing chemicals safely and correctly',
      'Assisting on 2–4 real customer jobs',
    ],
  },
  {
    day: 'Days 2–4',
    title: 'Hands-On, Building Responsibility',
    points: [
      'Pre-treatment and stain assessment',
      'Agitation techniques',
      'Operating the extraction machine',
      'Specialist stain removal',
      'Drying and finishing',
      'Talking to customers, quoting and upselling',
    ],
  },
  {
    day: 'Day 5',
    title: 'You Run the Jobs',
    points: [
      'Complete jobs yourself under supervision',
      'Pricing and business setup advice',
      'Marketing that actually wins work',
      'Open Q&A on anything carpet cleaning',
      'Certificate of completion',
    ],
  },
];

const learnPoints = [
  'Hot-water extraction on real carpets',
  'Stain removal on genuine household stains',
  'Upholstery cleaning basics',
  'Quoting jobs and pricing confidently',
  'Handling customers in their own homes',
  'Working efficiently to a daily schedule',
  'Chemical safety and dilution',
  'Marketing and winning your first customers',
];

const faqs = [
  {
    question: 'Do I need any experience?',
    answer:
      'None at all. The course is designed for complete beginners. By day five you will have cleaned carpets in real customers’ homes, dealt with real stains and spoken to real customers — all under direct supervision.',
  },
  {
    question: 'Is this classroom training?',
    answer:
      'No — that’s the whole point. There is no workshop and no demo rig. Every day you are out on genuine customer bookings with an experienced technician, learning in real homes with real furniture, pets and stains.',
  },
  {
    question: 'Am I insured while training?',
    answer:
      'Yes. All work is carried out under the direct supervision of our fully insured technician, and trainees are covered while on our jobs. Customers give written consent before a trainee attends their booking.',
  },
  {
    question: 'What do I need to bring?',
    answer:
      'Just comfortable work clothes and sturdy footwear. All equipment, chemicals and materials are provided — you’ll be using the same professional truck-mount-grade kit we use every day.',
  },
  {
    question: 'Will I be ready to start my own business afterwards?',
    answer:
      'You will have completed a full week of real jobs, plus a dedicated session on pricing, business setup and marketing. Most trainees leave with everything they need to take their first paying customer. You also receive a certificate of completion.',
  },
  {
    question: 'How many people are on each course?',
    answer:
      'One. We deliberately take a single trainee at a time so you get maximum hands-on time on every job and our customers get the same quality of service as always.',
  },
];

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

export default function TrainingPage() {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get('_honey')) return;
    setSending(true);
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: '5-Day Live Carpet Cleaning Training Course',
    description:
      'Hands-on carpet cleaning training on real customer jobs across Wirral and Merseyside. One trainee per course, all equipment provided, certificate of completion.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Wirral Carpet Cleaning Limited',
      telephone: '0151 936 9664',
      url: 'https://www.wirralcarpetcleaning.com',
    },
  };

  return (
    <>
      <Helmet>
        <title>Carpet Cleaning Training Course | 5 Days on Real Customer Jobs | Wirral Carpet Cleaning</title>
        <meta
          name="description"
          content="Learn carpet cleaning on real customer jobs — not in a classroom. 5-day one-to-one training across Wirral & Merseyside with an experienced technician. Equipment provided, certificate of completion. Call 0151 936 9664."
        />
        <link rel="canonical" href="https://www.wirralcarpetcleaning.com/training" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gray-900 py-20 md:py-28">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-sm font-medium mb-4">
            <HiAcademicCap className="w-4 h-4 text-primary" />
            <span className="text-primary">Hands-On Training</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn Carpet Cleaning on Real Customer Jobs
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            A 5-day, one-to-one training experience. No classroom, no demo rig —
            you spend the week working genuine bookings alongside an experienced,
            fully insured technician with 15+ years in the trade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:01519369664"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold transition-colors"
            >
              <HiPhone className="w-5 h-5" />
              Call 0151 936 9664
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              Enquire About the Next Course
              <HiArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Why it's different */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Why Train on Real Jobs?
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            A classroom can show you the theory. It can&apos;t show you a nervous
            customer, a ten-year-old wine stain or a landing full of furniture.
            Our course can — because every day is a real working day.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HiHome,
                title: 'Real Homes',
                text: 'Real stains, pets, furniture and customer interactions — not staged samples.',
              },
              {
                icon: HiUserGroup,
                title: 'One-to-One',
                text: 'One trainee per course. Maximum hands-on time on every single job.',
              },
              {
                icon: HiCurrencyPound,
                title: 'Business Skills',
                text: 'Quoting, pricing, upselling and marketing — learned live, then reviewed on day 5.',
              },
              {
                icon: HiBadgeCheck,
                title: 'Certificate',
                text: 'Finish with a certificate of completion for your 5-day practical training.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course outline */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            The 5-Day Course Outline
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {days.map((d) => (
              <div key={d.day} className="bg-white rounded-xl border border-gray-200 p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-3">
                  {d.day}
                </span>
                <h3 className="font-bold text-gray-900 mb-4">{d.title}</h3>
                <ul className="space-y-2.5">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <HiCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center mt-8 max-w-2xl mx-auto">
            Every customer is asked in advance and gives written consent before a
            trainee attends their booking. Their price and service stay exactly the same.
          </p>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            What You&apos;ll Learn
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {learnPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4"
              >
                <HiCheck className="w-5 h-5 text-primary shrink-0" />
                <span className="text-gray-700 font-medium">{point}</span>
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
            Course Fee
          </h2>
          <p className="text-4xl font-bold text-primary mb-2">£995</p>
          <p className="text-gray-600 leading-relaxed mb-6 max-w-xl mx-auto">
            Per person, for the full 5-day course. One trainee at a time — so you
            get an entire working week of one-to-one training. All equipment and
            chemicals provided, plus a dedicated pricing, business and marketing
            session and your certificate of completion.
          </p>
          <a
            href="#enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
          >
            Reserve Your Week
            <HiArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquiry" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Enquire About the Next Course
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Places are limited to one trainee per course, so dates book up fast.
            Send us your details and we&apos;ll come back to you with the next
            available week.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <HiCheck className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  We&apos;ve received your enquiry and will get back to you with
                  available course dates, usually within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="hidden"
                  name="access_key"
                  value="fae49abe-d4e1-4cdc-9ed1-a5ec3c116881"
                />
                <input
                  type="hidden"
                  name="subject"
                  value="Training Course Enquiry — Wirral Carpet Cleaning"
                />
                <input
                  type="hidden"
                  name="from_name"
                  value="Wirral Carpet Cleaning Website"
                />
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="training-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="training-name"
                      name="name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="training-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="training-phone"
                      name="phone"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="07700 900 000"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="training-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="training-email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="training-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Anything You&apos;d Like to Ask?
                  </label>
                  <textarea
                    id="training-message"
                    name="message"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    placeholder="Preferred dates, experience level, questions about the course..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                >
                  {sending ? 'Sending...' : 'Send Enquiry'}
                  {!sending && <HiArrowRight className="w-5 h-5" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
