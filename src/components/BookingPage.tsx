import { useEffect } from 'react';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function BookingPage() {
  useEffect(() => {
    document.title = 'Book Your Free Discovery Call - Inner Edge';

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Book Your Free Discovery Call - Inner Edge Mens Coaching"
        description="Schedule your free 45-minute discovery call with Inner Edge. No pressure, no obligation. Explore how mens coaching can help you unlock your potential."
        keywords="book mens coach, free discovery call, mens coaching consultation, schedule coaching session, free mens coaching call"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/booking"
        ogUrl="https://www.inneredge.co/booking"
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Start Your Journey
          </p>
          <Calendar className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Ready to Transform Your Life?
          </h1>
          <p className="text-xl sm:text-2xl text-brand-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Book a free discovery call and let's explore how we can work together
            to unlock your full potential.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            What to Expect on Your Call
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="text-brand-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                45-Minute Session
              </h3>
              <p className="text-slate-600 leading-relaxed">
                A focused conversation designed to understand your goals, challenges,
                and where you want to be.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                <Video className="text-brand-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Virtual Meeting
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Connect from anywhere via video call. Comfortable, convenient,
                and completely confidential.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-brand-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                No Pressure
              </h3>
              <p className="text-slate-600 leading-relaxed">
                This is about you. We'll discuss if working together is the right
                fit, with zero obligation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div id="booking-form" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Book Your Discovery Call
              </h2>
              <p className="text-lg text-slate-600">
                Select a date and time that works best for you
              </p>
            </div>

            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/soleimanbolour/discoverycall?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=2d7471"
              style={{ minWidth: '320px', height: '700px' }}
            ></div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Is this really free?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! This discovery call is completely free with no strings attached.
                It's an opportunity for us to connect and see if we're a good fit to
                work together.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                What if I'm not sure if coaching is right for me?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                That's exactly what this call is for. We'll discuss your situation and
                goals, and I'll help you determine whether coaching would be valuable
                for you right now.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How should I prepare for the call?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Just come as you are. Think about what's been challenging you and what
                you'd like to change. We'll take it from there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
