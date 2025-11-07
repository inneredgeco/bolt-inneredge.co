import { ArrowRight, Calendar, MessageCircle, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Calendar,
    title: 'Book a Call',
    description: 'Schedule a free 45-minute discovery session',
  },
  {
    icon: MessageCircle,
    title: 'Get Clear',
    description: "We'll discuss your goals and create your custom roadmap",
  },
  {
    icon: Rocket,
    title: 'Start Transforming',
    description: 'Begin your transformation journey from the inside out',
  },
];

export function CTA() {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate('/booking');
    window.scrollTo(0, 0);
  };

  return (
    <section id="cta" className="py-16 md:py-20" style={{ background: '#2d7471' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="text-sm font-heading font-semibold tracking-wide uppercase px-4 py-2 bg-white/10 rounded-full" style={{ color: '#8ad6ce' }}>
              Take the First Step
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">
            Your Next Chapter Starts Now
          </h2>
          <p className="text-xl font-body text-white/90 max-w-3xl mx-auto">
            Stop waiting for the perfect moment. Stop making excuses. The time is now.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <Icon style={{ color: '#2d7471' }} size={32} />
                </div>
                <div className="text-2xl font-heading font-bold text-white mb-2">{step.title}</div>
                <p className="font-body text-white/90">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleBookingClick}
            className="group bg-white px-12 py-5 rounded-full font-heading font-bold text-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-3 shadow-2xl hover:shadow-3xl"
            style={{ color: '#2d7471' }}
          >
            Book Your Free Discovery Call
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </button>
          <p className="font-body text-white/90 mt-6 text-sm">
            No pressure. No sales pitch. Just an honest conversation about where you are and where you want to be.
          </p>
        </div>

      </div>
    </section>
  );
}
