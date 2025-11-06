import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep3Props {
  onComplete: (currentReality: string, whyImportant: string) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

const MIN_CHARS = 250;
const MAX_CHARS = 500;

export function VisionBuilderStep3({ onComplete, onBack, initialData, isLoading }: VisionBuilderStep3Props) {
  const [currentReality, setCurrentReality] = useState(initialData.current_reality || '');
  const [whyImportant, setWhyImportant] = useState(initialData.why_important || '');

  const getAreaTitle = (areaId: string | undefined): string => {
    if (!areaId) return 'your selected area';

    const areaMap: Record<string, string> = {
      'health-fitness': 'Health & Fitness',
      'career-business': 'Career & Business',
      'finances': 'Finances',
      'romantic-relationship': 'Romantic Relationship',
      'friendships-community': 'Friendships & Community',
      'personal-development': 'Personal Development',
      'family-relationships': 'Family Relationships',
      'spirituality': 'Spirituality',
      'fun-recreation': 'Fun & Recreation',
    };

    return areaMap[areaId] || areaId;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentReality.trim().length >= MIN_CHARS && whyImportant.trim().length >= MIN_CHARS) {
      onComplete(currentReality.trim(), whyImportant.trim());
    }
  };

  const currentRealityLength = currentReality.length;
  const whyImportantLength = whyImportant.length;

  const currentRealityValid = currentRealityLength >= MIN_CHARS;
  const whyImportantValid = whyImportantLength >= MIN_CHARS;
  const canContinue = currentRealityValid && whyImportantValid;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center gap-2 text-stone-600 hover:text-brand-600 transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>

            <div className="text-sm font-semibold text-stone-500">
              Step 2 of 6
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '33.33%' }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            Tell us about your {getAreaTitle(initialData.area_of_life)} journey
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Help us personalize your vision by sharing where you are now and why this matters to you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 space-y-8">
          <div>
            <label htmlFor="currentReality" className="block text-lg font-semibold text-stone-900 mb-3">
              Where are you now? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="currentReality"
              value={currentReality}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setCurrentReality(e.target.value);
                }
              }}
              placeholder="Describe your current situation or the challenge you're facing..."
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
                currentRealityValid || currentRealityLength === 0
                  ? 'border-stone-200 focus:border-brand-600'
                  : 'border-red-300 focus:border-red-500'
              }`}
              disabled={isLoading}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm ${currentRealityValid ? 'text-stone-500' : 'text-red-600'}`}>
                {currentRealityValid
                  ? 'Great! Continue writing if you want (optional)'
                  : currentRealityLength > 0
                  ? 'Please write at least 250 characters to help us personalize your vision'
                  : 'Required field - minimum 250 characters'}
              </p>
              <p className={`text-sm font-medium ${
                currentRealityValid
                  ? 'text-green-600'
                  : currentRealityLength > MIN_CHARS * 0.5
                  ? 'text-orange-600'
                  : 'text-stone-400'
              }`}>
                {currentRealityLength}/{MIN_CHARS} minimum
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="whyImportant" className="block text-lg font-semibold text-stone-900 mb-3">
              Why is this transformation important to you? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="whyImportant"
              value={whyImportant}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setWhyImportant(e.target.value);
                }
              }}
              placeholder="What will this change mean for your life?..."
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
                whyImportantValid || whyImportantLength === 0
                  ? 'border-stone-200 focus:border-brand-600'
                  : 'border-red-300 focus:border-red-500'
              }`}
              disabled={isLoading}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm ${whyImportantValid ? 'text-stone-500' : 'text-red-600'}`}>
                {whyImportantValid
                  ? 'Great! Continue writing if you want (optional)'
                  : whyImportantLength > 0
                  ? 'Please write at least 250 characters to help us personalize your vision'
                  : 'Required field - minimum 250 characters'}
              </p>
              <p className={`text-sm font-medium ${
                whyImportantValid
                  ? 'text-green-600'
                  : whyImportantLength > MIN_CHARS * 0.5
                  ? 'text-orange-600'
                  : 'text-stone-400'
              }`}>
                {whyImportantLength}/{MIN_CHARS} minimum
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-stone-700 hover:bg-stone-100 transition-all disabled:opacity-50"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <button
              type="submit"
              disabled={isLoading || !canContinue}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                isLoading || !canContinue
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
