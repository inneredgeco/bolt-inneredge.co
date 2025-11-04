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

      <div className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
        {/* Soft Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-cyan-50 to-teal-100"></div>

        {/* Radial Gradient Overlays for Soft Cloud Effect */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cyan-200/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-radial from-teal-200/30 via-transparent to-transparent"></div>
        </div>

        {/* Subtle Blur Effect Layer */}
        <div className="absolute inset-0 backdrop-blur-3xl opacity-20"></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex items-center" style={{ minHeight: '85vh' }}>
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            The Man You're Meant to Be
            <br />
            <span className="text-teal-600">Is Already Within You.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            Transform your life from the inside out. Discover your vision, reconnect with your truth, and step into grounded leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection('cta')}
              className="group bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              Take the First Step
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="border-2 border-teal-600 text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-600 hover:text-white transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
