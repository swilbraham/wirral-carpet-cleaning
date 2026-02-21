import { useState } from 'react';
import { HiPhone, HiArrowRight, HiStar, HiCheck, HiShieldCheck, HiClock, HiSparkles, HiMail } from 'react-icons/hi';
import logo from '../assets/logo.png';
import carpetImg from '../assets/carpet.jpg';
import upholsteryImg from '../assets/upholstery.jpg';
import biohazardImg from '../assets/bio.jpeg';

const services = [
  {
    title: 'Domestic Cleaning',
    description: 'Deep hot-water extraction that removes embedded dirt, stains and allergens.',
    image: carpetImg,
    features: ['Deep stain removal', 'Fast drying', 'Pet-safe products'],
  },
  {
    title: 'Upholstery Cleaning',
    description: 'Specialist fabric cleaning for sofas, chairs and mattresses.',
    image: upholsteryImg,
    features: ['All fabric types', 'Odour elimination', 'Colour-safe'],
  },
  {
    title: 'Biohazard Cleaning',
    description: 'Certified biohazard and trauma cleaning. Discreet, compassionate service.',
    image: biohazardImg,
    features: ['Certified & compliant', 'Rapid response', '24/7 availability'],
  },
];

const reviews = [
  { name: 'Sarah M.', location: 'Heswall', text: 'Absolutely brilliant job on our living room carpet. Looks and smells brand new!' },
  { name: 'Karen B.', location: 'Neston', text: 'Had a 3-piece suite I was ready to replace. They cleaned it and it came up like new — saved me a fortune.' },
  { name: 'Linda W.', location: 'Chester', text: 'They got red wine out of a cream carpet — I genuinely didn\'t think it was possible. Magic workers!' },
];

export default function Landing() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const jsonData = {};
    data.forEach((value, key) => {
      if (!key.startsWith('_') || key === '_subject' || key === '_captcha' || key === '_template') {
        jsonData[key] = value;
      }
    });
    jsonData['_subject'] = 'Landing Page Quote - Wirral Carpet Cleaning';
    jsonData['_captcha'] = 'false';
    jsonData['_template'] = 'table';

    try {
      await fetch('https://formsubmit.co/ajax/contact@wirralcarpetcleaning.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
    } catch {
      // Submit anyway
    }
    setSubmitted(true);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary/95 to-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(4,167,235,0.15),_transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Wirral Carpet Cleaning" className="h-16 md:h-20 w-auto" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center leading-tight mb-4">
            Professional Carpet &amp; Upholstery Cleaning
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Across Merseyside &amp; Cheshire
            </span>
          </h1>

          <p className="text-gray-300 text-center text-lg max-w-2xl mx-auto mb-8">
            Expert cleaning for homes and businesses. We restore what others can't — serving
            Liverpool, Wirral, Chester and surrounding areas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/25"
            >
              Get a Free Quote
              <HiArrowRight className="w-5 h-5" />
            </a>
            <a
              href="tel:01519369664"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-xl text-lg font-semibold transition-all"
            >
              <HiPhone className="w-5 h-5" />
              0151 936 9664
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12 text-center">
            {[
              { icon: HiStar, value: '5★', label: 'Rated' },
              { icon: HiClock, value: '15+', label: 'Years Exp.' },
              { icon: HiShieldCheck, value: '100%', label: 'Guaranteed' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-xl font-bold text-white">{value}</span>
                </div>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Our <span className="text-primary">Services</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                  <ul className="space-y-1.5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheck className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Why Choose <span className="text-primary">Us</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: HiSparkles, title: 'Revive Your Carpets', text: 'Restore colour and softness — they\'ll look like new.' },
              { icon: HiShieldCheck, title: 'Protect Your Investment', text: 'Extend the life of carpets and furniture by years.' },
              { icon: HiClock, title: 'Fast & Reliable', text: 'On time, every time. Fast drying so you\'re back to normal quickly.' },
              { icon: HiStar, title: '5-Star Reviews', text: 'Trusted by 1,000+ customers across Merseyside & Cheshire.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            What Our <span className="text-primary">Customers Say</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{review.text}"</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {review.name} <span className="font-normal text-gray-400">— {review.location}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="py-14 md:py-20 bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Free Quote</span>
          </h2>
          <p className="text-gray-400 text-center mb-8">
            No obligation. We typically respond within 2 hours.
          </p>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <HiCheck className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quote Request Sent!</h3>
              <p className="text-gray-300">We'll be in touch shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-accent text-sm font-medium">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="Landing Page Quote - Wirral Carpet Cleaning" />
              <input type="text" name="_honey" style={{ display: 'none' }} />

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                />
                <select
                  name="service"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                >
                  <option value="domestic" className="bg-gray-800">Domestic Cleaning</option>
                  <option value="upholstery" className="bg-gray-800">Upholstery Cleaning</option>
                  <option value="biohazard" className="bg-gray-800">Biohazard Cleaning</option>
                  <option value="commercial" className="bg-gray-800">Commercial Carpet Cleaning</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <textarea
                name="message"
                rows={3}
                required
                placeholder="Tell us about your needs..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                Get My Free Quote
                <HiArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Wirral Carpet Cleaning" className="h-8 w-auto" />
            <span className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Wirral Carpet Cleaning Limited</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:01519369664" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <HiPhone className="w-4 h-4" />
              0151 936 9664
            </a>
            <a href="mailto:contact@wirralcarpetcleaning.com" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
              <HiMail className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
