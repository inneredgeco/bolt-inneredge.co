import { supabase } from '../lib/supabase';

interface Post {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export async function generateRSS(): Promise<string> {
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, author, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const baseUrl = 'https://inneredge.co';
  const currentDate = new Date().toUTCString();

  let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
  rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  rss += '  <channel>\n';
  rss += '    <title>Inner Edge - The Path Forward</title>\n';
  rss += '    <link>https://inneredge.co/blog</link>\n';
  rss += '    <description>Insights and reflections on men\'s personal development, growth, and transformation</description>\n';
  rss += '    <language>en-us</language>\n';
  rss += `    <lastBuildDate>${currentDate}</lastBuildDate>\n`;
  rss += '    <atom:link href="https://inneredge.co/rss.xml" rel="self" type="application/rss+xml" />\n';

  if (posts && posts.length > 0) {
    posts.forEach((post: Post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.created_at).toUTCString();

      rss += '    <item>\n';
      rss += `      <title><![CDATA[${post.title}]]></title>\n`;
      rss += `      <link>${postUrl}</link>\n`;
      rss += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
      rss += `      <description><![CDATA[${post.excerpt}]]></description>\n`;
      rss += `      <author>${post.author}</author>\n`;
      rss += `      <pubDate>${pubDate}</pubDate>\n`;
      rss += '    </item>\n';
    });
  }

  rss += '  </channel>\n';
  rss += '</rss>';

  return rss;
}
