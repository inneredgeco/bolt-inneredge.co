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
        type="website"
        title="Men's Life Coaching and Community Organization. Based in San Diego, CA."
        description="Transform your life from the inside out with Inner Edge. Discover your vision, reconnect with your truth, and step into grounded leadership. Virtual life coaching for men in San Diego, CA."
        keywords="mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development, mens community, mens virtual community, mens online community, san diego life coach"
        ogImage="https://cdn.inneredge.co/og-images/home-ie-open-graph.png"
        ogUrl="https://inneredge.co/"
        canonical="https://inneredge.co/"
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
