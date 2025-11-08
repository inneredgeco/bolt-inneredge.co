import { Hero } from './Hero';
import { Services } from './Services';
import { Transformation } from './Transformation';
import { About } from './About';
import { CTA } from './CTA';
import NewsletterForm from './NewsletterForm';
import { SEOHead } from './SEOHead';
import { LocalHero } from './LocalHero';
import LocalBusinessSchema from './LocalBusinessSchema';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <>
      <SEOHead
        title="Men's Life Coaching and Community Organization. Based in San Diego, CA."
        description="Transform your life from the inside out with Inner Edge. Discover your vision, reconnect with your truth, and step into grounded leadership. Virtual life coaching for men in San Diego, CA."
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/"
      />
      <LocalBusinessSchema />
      <Hero />
      <LocalHero />
      <NewsletterForm />
      <Services />
      <Transformation />
      <About />
      <CTA />
      <Footer />
    </>
  );
}
