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

      <div className="relative bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800" style={{ minHeight: '85vh' }}>
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex items-center" style={{ minHeight: '85vh' }}>
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Settling.
            <br />
            <span style={{ color: '#8ad6ce' }}>Start Living.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-brand-100 mb-8 leading-relaxed">
            You know you're capable of more. More confidence, more purpose, more impact.
            It's time to unlock the man you were meant to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection('cta')}
              className="group bg-white text-brand-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-50 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Take the First Step
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-700 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
