import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '../.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
}

const env = loadEnvFile();
const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Skipping sitemap generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      process.exit(0);
    }

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

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/${page.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    if (posts && posts.length > 0) {
      posts.forEach((post) => {
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

    const sitemapPath = join(__dirname, '../public/sitemap.xml');
    writeFileSync(sitemapPath, sitemap, 'utf-8');

    console.log(`✓ Sitemap generated successfully with ${posts?.length || 0} blog posts`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(0);
  }
}

generateSitemap();
