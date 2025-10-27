import { useState } from 'react';
import { User, Mail, MessageSquare } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
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
      const apiKey = '1128782-4061447701527616138169404029449-rc83zGBS5E1XzqgAzsIhDbJHXpbN2Pxw0vYOP3cxJPTOK7Csad';
      const userCode = '11394E';

      const getUserResponse = await fetch('https://api.lessannoyingcrm.com/v2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({
          Function: 'GetUser',
          Parameters: {
            UserCode: userCode,
          },
        }),
      });

      const getUserResult = await getUserResponse.json();

      if (!getUserResponse.ok || !getUserResult.Success) {
        throw new Error('Failed to get user information');
      }

      const userId = getUserResult.UserId;
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const parameters: Record<string, unknown> = {
        IsCompany: false,
        AssignedTo: userId,
        Name: fullName,
      };

      if (formData.email) {
        parameters.Email = [{ Email: formData.email, Type: 'Work' }];
      }

      if (formData.phone) {
        parameters.Phone = [{ Phone: formData.phone, Type: 'Work' }];
      }

      const response = await fetch('https://api.lessannoyingcrm.com/v2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({
          Function: 'CreateContact',
          Parameters: parameters,
        }),
      });

      const result = await response.json();

      if (response.ok && result.Success) {
        const contactId = result.ContactId;

        if (formData.message && contactId) {
          await fetch('https://api.lessannoyingcrm.com/v2/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': apiKey,
            },
            body: JSON.stringify({
              Function: 'CreateNote',
              Parameters: {
                ContactId: contactId,
                Note: formData.message,
              },
            }),
          });
        }

        setSubmitMessage({
          type: 'success',
          text: '✓ Message sent successfully! We\'ll get back to you soon.'
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(result.Message || 'Submission failed');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Something went wrong. Please try again or email us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900 mb-2">
            First Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 hover:border-slate-400"
              placeholder="John"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 hover:border-slate-400"
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
          Email *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 hover:border-slate-400"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 hover:border-slate-400"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
          Message *
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <MessageSquare className="h-5 w-5 text-slate-400" />
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 hover:border-slate-400 resize-none"
            placeholder="Tell us how we can help you..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {submitMessage && (
        <div
          className={`p-4 rounded-lg text-center font-medium transition-all duration-300 ${
            submitMessage.type === 'success'
              ? 'bg-brand-50 text-brand-800 border border-brand-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitMessage.text}
        </div>
      )}
    </form>
  );
}
