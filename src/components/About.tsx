import { CheckCircle2 } from 'lucide-react';

const principles = [
  'No fluff, no theory—just proven strategies that work',
  'Accountability that pushes you beyond your comfort zone',
  'A focus on action, not just awareness',
  'Holistic transformation: mind, body, and spirit',
  'A judgment-free space to be vulnerable and grow',
  'Tools and frameworks you can use for life',
];

export function About() {
  return (
    <section id="about" className="py-16 md:py-20" style={{ background: '#2d7471' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - 3 columns */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <span className="text-sm font-heading font-semibold tracking-wide uppercase px-4 py-2 bg-white/10 rounded-full" style={{ color: '#8ad6ce' }}>
                A Different Approach
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-8 text-white leading-tight">
              This Isn't for Everyone
            </h2>
            <div className="space-y-6 text-lg font-body text-white/90 leading-relaxed">
              <p>
                Let's be honest: most men are sleepwalking through life. Going through the motions.
                Playing it safe. Waiting for something to change.
              </p>
              <p>
                But you're different. You're here because you know there's more. You're ready to stop
                making excuses and start making moves.
              </p>
              <p>
                This program is for men who are done with mediocrity. Who are ready to face their fears,
                challenge their limitations, and build the life they actually want—not the one they settled for.
              </p>
              <p className="text-accent font-heading font-semibold text-xl">
                The question is: Are you ready to do what it takes?
              </p>
            </div>
          </div>

          {/* Right Column - 2 columns */}
          <div className="lg:col-span-2 card-hover bg-white p-8 md:p-10 rounded-lg">
            <h3 className="text-2xl font-heading font-bold mb-6" style={{ color: '#1a1a1a' }}>What Makes This Different</h3>
            <div className="space-y-4">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: '#2d7471' }} className="flex-shrink-0 mt-1" size={20} />
                  <span className="font-body leading-relaxed" style={{ color: '#4a4a4a' }}>{principle}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-stone-200">
              <p className="font-body italic" style={{ color: '#4a4a4a' }}>
                "The only way out is through. And I'll be there with you every step of the way."
              </p>
              <p className="font-heading font-semibold mt-3" style={{ color: '#1a1a1a' }}>— Soleiman Bolour</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-body text-white/90 mb-6 text-lg">
            Ready to learn more about our approach?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-block bg-white px-8 py-4 rounded-full font-heading font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ color: '#2d7471' }}
            >
              About Inner Edge
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-md font-heading font-semibold transition-all duration-200 hover:bg-white"
              style={{ '&:hover': { color: '#2d7471' } }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
