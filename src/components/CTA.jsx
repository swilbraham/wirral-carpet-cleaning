import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi';

const contactInfo = [
  { icon: HiPhone, label: '0151 936 9664', href: 'tel:01519369664' },
  { icon: HiMail, label: 'contact@wirralcarpetcleaning.com', href: 'mailto:contact@wirralcarpetcleaning.com' },
  { icon: HiLocationMarker, label: 'Merseyside & Cheshire', href: null },
  { icon: HiClock, label: 'Mon–Sat: 8am – 6pm', href: null },
];

export default function CTA() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const jsonData = {};
    data.forEach((value, key) => {
      if (!key.startsWith('_')) jsonData[key] = value;
    });
    jsonData['_subject'] = 'New Quote Request - Wirral Carpet Cleaning';
    jsonData['_captcha'] = 'false';
    jsonData['_template'] = 'table';

    try {
      const res = await fetch('https://formsubmit.co/ajax/contact@wirralcarpetcleaning.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setSubmitted(true);
        form.reset();
      }
    } catch {
      setSubmitted(true);
      form.reset();
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-dark overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(4,167,235,0.08),_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Get Started Today
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Ready for Spotless
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Carpets &amp; Upholstery?
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Request your free, no-obligation quote today. We'll get back to you
            within hours — not days.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map(({ icon: Icon, label, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                {href ? (
                  <a href={href} className="text-gray-300 hover:text-white transition-colors">
                    {label}
                  </a>
                ) : (
                  <span className="text-gray-300">{label}</span>
                )}
              </div>
            ))}

            <div className="pt-6">
              <a
                href="tel:01519369664"
                className="group inline-flex items-center gap-3 px-6 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-accent/25 w-full justify-center sm:w-auto"
              >
                <HiPhone className="w-5 h-5" />
                Call Now: 0151 936 9664
              </a>
            </div>
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Quote Request Sent!</h3>
                  <p className="text-gray-300">
                    Thank you. We'll be in touch shortly with your free quote.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-accent hover:text-accent-light text-sm font-medium transition-colors"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="text" name="_honey" style={{ display: 'none' }} />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="07123 456789"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                        Service Required
                      </label>
                      <select
                        id="service"
                        name="service"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      >
                        <option value="domestic" className="bg-gray-800">Domestic Carpet Cleaning</option>
                        <option value="upholstery" className="bg-gray-800">Upholstery Cleaning</option>
                        <option value="commercial" className="bg-gray-800">Commercial Carpet Cleaning</option>
                        <option value="biohazard" className="bg-gray-800">Biohazard Cleaning</option>
                        <option value="other" className="bg-gray-800">Other / Multiple</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Tell Us About Your Needs
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="e.g. 3-bed house, living room and hallway carpets, pet stains..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-accent/25"
                  >
                    Get My Free Quote
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    No spam, no obligation. We typically respond within 2 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
