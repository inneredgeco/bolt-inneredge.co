import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { SEOHead } from './SEOHead';
import { BlogNewsletterSignup } from './BlogNewsletterSignup';
import { BlogNavigation } from './BlogNavigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  image_alt_text: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

interface AdjacentPost {
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [previousPost, setPreviousPost] = useState<AdjacentPost | null>(null);
  const [nextPost, setNextPost] = useState<AdjacentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  async function fetchPost(postSlug: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        console.log('=== BLOG POST DEBUG ===');
        console.log('post.title:', data.title);
        console.log('post.slug:', data.slug);
        console.log('post.image_url:', data.image_url);
        console.log('post.excerpt:', data.excerpt);
        console.log('======================');
        setPost(data);
        await fetchAdjacentPosts(data.created_at);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdjacentPosts(currentPostDate: string) {
    try {
      const { data: prevData } = await supabase
        .from('posts')
        .select('title, slug, excerpt, image_url')
        .eq('published', true)
        .lt('created_at', currentPostDate)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (prevData) {
        setPreviousPost(prevData);
      }

      const { data: nextData } = await supabase
        .from('posts')
        .select('title, slug, excerpt, image_url')
        .eq('published', true)
        .gt('created_at', currentPostDate)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (nextData) {
        setNextPost(nextData);
      }
    } catch (error) {
      console.error('Error fetching adjacent posts:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-stone-600 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Post Not Found</h1>
          <p className="text-stone-600 mb-8">The post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `https://inneredge.co/blog/${post.slug}`;
  const wordCount = post.content.split(/\s+/).filter(word => word.length > 0).length;
  const imageAlt = post.image_alt_text || `Featured image for ${post.title}`;

  const postDescription = post.excerpt || post.content.substring(0, 160)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    .trim();
  const postImage = post.image_url || 'https://inner-edge-audio-files.b-cdn.net/Inner-Edge-Open-Graph.png';
  const postKeywords = `${post.title}, mens coaching blog, personal development, Inner Edge, ${post.author}`;

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        type="article"
        title={`${post.title} | Inner Edge`}
        description={postDescription}
        keywords={postKeywords}
        ogImage={postImage}
        ogUrl={currentUrl}
        canonical={currentUrl}
        author={post.author}
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        wordCount={wordCount}
      />

      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {import.meta.env.DEV && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-yellow-900 mb-2">🐛 Debug Info (Development Only)</h3>
            <div className="text-sm text-yellow-900 font-mono space-y-1">
              <div><strong>Post ID:</strong> {post.id}</div>
              <div><strong>Image URL:</strong> {post.image_url || '(null/undefined)'}</div>
              <div><strong>Slug:</strong> {post.slug}</div>
              <div><strong>Title:</strong> {post.title}</div>
            </div>
          </div>
        )}

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-[21/9] bg-stone-200 overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
                <BookOpen className="w-24 h-24 text-amber-500" />
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="hidden">
              <span itemProp="author">{post.author}</span>
              <time itemProp="datePublished" dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <div className="prose prose-lg prose-stone max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-stone-900 mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-stone-900 mt-8 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-stone-900 mt-6 mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="text-stone-700 leading-relaxed mb-6" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2" style={{ color: '#44403c' }} {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2" style={{ color: '#44403c' }} {...props} />,
                  a: ({node, ...props}) => <a className="text-teal-600 hover:text-teal-700 underline" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  iframe: ({node, ...props}) => {
                    const src = props.src as string;
                    const isVimeo = src?.includes('vimeo.com');
                    const updatedSrc = isVimeo && src
                      ? `${src}${src.includes('?') ? '&' : '?'}background=1&responsive=1`
                      : src;

                    return (
                      <div className="my-8 -mx-8 md:-mx-12" style={{ padding: 0, margin: '2rem -2rem', overflow: 'hidden' }}>
                        <iframe
                          {...props}
                          src={updatedSrc}
                          className="w-full rounded-lg shadow-lg"
                          style={{ aspectRatio: '16/9', width: '100%', height: '100%', border: 0, display: 'block', margin: 0, padding: 0 }}
                          allow="autoplay; fullscreen; picture-in-picture"
                        />
                      </div>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <BlogNewsletterSignup />

        <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
      </article>
    </div>
  );
}
