import { ArrowRight } from 'lucide-react';
import { Header } from './Header';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      <div className="relative overflow-hidden" style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #f5f1ed 0%, #e8e4df 30%, #d4e8e6 70%, #c5ddd9 100%)'
      }}>
        {/* Abstract Gradient Shape */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40">
          <div className="absolute inset-0 rounded-full" style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(138, 214, 206, 0.6) 0%, rgba(107, 201, 191, 0.4) 30%, rgba(78, 184, 173, 0.2) 60%, transparent 100%)',
            filter: 'blur(60px)'
          }}></div>
          <div className="absolute inset-0 rounded-full translate-x-20 translate-y-32" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(78, 184, 173, 0.5) 0%, rgba(60, 154, 145, 0.3) 40%, transparent 70%)',
            filter: 'blur(80px)'
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex items-center" style={{ minHeight: '90vh' }}>
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
              Transform from Within
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.1]">
              <span className="text-gray-900">The Man You're<br />Meant to Be</span>
              <br />
              <span className="relative inline-block">
                <span className="text-brand-600">Is Already Within You.</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 400 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 4C50 2, 100 6, 150 3C200 1, 250 5, 300 2C350 0, 380 4, 398 3"
                    stroke="#8ad6ce"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl">
              Transform your life from the inside out. Discover your vision, reconnect with your truth, and step into grounded leadership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('cta')}
                className="group bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Take the First Step
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 hover:text-white transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
