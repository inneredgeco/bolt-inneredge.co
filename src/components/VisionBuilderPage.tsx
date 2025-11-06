import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { VisionBuilderStep1 } from './VisionBuilderStep1';
import { VisionBuilderStep2 } from './VisionBuilderStep2';
import { VisionBuilderStep3 } from './VisionBuilderStep3';
import { VisionBuilderStep4 } from './VisionBuilderStep4';
import { VisionBuilderStep5 } from './VisionBuilderStep5';
import { VisionBuilderStep6 } from './VisionBuilderStep6';
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
    console.log('=== LOADING SUBMISSION ===');
    console.log('Submission ID:', id);

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
        console.error('No submission data found');
        setError('Vision submission not found. Please check your link and try again.');
        return;
      }

      console.log('Submission loaded successfully');
      console.log('Current step from database:', data.current_step);

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

      console.log('Setting currentStep to:', data.current_step);
      setCurrentStep(data.current_step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('=== SUBMISSION LOADED - SHOULD SHOW STEP', data.current_step, '===');
    } catch (err) {
      console.error('Error loading submission:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Complete = async (name: string, email: string, submissionId: string) => {
    console.log('=== STEP 1 COMPLETE CALLBACK ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Submission ID:', submissionId);

    setSubmissionData({
      ...submissionData,
      id: submissionId,
      name,
      email,
      current_step: 2,
    });

    console.log('Setting currentStep to 2');
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('Navigating to resume URL');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving step 2:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Complete = async (currentReality: string, whyImportant: string) => {
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
          current_reality: currentReality,
          why_important: whyImportant,
          current_step: 4,
          step_3_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        setError('Failed to save your progress. Please try again.');
        return;
      }

      setSubmissionData({
        ...submissionData,
        current_reality: currentReality,
        why_important: whyImportant,
        current_step: 4,
      });

      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving step 3:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Complete = async (beingWords: string[]) => {
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
          being_words: beingWords,
          current_step: 5,
          step_4_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        setError('Failed to save your progress. Please try again.');
        return;
      }

      setSubmissionData({
        ...submissionData,
        being_words: beingWords,
        current_step: 5,
      });

      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving step 4:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep5Complete = async (doingActions: string[]) => {
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
          doing_actions: doingActions,
          current_step: 6,
          step_5_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        setError('Failed to save your progress. Please try again.');
        return;
      }

      setSubmissionData({
        ...submissionData,
        doing_actions: doingActions,
        current_step: 6,
      });

      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving step 5:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep6Complete = async (havingOutcomes: string[]) => {
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
          having_outcomes: havingOutcomes,
          current_step: 7,
          step_6_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'generating',
        })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        setError('Failed to save your progress. Please try again.');
        setIsLoading(false);
        return;
      }

      setSubmissionData({
        ...submissionData,
        having_outcomes: havingOutcomes,
        current_step: 7,
      });

      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-vision`;

        const visionResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            submissionId: submissionData.id,
          }),
        });

        if (!visionResponse.ok) {
          const errorData = await visionResponse.json();
          console.error('Vision generation error:', errorData);
          setError('Failed to generate your vision. Please try again.');
          setIsLoading(false);
          return;
        }

        const visionData = await visionResponse.json();
        console.log('Vision generated successfully:', visionData);

        navigate(`/vision-builder/results/${submissionData.id}`);

      } catch (visionError) {
        console.error('Error calling vision generation:', visionError);
        setError('Failed to generate your vision. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error saving step 6:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  console.log('=== RENDERING VISION BUILDER ===');
  console.log('currentStep:', currentStep);
  console.log('submissionData.id:', submissionData.id);
  console.log('submissionData.current_step:', submissionData.current_step);

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
          <>
            {console.log('Rendering Step 1')}
            <VisionBuilderStep1
              onComplete={handleStep1Complete}
              initialData={submissionData}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            {console.log('Rendering Step 2')}
            <VisionBuilderStep2
              onComplete={handleStep2Complete}
              onBack={handleBack}
              initialData={submissionData}
              isLoading={isLoading}
            />
          </>
        )}

        {currentStep === 3 && (
          <VisionBuilderStep3
            onComplete={handleStep3Complete}
            onBack={handleBack}
            initialData={submissionData}
            isLoading={isLoading}
          />
        )}

        {currentStep === 4 && (
          <VisionBuilderStep4
            onComplete={handleStep4Complete}
            onBack={handleBack}
            initialData={submissionData}
            isLoading={isLoading}
          />
        )}

        {currentStep === 5 && (
          <VisionBuilderStep5
            onComplete={handleStep5Complete}
            onBack={handleBack}
            initialData={submissionData}
            isLoading={isLoading}
          />
        )}

        {currentStep === 6 && (
          <VisionBuilderStep6
            onComplete={handleStep6Complete}
            onBack={handleBack}
            initialData={submissionData}
            isLoading={isLoading}
          />
        )}

        {currentStep >= 7 && (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800">
            <div className="text-center px-4">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Creating your vision...</h2>
              <p className="text-xl text-brand-100 max-w-md mx-auto mb-2">
                We're crafting your personalized 1-year vision based on your responses
              </p>
              <p className="text-lg text-brand-200 max-w-md mx-auto">
                This may take 30-60 seconds
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
