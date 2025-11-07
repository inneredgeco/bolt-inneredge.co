import { Linkedin, Instagram, Facebook, Youtube, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const handleNavigation = (path: string) => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-8">
          {/* Brand */}
          <div>
            <a href="/" className="block mb-4">
              <img
                src="https://inner-edge-audio-files.b-cdn.net/Inner%20Edge%20Main.png"
                alt="InnerEdge"
                className="h-auto max-w-[140px]"
              />
            </a>
            <p className="text-white/80 leading-relaxed">
              Empowering men to break through limitations and build lives of purpose, confidence, and impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" onClick={() => handleNavigation('/about')} className="text-white/80 hover:text-accent-300 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/blog" onClick={() => handleNavigation('/blog')} className="text-white/80 hover:text-accent-300 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/podcast" onClick={() => handleNavigation('/podcast')} className="text-white/80 hover:text-accent-300 transition-colors">Podcast</Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => handleNavigation('/contact')} className="text-white/80 hover:text-accent-300 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="tel:+13102662677"
                className="flex items-center gap-2 text-white/80 hover:text-accent-300 transition-colors"
              >
                <Phone size={16} />
                <span className="text-sm">310-266-2677</span>
              </a>
              <p className="flex items-start gap-2 text-sm text-white/80">
                <Mail size={16} className="mt-0.5" />
                <span>San Diego, CA<br />Virtual Sessions Available</span>
              </p>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/soleimanbolour"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/soleimanbolour"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.youtube.com/@SoleimanBolour"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/soleimanbolour/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@soleimanb"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/80">
            © 2025 InnerEdge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy-policy" className="text-white/80 hover:text-accent-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
