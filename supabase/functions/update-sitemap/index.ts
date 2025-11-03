import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all published posts
    const { data: posts, error } = await supabase
      .from("posts")
      .select("slug, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const staticPages = [
      { url: "", priority: "1.0", changefreq: "weekly" },
      { url: "about", priority: "0.8", changefreq: "monthly" },
      { url: "blog", priority: "0.9", changefreq: "weekly" },
      { url: "podcast", priority: "0.9", changefreq: "weekly" },
      { url: "contact", priority: "0.8", changefreq: "monthly" },
      { url: "booking", priority: "0.9", changefreq: "monthly" },
      { url: "emotional-release-techniques", priority: "0.6", changefreq: "monthly" },
      { url: "rise-course-resources", priority: "0.6", changefreq: "monthly" },
      { url: "link", priority: "0.5", changefreq: "monthly" },
      { url: "privacy-policy", priority: "0.3", changefreq: "yearly" },
    ];

    const baseUrl = "https://inneredge.co";
    const currentDate = new Date().toISOString().split("T")[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach((page) => {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}/${page.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += "  </url>\n";
    });

    if (posts && posts.length > 0) {
      posts.forEach((post) => {
        const postDate = new Date(post.created_at).toISOString().split("T")[0];
        sitemap += "  <url>\n";
        sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        sitemap += `    <lastmod>${postDate}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += "  </url>\n";
      });
    }

    sitemap += "</urlset>";

    return new Response(
      JSON.stringify({
        success: true,
        sitemap,
        postCount: posts?.length || 0,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
