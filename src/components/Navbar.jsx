import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiPhone } from 'react-icons/hi';
import logo from '../assets/logo.png';

const navLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'Prices', href: '/#calculator' },
  { name: 'How It Works', href: '/#process' },
  { name: 'Reviews', href: '/#testimonials' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On non-home pages, always show scrolled (white) navbar
  const showWhiteNav = scrolled || !isHome;

  const handleNavClick = (e, href) => {
    setMobileOpen(false);
    if (isHome && href.startsWith('/#')) {
      e.preventDefault();
      const el = document.querySelector(href.replace('/', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showWhiteNav
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="Wirral Carpet Cleaning"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showWhiteNav
                    ? 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:01519369664"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showWhiteNav
                  ? 'text-primary hover:bg-primary/5'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <HiPhone className="w-4 h-4" />
              0151 936 9664
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, '/#contact')}
              className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              showWhiteNav ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <a
                  href="tel:01519369664"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold"
                >
                  <HiPhone className="w-5 h-5" />
                  Call 0151 936 9664
                </a>
                <a
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, '/#contact')}
                  className="block text-center w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold"
                >
                  Get a Free Quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
