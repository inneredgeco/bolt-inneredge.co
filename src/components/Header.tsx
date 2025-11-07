import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <img
              src="https://inner-edge-audio-files.b-cdn.net/Inner%20Edge%20Main.png"
              alt="Inner Edge Logo"
              className="h-auto max-w-[180px] sm:max-w-[200px]"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-slate-700 hover:text-brand-500 transition-colors font-medium">
              About
            </Link>
            <Link to="/blog" className="text-slate-700 hover:text-brand-500 transition-colors font-medium">
              Blog
            </Link>
            <Link to="/podcast" className="text-slate-700 hover:text-brand-500 transition-colors font-medium">
              Podcast
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-brand-500 transition-colors font-medium">
              Contact
            </Link>
            <a
              href="https://www.skool.com/inner-edge-1237"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-600 transition-all hover:scale-105"
            >
              Login
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/about"
              className="block w-full text-left text-slate-700 hover:text-brand-500 py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/blog"
              className="block w-full text-left text-slate-700 hover:text-brand-500 py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/podcast"
              className="block w-full text-left text-slate-700 hover:text-brand-500 py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Podcast
            </Link>
            <Link
              to="/contact"
              className="block w-full text-left text-slate-700 hover:text-brand-500 py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href="https://www.skool.com/inner-edge-1237"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-brand-500 text-white px-6 py-2.5 rounded-full font-semibold mt-4"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
