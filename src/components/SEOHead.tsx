import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

interface SEOHeadProps {
  pagePath?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackOgImage?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  locality?: string;
  region?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  wordCount?: number;
}

export function SEOHead({
  pagePath,
  fallbackTitle,
  fallbackDescription,
  fallbackOgImage,
  title: propTitle,
  description: propDescription,
  keywords,
  ogImage: propOgImage,
  ogUrl,
  canonical,
  locality = 'San Diego',
  region = 'CA',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  wordCount
}: SEOHeadProps) {
  const [seoData, setSeoData] = useState<{
    page_title: string;
    meta_description: string;
    og_image_url: string | null;
    og_url: string | null;
    keywords: string | null;
    locality: string | null;
    region: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(!!pagePath);

  useEffect(() => {
    const fetchSeoData = async () => {
      if (!pagePath) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('seo_meta')
          .select('page_title, meta_description, og_image_url, og_url, keywords, locality, region')
          .eq('page_path', pagePath)
          .maybeSingle();

        if (error) {
          console.error('SEOHead: Error fetching SEO data:', error);
        }

        if (data) {
          console.log('SEOHead: Database data found for', pagePath, data);
          setSeoData(data);
        } else {
          console.log('SEOHead: No database data for', pagePath, '- using fallbacks');
        }
      } catch (err) {
        console.error('SEOHead: Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [pagePath]);

  const title = propTitle || seoData?.page_title || fallbackTitle || 'Inner Edge';
  const description = propDescription || seoData?.meta_description || fallbackDescription || 'Transform your life from the inside out with Inner Edge.';
  const ogImage = propOgImage || seoData?.og_image_url || fallbackOgImage;
  const finalOgUrl = ogUrl || seoData?.og_url;
  const finalKeywords = keywords || seoData?.keywords;
  const finalLocality = locality || seoData?.locality || 'San Diego';
  const finalRegion = region || seoData?.region || 'CA';

  const defaultKeywords = 'mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development, mens community, mens virtual community, mens online community';

  const defaultImage = 'https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png';
  const finalImage = ogImage || (type === 'website' ? defaultImage : '');
  const fullImageUrl = finalImage && finalImage.startsWith('http')
    ? finalImage
    : finalImage
      ? `${window.location.origin}${finalImage}`
      : defaultImage;

  useEffect(() => {
    if (!loading) {
      console.log('SEOHead: Rendering meta tags for', pagePath || 'custom');
      console.log('SEOHead: Using title:', title);
      console.log('SEOHead: Using description:', description);
      console.log('SEOHead: Using og_image:', ogImage);
      console.log('SEOHead: Final og_image URL:', fullImageUrl);
      console.log('SEOHead: Database data:', !!seoData);
    }
  }, [loading, title, description, ogImage, fullImageUrl, seoData, pagePath]);

  if (loading) {
    return null;
  }

  const structuredData = type === 'article' && finalOgUrl && finalImage ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": finalOgUrl
    },
    "author": {
      "@type": "Person",
      "name": author || "Inner Edge"
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "image": finalImage,
    "inLanguage": "en-US",
    "wordCount": wordCount,
    "publisher": {
      "@type": "Organization",
      "name": "Inner Edge"
    }
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords || defaultKeywords} />

      <meta name="geo.region" content={`US-${finalRegion}`} />
      <meta name="geo.placename" content={finalLocality} />
      <meta name="geo.position" content="32.7677;-117.0231" />
      <meta name="ICBM" content="32.7677, -117.0231" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Inner Edge" />

      {fullImageUrl && (
        <>
          <meta property="og:image" content={fullImageUrl} />
          <meta property="og:image:secure_url" content={fullImageUrl} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
          <meta name="twitter:image" content={fullImageUrl} />
        </>
      )}

      {finalOgUrl && <meta property="og:url" content={finalOgUrl} />}

      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
