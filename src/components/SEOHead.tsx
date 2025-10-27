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
}

export function SEOHead({
  title,
  description,
  keywords = 'mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development',
  ogImage = 'https://inner-edge-audio-files.b-cdn.net/Inner-Edge-Open-Graph.png',
  ogUrl,
  canonical,
  locality = 'San Diego',
  region = 'CA'
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
    if (keywords) updateMetaTag('keywords', keywords);

    updateMetaTag('geo.region', `US-${region}`);
    updateMetaTag('geo.placename', locality);
    updateMetaTag('geo.position', '32.7677;-117.0231');
    updateMetaTag('ICBM', '32.7677, -117.0231');

    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      updateMetaTag('og:image', fullImageUrl, true);
      updateMetaTag('og:image:type', 'image/png', true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
    }
    if (ogUrl) updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:site_name', 'Inner Edge', true);

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      updateMetaTag('twitter:image', fullImageUrl);
    }

    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }
  }, [title, description, keywords, ogImage, ogUrl, canonical]);

  return null;
}
