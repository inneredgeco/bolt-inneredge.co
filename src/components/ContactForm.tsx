import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

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
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

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

    if (!recaptchaVerified) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Form submitted:', formData);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        joinNewsletter: false,
      });
      setRecaptchaVerified(false);

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

  const handleRecaptchaChange = () => {
    setRecaptchaVerified(true);
  };

  if (submitSuccess) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-teal-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-2">
            Thank you!
          </h3>
          <p className="text-stone-600">
            We'll be in touch soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Send us a message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-stone-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="First name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                errors.firstName ? 'border-red-500' : 'border-stone-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-stone-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                errors.lastName ? 'border-red-500' : 'border-stone-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-stone-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can we help you?"
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${
              errors.message ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="joinNewsletter"
            checked={formData.joinNewsletter}
            onChange={(e) => setFormData({ ...formData, joinNewsletter: e.target.checked })}
            className="mt-1 w-4 h-4 text-teal-600 border-stone-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="joinNewsletter" className="text-sm text-stone-600">
            Yes, I'd like to receive updates and insights from Inner Edge
          </label>
        </div>

        <div className="bg-stone-100 border border-stone-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recaptcha"
              checked={recaptchaVerified}
              onChange={handleRecaptchaChange}
              className="w-5 h-5 text-teal-600 border-stone-400 rounded focus:ring-teal-500"
            />
            <label htmlFor="recaptcha" className="text-sm text-stone-700 font-medium">
              I'm not a robot (reCAPTCHA placeholder)
            </label>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Note: This is a placeholder. Google reCAPTCHA will be integrated in the next step.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !recaptchaVerified}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            isSubmitting || !recaptchaVerified
              ? 'bg-stone-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
