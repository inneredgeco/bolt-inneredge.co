import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Mic } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        pagePath="/guests"
        fallbackTitle="Podcast Guests - Inner Edge"
        fallbackDescription="Meet the inspiring guests who have appeared on the Inner Edge Podcast, sharing their expertise in men's personal development and transformation."
        fallbackOgImage="https://cdn.inneredge.co/og-images/home-ie-open-graph.png"
        canonical="https://inneredge.co/guests"
        ogUrl="https://inneredge.co/guests"
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
            Guest Directory
          </p>
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Our Podcast Guests
          </h1>
          <p className="text-xl text-brand-700 max-w-3xl mx-auto">
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {guests.map((guest) => (
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
        )}
      </div>

      <Footer />
    </div>
  );
}
