import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function NotFound() {
  useEffect(() => {
    document.title = '404 - Page Not Found';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <Link to="/" className="inline-block mb-8">
          <img
            src="https://inner-edge-audio-files.b-cdn.net/Inner%20Edge%20Main.png"
            alt="Inner Edge - Mens Coaching and Personal Development"
            className="h-16 w-auto mx-auto"
          />
        </Link>

        <h1 className="text-8xl font-bold text-slate-900 mb-4">404</h1>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-brand-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-600 transition-colors shadow-lg hover:shadow-xl"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
