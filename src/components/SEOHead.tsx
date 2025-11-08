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
  wordCount
}: SEOHeadProps) {
  const title = propTitle || 'Inner Edge';
  const description = propDescription || 'Transform your life from the inside out with Inner Edge.';
  const finalKeywords = keywords || 'mens coaching, life coaching for men, personal development, mindset coaching, emotional intelligence, leadership development, mens community, mens virtual community, mens online community';

  const defaultImage = 'https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png';
  const finalImage = propOgImage || defaultImage;
  const fullImageUrl = finalImage && finalImage.startsWith('http')
    ? finalImage
    : finalImage
      ? `${window.location.origin}${finalImage}`
      : defaultImage;

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
