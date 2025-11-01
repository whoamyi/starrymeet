import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [allExpanded, setAllExpanded] = useState(true);

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Team', href: '/team' },
        { label: 'Careers', href: '/jobs' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/faq' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Shop',
      links: [
        { label: 'Gift Cards', href: '/browse' },
        { label: 'For Business', href: '/for-celebrities' },
        { label: 'For Kids', href: '/browse' },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Social Links */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <a
            href="#"
            className="text-gray-400 hover:text-white text-sm transition"
            aria-label="Download on App Store"
          >
            App Store
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white text-sm transition"
            aria-label="Get it on Google Play"
          >
            Google Play
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white text-sm transition"
            aria-label="Instagram"
          >
            IG
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white text-sm transition"
            aria-label="TikTok"
          >
            TT
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white text-sm transition"
            aria-label="Twitter/X"
          >
            X
          </a>
        </div>

        {/* Footer Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={toggleAll}
                className="w-full text-left font-semibold text-white mb-3 flex items-center justify-between md:cursor-default"
              >
                <span>{section.title}</span>
                <svg
                  className={`w-4 h-4 transition-transform md:hidden ${
                    allExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={`flex flex-col gap-2 ${
                  allExpanded ? 'block' : 'hidden md:flex'
                }`}
              >
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Locale Selector */}
        <div className="flex justify-center mb-8">
          <button className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2">
            <span>🌐</span>
            <span>EN | United States | $ USD</span>
          </button>
        </div>

        {/* Legal */}
        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400">
          <span>© 2025 StarryMeet</span>
          <Link to="/terms" className="hover:text-white transition">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
