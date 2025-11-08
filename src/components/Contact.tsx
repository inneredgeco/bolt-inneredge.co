import { Mail, MapPin, Phone } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { ContactForm } from './ContactForm';

export function Contact() {

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        pagePath="/contact"
        fallbackTitle="Contact Inner Edge - Get in Touch"
        fallbackDescription="Ready to start your transformation? Contact Inner Edge today for mens coaching, personal development, and life-changing support. Based in San Diego, CA."
        fallbackOgImage="https://cdn.inneredge.co/og-images/home-ie-open-graph.png"
        canonical="https://inneredge.co/contact"
      />
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        {/* Soft Abstract Gradient Shapes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 w-[800px] h-[800px]" style={{
            background: 'radial-gradient(circle at center, rgba(138, 214, 206, 0.15) 0%, transparent 60%)',
            filter: 'blur(100px)',
            transform: 'translate(-30%, -20%)'
          }}></div>
          <div className="absolute right-0 bottom-0 w-[1000px] h-[1000px]" style={{
            background: 'radial-gradient(circle at center, rgba(107, 201, 191, 0.2) 0%, rgba(138, 214, 206, 0.1) 40%, transparent 70%)',
            filter: 'blur(120px)',
            transform: 'translate(20%, 30%)'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Connect With Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-brand-700 max-w-3xl">
            Ready to start your transformation? Have questions? We're here to help.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg">
              <ContactForm />
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
      <Footer />
    </div>
  );
}
