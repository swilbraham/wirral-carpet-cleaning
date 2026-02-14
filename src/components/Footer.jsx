import { Link } from 'react-router-dom';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import logo from '../assets/logo.png';

const quickLinks = [
  { name: 'Carpet Cleaning', href: '#services' },
  { name: 'Upholstery Cleaning', href: '#services' },
  { name: 'Commercial Cleaning', href: '#services' },
  { name: 'Biohazard Cleaning', href: '#services' },
];

const companyLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'How It Works', href: '#process' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'Get a Quote', href: '#contact' },
];

const areas = [
  'Liverpool', 'Wirral', 'Chester', 'Birkenhead', 'Wallasey',
  'Southport', 'St Helens', 'Warrington', 'Ellesmere Port',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="Wirral Carpet Cleaning" className="h-10 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm leading-relaxed mb-6">
              Professional carpet, upholstery and biohazard cleaning for homes and
              businesses across Merseyside and Cheshire.
            </p>
            <div className="space-y-3">
              <a href="tel:01519369664" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <HiPhone className="w-4 h-4 text-accent" />
                0151 936 9664
              </a>
              <a href="mailto:contact@wirralcarpetcleaning.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <HiMail className="w-4 h-4 text-accent" />
                contact@wirralcarpetcleaning.com
              </a>
              <div className="flex items-center gap-2 text-sm">
                <HiLocationMarker className="w-4 h-4 text-accent" />
                Merseyside &amp; Cheshire
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-white font-semibold mb-4">Areas Covered</h4>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-1 rounded-md bg-gray-800 text-xs text-gray-400"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Wirral Carpet Cleaning Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <p className="text-xs text-gray-500">
              Serving Merseyside &amp; Cheshire with professional cleaning services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
