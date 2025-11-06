import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep4Props {
  onComplete: (beingWords: string[]) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

const MIN_WORDS = 8;
const MAX_WORDS = 10;
const REQUIRED_CUSTOM_WORDS = 2;

const wordsByArea: Record<string, string[]> = {
  'health-fitness': [
    'Energized', 'Strong', 'Disciplined', 'Vibrant', 'Confident', 'Fit', 'Healthy', 'Active',
    'Powerful', 'Resilient', 'Agile', 'Athletic', 'Balanced', 'Vital', 'Transformed',
    'Capable', 'Alive', 'Present', 'Grounded', 'Radiant'
  ],
  'career-business': [
    'Focused', 'Successful', 'Strategic', 'Impactful', 'Confident', 'Purposeful', 'Innovative',
    'Leader', 'Visionary', 'Productive', 'Respected', 'Influential', 'Driven', 'Accomplished',
    'Professional', 'Competent', 'Masterful', 'Decisive', 'Clear', 'Authentic'
  ],
  'finances': [
    'Abundant', 'Secure', 'Wealthy', 'Wise', 'Disciplined', 'Free', 'Generous', 'Prosperous',
    'Stable', 'Confident', 'Strategic', 'Prudent', 'Responsible', 'Empowered', 'Successful',
    'Grateful', 'Relaxed', 'Clear', 'Intentional', 'Growing'
  ],
  'romantic-relationship': [
    'Loving', 'Present', 'Respectful', 'Passionate', 'Attentive', 'Grateful', 'Authentic',
    'Supportive', 'Playful', 'Vulnerable', 'Connected', 'Trustworthy', 'Patient', 'Kind',
    'Appreciative', 'Affectionate', 'Understanding', 'Open', 'Secure', 'Joyful'
  ],
  'friendships-community': [
    'Connected', 'Supportive', 'Authentic', 'Present', 'Generous', 'Loyal', 'Fun', 'Engaged',
    'Caring', 'Trustworthy', 'Reliable', 'Warm', 'Inclusive', 'Accepting', 'Encouraging',
    'Available', 'Grateful', 'Joyful', 'Open', 'Genuine'
  ],
  'personal-development': [
    'Growing', 'Aware', 'Intentional', 'Disciplined', 'Curious', 'Reflective', 'Open',
    'Courageous', 'Evolving', 'Mindful', 'Focused', 'Clear', 'Committed', 'Patient',
    'Humble', 'Authentic', 'Self-aware', 'Purposeful', 'Present', 'Transforming'
  ],
  'family-relationships': [
    'Present', 'Loving', 'Patient', 'Understanding', 'Supportive', 'Connected', 'Grateful',
    'Respectful', 'Available', 'Attentive', 'Forgiving', 'Kind', 'Accepting', 'Warm',
    'Reliable', 'Caring', 'Genuine', 'Peaceful', 'Engaged', 'Appreciative'
  ],
  'spirituality': [
    'Connected', 'Peaceful', 'Present', 'Grounded', 'Faithful', 'Grateful', 'Aligned',
    'Aware', 'Centered', 'Trusting', 'Open', 'Reverent', 'Still', 'Contemplative',
    'Devoted', 'Clear', 'Awakened', 'Attuned', 'Serene', 'Mindful'
  ],
  'fun-recreation': [
    'Joyful', 'Playful', 'Adventurous', 'Free', 'Spontaneous', 'Energized', 'Relaxed',
    'Creative', 'Present', 'Carefree', 'Enthusiastic', 'Happy', 'Engaged', 'Alive',
    'Open', 'Excited', 'Light', 'Fun-loving', 'Vibrant', 'Grateful'
  ],
};

export function VisionBuilderStep4({ onComplete, onBack, initialData, isLoading }: VisionBuilderStep4Props) {
  const [selectedWords, setSelectedWords] = useState<string[]>(initialData.being_words || []);
  const [customWords, setCustomWords] = useState<string[]>(['', '']);

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

  const availableWords = wordsByArea[initialData.area_of_life || ''] || [];

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      if (selectedWords.length < MAX_WORDS) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const handleCustomWordChange = (index: number, value: string) => {
    const newCustomWords = [...customWords];
    newCustomWords[index] = value;
    setCustomWords(newCustomWords);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validCustomWords = customWords.filter(w => w.trim().length > 0).map(w => w.trim());
    const allWords = [...selectedWords, ...validCustomWords];

    if (allWords.length >= MIN_WORDS && allWords.length <= MAX_WORDS) {
      onComplete(allWords);
    }
  };

  const validCustomWordsCount = customWords.filter(w => w.trim().length > 0).length;
  const totalSelected = selectedWords.length + validCustomWordsCount;
  const hasRequiredCustomWords = validCustomWordsCount >= REQUIRED_CUSTOM_WORDS;
  const canContinue = totalSelected >= MIN_WORDS && totalSelected <= MAX_WORDS && hasRequiredCustomWords;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Step 3 of 6
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '50%' }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            How do you want to BE in your {getAreaTitle(initialData.area_of_life)}?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Select 6-8 from the list below, and add 2 of your own
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-900">Select Your Words</h3>
              <div className={`text-lg font-bold ${
                totalSelected < MIN_WORDS ? 'text-orange-600' :
                totalSelected > MAX_WORDS ? 'text-red-600' :
                'text-brand-600'
              }`}>
                {totalSelected}/{MAX_WORDS} words selected
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {availableWords.map((word) => {
                const isSelected = selectedWords.includes(word);
                const isDisabled = !isSelected && selectedWords.length >= MAX_WORDS;

                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => toggleWord(word)}
                    disabled={isDisabled || isLoading}
                    className={`px-5 py-3 rounded-full font-semibold text-base transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-md scale-105'
                        : isDisabled
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-white border-2 border-stone-200 text-stone-700 hover:border-brand-400 hover:shadow-sm'
                    }`}
                  >
                    {word}
                    {isSelected && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t-2 border-stone-100 pt-6 mt-6">
              <h4 className="text-lg font-bold text-stone-900 mb-2">
                Add 2 custom words <span className="text-red-600">*</span>
              </h4>
              <p className="text-sm text-stone-600 mb-4">These are required and count toward your total</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customWords.map((word, index) => (
                  <input
                    key={index}
                    type="text"
                    value={word}
                    onChange={(e) => handleCustomWordChange(index, e.target.value)}
                    placeholder={`Custom word ${index + 1} (required)`}
                    maxLength={20}
                    className="px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-600 transition-all"
                    disabled={isLoading}
                    required
                  />
                ))}
              </div>
            </div>

            {(totalSelected < MIN_WORDS || !hasRequiredCustomWords) && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-sm text-orange-800">
                  {!hasRequiredCustomWords
                    ? `You must add ${REQUIRED_CUSTOM_WORDS} custom words to continue`
                    : `Please select at least ${MIN_WORDS - totalSelected} more word${MIN_WORDS - totalSelected !== 1 ? 's' : ''} to continue`}
                </p>
              </div>
            )}

            {totalSelected > MAX_WORDS && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-sm text-red-800">
                  You've selected {totalSelected - MAX_WORDS} too many word{totalSelected - MAX_WORDS !== 1 ? 's' : ''}. Please remove some to continue.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
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
              disabled={!canContinue || isLoading}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                !canContinue || isLoading
                  ? 'bg-brand-300 text-brand-100 cursor-not-allowed'
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
