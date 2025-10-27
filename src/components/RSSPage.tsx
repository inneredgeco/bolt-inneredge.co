import { useEffect } from 'react';
import { generateRSS } from '../utils/generateRSS';

export function RSSPage() {
  useEffect(() => {
    generateRSS().then((rssContent) => {
      const blob = new Blob([rssContent], { type: 'application/rss+xml' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    });
  }, []);

  return null;
}
