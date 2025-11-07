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
    <section id="transformation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Real Men. Real Results.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These aren't overnight transformations. They're the result of commitment, courage, and doing the work.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-teal-100"
            >
              <Quote className="text-teal-600 mb-4" size={32} />

              <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-teal-200 pt-6">
                <div className="font-bold text-gray-900">{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
