import { supabase } from '../lib/supabase';

interface Post {
  slug: string;
  created_at: string;
}

export async function generateSitemap(): Promise<string> {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const staticPages = [
    { url: '', priority: '1.0' },
    { url: 'about', priority: '0.8' },
    { url: 'blog', priority: '0.9' },
    { url: 'contact', priority: '0.8' },
    { url: 'booking', priority: '0.9' },
    { url: 'emotional-release-techniques', priority: '0.6' },
    { url: 'rise-course-resources', priority: '0.6' },
    { url: 'link', priority: '0.5' },
    { url: 'privacy-policy', priority: '0.3' },
  ];

  const baseUrl = 'https://inneredge.co';
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/${page.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  if (posts && posts.length > 0) {
    posts.forEach((post: Post) => {
      const postDate = new Date(post.created_at).toISOString().split('T')[0];
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      sitemap += `    <lastmod>${postDate}</lastmod>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += '  </url>\n';
    });
  }

  sitemap += '</urlset>';

  return sitemap;
}
