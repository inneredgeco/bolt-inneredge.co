import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Richard K.',
    quote: "Soleiman has a gift for creating spaces where individuals feel comfortable to encounter themselves in ways that may otherwise feel intimidating.",
  },
  {
    name: 'Sprout B.',
    quote: "I have had the distinct pleasure of working with Soleiman, a remarkable Men's Transformational Coach whose expertise has profoundly influenced my personal development. His deep insights, unwavering support, and patient demeanor create a safe and nurturing environment, conducive to deep personal growth.",
  },
  {
    name: 'Jeff H.',
    quote: "I have had the opportunity to be a part of Soleiman's workshops and one on one coaching for several years and have found his dedication to teaching and sharing his knowledge engaging for self growth. When sharing, Soleiman listens patiently with intent. You feel listened to and heard, with his responses catered to you.",
  },
];

export function Transformation() {
  return (
    <section id="transformation" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Real Men. Real Results.
          </h2>
          <p className="text-xl font-body max-w-3xl mx-auto" style={{ color: '#4a4a4a' }}>
            These aren't overnight transformations. They're the result of commitment, courage, and doing the work.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg card-hover border" style={{ borderColor: '#e5e7eb' }}
            >
              <Quote style={{ color: '#8ad6ce' }} className="mb-4" size={32} />

              <p className="font-body text-lg mb-6 leading-relaxed italic" style={{ color: '#4a4a4a' }}>
                "{testimonial.quote}"
              </p>

              <div className="border-t pt-6" style={{ borderColor: '#e5e7eb' }}>
                <div className="font-heading font-bold" style={{ color: '#1a1a1a' }}>{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
