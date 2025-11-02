import { useState, FormEvent, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: {
      getResponse: () => string;
      reset: () => void;
    };
    onRecaptchaLoad: () => void;
  }
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  joinNewsletter: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    joinNewsletter: false,
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const recaptchaLoadedRef = useRef(false);

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = [];
      if (match[1]) parts.push(`(${match[1]}`);
      if (match[2]) parts.push(`) ${match[2]}`);
      if (match[3]) parts.push(`-${match[3]}`);
      return parts.join('');
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const recaptchaResponse = window.grecaptcha?.getResponse();
    if (!recaptchaResponse) {
      setRecaptchaError('Please complete the reCAPTCHA verification');
      return;
    }
    setRecaptchaError('');

    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form-submission`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          joinNewsletter: formData.joinNewsletter,
          recaptchaResponse: recaptchaResponse,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit form');
      }

      console.log('Form submitted successfully:', result);

      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        joinNewsletter: false,
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log('reCAPTCHA Site Key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);

    if (recaptchaLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('reCAPTCHA script loaded');
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);
    recaptchaLoadedRef.current = true;

    const checkRecaptcha = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.getResponse !== undefined) {
        console.log('reCAPTCHA loaded successfully');
        setRecaptchaReady(true);
        clearInterval(checkRecaptcha);
      }
    }, 100);

    return () => {
      clearInterval(checkRecaptcha);
      const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-stone-900 mb-4">
          Thank you!
        </h3>
        <p className="text-lg text-stone-600">
          We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-stone-900 mb-8">Send us a message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-stone-900 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="First name"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.firstName ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-stone-900 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last name"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.lastName ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-stone-900 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
              errors.email ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-stone-900 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-600 transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-stone-900 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can we help you?"
            rows={6}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
              errors.message ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3 py-2">
          <input
            type="checkbox"
            id="joinNewsletter"
            checked={formData.joinNewsletter}
            onChange={(e) => setFormData({ ...formData, joinNewsletter: e.target.checked })}
            className="mt-0.5 w-5 h-5 text-brand-600 border-stone-300 rounded focus:ring-2 focus:ring-brand-500"
          />
          <label htmlFor="joinNewsletter" className="text-sm text-stone-700 leading-relaxed">
            Yes, I'd like to receive updates and insights from Inner Edge
          </label>
        </div>

        <div className="my-6">
          <div className="flex justify-center">
            {recaptchaReady ? (
              <div
                className="g-recaptcha"
                data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              ></div>
            ) : (
              <div className="text-sm text-stone-500">Loading reCAPTCHA...</div>
            )}
          </div>
          {recaptchaError && (
            <p className="mt-2 text-sm text-red-600 text-center">{recaptchaError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-brand-300 text-brand-100 cursor-not-allowed opacity-50'
              : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
