import { Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { EmotionalReleaseTechniques } from './components/EmotionalReleaseTechniques';
import { RiseCourseResources } from './components/RiseCourseResources';
import { BookingPage } from './components/BookingPage';
import { Contact } from './components/Contact';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { AdminPage } from './components/AdminPage';
import { SitemapPage } from './components/SitemapPage';
import { RSSPage } from './components/RSSPage';
import { LinkPage } from './components/LinkPage';
import { PodcastPage } from './components/PodcastPage';
import { NotFound } from './components/NotFound';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<><HomePage /><Footer /></>} />
        <Route path="/privacy-policy" element={<><PrivacyPolicy /><Footer /></>} />
        <Route path="/emotional-release-techniques" element={<><EmotionalReleaseTechniques /><Footer /></>} />
        <Route path="/rise-course-resources" element={<><RiseCourseResources /><Footer /></>} />
        <Route path="/booking" element={<><BookingPage /><Footer /></>} />
        <Route path="/contact" element={<><Contact /><Footer /></>} />
        <Route path="/about" element={<><AboutPage /><Footer /></>} />
        <Route path="/blog" element={<><BlogPage /><Footer /></>} />
        <Route path="/blog/:slug" element={<><BlogPostPage /><Footer /></>} />
        <Route path="/podcast" element={<><PodcastPage /><Footer /></>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/sitemap.xml" element={<SitemapPage />} />
        <Route path="/rss.xml" element={<RSSPage />} />
        <Route path="/link" element={<LinkPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </div>
  );
}

export default App;
