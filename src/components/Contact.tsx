import { useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function Contact() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.lessannoyingcrm.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://embed.lessannoyingcrm.com/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Contact Inner Edge - Get in Touch"
        description="Ready to start your transformation? Contact Inner Edge today for mens coaching, personal development, and life-changing support. Based in San Diego, CA."
        keywords="contact mens coach, get coaching help, mens life coach contact, coaching inquiry, book coaching session"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/contact"
        ogUrl="https://www.inneredge.co/contact"
      />
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl">
            Ready to start your transformation? Have questions? We're here to help.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <blockquote
                className="lacrm-embed"
                data-embed-height="650"
                data-embed-show-header="false"
              >
                <a href="https://forms.lessannoyingcrm.com/view/4047589812937929810144110751004">
                  Contact Us - Inner Edge
                </a>
              </blockquote>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  We're committed to helping you achieve your goals. Reach out to us and let's start your journey together.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-brand-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                    <a href="tel:+13102662677" className="text-slate-600 hover:text-brand-500 transition-colors">
                      310-266-2677
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-brand-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <a href="mailto:contact@inneredge.co" className="text-slate-600 hover:text-brand-500 transition-colors">
                      contact@inneredge.co
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-brand-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Location</h3>
                    <p className="text-slate-600">
                      San Diego, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
