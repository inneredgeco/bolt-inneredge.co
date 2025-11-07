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
    <section id="about" className="py-20 md:py-32 bg-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - 3 columns */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <span className="text-sm font-heading font-semibold tracking-wide uppercase text-accent px-4 py-2 bg-white/10 rounded-full">
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
          <div className="lg:col-span-2 card-hover bg-white p-8 md:p-10 rounded-xl">
            <h3 className="text-2xl font-heading font-bold mb-6 text-dark">What Makes This Different</h3>
            <div className="space-y-4">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand flex-shrink-0 mt-1" size={20} />
                  <span className="font-body text-dark-medium leading-relaxed">{principle}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-stone-200">
              <p className="font-body text-dark-medium italic">
                "The only way out is through. And I'll be there with you every step of the way."
              </p>
              <p className="font-heading text-dark font-semibold mt-3">— Soleiman Bolour</p>
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
              className="inline-block bg-white text-brand px-8 py-4 rounded-full font-heading font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              About Inner Edge
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-md font-heading font-semibold transition-all duration-200 hover:bg-white hover:text-brand"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
