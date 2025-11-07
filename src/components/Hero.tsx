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
          minHeight: '600px',
          background: 'linear-gradient(135deg, #f0f7f6 0%, #d9eeec 25%, #c4e3e0 50%, #b8d4d2 75%, #8ad6ce 100%)'
        }}
      >
        {/* Hero Content - Centered */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex items-center" style={{ minHeight: '600px' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <span className="text-sm font-heading font-semibold tracking-wide uppercase px-4 py-2 bg-white/40 rounded-full" style={{ color: '#2d7471' }}>
                Transform from Within
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
              The Man You're Meant to Be{' '}
              <span style={{ color: '#2d7471' }}>Is Already Within You.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-body mb-10 leading-relaxed max-w-3xl mx-auto" style={{ color: '#4a4a4a' }}>
              Transform your life from the inside out. Discover your vision, reconnect with your truth, and step into grounded leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('cta')}
                className="btn-primary group flex items-center justify-center gap-2"
              >
                Take the First Step
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="btn-secondary"
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
