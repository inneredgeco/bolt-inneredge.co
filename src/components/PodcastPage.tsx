import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function PodcastPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Podcast - Inner Edge"
        description="The Inner Edge Podcast - Coming Soon"
        keywords="inner edge podcast, mens work podcast, personal development"
        canonical="https://www.inneredge.co/podcast"
        ogUrl="https://www.inneredge.co/podcast"
      />
      <Header />
      <div className="min-h-[80vh] bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Podcast</h1>
          <p className="text-2xl text-accent mb-8">Coming Soon</p>
          <a
            href="https://inneredge.co/podcast-guest"
            className="inline-block bg-brand-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-600 transition-all hover:scale-105"
          >
            Be a Podcast Guest
          </a>
        </div>
      </div>
    </div>
  );
}
