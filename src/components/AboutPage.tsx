import { User, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { SEOHead } from './SEOHead';
import { Footer } from './Footer';

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
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/about"
        ogUrl="https://www.inneredge.co/about"
      />
      <Header />

      {/* Hero Section - Living from the Inside Out */}
      <div className="relative overflow-hidden py-20 lg:py-28" style={{
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
                Men's Coach & Founder
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">About Soleiman Bolour</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-light text-brand-700 mb-8 leading-relaxed">
                Living from the Inside Out
              </p>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
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
                <div className="aspect-square rounded-3xl shadow-2xl overflow-hidden border border-brand-200">
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
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                My Story — Why I Do This Work
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
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
              <div className="mt-10 pl-6 border-l-4 border-teal-600">
                <p className="text-xl font-medium text-gray-800 italic leading-relaxed">
                  "We don't grow through being told what to do. We grow through being asked who we are."
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="w-full max-w-md">
                <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-teal-50 to-white shadow-xl overflow-hidden border border-teal-100">
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
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">
            My Philosophy — Learning Beside You
          </h2>
          <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
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
            <div className="inline-block px-8 py-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg border border-teal-100">
              <p className="text-2xl font-medium text-gray-900 italic leading-relaxed">
                "You already have what you're seeking. The work is to remember."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Work Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              The Work — What We Create Together
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformation begins when we stop walking alone.
            </p>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-16 leading-relaxed">
            Through 1-on-1 Coaching and the Inner Edge Men's Community, I support men who are ready to live with more depth, purpose, and connection.
          </p>
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                <User className="text-brand-500 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Embodiment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Learning to listen to the body's wisdom and regulate your nervous system through movement, breath, and awareness.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                <Brain className="text-brand-500 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mindset
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rewriting limiting stories, cultivating focus, and aligning action with intention.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                <Users className="text-brand-500 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Brotherhood
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Walking alongside men who see you, challenge you, and support your evolution.
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            This is a space where you're not told how to live — you're supported in discovering it for yourself.
          </p>
          <div className="text-center">
            <button
              onClick={handleCommunityClick}
              className="inline-flex items-center gap-3 bg-brand-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition-all hover:scale-105 shadow-lg"
            >
              Join the Inner Edge Community
            </button>
          </div>
        </div>
      </div>

      {/* Ongoing Journey Section */}
      <div className="py-20" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900">
            The Ongoing Journey — Still a Student
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-12">
            <p>
              After more than two decades in men's work, I've learned one thing: there's no finish line.
            </p>
            <p>
              Every man I meet reminds me that we're all still learning — learning to listen, to forgive, to open, and to stay connected.
            </p>
            <p className="text-xl font-medium text-brand-700">
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
              className="inline-flex items-center justify-center gap-3 border-2 border-brand-600 text-brand-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 hover:text-white transition-all"
            >
              Book a Discovery Call
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-800 font-medium leading-relaxed">
                  M.A. in Spiritual Psychology — University of Santa Monica
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-800 font-medium leading-relaxed">
                  B.S. in Business Marketing — California State University, Northridge
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-800 font-medium leading-relaxed">
                  NLP Certified Coach
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-800 font-medium leading-relaxed">
                  Tantra Teacher Training (Fragrance of the Lotus)
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-800 font-medium leading-relaxed">
                  Somatic Experiencing Practitioner in Training (2026)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Invitation Section */}
      <div className="py-24" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Final Invitation
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-12">
            <p className="text-xl">
              The Inner Edge isn't just a community — it's a movement of men returning home to themselves.
            </p>
            <p>
              You don't need to have it all figured out.
            </p>
            <p>
              You just need a willingness to show up — honest, open, and ready to grow.
            </p>
            <p className="text-xl font-medium text-brand-700">
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
              className="inline-flex items-center justify-center gap-3 border-2 border-brand-600 text-brand-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 hover:text-white transition-all"
            >
              Work with Me
            </button>
            <a
              href="/podcast"
              className="inline-flex items-center justify-center gap-3 border-2 border-brand-600 text-brand-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 hover:text-white transition-all"
            >
              Listen to the Podcast
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
