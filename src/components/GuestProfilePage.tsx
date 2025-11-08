import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Globe, Facebook, Instagram, Linkedin, Youtube, Music2, Play } from 'lucide-react';

interface Guest {
  id: string;
  slug: string;
  full_name: string;
  first_name: string;
  profession: string;
  short_bio: string;
  photo_url: string;
  pitch: string;
  exercise_description: string;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  guest_youtube_url: string | null;
  episode_title: string | null;
  episode_date: string | null;
  spotify_url: string | null;
  apple_podcast_url: string | null;
  podcast_youtube_url: string | null;
  status: string;
}

export function GuestProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchGuest();
  }, [slug]);

  async function fetchGuest() {
    try {
      const { data, error } = await supabase
        .from('podcast_guests')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setGuest(data);
      }
    } catch (error) {
      console.error('Error fetching guest:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-gray-600">Loading guest profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !guest) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Guest Not Found</h1>
            <p className="text-gray-600 mb-8">
              The guest profile you're looking for doesn't exist or hasn't been published yet.
            </p>
            <a
              href="/podcast"
              className="inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors"
            >
              Back to Podcast
            </a>
          </div>
        </div>
      </>
    );
  }

  const hasEpisode = guest.episode_title || guest.spotify_url || guest.apple_podcast_url || guest.podcast_youtube_url;

  return (
    <>
      <SEOHead
        title={`${guest.full_name} - Inner Edge Podcast Guest`}
        description={`${guest.short_bio} - Listen to ${guest.full_name} on the Inner Edge Podcast.`}
        canonical={`https://www.inneredge.co/guests/${guest.slug}`}
        ogUrl={`https://www.inneredge.co/guests/${guest.slug}`}
      />
      <Header />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative overflow-hidden px-8 py-12 text-center" style={{
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

              <div className="relative">
              <img
                src={guest.photo_url}
                alt={guest.full_name}
                className="w-48 h-48 rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover"
              />
              <h1 className="text-4xl sm:text-5xl font-black mb-2" style={{ color: '#2d7471' }}>
                {guest.full_name}
              </h1>
              <p className="text-xl text-brand-700 font-semibold mb-6">
                {guest.profession}
              </p>

              <div className="flex items-center justify-center gap-3">
                {guest.website_url && (
                  <a
                    href={guest.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition-colors"
                    aria-label="Website"
                  >
                    <Globe size={24} />
                  </a>
                )}
                {guest.linkedin_url && (
                  <a
                    href={guest.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {guest.facebook_url && (
                  <a
                    href={guest.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                )}
                {guest.instagram_url && (
                  <a
                    href={guest.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </a>
                )}
                {guest.guest_youtube_url && (
                  <a
                    href={guest.guest_youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={24} />
                  </a>
                )}
              </div>
              </div>
            </div>

            <div className="px-8 py-10">
              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#2d7471' }}>
                  About {guest.first_name}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {guest.short_bio}
                </p>
              </section>

              {hasEpisode && (
                <section className="mb-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Listen to {guest.first_name}'s Episode
                  </h3>
                  {guest.episode_title && (
                    <p className="text-xl mb-2 font-semibold text-brand-100">
                      <span className="text-white">Title:</span> {guest.episode_title}
                    </p>
                  )}
                  {guest.episode_date && (
                    <p className="text-brand-100 mb-6">
                      <span className="text-white">Date:</span> {new Date(guest.episode_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    {guest.spotify_url && (
                      <a
                        href={guest.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#1DB954] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1ed760] transition-colors"
                      >
                        <Music2 size={20} />
                        Spotify
                      </a>
                    )}
                    {guest.apple_podcast_url && (
                      <a
                        href={guest.apple_podcast_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FA57C1] to-[#B14FE0] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Play size={20} />
                        Apple Podcasts
                      </a>
                    )}
                    {guest.podcast_youtube_url && (
                      <a
                        href={guest.podcast_youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#cc0000] transition-colors"
                      >
                        <Play size={20} />
                        YouTube
                      </a>
                    )}
                  </div>
                </section>
              )}

              {guest.exercise_description && (
                <section className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    The Practice Led by {guest.first_name}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {guest.exercise_description}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
