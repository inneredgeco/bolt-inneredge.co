import { User, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function AboutPage() {
  const navigate = useNavigate();

  const handleCommunityClick = () => {
    window.open('https://www.skool.com/inner-edge-1237', '_blank');
  };

  const handleBookingClick = () => {
    navigate('/booking');
    setTimeout(() => {
      const element = document.getElementById('booking-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About Soleiman Bolour - Men's Coach & Founder of Inner Edge"
        description="Meet Soleiman Bolour, men's coach and founder of Inner Edge. Learn about his journey through Spiritual Psychology, Tantra, and embodiment work to help men live authentically."
        keywords="Soleiman Bolour, mens coach, spiritual psychology, tantra teacher, Inner Edge founder, mens work facilitator"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/about"
        ogUrl="https://www.inneredge.co/about"
      />
      <Header />

      {/* Hero Section - Living from the Inside Out */}
      <div className="py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #f0f7f6 0%, #d9eeec 25%, #c4e3e0 50%, #b8d4d2 75%, #8ad6ce 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
                About Soleiman Bolour
              </h1>
              <p className="text-2xl sm:text-3xl font-body font-light mb-8 leading-relaxed" style={{ color: '#2d7471' }}>
                Living from the Inside Out
              </p>
              <div className="space-y-6 text-lg font-body leading-relaxed max-w-2xl mx-auto lg:mx-0" style={{ color: '#4a4a4a' }}>
                <p>
                  I'm not here as the expert on your life.
                </p>
                <p>
                  I'm here as a man — a student, a guide, and a brother walking beside you.
                </p>
                <p>
                  For the past 18 years, I've devoted my life to understanding what it means to live fully — through body, breath, heart, and presence. My work as a men's coach and founder of the Inner Edge Men's Community is about walking this path together — learning, unlearning, and remembering who we truly are.
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-lg">
                <div className="aspect-square rounded-2xl shadow-2xl overflow-hidden">
                  <img
                    src="https://inner-edge.b-cdn.net/ie-about-soleiman-main.jpg"
                    alt="Soleiman Bolour - Men's Coach and Founder of Inner Edge"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Story Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-8" style={{ color: '#1a1a1a' }}>
                My Story — Why I Do This Work
              </h2>
              <div className="space-y-6 text-lg font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
                <p>
                  When my father passed away, I searched for guidance from the men in my family.
                </p>
                <p>
                  I had four uncles, each living their own version of life. Each told me who I should be.
                </p>
                <p>
                  But none of them asked who I was.
                </p>
                <p>
                  That experience stayed with me. It showed me that most men don't need to be told what to do — they need to be seen, heard, and guided back to their own truth.
                </p>
                <p>
                  Now, through Inner Edge, I help men do exactly that: find their own voice, trust their inner compass, and lead from within.
                </p>
              </div>
              <div className="mt-10 pl-6 border-l-4" style={{ borderColor: '#2d7471' }}>
                <p className="text-xl font-body font-medium italic leading-relaxed" style={{ color: '#1a1a1a' }}>
                  "We don't grow through being told what to do. We grow through being asked who we are."
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="w-full max-w-md">
                <div className="aspect-[4/5] rounded-2xl shadow-xl overflow-hidden">
                  <img
                    src="https://inner-edge.b-cdn.net/ie-about-soleiman-portrait.jpg"
                    alt="Soleiman Bolour walking his path"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-16 md:py-20" style={{ background: '#fafaf9' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-12 text-center" style={{ color: '#1a1a1a' }}>
            My Philosophy — Learning Beside You
          </h2>
          <div className="space-y-8 text-lg font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
            <p>
              I don't see myself as the expert — I see myself as a mirror.
            </p>
            <p>
              I'm learning too. Every circle, every conversation, every breath teaches me something new about presence, patience, and love.
            </p>
            <p>
              My coaching draws from Spiritual Psychology, Tantra, NLP, and Embodiment — yet it's not about techniques. It's about relationship. It's about slowing down, listening to your body, and allowing your truth to unfold naturally.
            </p>
            <p>
              Growth isn't about becoming someone new — it's about returning to who you've always been.
            </p>
          </div>
          <div className="mt-12 text-center">
            <div className="inline-block px-8 py-6 bg-white rounded-lg shadow-lg">
              <p className="text-2xl font-body font-medium italic leading-relaxed" style={{ color: '#1a1a1a' }}>
                "You already have what you're seeking. The work is to remember."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Work Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6" style={{ color: '#1a1a1a' }}>
              The Work — What We Create Together
            </h2>
            <p className="text-xl font-body max-w-3xl mx-auto" style={{ color: '#4a4a4a' }}>
              Transformation begins when we stop walking alone.
            </p>
          </div>
          <p className="text-lg font-body text-center max-w-4xl mx-auto mb-16 leading-relaxed" style={{ color: '#4a4a4a' }}>
            Through 1-on-1 Coaching and the Inner Edge Men's Community, I support men who are ready to live with more depth, purpose, and connection.
          </p>
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="group bg-white p-10 rounded-lg card-hover border border-gray-100">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#a8e0da' }}>
                <User style={{ color: '#2d7471' }} size={32} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Embodiment
              </h3>
              <p className="font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
                Learning to listen to the body's wisdom and regulate your nervous system through movement, breath, and awareness.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-lg card-hover border border-gray-100">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#a8e0da' }}>
                <Brain style={{ color: '#2d7471' }} size={32} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Mindset
              </h3>
              <p className="font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
                Rewriting limiting stories, cultivating focus, and aligning action with intention.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-lg card-hover border border-gray-100">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#a8e0da' }}>
                <Users style={{ color: '#2d7471' }} size={32} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Brotherhood
              </h3>
              <p className="font-body leading-relaxed" style={{ color: '#4a4a4a' }}>
                Walking alongside men who see you, challenge you, and support your evolution.
              </p>
            </div>
          </div>
          <p className="text-lg font-body text-center max-w-3xl mx-auto mb-10 leading-relaxed" style={{ color: '#4a4a4a' }}>
            This is a space where you're not told how to live — you're supported in discovering it for yourself.
          </p>
          <div className="text-center">
            <button
              onClick={handleCommunityClick}
              className="inline-flex items-center gap-3 text-white px-10 py-4 rounded-full font-heading font-bold text-lg transition-all hover:scale-105 shadow-lg"
              style={{ background: '#2d7471' }}
            >
              Join the Inner Edge Community
            </button>
          </div>
        </div>
      </div>

      {/* Ongoing Journey Section */}
      <div className="py-16 md:py-20 text-white" style={{ background: '#2d7471' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-8">
            The Ongoing Journey — Still a Student
          </h2>
          <div className="space-y-6 text-lg font-body leading-relaxed mb-12" style={{ color: '#f5f5f4' }}>
            <p>
              After more than two decades in men's work, I've learned one thing: there's no finish line.
            </p>
            <p>
              Every man I meet reminds me that we're all still learning — learning to listen, to forgive, to open, and to stay connected.
            </p>
            <p className="text-xl font-body font-medium" style={{ color: '#8ad6ce' }}>
              I don't believe in gurus. I believe in growth.
            </p>
            <p>
              And if you're here, reading this, you've already begun.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCommunityClick}
              className="inline-flex items-center justify-center gap-3 bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105 shadow-lg"
            >
              Join Inner Edge
            </button>
            <button
              onClick={handleBookingClick}
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-md font-heading font-bold text-lg hover:bg-white transition-all"
            >
              Book a Discovery Call
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="py-16 md:py-20" style={{ background: '#fafaf9' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-heading font-bold mb-12 text-center" style={{ color: '#1a1a1a' }}>
            Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="font-body font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
                  M.A. in Spiritual Psychology — University of Santa Monica
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="font-body font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
                  B.S. in Business Marketing — California State University, Northridge
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="font-body font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
                  NLP Certified Coach
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="font-body font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
                  Tantra Teacher Training (Fragrance of the Lotus)
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="font-body font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
                  Somatic Experiencing Practitioner in Training (2026)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Invitation Section */}
      <div className="py-16 md:py-20" style={{ background: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Final Invitation
          </h2>
          <div className="space-y-6 text-lg font-body leading-relaxed mb-12" style={{ color: '#f5f5f4' }}>
            <p className="text-xl">
              The Inner Edge isn't just a community — it's a movement of men returning home to themselves.
            </p>
            <p>
              You don't need to have it all figured out.
            </p>
            <p>
              You just need a willingness to show up — honest, open, and ready to grow.
            </p>
            <p className="text-xl font-body font-medium" style={{ color: '#8ad6ce' }}>
              Let's walk together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCommunityClick}
              className="inline-flex items-center justify-center gap-3 bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105 shadow-lg"
            >
              Join the Community
            </button>
            <button
              onClick={handleBookingClick}
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-md font-heading font-bold text-lg hover:bg-white transition-all"
            >
              Work with Me
            </button>
            <a
              href="/podcast"
              className="inline-flex items-center justify-center gap-3 border-2 text-white px-8 py-4 rounded-md font-heading font-bold text-lg transition-all"
              style={{ borderColor: '#737373' }}
            >
              Listen to the Podcast
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
