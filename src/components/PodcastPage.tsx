import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { SEOHead } from './SEOHead';
import { Footer } from './Footer';
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
        .order('created_at', { ascending: false })
        .limit(8);

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

      <section className="relative overflow-hidden py-24 md:py-32" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        {/* Soft Abstract Gradient Shapes */}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
              Deep Conversations
            </p>
            <Mic className="w-20 h-20 mx-auto mb-8 text-brand-600" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              The Inner Edge Podcast
            </h1>
            <p className="text-xl md:text-2xl text-brand-700 mb-12 leading-relaxed">
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
                href="https://www.youtube.com/@SoleimanBolour"
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
                src="https://cdn.inneredge.co/guests/headshots/soleiman-bolour-1762304576351.jpg"
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
                    Coach, Facilitator, and Community Founder
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
                      className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                    >
                      <div className="p-6 text-center">
                        <div className="mb-4">
                          <img
                            src={guest.photo_url}
                            alt={guest.full_name}
                            className="w-[150px] h-[150px] rounded-full object-cover mx-auto border-4 border-stone-100 group-hover:border-teal-200 transition-colors"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/150x150/e7e5e4/78716c?text=' + guest.first_name.charAt(0);
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">
                          {guest.full_name}
                        </h3>
                        <p className="text-sm text-teal-600 font-semibold">
                          {guest.profession}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/guests"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  View All Guests
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 w-[500px] h-[500px]" style={{
            background: 'radial-gradient(circle at center, rgba(138, 214, 206, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
            transform: 'translate(-20%, -20%)'
          }}></div>
          <div className="absolute right-0 bottom-0 w-[600px] h-[600px]" style={{
            background: 'radial-gradient(circle at center, rgba(107, 201, 191, 0.2) 0%, rgba(138, 214, 206, 0.1) 40%, transparent 70%)',
            filter: 'blur(100px)',
            transform: 'translate(20%, 20%)'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Want to be a guest?
          </h2>
          <p className="text-xl text-brand-700 mb-8 max-w-2xl mx-auto">
            Share your wisdom and connect with men ready to transform. We're looking for coaches, facilitators, and thought leaders with unique perspectives on personal growth.
          </p>
          <Link
            to="/podcast-guest"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-full hover:bg-brand-700 font-bold transition-all hover:scale-105 shadow-lg"
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
