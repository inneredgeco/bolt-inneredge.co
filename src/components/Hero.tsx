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

      <div className="relative overflow-hidden grain-texture bg-stone-50" style={{ minHeight: '90vh' }}>
        {/* Organic shape decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30">
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl bg-accent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20">
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl bg-brand-light"></div>
        </div>

        {/* Hero Content - Left aligned */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:py-40 grid lg:grid-cols-5 gap-12 items-center" style={{ minHeight: '90vh' }}>
          <div className="lg:col-span-3">
            <div className="mb-6 inline-block">
              <span className="text-sm font-heading font-semibold tracking-wide uppercase text-brand px-4 py-2 bg-brand-50 rounded-full">
                Transform from Within
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-[1.1] text-dark">
              The Man You're Meant to Be{' '}
              <span className="relative inline-block">
                <span className="text-brand">Is Already Within You.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 4 100 2 150 4C200 6 250 8 298 10" stroke="#8ad6ce" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-body mb-10 leading-relaxed text-dark-medium max-w-2xl">
              Transform your life from the inside out. Discover your vision, reconnect with your truth, and step into grounded leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

          {/* Right side - Abstract shape or image placeholder */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="relative">
              <div className="w-full h-[500px] rounded-2xl bg-gradient-to-br from-brand to-brand-dark opacity-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-accent opacity-50 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-brand-light opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-brand rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
