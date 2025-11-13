import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { EmotionalReleaseTechniques } from './components/EmotionalReleaseTechniques';
import { RiseCourseResources } from './components/RiseCourseResources';
import { BookingPage } from './components/BookingPage';
import { Contact } from './components/Contact';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogPostsAdminPage } from './components/BlogPostsAdminPage';
import { GuestProfilesAdminPage } from './components/GuestProfilesAdminPage';
import { EmailTemplatesPage } from './components/EmailTemplatesPage';
import { MediaManagerPage } from './components/MediaManagerPage';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RSSPage } from './components/RSSPage';
import { SitemapPage } from './components/SitemapPage';
import { LinkPage } from './components/LinkPage';
import { PodcastPage } from './components/PodcastPage';
import { PodcastGuestPage } from './components/PodcastGuestPage';
import { PodcastGuestFormPage } from './components/PodcastGuestFormPage';
import { PodcastGuestOnboardingPage } from './components/PodcastGuestOnboardingPage';
import { GuestProfilePage } from './components/GuestProfilePage';
import { GuestsDirectoryPage } from './components/GuestsDirectoryPage';
import { VisionBuilderPage } from './components/VisionBuilderPage';
import { VisionAnalyticsPage } from './components/VisionAnalyticsPage';
import { VisionResultsPage } from './components/VisionResultsPage';
import NewsletterFormVisualBuilder from './components/NewsletterFormVisualBuilder';
import { NotFound } from './components/NotFound';
import { CookieConsent } from './components/CookieConsent';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/emotional-release-techniques" element={<EmotionalReleaseTechniques />} />
        <Route path="/rise-course-resources" element={<RiseCourseResources />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/podcast" element={<PodcastPage />} />
        <Route path="/podcast-guest" element={<PodcastGuestPage />} />
        <Route path="/podcast-guest-form" element={<PodcastGuestFormPage />} />
        <Route path="/podcast-guest-onboarding" element={<PodcastGuestOnboardingPage />} />
        <Route path="/guests" element={<GuestsDirectoryPage />} />
        <Route path="/guests/:slug" element={<GuestProfilePage />} />
        <Route path="/vision-builder" element={<VisionBuilderPage />} />
        <Route path="/vision-builder/resume/:submissionId" element={<VisionBuilderPage />} />
        <Route path="/vision-builder/results/:submissionId" element={<VisionResultsPage />} />
        <Route path="/newsletter-form-vision-builder" element={<NewsletterFormVisualBuilder />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/blog-posts" element={<ProtectedRoute><BlogPostsAdminPage /></ProtectedRoute>} />
        <Route path="/admin/guest-profiles" element={<ProtectedRoute><GuestProfilesAdminPage /></ProtectedRoute>} />
        <Route path="/admin/email-templates" element={<ProtectedRoute><EmailTemplatesPage /></ProtectedRoute>} />
        <Route path="/admin/media-manager" element={<ProtectedRoute><MediaManagerPage /></ProtectedRoute>} />
        <Route path="/admin/vision-analytics" element={<ProtectedRoute><VisionAnalyticsPage /></ProtectedRoute>} />
        <Route path="/rss.xml" element={<RSSPage />} />
        <Route path="/sitemap.xml" element={<SitemapPage />} />
        <Route path="/link" element={<LinkPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </div>
  );
}

export default App;
