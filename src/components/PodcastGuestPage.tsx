import { Mic } from 'lucide-react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function PodcastGuestPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Be a Podcast Guest - Share Your Story on Inner Edge Podcast"
        description="Share your transformation story on the Inner Edge Podcast. Connect with men seeking growth and inspire others through your journey of personal development."
        keywords="podcast guest, mens podcast, personal development podcast, transformation story, inner edge podcast guest"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/podcast-guest"
        ogUrl="https://www.inneredge.co/podcast-guest"
      />
      <Header />

      <div className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-200" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Be a Podcast Guest
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Share your story on the Inner Edge Podcast
          </p>
        </div>
      </div>

      <div className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">
                Your Story Matters
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  The Inner Edge Podcast is a space where men share authentic stories of transformation,
                  growth, and breaking through limitations.
                </p>
                <p>
                  Whether you've overcome adversity, discovered your purpose, or learned valuable lessons
                  on your journey, your story has the power to inspire others.
                </p>
                <p>
                  We're looking for guests who are willing to speak openly about their experiences and
                  contribute to a conversation that helps men live with more depth, purpose, and connection.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-8 rounded-xl border border-stone-200">
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                What We'll Explore Together
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Your personal journey and transformation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Challenges you've overcome and lessons learned</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Insights that could help other men on their path</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Your unique perspective on growth and self-discovery</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  Ready to Share Your Story?
                </h3>
                <p className="text-stone-600 mb-6">
                  The application form will be available here soon. In the meantime, feel free to reach out directly.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition-all hover:scale-105"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
