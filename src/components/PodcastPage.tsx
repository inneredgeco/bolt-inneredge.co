import { Header } from './Header';
import { SEOHead } from './SEOHead';

export function PodcastPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Podcast - Inner Edge"
        description="The Inner Edge Podcast - Coming Soon"
        keywords="inner edge podcast, mens work podcast, personal development"
        canonical="https://www.inner-edge.com/podcast"
        ogUrl="https://www.inner-edge.com/podcast"
      />
      <Header />
      <div className="min-h-[80vh] bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Podcast</h1>
          <p className="text-2xl text-accent">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
