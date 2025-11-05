import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';
import { Mic, ArrowRight, Play, Music2, Users } from 'lucide-react';

interface Guest {
  id: string;
  slug: string;
  full_name: string;
  first_name: string;
  profession: string;
  short_bio: string;
  photo_url: string;
  episode_title: string | null;
  status: string;
}

export function PodcastPage() {
  const [featuredGuests, setFeaturedGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedGuests();
  }, []);

  async function fetchFeaturedGuests() {
    try {
      const { data, error } = await supabase
        .from('podcast_guests')
        .select('id, slug, full_name, first_name, profession, short_bio, photo_url, episode_title, status')
        .eq('status', 'Published')
        .not('episode_title', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedGuests(data || []);
    } catch (error) {
      console.error('Error fetching featured guests:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Podcast - Inner Edge"
        description="Deep conversations about men's transformation, personal development, and authentic living. Featuring coaches and thought leaders exploring what it means to live with purpose and presence."
        keywords="inner edge podcast, mens transformation podcast, personal development podcast, coaching podcast, authentic living"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/podcast"
        ogUrl="https://www.inneredge.co/podcast"
      />
      <Header />

      <section className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Mic className="w-20 h-20 mx-auto mb-8 text-brand-200" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              The Inner Edge Podcast
            </h1>
            <p className="text-xl md:text-2xl text-brand-100 mb-12 leading-relaxed">
              Conversations with coaches and thought leaders exploring men's transformation, personal development, and authentic living
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://open.spotify.com/show/your-spotify-id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#1DB954] text-white rounded-full font-semibold hover:bg-[#1ed760] transition-all hover:scale-105 shadow-lg"
              >
                <Music2 className="w-5 h-5" />
                Listen on Spotify
              </a>
              <a
                href="https://podcasts.apple.com/podcast/your-apple-id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FA57C1] to-[#B14FE0] text-white rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Listen on Apple Podcasts
              </a>
              <a
                href="https://youtube.com/@inneredge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF0000] text-white rounded-full font-semibold hover:bg-[#cc0000] transition-all hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
              <img
                src="/soleiman-portrait.jpg"
                alt="Soleiman Bolour - Host"
                className="w-64 h-64 rounded-full object-cover mx-auto shadow-2xl border-4 border-stone-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/256x256/14b8a6/ffffff?text=SB';
                }}
              />
            </div>

            <div className="lg:w-2/3">
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                About the Podcast
              </h2>
              <div className="space-y-4 text-lg text-stone-700 leading-relaxed">
                <p>
                  The Inner Edge Podcast features deep conversations with coaches, facilitators, and thought leaders who are dedicated to supporting men in their journey of transformation. Each episode goes beyond surface-level advice, diving into the inner work that creates lasting change.
                </p>
                <p>
                  We explore topics like emotional intelligence, masculine energy, relationships, purpose, and what it truly means to live with integrity and presence. Every guest brings a unique perspective and leads listeners through practical exercises they can apply immediately.
                </p>
                <p>
                  Whether you're navigating a major life transition, seeking deeper meaning, or simply curious about personal growth, these conversations will challenge and inspire you to discover your inner edge.
                </p>
                <div className="pt-4">
                  <p className="font-semibold text-stone-900">
                    Hosted by Soleiman Bolour
                  </p>
                  <p className="text-stone-600">
                    Men's Coach & Facilitator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Featured Guests
            </h2>
            <p className="text-xl text-stone-600">
              Coaches and thought leaders who have shared their wisdom
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-stone-600">Loading guests...</p>
            </div>
          ) : featuredGuests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-stone-400" />
              <p className="text-xl text-stone-600">
                Featured guests coming soon!
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto pb-8 -mx-4 px-4">
                <div className="flex gap-6 min-w-max">
                  {featuredGuests.map((guest) => (
                    <Link
                      key={guest.id}
                      to={`/guests/${guest.slug}`}
                      className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                    >
                      <div className="p-6 text-center">
                        <div className="mb-4">
                          <img
                            src={guest.photo_url}
                            alt={guest.full_name}
                            className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-stone-100 group-hover:border-teal-200 transition-colors"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/160x160/e7e5e4/78716c?text=' + guest.first_name.charAt(0);
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">
                          {guest.full_name}
                        </h3>
                        <p className="text-sm text-teal-600 font-semibold mb-3">
                          {guest.profession}
                        </p>
                        <p className="text-sm text-stone-600 line-clamp-3 mb-4">
                          {guest.short_bio}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                          <span className="text-sm">View Profile</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/guests"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  View All Guests
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Recent Episodes
            </h2>
            <p className="text-xl text-stone-600 mb-8">
              Coming Soon
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-stone-50 rounded-2xl p-12 border border-stone-200">
              <Mic className="w-16 h-16 mx-auto mb-6 text-teal-600" />
              <p className="text-xl text-stone-700 mb-8">
                Episodes coming soon! We're currently recording with amazing guests. Subscribe to be notified when we launch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://open.spotify.com/show/your-spotify-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold transition-colors"
                >
                  <Music2 className="w-5 h-5" />
                  Follow on Spotify
                </a>
                <a
                  href="https://podcasts.apple.com/podcast/your-apple-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Follow on Apple
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-teal-600" />
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Want to be a guest?
          </h2>
          <p className="text-xl text-stone-700 mb-8 max-w-2xl mx-auto">
            Share your wisdom and connect with men ready to transform. We're looking for coaches, facilitators, and thought leaders with unique perspectives on personal growth.
          </p>
          <Link
            to="/podcast-guest"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Apply to Be a Guest
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-stone-600 mb-8">
            Follow us for updates, behind-the-scenes content, and inspiration
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/inneredge.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 font-semibold transition-all hover:scale-105 shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>

            <a
              href="https://www.facebook.com/inneredge.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#0c63d4] font-semibold transition-all hover:scale-105 shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>

            <a
              href="https://www.linkedin.com/company/inneredge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] font-semibold transition-all hover:scale-105 shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
