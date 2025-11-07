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
    <section id="about" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              This Isn't for Everyone
            </h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
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
              <p className="text-accent font-semibold text-xl">
                The question is: Are you ready to do what it takes?
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-800 p-10 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">What Makes This Different</h3>
            <div className="space-y-4">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span className="text-gray-300 text-lg leading-relaxed">{principle}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-gray-700">
              <p className="text-gray-400 italic">
                "The only way out is through. And I'll be there with you every step of the way."
              </p>
              <p className="text-white font-semibold mt-3">— Soleiman Bolour</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            Ready to learn more about our approach?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition-all hover:scale-105"
            >
              About Inner Edge
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
