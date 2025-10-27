import { useEffect, useState } from 'react';
import { generateSitemap } from '../utils/generateSitemap';

export function SitemapPage() {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    async function loadSitemap() {
      const xml = await generateSitemap();
      setSitemap(xml);
    }
    loadSitemap();
  }, []);

  useEffect(() => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    }
  }, [sitemap]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-600">Generating sitemap...</p>
    </div>
  );
}
