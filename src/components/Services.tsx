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
    <section id="services" className="py-16 md:py-20" style={{ background: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-sm font-heading font-semibold tracking-wide uppercase px-4 py-2 rounded-full" style={{ color: '#2d7471', background: '#a8e0da' }}>
              What You'll Achieve
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
            Transform Every Area of Your Life
          </h2>
          <p className="text-xl font-body" style={{ color: '#4a4a4a' }}>
            A holistic approach to transformation—confident, purpose-driven, and unstoppable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="card-hover bg-white p-8 rounded-lg border border-stone-200"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ background: '#2d7471' }}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3" style={{ color: '#1a1a1a' }}>
                  {service.title}
                </h3>
                <p className="font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
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
