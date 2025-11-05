import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Mic, ArrowRight } from 'lucide-react';

interface Guest {
  id: string;
  slug: string;
  full_name: string;
  first_name: string;
  profession: string;
  short_bio: string;
  photo_url: string;
  episode_date: string | null;
  status: string;
}

export function GuestsDirectoryPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedGuests();
  }, []);

  async function fetchPublishedGuests() {
    try {
      const { data, error } = await supabase
        .from('podcast_guests')
        .select('id, slug, full_name, first_name, profession, short_bio, photo_url, episode_date, status')
        .eq('status', 'Published')
        .order('episode_date', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  }

  function truncateBio(bio: string, maxLength: number = 120): string {
    if (bio.length <= maxLength) return bio;
    return bio.substring(0, maxLength).trim() + '...';
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        title="Podcast Guests - Inner Edge"
        description="Meet the inspiring guests who have appeared on the Inner Edge Podcast, sharing their expertise in men's personal development and transformation."
        keywords="inner edge podcast guests, coaches, facilitators, thought leaders, personal development experts"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/guests"
        ogUrl="https://www.inneredge.co/guests"
      />
      <Header />

      <div className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-200" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Our Podcast Guests
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto">
            Meet the coaches, facilitators, and thought leaders who have shared their wisdom on the Inner Edge Podcast
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-stone-600">Loading guests...</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-20">
            <Mic className="w-16 h-16 mx-auto mb-6 text-stone-400" />
            <p className="text-xl text-stone-600 mb-2">No guest profiles published yet.</p>
            <p className="text-stone-500">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guests.map((guest) => (
              <Link
                key={guest.id}
                to={`/guests/${guest.slug}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src={guest.photo_url}
                      alt={guest.full_name}
                      className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-stone-100 group-hover:border-teal-200 transition-colors"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x200/e7e5e4/78716c?text=' + guest.first_name.charAt(0);
                      }}
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-stone-900 mb-2">
                    {guest.full_name}
                  </h2>

                  <p className="text-teal-600 font-semibold mb-4">
                    {guest.profession}
                  </p>

                  <p className="text-stone-600 mb-6 min-h-[3rem]">
                    {truncateBio(guest.short_bio)}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                    <span>View Profile</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
