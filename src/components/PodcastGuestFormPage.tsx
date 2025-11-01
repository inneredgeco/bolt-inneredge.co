import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Mic } from 'lucide-react';

export function PodcastGuestFormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    whyGuest: '',
    website: '',
    facebook: '',
    instagram: '',
    exercise: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const apiUrl = `${supabaseUrl}/functions/v1/podcast-guest-submission`;

      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        profession: formData.profession,
        why_guest: formData.whyGuest,
        exercise: formData.exercise,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('Submission errors:', result.errors);
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        profession: '',
        whyGuest: '',
        website: '',
        facebook: '',
        instagram: '',
        exercise: ''
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SEOHead
        title="Podcast Guest Application - Inner Edge Podcast"
        description="Apply to be a guest on the Inner Edge Podcast. Share your expertise with men who are ready for transformation."
        keywords="podcast guest application, mens coaching podcast, inner edge podcast, coaching application"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/podcast-guest-form"
        ogUrl="https://www.inneredge.co/podcast-guest-form"
      />
      <Header />

      <div className="bg-gradient-to-br from-brand-500 via-brand-700 to-brand-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mic className="w-16 h-16 mx-auto mb-6 text-brand-200" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Be a Podcast Guest
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Share your story on the Inner Edge Podcast
          </p>
        </div>
      </div>

      <div className="flex-grow py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-stone-900 mb-4">
                  Thank you!
                </h2>
                <p className="text-lg text-stone-600">
                  We've received your application and sent a confirmation email. We'll be in touch within 3-5 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="fullName" className="block text-stone-900 font-bold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-stone-900 font-bold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-stone-900 font-bold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="website" className="block text-stone-900 font-bold mb-2">
                    Website *
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    required
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="facebook" className="block text-stone-900 font-bold mb-2">
                    Facebook *
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    required
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourprofile or @yourhandle"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="instagram" className="block text-stone-900 font-bold mb-2">
                    Instagram *
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    required
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourhandle or @yourhandle"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="profession" className="block text-stone-900 font-bold mb-2">
                    What do you do? / Your profession *
                  </label>
                  <textarea
                    id="profession"
                    name="profession"
                    required
                    value={formData.profession}
                    onChange={handleChange}
                    rows={3}
                    placeholder="I'm a men's coach specializing in..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors resize-none"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="whyGuest" className="block text-stone-900 font-bold mb-2">
                    Why would you be a great podcast guest? *
                  </label>
                  <textarea
                    id="whyGuest"
                    name="whyGuest"
                    required
                    value={formData.whyGuest}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us about your expertise, your story, and what unique perspective you'd bring to our listeners..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors resize-none"
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="exercise" className="block text-stone-900 font-bold mb-2">
                    What practical exercise or experience would you lead? *
                  </label>
                  <textarea
                    id="exercise"
                    name="exercise"
                    required
                    value={formData.exercise}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the 10-15 minute exercise you'd guide listeners through during the podcast..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-600 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
