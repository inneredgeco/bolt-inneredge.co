import { Mail, MapPin, Phone } from 'lucide-react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';
import { ContactForm } from './ContactForm';

export function Contact() {

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
      <div className="py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #f0f7f6 0%, #d9eeec 25%, #c4e3e0 50%, #b8d4d2 75%, #8ad6ce 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Get in Touch
          </h1>
          <p className="text-xl font-body max-w-3xl" style={{ color: '#4a4a4a' }}>
            Ready to start your transformation? Have questions? We're here to help.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg border" style={{ borderColor: '#e5e7eb' }}>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6" style={{ color: '#1a1a1a' }}>
                  Contact Information
                </h2>
                <p className="font-body mb-8 leading-relaxed" style={{ color: '#4a4a4a' }}>
                  We're committed to helping you achieve your goals. Reach out to us and let's start your journey together.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#a8e0da' }}>
                    <Phone style={{ color: '#2d7471' }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1" style={{ color: '#1a1a1a' }}>Phone</h3>
                    <a href="tel:+13102662677" className="font-body transition-colors" style={{ color: '#4a4a4a' }}>
                      310-266-2677
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#a8e0da' }}>
                    <Mail style={{ color: '#2d7471' }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1" style={{ color: '#1a1a1a' }}>Email</h3>
                    <a href="mailto:contact@inneredge.co" className="font-body transition-colors" style={{ color: '#4a4a4a' }}>
                      contact@inneredge.co
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#a8e0da' }}>
                    <MapPin style={{ color: '#2d7471' }} size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1" style={{ color: '#1a1a1a' }}>Location</h3>
                    <p className="font-body" style={{ color: '#4a4a4a' }}>
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
