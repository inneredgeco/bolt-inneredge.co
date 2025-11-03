import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function SitemapPage() {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    generateSitemap();
  }, []);

  async function generateSitemap() {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: 'about', priority: '0.8', changefreq: 'monthly' },
      { url: 'blog', priority: '0.9', changefreq: 'weekly' },
      { url: 'podcast', priority: '0.9', changefreq: 'weekly' },
      { url: 'contact', priority: '0.8', changefreq: 'monthly' },
      { url: 'booking', priority: '0.9', changefreq: 'monthly' },
      { url: 'emotional-release-techniques', priority: '0.6', changefreq: 'monthly' },
      { url: 'rise-course-resources', priority: '0.6', changefreq: 'monthly' },
      { url: 'link', priority: '0.5', changefreq: 'monthly' },
      { url: 'privacy-policy', priority: '0.3', changefreq: 'yearly' },
    ];

    const baseUrl = 'https://inneredge.co';
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach((page) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${page.url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    if (posts && posts.length > 0) {
      posts.forEach((post) => {
        const postDate = new Date(post.created_at).toISOString().split('T')[0];
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${postDate}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += '  </url>\n';
      });
    }

    xml += '</urlset>';
    setSitemap(xml);
  }

  useEffect(() => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    }
  }, [sitemap]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Generating sitemap...</p>
      </div>
    </div>
  );
}
