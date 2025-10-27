import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
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
  title,
  description,
  keywords = 'mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development, mens community, mens virtual community, mens online community',
  ogImage,
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
  useEffect(() => {
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
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    updateMetaTag('geo.region', `US-${region}`);
    updateMetaTag('geo.placename', locality);
    updateMetaTag('geo.position', '32.7677;-117.0231');
    updateMetaTag('ICBM', '32.7677, -117.0231');

    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    
    const defaultImage = 'https://inner-edge-audio-files.b-cdn.net/Inner-Edge-Open-Graph.png';
    const finalImage = ogImage ? ogImage : (type === 'website' ? defaultImage : '');
    
    if (finalImage) {
      const fullImageUrl = finalImage.startsWith('http') ? finalImage : `${window.location.origin}${finalImage}`;
      updateMetaTag('og:image', fullImageUrl, true);
      updateMetaTag('og:image:type', 'image/png', true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
      updateMetaTag('twitter:image', fullImageUrl);
    }
    
    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
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

    if (type === 'article' && ogUrl && finalImage) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]#article-schema') as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('id', 'article-schema');
        document.head.appendChild(scriptElement);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': description,
        'mainEntityOfPage': {
          '@type': 'WebP