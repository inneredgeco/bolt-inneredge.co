import { useState } from 'react';
import { Mail, User } from 'lucide-react';

export function BlogNewsletterSignup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-newsletter-signup`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          firstName: firstName,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✓ Check your email (spam folder) to confirm your subscription!' });
        setFirstName('');
        setEmail('');
      } else {
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-stone-50 border-t border-b border-stone-200 py-8 my-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-stone-900 mb-2">
            Enjoyed this post? Get more insights.
          </h3>
          <p className="text-stone-600">
            Join the Inner Edge newsletter for weekly insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative sm:flex-[1.5]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-stone-400" />
              </div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-stone-900 placeholder-stone-400 hover:border-stone-400"
              />
            </div>

            <div className="relative sm:flex-[2]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-stone-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-stone-900 placeholder-stone-400 hover:border-stone-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap sm:flex-shrink-0"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <div
              className={`text-sm text-center py-2 px-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
