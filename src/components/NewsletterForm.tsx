import { useState } from 'react';
import { Mail, User } from 'lucide-react';

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const apiKey = 'fd_key_6f6209abe2024b23ab120d0b79eadf8b.K22hdBBKP7iLAmxhcqIv8M6LhLhMvekQEsTBp3tC5XbGTM0ljLSgHHBYuEzH5z8FLoi1zgzxGPBxIJnap4lZoawV33XaUHA2y3JTbNNJc6NVckqrPbDKFECoUvEsVKUXg6bV0riyo6TVnSqLMli7DuUnzEPaokhvAdOxJsPh4aMmnFKBetRu9oDdMPRAhdqM';

      const response = await fetch('https://api.flodesk.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(apiKey + ':')
        },
        body: JSON.stringify({
          first_name: firstName,
          email: email,
          segment_ids: ['68d46512d9763da82ebac86d'],
          double_optin: true
        })
      });

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: '🎉 Success! Check your email (and spam folder) to confirm and get your free guide.'
        });
        setEmail('');
        setFirstName('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-100">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="text-center mb-5">
              <div className="inline-block mb-2 px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-semibold">
                FREE RESOURCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                Vision Formula
              </h2>
              <p className="text-base text-gray-700 max-w-xl mx-auto">
                Download your free guide and learn what is required to create a vision for your life.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="space-y-2.5 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold py-2.5 px-6 rounded-lg hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
              >
                {isSubmitting ? 'Getting your guide...' : 'Get Free Guide'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Unsubscribe anytime. We respect your privacy.
              </p>

              {submitMessage && (
                <div
                  className={`mt-6 p-4 rounded-lg text-center font-medium transition-all duration-300 ${
                    submitMessage.type === 'success'
                      ? 'bg-brand-50 text-brand-800 border border-brand-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
