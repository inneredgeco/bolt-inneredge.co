import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BusinessInfo {
  business_name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  phone: string;
  email: string;
  website: string;
  business_type: string;
  description: string;
  founded_year: number;
  service_area: string[];
  social_profiles: Record<string, string>;
  hours_of_operation: any;
  logo_url: string;
  image_url: string;
  price_range: string;
  accepts_reservations: boolean;
}

export default function LocalBusinessSchema() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  useEffect(() => {
    async function fetchBusinessInfo() {
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .maybeSingle();

      if (data && !error) {
        setBusinessInfo(data);
      }
    }

    fetchBusinessInfo();
  }, []);

  if (!businessInfo) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": businessInfo.business_type,
    "@id": businessInfo.website,
    "name": businessInfo.business_name,
    "description": businessInfo.description,
    "url": businessInfo.website,
    "logo": `${businessInfo.website}${businessInfo.logo_url}`,
    "image": `${businessInfo.website}${businessInfo.image_url}`,
    "telephone": businessInfo.phone,
    "email": businessInfo.email,
    "priceRange": businessInfo.price_range,
    "foundingDate": businessInfo.founded_year.toString(),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo.address_street,
      "addressLocality": businessInfo.address_city,
      "addressRegion": businessInfo.address_state,
      "postalCode": businessInfo.address_zip,
      "addressCountry": businessInfo.address_country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "32.7677",
      "longitude": "-117.0231"
    },
    "areaServed": businessInfo.service_area.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "serviceType": [
      "Life Coaching",
      "Emotional Wellness Coaching",
      "Personal Development",
      "Emotional Intelligence Training",
      "Transformational Coaching"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Coaching Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Individual Coaching Sessions",
            "description": "One-on-one transformative coaching sessions focused on emotional wellness and personal growth"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "RISE Course",
            "description": "Comprehensive emotional release and personal transformation program"
          }
        }
      ]
    },
    "makesOffer": {
      "@type": "Offer",
      "availableDeliveryMethod": "OnlineOnly",
      "availability": "https://schema.org/InStock"
    },
    "openingHoursSpecification": businessInfo.hours_of_operation,
    "sameAs": Object.values(businessInfo.social_profiles).filter(Boolean),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "47"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
