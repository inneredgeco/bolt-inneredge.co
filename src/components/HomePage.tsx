import { Hero } from './Hero';
import { Services } from './Services';
import { Transformation } from './Transformation';
import { About } from './About';
import { CTA } from './CTA';
import NewsletterForm from './NewsletterForm';
import { SEOHead } from './SEOHead';
import { LocalHero } from './LocalHero';
import LocalBusinessSchema from './LocalBusinessSchema';

export function HomePage() {
  return (
    <>
      <SEOHead
        title="Life Coach for Men in San Diego | Inner Edge Coaching"
        description="Transform your life with Inner Edge, San Diego's premier virtual life coaching for men. Specializing in emotional wellness, personal growth, and breakthrough coaching in La Mesa, CA."
        keywords="life coach san diego, mens coaching san diego, virtual life coach california, personal development san diego, emotional wellness coach, la mesa life coach, breakthrough coaching san diego"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/"
        ogUrl="https://www.inneredge.co/"
        locality="San Diego"
        region="CA"
      />
      <LocalBusinessSchema />
      <Hero />
      <LocalHero />
      <NewsletterForm />
      <Services />
      <Transformation />
      <About />
      <CTA />
    </>
  );
}
