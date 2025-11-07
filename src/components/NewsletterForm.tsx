import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function NewsletterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== VISION BUILDER SIGN-UP STARTED ===');
    console.log('Name:', name);
    console.log('Email:', email);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating vision submission in database...');

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
        console.error('Database insert error:', insertError);
        alert('Failed to start your vision. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!data) {
        console.error('No data returned from database');
        alert('Failed to create submission. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Database save successful! Submission ID:', data.id);
      const submissionId = data.id;

      console.log('Updating current_step to 2...');
      const { error: updateError } = await supabase
        .from('vision_submissions')
        .update({
          current_step: 2,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Error updating current_step:', updateError);
      } else {
        console.log('current_step updated to 2 successfully');
      }

      console.log('Adding to Flodesk Vision Builder segment...');
      try {
        const flodeskApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-to-flodesk-vision-segment`;

        const flodeskResponse = await fetch(flodeskApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        });

        if (!flodeskResponse.ok) {
          console.error('Flodesk integration failed:', await flodeskResponse.text());
        } else {
          console.log('Successfully added to Flodesk Vision Builder segment');
        }
      } catch (flodeskError) {
        console.error('Error calling Flodesk integration:', flodeskError);
      }

      console.log('=== SIGN-UP COMPLETE - Navigating to vision builder ===');
      navigate(`/vision-builder/resume/${submissionId}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: '#2d7471' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="text-center mb-5">
              <div className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#a8e0da', color: '#2d7471' }}>
                FREE RESOURCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2 leading-tight" style={{ color: '#1a1a1a' }}>
                Create Your 1-Year Vision
              </h2>
              <p className="text-base font-body max-w-xl mx-auto" style={{ color: '#4a4a4a' }}>
                A guided process to design the life you want in the next 12 months
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-400 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-400 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ background: '#8ad6ce', color: '#1a1a1a' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Starting Your Vision...
                  </>
                ) : (
                  <>
                    Begin Your Vision
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Your vision is private and secure. We'll never share your information.
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                Takes about 10 minutes to complete
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
