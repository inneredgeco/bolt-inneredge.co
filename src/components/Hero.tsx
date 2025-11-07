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

      <div
        className="relative overflow-hidden"
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(135deg, #f0f7f6 0%, #d9eeec 25%, #c4e3e0 50%, #b8d4d2 75%, #8ad6ce 100%)'
        }}
      >
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#8ad6ce' }}></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: '#2d7471' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#d9eeec' }}></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex items-center" style={{ minHeight: '85vh' }}>
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
            The Man You're Meant to Be
            <br />
            <span style={{ color: '#2d7471' }}>Is Already Within You.</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 leading-relaxed" style={{ color: '#4a4a4a' }}>
            Transform your life from the inside out. Discover your vision, reconnect with your truth, and step into grounded leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection('cta')}
              className="group px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: '#2d7471',
                color: 'white'
              }}
            >
              Take the First Step
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-8 py-4 rounded-full font-bold text-lg transition-all border-2"
              style={{
                borderColor: '#2d7471',
                color: '#2d7471',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d7471';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#2d7471';
              }}
            >
              Learn More
            </button>
          </div>
        </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: '#2d7471' }}>
            <div className="w-1.5 h-3 rounded-full" style={{ background: '#2d7471' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
