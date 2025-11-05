import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { VisionBuilderStep1 } from './VisionBuilderStep1';
import { VisionBuilderStep2 } from './VisionBuilderStep2';
import { supabase } from '../lib/supabase';

export interface VisionSubmissionData {
  id?: string;
  name: string;
  email: string;
  area_of_life?: string;
  current_reality?: string;
  why_important?: string;
  being_words?: string[];
  doing_actions?: string[];
  having_outcomes?: string[];
  current_step: number;
}

export function VisionBuilderPage() {
  const { submissionId } = useParams<{ submissionId?: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionData, setSubmissionData] = useState<VisionSubmissionData>({
    name: '',
    email: '',
    current_step: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      loadSubmission(submissionId);
    }
  }, [submissionId]);

  const loadSubmission = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('vision_submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading submission:', fetchError);
        setError('Failed to load your vision. Please check your link and try again.');
        return;
      }

      if (!data) {
        setError('Vision submission not found. Please check your link and try again.');
        return;
      }

      setSubmissionData({
        id: data.id,
        name: data.name,
        email: data.email,
        area_of_life: data.area_of_life,
        current_reality: data.current_reality,
        why_important: data.why_important,
        being_words: data.being_words || [],
        doing_actions: data.doing_actions || [],
        having_outcomes: data.having_outcomes || [],
        current_step: data.current_step,
      });

      setCurrentStep(data.current_step);
    } catch (err) {
      console.error('Error loading submission:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Complete = async (name: string, email: string, submissionId: string) => {
    setSubmissionData({
      ...submissionData,
      id: submissionId,
      name,
      email,
      current_step: 2,
    });
    setCurrentStep(2);

    navigate(`/vision-builder/resume/${submissionId}`, { replace: true });
  };

  const handleStep2Complete = async (areaOfLife: string) => {
    if (!submissionData.id) {
      setError('Missing submission ID. Please start over.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('vision_submissions')
        .update({
          area_of_life: areaOfLife,
          current_step: 3,
          step_2_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'in_progress',
        })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        setError('Failed to save your progress. Please try again.');
        return;
      }

      setSubmissionData({
        ...submissionData,
        area_of_life: areaOfLife,
        current_step: 3,
      });

      setCurrentStep(3);
    } catch (err) {
      console.error('Error saving step 2:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading && !submissionData.id) {
    return (
      <>
        <SEOHead
          title="Create Your 1-Year Vision | Inner Edge"
          description="A guided process to design the life you want in the next 12 months"
          canonical="https://www.inneredge.co/vision-builder"
        />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-stone-600">Loading your vision...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead
          title="Create Your 1-Year Vision | Inner Edge"
          description="A guided process to design the life you want in the next 12 months"
          canonical="https://www.inneredge.co/vision-builder"
        />
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Oops!</h2>
            <p className="text-stone-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/vision-builder')}
              className="bg-brand-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-700 transition-all"
            >
              Start New Vision
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Create Your 1-Year Vision | Inner Edge"
        description="A guided process to design the life you want in the next 12 months"
        canonical="https://www.inneredge.co/vision-builder"
      />
      <Header />

      <div className="min-h-screen">
        {currentStep === 1 && (
          <VisionBuilderStep1
            onComplete={handleStep1Complete}
            initialData={submissionData}
          />
        )}

        {currentStep === 2 && (
          <VisionBuilderStep2
            onComplete={handleStep2Complete}
            onBack={handleBack}
            initialData={submissionData}
            isLoading={isLoading}
          />
        )}

        {currentStep >= 3 && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Coming Soon</h2>
            <p className="text-lg text-stone-600">
              Steps 3-6 are currently being developed.
            </p>
            <p className="text-stone-500 mt-4">
              Your progress has been saved. We'll notify you when the remaining steps are available.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
