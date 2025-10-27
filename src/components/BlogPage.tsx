import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { BookOpen, Rss } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
      <Helmet>
        <title>The Path Forward - Inner Edge Blog</title>
        <meta name="description" content="Insights and reflections on men's personal development, growth, and transformation. Read articles on emotional intelligence, mindset, and brotherhood." />

        <meta property="og:title" content="The Path Forward - Inner Edge Blog" />
        <meta property="og:description" content="Insights and reflections on men's personal development, growth, and transformation. Read articles on emotional intelligence, mindset, and brotherhood." />
        <meta property="og:image" content="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inneredge.co/blog" />
        <meta property="og:site_name" content="Inner Edge" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Path Forward - Inner Edge Blog" />
        <meta name="twitter:description" content="Insights and reflections on men's personal development, growth, and transformation. Read articles on emotional intelligence, mindset, and brotherhood." />
        <meta name="twitter:image" content="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png" />

        <link rel="canonical" href="https://inneredge.co/blog" />
      </Helmet>
      <Header />

      <div className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-brand-200" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            The Path Forward
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-6">
            Insights and reflections on men's personal development, growth, and transformation
          </p>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-lg hover:bg-brand-50 font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="w-5 h-5" />
            Subscribe via RSS
          </a>
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
                  <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-accent transition-colors">
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
    </div>
  );
}
