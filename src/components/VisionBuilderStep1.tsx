import { useState, FormEvent } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep1Props {
  onComplete: (name: string, email: string, submissionId: string) => void;
  initialData: VisionSubmissionData;
}

export function VisionBuilderStep1({ onComplete, initialData }: VisionBuilderStep1Props) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('=== STEP 1 SUBMISSION STARTED ===');
    console.log('Name:', name);
    console.log('Email:', email);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to save to database...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

      const { data, error: insertError } = await supabase
        .from('vision_submissions')
        .insert({
          name: name.trim(),
          email: email.trim(),
          current_step: 1,
          status: 'started',
          step_1_completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('=== DATABASE INSERT ERROR ===');
        console.error('Error message:', insertError.message);
        console.error('Error code:', insertError.code);
        console.error('Error details:', insertError.details);
        console.error('Full error:', insertError);
        alert('Failed to start your vision. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!data) {
        console.error('=== NO DATA RETURNED ===');
        alert('Failed to create submission. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Database save successful!');
      console.log('Submission ID:', data.id);

      const submissionId = data.id;

      try {
        console.log('Attempting to send confirmation email...');
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vision-builder-submission`;

        const emailResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            submissionId: submissionId,
          }),
        });

        if (!emailResponse.ok) {
          console.warn('Failed to send confirmation email (non-critical)');
          const errorText = await emailResponse.text();
          console.warn('Email error response:', errorText);
        } else {
          console.log('Email sent successfully!');
        }
      } catch (emailError) {
        console.warn('Error sending confirmation email (non-critical):', emailError);
      }

      console.log('=== STEP 1 COMPLETE - Moving to Step 2 ===');
      onComplete(name.trim(), email.trim(), submissionId);
    } catch (err) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
      console.error('Full error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="text-white" size={40} />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Create Your 1-Year Vision
          </h1>

          <p className="text-xl sm:text-2xl text-brand-100 max-w-2xl mx-auto leading-relaxed">
            A guided process to design the life you want in the next 12 months
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-stone-900 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-stone-200 focus:border-brand-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <p className="mt-2 text-xs text-stone-500">
                We'll email you a link to save your progress and continue anytime
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group w-full px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-brand-300 text-brand-100 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Your Vision...
                </>
              ) : (
                <>
                  Begin Your Vision
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-6">
            Your vision is private and secure. We'll never share your information.
          </p>
        </div>

        <div className="text-center mt-8">
          <p className="text-brand-100 text-sm">
            Takes about 15-20 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
}
