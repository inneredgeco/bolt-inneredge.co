import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (loading) return;

    console.log('SEOHead: Rendering meta tags for', pagePath || 'custom');
    console.log('SEOHead: Using title:', title);
    console.log('SEOHead: Using description:', description);
    console.log('SEOHead: Using og_image:', ogImage);
    console.log('SEOHead: Database data:', !!seoData);

    document.title = title;

    const updateMetaTag = (property: string, content: string, useProperty = false) => {
      const attribute = useProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', finalKeywords || defaultKeywords);

    updateMetaTag('geo.region', `US-${finalRegion}`);
    updateMetaTag('geo.placename', finalLocality);
    updateMetaTag('geo.position', '32.7677;-117.0231');
    updateMetaTag('ICBM', '32.7677, -117.0231');

    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);

    const defaultImage = 'https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png';
    const finalImage = ogImage || (type === 'website' ? defaultImage : '');

    if (finalImage) {
      const fullImageUrl = finalImage.startsWith('http') ? finalImage : `${window.location.origin}${finalImage}`;
      updateMetaTag('og:image', fullImageUrl, true);
      updateMetaTag('og:image:secure_url', fullImageUrl, true);
      updateMetaTag('og:image:type', 'image/png', true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
      updateMetaTag('og:image:alt', title, true);
      updateMetaTag('twitter:image', fullImageUrl);
    } else {
      const ogImageElement = document.querySelector('meta[property="og:image"]');
      if (ogImageElement) {
        ogImageElement.remove();
      }
    }

    if (finalOgUrl) {
      updateMetaTag('og:url', finalOgUrl, true);
    }
    updateMetaTag('og:site_name', 'Inner Edge', true);

    if (type === 'article') {
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
    }

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);

    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }

    if (type === 'article' && finalOgUrl && finalImage) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]#article-schema') as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('id', 'article-schema');
        document.head.appendChild(scriptElement);
      }

      const structuredData = {
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
      };

      scriptElement.textContent = JSON.stringify(structuredData);
    } else {
      const existingScript = document.querySelector('script[type="application/ld+json"]#article-schema');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [loading, title, description, finalKeywords, ogImage, finalOgUrl, canonical, finalLocality, finalRegion, type, author, publishedTime, modifiedTime, wordCount, seoData, pagePath]);

  return null;
}
