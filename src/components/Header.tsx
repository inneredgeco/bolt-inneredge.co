import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            <img
              src="https://inner-edge-audio-files.b-cdn.net/Inner%20Edge%20Main.png"
              alt="Inner Edge Logo"
              className="h-auto max-w-[200px] sm:max-w-[220px]"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/about"
              className={`relative font-heading text-dark-medium hover:text-brand transition-colors font-semibold group ${
                isActive('/about') ? 'text-brand' : ''
              }`}
            >
              About
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transition-transform origin-left ${
                isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link
              to="/blog"
              className={`relative font-heading text-dark-medium hover:text-brand transition-colors font-semibold group ${
                isActive('/blog') ? 'text-brand' : ''
              }`}
            >
              Blog
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transition-transform origin-left ${
                isActive('/blog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link
              to="/podcast"
              className={`relative font-heading text-dark-medium hover:text-brand transition-colors font-semibold group ${
                isActive('/podcast') ? 'text-brand' : ''
              }`}
            >
              Podcast
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transition-transform origin-left ${
                isActive('/podcast') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link
              to="/contact"
              className={`relative font-heading text-dark-medium hover:text-brand transition-colors font-semibold group ${
                isActive('/contact') ? 'text-brand' : ''
              }`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transition-transform origin-left ${
                isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <a
              href="https://www.skool.com/inner-edge-1237"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Login
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-dark-medium hover:text-brand transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/about"
              className={`block w-full text-left font-heading py-2 font-semibold transition-colors ${
                isActive('/about') ? 'text-brand' : 'text-dark-medium hover:text-brand'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/blog"
              className={`block w-full text-left font-heading py-2 font-semibold transition-colors ${
                isActive('/blog') ? 'text-brand' : 'text-dark-medium hover:text-brand'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/podcast"
              className={`block w-full text-left font-heading py-2 font-semibold transition-colors ${
                isActive('/podcast') ? 'text-brand' : 'text-dark-medium hover:text-brand'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Podcast
            </Link>
            <Link
              to="/contact"
              className={`block w-full text-left font-heading py-2 font-semibold transition-colors ${
                isActive('/contact') ? 'text-brand' : 'text-dark-medium hover:text-brand'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href="https://www.skool.com/inner-edge-1237"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center btn-primary mt-4"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
