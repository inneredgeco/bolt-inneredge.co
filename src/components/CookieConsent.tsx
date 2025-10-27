import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-6 shadow-2xl z-50 border-t-2 border-teal-600">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm sm:text-base leading-relaxed">
            We use cookies to enhance your browsing experience and analyze our traffic.
            By clicking "Accept", you consent to our use of cookies.{' '}
            <a
              href="/privacy-policy"
              className="text-teal-400 hover:text-teal-300 underline"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-6 py-2 border-2 border-gray-600 text-gray-300 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-brand-500 text-white rounded-full font-semibold hover:bg-brand-600 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
