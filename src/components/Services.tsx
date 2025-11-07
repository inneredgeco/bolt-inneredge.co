import { Target, Users, Zap, Brain, Heart, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: Target,
    title: 'Clarity & Direction',
    description: 'Break through the fog. Define your vision, set authentic goals, and create a roadmap that actually excites you.',
  },
  {
    icon: Brain,
    title: 'Mindset Mastery',
    description: 'Rewire limiting beliefs. Build unshakeable confidence. Develop the mental resilience of high performers.',
  },
  {
    icon: Heart,
    title: 'Emotional Intelligence',
    description: 'Master your emotions instead of being controlled by them. Build deeper connections and stronger relationships.',
  },
  {
    icon: Zap,
    title: 'Peak Performance',
    description: 'Optimize your energy, health, and productivity. Show up as your best self every single day.',
  },
  {
    icon: Users,
    title: 'Leadership Development',
    description: 'Lead with authenticity and purpose. Inspire others while staying true to your values.',
  },
  {
    icon: TrendingUp,
    title: 'Sustainable Growth',
    description: 'Build lasting change through proven systems. No quick fixes—real transformation that sticks.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transform Every Area of Your Life
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A holistic approach to transformation—confident, purpose-driven, and unstoppable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                  <Icon className="text-brand-500 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
