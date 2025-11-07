import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  created_at: string;
}

export function LinkPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);


    supabase
      .from('posts')
      .select('id, title, slug, excerpt, image_url, author, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
        }
      });

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const openCalendly = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/soleimanbolour/lets-connect?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=2d7471'
      });
    }
  };

  const handleFlodeskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/linkpage-newsletter-signup`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          firstName: firstName,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitMessage({
          type: 'success',
          text: '🎉 Success! Check your email to confirm and get your free guide.'
        });
        setEmail('');
        setFirstName('');
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32" style={{
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
            Connect & Transform
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Unlock Your Inner Edge
          </h1>
          <p className="text-xl sm:text-2xl text-brand-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join a community of men committed to growth, purpose, and becoming the best versions of themselves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#community" className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-700 transition-all hover:scale-105 shadow-lg">
              Mens Community
            </a>
            <a href="#coaching" className="border-2 border-brand-600 text-brand-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 hover:text-white transition-all">
              1-on-1 Coaching
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 text-center">
            About Inner Edge
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              At Inner Edge, we believe that true strength comes from within. We're a brotherhood dedicated to helping men develop mental resilience, emotional intelligence, and authentic leadership.
            </p>
            <p>
              Through our community, coaching, and resources, we provide the tools and support men need to break through limitations, build meaningful connections, and create lives of purpose and impact.
            </p>
            <p>
              This isn't about quick fixes or surface-level advice. This is about doing the deep work that creates lasting transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Inner Edge Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with like-minded men who are committed to growth, accountability, and excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brotherhood</h3>
              <p className="text-gray-600 leading-relaxed">
                Build genuine connections with men who understand your journey
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accountability</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay committed to your goals with support from the community
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resources</h3>
              <p className="text-gray-600 leading-relaxed">
                Access exclusive content, workshops, and development tools
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Weekly challenges and conversations that push you forward
              </p>
            </div>
          </div>

          <div className="text-center">
            <a href="https://www.skool.com/inner-edge-1237" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105">
              Join Inner Edge Community
            </a>
          </div>
        </div>
      </section>

      {/* Coaching Section */}
      <section id="coaching" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              1-on-1 Coaching
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized guidance to help you break through barriers and achieve your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transform Your Life</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Work directly with me to develop clarity, confidence, and a concrete plan for the life you want to build.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're navigating a major transition, building a business, or developing as a leader, I'll help you cut through the noise and focus on what matters.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-brand-500">
                <p className="text-gray-700 font-medium">✓ Personalized development plan</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-brand-500">
                <p className="text-gray-700 font-medium">✓ Weekly 1-on-1 video sessions</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-brand-500">
                <p className="text-gray-700 font-medium">✓ Accountability and tracking</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-brand-500">
                <p className="text-gray-700 font-medium">✓ Resources and tools tailored to you</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="" onClick={openCalendly} className="inline-block bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105">
              Book Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-24 bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Free Guide: The 3 Part Vision Formula
          </h2>
          <p className="text-xl text-brand-100 mb-8 leading-relaxed">
            Download your free guide and learn what is required to create a vision for your life.
          </p>
          <form id="lead-magnet-form" className="max-w-lg mx-auto flex flex-col gap-4" onSubmit={handleFlodeskSubmit}>
            <input
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-brand-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-50 transition-all hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Subscribing...' : 'Get Free Guide'}
            </button>
            {submitMessage && (
              <div className={`text-center p-4 rounded-full ${
                submitMessage.type === 'success'
                  ? 'bg-white text-brand-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              From the Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, strategies, and real talk about men's development and personal growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                <p>No blog posts available yet.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/blog" className="inline-block bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105">
              Read More Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-16 text-center">
            What Men Are Saying
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "Soleiman has a gift for creating spaces where individuals feel comfortable to encounter themselves in ways that may otherwise feel intimidating."
              </p>
              <p className="text-gray-900 font-semibold">— Richard K.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "I have had the distinct pleasure of working with Soleiman, a remarkable Men's Transformational Coach whose expertise has profoundly influenced my personal development. His deep insights, unwavering support, and patient demeanor create a safe and nurturing environment, conducive to deep personal growth."
              </p>
              <p className="text-gray-900 font-semibold">— Sprout B.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "I have had the opportunity to be a part of Soleiman's workshops and one on one coaching for several years and have found his dedication to teaching and sharing his knowledge engaging for self growth. When sharing, Soleiman listens patiently with intent. You feel listened to and heard, with his responses catered to you."
              </p>
              <p className="text-gray-900 font-semibold">— Jeff H.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white py-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://www.instagram.com/soleimanbolour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/soleimanbolour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.youtube.com/@SoleimanBolour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/soleimanbolour/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@soleimanb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
          <p className="text-brand-200 opacity-70">© 2025 Inner Edge Community. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-900 bg-opacity-98 backdrop-blur-sm shadow-lg z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-3">
          <a
            href="mailto:contact@inneredge.co"
            className="flex flex-col items-center gap-1 px-4 py-3 bg-white text-brand-700 rounded-lg font-semibold text-sm hover:bg-brand-50 transition-all hover:scale-105 hover:-translate-y-1 flex-1 max-w-[140px]"
          >
            <span className="text-xl">📧</span>
            <span>Email</span>
          </a>
          <a
            href=""
            onClick={openCalendly}
            className="flex flex-col items-center gap-1 px-4 py-3 bg-white text-brand-700 rounded-lg font-semibold text-sm hover:bg-brand-50 transition-all hover:scale-105 hover:-translate-y-1 flex-1 max-w-[140px]"
          >
            <span className="text-xl">📅</span>
            <span>Book Call</span>
          </a>
          <a
            href="https://www.skool.com/inner-edge-1237"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-4 py-3 bg-white text-brand-700 rounded-lg font-semibold text-sm hover:bg-brand-50 transition-all hover:scale-105 hover:-translate-y-1 flex-1 max-w-[140px]"
          >
            <span className="text-xl">🤝</span>
            <span>Community</span>
          </a>
        </div>
      </div>
    </div>
  );
}
