import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
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
  pagePath?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackOgImage?: string;
}

export function SEOHead({
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
  wordCount,
  pagePath,
  fallbackTitle,
  fallbackDescription,
  fallbackOgImage
}: SEOHeadProps) {
  const title = propTitle || fallbackTitle || 'Inner Edge';
  const description = propDescription || fallbackDescription || 'Transform your life from the inside out with Inner Edge.';
  const defaultKeywords = 'mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development, mens community, mens virtual community, mens online community';
  const finalKeywords = keywords || defaultKeywords;

  const defaultImage = 'https://cdn.inneredge.co/og-images/home-ie-open-graph.png';
  const finalImage = propOgImage || fallbackOgImage || defaultImage;
  const fullImageUrl = finalImage && finalImage.startsWith('http')
    ? finalImage
    : finalImage
      ? `${window.location.origin}${finalImage}`
      : defaultImage;

  const finalOgUrl = ogUrl;
  const finalLocality = locality;
  const finalRegion = region;

  const getImageType = (url: string): string => {
    if (!url) return 'image/jpeg';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.png') || lowerUrl.includes('.png?')) return 'image/png';
    if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg') || lowerUrl.includes('.jpg?') || lowerUrl.includes('.jpeg?')) return 'image/jpeg';
    if (lowerUrl.endsWith('.webp') || lowerUrl.includes('.webp?')) return 'image/webp';
    if (lowerUrl.endsWith('.gif') || lowerUrl.includes('.gif?')) return 'image/gif';
    return 'image/jpeg';
  };

  const imageType = getImageType(fullImageUrl);

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
      <meta name="keywords" content={finalKeywords} />

      <meta name="geo.region" content={`US-${finalRegion}`} />
      <meta name="geo.placename" content={finalLocality} />
      <meta name="geo.position" content="32.7677;-117.0231" />
      <meta name="ICBM" content="32.7677, -117.0231" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Inner Edge" />

      <meta property="og:image" content={fullImageUrl || defaultImage} />
      <meta property="og:image:secure_url" content={fullImageUrl || defaultImage} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:image" content={fullImageUrl || defaultImage} />

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
