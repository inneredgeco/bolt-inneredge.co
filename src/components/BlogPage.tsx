import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { BookOpen } from 'lucide-react';
import { SEOHead } from './SEOHead';
import { Footer } from './Footer';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  created_at: string;
}

let postsCache: Post[] | null = null;
let postsPromise: Promise<Post[]> | null = null;

function fetchPosts(): Promise<Post[]> {
  if (postsCache !== null) {
    return Promise.resolve(postsCache);
  }

  if (postsPromise === null) {
    postsPromise = supabase
      .from('posts')
      .select('id, title, slug, excerpt, image_url, author, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching posts:', error);
          return [];
        }
        postsCache = data || [];
        return postsCache;
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        return [];
      });
  }

  return postsPromise;
}

fetchPosts();

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(postsCache || []);
  const [loading, setLoading] = useState(postsCache === null);

  useEffect(() => {
    if (postsCache === null) {
      fetchPosts().then((data) => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        title="The Path Forward - Inner Edge Blog"
        description="Insights and reflections on men's personal development, growth, and transformation. Read articles on emotional intelligence, mindset, and brotherhood."
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        ogUrl="https://inneredge.co/blog"
        canonical="https://inneredge.co/blog"
        keywords="mens coaching blog, personal development, mens growth, emotional intelligence, mindset coaching, mens community"
      />
      <Header />

      <div className="relative overflow-hidden py-20" style={{
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Insights & Reflections
          </p>
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-gray-900">
            The Path Forward
          </h1>
          <p className="text-xl text-brand-700 max-w-2xl mx-auto">
            Insights and reflections on men's personal development, growth, and transformation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-stone-600 text-lg">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-video bg-stone-200 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
                      <BookOpen className="w-16 h-16 text-amber-500" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-stone-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
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
