import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep4Props {
  onComplete: (beingWords: string[]) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

const MAX_LIST_WORDS = 8;
const REQUIRED_CUSTOM_WORDS = 2;
const TOTAL_WORDS = MAX_LIST_WORDS + REQUIRED_CUSTOM_WORDS;

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
      if (selectedWords.length < MAX_LIST_WORDS) {
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
    console.log('=== STEP 4 CONTINUE CLICKED ===');

    const validCustomWords = customWords.filter(w => w.trim().length > 0).map(w => w.trim());
    const allWords = [...selectedWords, ...validCustomWords];

    console.log('Selected words from list:', selectedWords);
    console.log('Custom words:', validCustomWords);
    console.log('All words combined:', allWords);
    console.log('Total words count:', allWords.length);
    console.log('Expected total:', TOTAL_WORDS);
    console.log('Can continue:', canContinue);

    if (allWords.length === TOTAL_WORDS) {
      console.log('Validation passed - calling onComplete...');
      onComplete(allWords);
    } else {
      console.error('Validation failed - word count mismatch');
      console.error('Expected:', TOTAL_WORDS, 'Got:', allWords.length);
    }
  };

  const validCustomWordsCount = customWords.filter(w => w.trim().length > 0).length;
  const totalSelected = selectedWords.length + validCustomWordsCount;
  const hasRequiredCustomWords = validCustomWordsCount >= REQUIRED_CUSTOM_WORDS;
  const listSelectionComplete = selectedWords.length === MAX_LIST_WORDS;
  const canContinue = selectedWords.length === MAX_LIST_WORDS && hasRequiredCustomWords;

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
            Select up to 8 from below, then add 2 of your own
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-stone-900">Select Your Words</h3>
                <div className={`text-lg font-bold ${
                  listSelectionComplete ? 'text-green-600' : 'text-brand-600'
                }`}>
                  {selectedWords.length}/{MAX_LIST_WORDS} words selected from list
                </div>
              </div>
              {listSelectionComplete && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <p className="text-sm text-green-800 font-medium">
                    List selections complete! Now add 2 of your own below.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {availableWords.map((word) => {
                const isSelected = selectedWords.includes(word);
                const isDisabled = !isSelected && selectedWords.length >= MAX_LIST_WORDS;

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
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-stone-900">
                  Add 2 custom words <span className="text-red-600">*</span>
                </h4>
                <div className={`text-sm font-bold ${
                  hasRequiredCustomWords ? 'text-green-600' : 'text-stone-500'
                }`}>
                  {validCustomWordsCount}/{REQUIRED_CUSTOM_WORDS} custom words required
                </div>
              </div>
              <p className="text-sm text-stone-600 mb-4">These are required and count toward your total of {TOTAL_WORDS}</p>
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

            {!canContinue && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-sm text-orange-800">
                  {selectedWords.length < MAX_LIST_WORDS
                    ? `Select ${MAX_LIST_WORDS - selectedWords.length} more word${MAX_LIST_WORDS - selectedWords.length !== 1 ? 's' : ''} from the list above`
                    : `Add ${REQUIRED_CUSTOM_WORDS - validCustomWordsCount} custom word${REQUIRED_CUSTOM_WORDS - validCustomWordsCount !== 1 ? 's' : ''} below to continue`}
                </p>
              </div>
            )}

            {canContinue && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Total: {TOTAL_WORDS} words ready! Click Continue below.
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
