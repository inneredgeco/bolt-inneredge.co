import { Mic } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

export function PodcastGuestPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Be a Guest on the Inner Edge Podcast - Share Your Wisdom"
        description="Join the Inner Edge Podcast as a guest. Share your coaching expertise and guide men through transformational embodiment practices. Apply to be featured."
        keywords="podcast guest, mens coaching podcast, embodiment practices, transformational coaching, inner edge podcast guest"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/podcast-guest"
        ogUrl="https://www.inneredge.co/podcast-guest"
      />
      <Header />

      <div className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Podcast Guest Application
          </p>
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Be a Podcast Guest
          </h1>
          <p className="text-xl text-brand-700 max-w-2xl mx-auto">
            Share Your Wisdom, Connect with Men Ready to Transform
          </p>
        </div>
      </div>

      <div className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">
                About the Podcast
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  The Inner Edge Podcast features coaches, facilitators, and thought leaders who are dedicated to supporting men in their journey of transformation. We believe true change happens through presence, embodiment, and lived experience—not just theory.
                </p>
                <p>
                  Each conversation goes beyond traditional interviews. We create space for authentic dialogue about the inner work that transforms men—helping them reconnect with their body, intuition, and purpose.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">
                What Makes This Different
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  This isn't just another interview. During your podcast conversation, you'll lead a 10-15 minute practical exercise—something listeners can experience directly. We move people from conversation into transformation.
                </p>
                <p>
                  So much of today's content is talk without action. Our goal is to create episodes that help men integrate what they learn through embodied practice, not just intellectual understanding.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">
                Recording Format
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  At this time, we only record in-person video sessions at our studio in San Diego, California. This allows us to create the most authentic, grounded conversations and capture the energy of being in the same space together.
                </p>
                <p>
                  The podcast is recorded in video format for YouTube and other platforms, with audio versions distributed to all major podcast platforms (Spotify, Apple Podcasts, etc.).
                </p>
                <p>
                  If you're traveling to San Diego or are local to the area, we'd love to have you on the show.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-10">
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                What to Expect
              </h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>A 60-90 minute in-person video conversation in San Diego, CA about your work, philosophy, and journey</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Opportunity to guide listeners through a practical exercise or embodiment practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Your episode will be published publicly and promoted to our audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>A featured 1-hour live session for the Inner Edge Men's Community members</span>
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">
                Who This Is For
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed mb-6">
                <p>
                  We're looking for coaches and facilitators who:
                </p>
              </div>
              <ul className="space-y-3 text-stone-600 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Understand that transformation happens through presence and embodiment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Create safe containers where men feel seen, challenged, and supported</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Value collaboration over competition and authenticity over performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-500 font-bold mt-1">•</span>
                  <span>Want to serve men who are ready to do deep inner work</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  Ready to Connect?
                </h3>
                <p className="text-stone-600 mb-6">
                  Fill out the application form below and we'll be in touch within 3-5 business days.
                </p>
                <a
                  href="/podcast-guest-form"
                  className="inline-flex items-center gap-2 bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition-all hover:scale-105"
                >
                  Apply to Be a Guest
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
