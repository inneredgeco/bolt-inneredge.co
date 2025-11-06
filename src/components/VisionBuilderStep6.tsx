import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep6Props {
  onComplete: (havingOutcomes: string[]) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

const MAX_LIST_OUTCOMES = 8;
const MIN_CUSTOM_OUTCOMES = 2;
const MAX_CUSTOM_OUTCOMES = 5;

const outcomesByArea: Record<string, string[]> = {
  'health-fitness': [
    'I have a strong, healthy body',
    'I have sustainable energy throughout the day',
    'I have visible muscle definition',
    'I am experiencing better sleep quality',
    'I have improved mental clarity',
    'I am experiencing less stress and anxiety',
    'I have the stamina to play with my kids',
    'I am confident in how I look and feel',
    'I have reduced inflammation and pain',
    'I am experiencing improved digestion',
    'I have a healthier relationship with food',
    'I am inspiring others with my transformation',
    'I have newfound confidence',
    'I am living with vitality and strength',
  ],
  'career-business': [
    'I have achieved my professional goals',
    'I have a thriving business or career',
    'I am earning the income I desire',
    'I have the respect of my peers',
    'I am making a meaningful impact',
    'I have work-life balance',
    'I am recognized as a leader in my field',
    'I have opportunities for growth',
    'I am working on projects I love',
    'I have a strong professional network',
    'I am financially rewarded for my work',
    'I have the freedom to work on my terms',
    'I am fulfilled by my professional life',
    'I have built something I am proud of',
  ],
  'finances': [
    'I have financial security and freedom',
    'I have eliminated my debt',
    'I have a substantial emergency fund',
    'I am growing my wealth consistently',
    'I have multiple income streams',
    'I have investments working for me',
    'I am living below my means comfortably',
    'I have the ability to give generously',
    'I am experiencing peace about money',
    'I have reached my savings goals',
    'I am building generational wealth',
    'I have financial independence',
    'I am making smart money decisions',
    'I have the resources to live my dreams',
  ],
  'romantic-relationship': [
    'I have a deeply connected relationship',
    'I am experiencing passionate love',
    'I have a partner who truly understands me',
    'I am feeling appreciated and valued',
    'I have trust and security in my relationship',
    'I am experiencing joy and laughter together',
    'I have open and honest communication',
    'I am growing together with my partner',
    'I have a fulfilling intimate life',
    'I am experiencing unconditional love',
    'I have a relationship that inspires others',
    'I am feeling supported in my dreams',
    'I have lasting romance and connection',
    'I am experiencing the relationship I always wanted',
  ],
  'friendships-community': [
    'I have deep, meaningful friendships',
    'I am part of a supportive community',
    'I have friends I can count on',
    'I am experiencing genuine connection',
    'I have a sense of belonging',
    'I am surrounded by positive people',
    'I have friendships that enrich my life',
    'I am experiencing regular social connection',
    'I have a strong support network',
    'I am making a difference in my community',
    'I have friendships that last',
    'I am experiencing true acceptance',
    'I have people who celebrate my wins',
    'I am never feeling alone',
  ],
  'personal-development': [
    'I have become the person I always wanted to be',
    'I am experiencing continuous growth',
    'I have overcome my limiting beliefs',
    'I am living with purpose and intention',
    'I have developed powerful new habits',
    'I am experiencing inner peace',
    'I have clarity about my path',
    'I am confident in who I am',
    'I have the skills I need to thrive',
    'I am experiencing personal transformation',
    'I have wisdom and self-awareness',
    'I am living authentically',
    'I have resilience and mental strength',
    'I am becoming my highest self',
  ],
  'family-relationships': [
    'I have strong, loving family bonds',
    'I am experiencing deeper connection with family',
    'I have resolved past conflicts',
    'I am feeling appreciated by my family',
    'I have quality time with loved ones',
    'I am experiencing family harmony',
    'I have created lasting family traditions',
    'I am feeling supported by my family',
    'I have open communication with family members',
    'I am experiencing unconditional family love',
    'I have peace in my family relationships',
    'I am creating beautiful family memories',
    'I have the family life I always wanted',
    'I am feeling grateful for my family',
  ],
  'spirituality': [
    'I have a deep connection with the divine',
    'I am experiencing inner peace',
    'I have clarity about my spiritual path',
    'I am feeling aligned with my purpose',
    'I have faith that guides me',
    'I am experiencing spiritual growth',
    'I have a regular spiritual practice',
    'I am feeling connected to something greater',
    'I have peace in my soul',
    'I am experiencing spiritual awakening',
    'I have wisdom and spiritual insight',
    'I am living in alignment with my values',
    'I have a sense of divine guidance',
    'I am experiencing transcendent joy',
  ],
  'fun-recreation': [
    'I have joy and laughter in my life',
    'I am experiencing regular adventure',
    'I have hobbies that fulfill me',
    'I am feeling light and carefree',
    'I have exciting experiences to look forward to',
    'I am experiencing more play in my life',
    'I have balance between work and fun',
    'I am feeling energized by recreation',
    'I have created wonderful memories',
    'I am experiencing life fully',
    'I have discovered new passions',
    'I am feeling alive and vibrant',
    'I have the freedom to enjoy life',
    'I am experiencing pure happiness',
  ],
};

export function VisionBuilderStep6({ onComplete, onBack, initialData, isLoading }: VisionBuilderStep6Props) {
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>(initialData.having_outcomes || []);
  const [customOutcomes, setCustomOutcomes] = useState<string[]>(['', '', '', '', '']);

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

  const availableOutcomes = outcomesByArea[initialData.area_of_life || ''] || [];

  const toggleOutcome = (outcome: string) => {
    if (selectedOutcomes.includes(outcome)) {
      setSelectedOutcomes(selectedOutcomes.filter(o => o !== outcome));
    } else {
      if (selectedOutcomes.length < MAX_LIST_OUTCOMES) {
        setSelectedOutcomes([...selectedOutcomes, outcome]);
      }
    }
  };

  const handleCustomOutcomeChange = (index: number, value: string) => {
    const newCustomOutcomes = [...customOutcomes];
    newCustomOutcomes[index] = value;
    setCustomOutcomes(newCustomOutcomes);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('=== STEP 6 CONTINUE CLICKED ===');

    const validCustomOutcomes = customOutcomes.filter(o => o.trim().length > 0).map(o => o.trim());
    const allOutcomes = [...selectedOutcomes, ...validCustomOutcomes];

    console.log('Selected outcomes from list:', selectedOutcomes.length);
    console.log('Custom outcomes:', validCustomOutcomes.length);
    console.log('Total outcomes:', allOutcomes.length);
    console.log('Can continue:', canContinue);

    console.log('Calling onComplete handler...');
    onComplete(allOutcomes);
  };

  const validCustomOutcomesCount = customOutcomes.filter(o => o.trim().length > 0).length;
  const totalSelected = selectedOutcomes.length + validCustomOutcomesCount;
  const hasMinCustomOutcomes = validCustomOutcomesCount >= MIN_CUSTOM_OUTCOMES;
  const listSelectionComplete = selectedOutcomes.length === MAX_LIST_OUTCOMES;
  const canContinue = selectedOutcomes.length === MAX_LIST_OUTCOMES && hasMinCustomOutcomes;

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
              Step 5 of 6
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '83.33%' }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            What will you HAVE as a result of this transformation?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Select up to 8 from below, then add 2-5 of your own
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-stone-900">Select Your Outcomes</h3>
                <div className={`text-lg font-bold ${
                  listSelectionComplete ? 'text-green-600' : 'text-brand-600'
                }`}>
                  {selectedOutcomes.length}/{MAX_LIST_OUTCOMES} outcomes selected from list
                </div>
              </div>
              {listSelectionComplete && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <p className="text-sm text-green-800 font-medium">
                    List selections complete! Add 2-5 of your own below.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {availableOutcomes.map((outcome) => {
                const isSelected = selectedOutcomes.includes(outcome);
                const isDisabled = !isSelected && selectedOutcomes.length >= MAX_LIST_OUTCOMES;

                return (
                  <label
                    key={outcome}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50 border-2 border-brand-600 shadow-sm'
                        : isDisabled
                        ? 'bg-stone-50 border-2 border-stone-200 opacity-40 cursor-not-allowed'
                        : 'bg-white border-2 border-stone-200 hover:border-brand-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOutcome(outcome)}
                      disabled={isDisabled || isLoading}
                      className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                    />
                    <span className={`text-base ${isSelected ? 'text-brand-900 font-medium' : 'text-stone-700'}`}>
                      {outcome}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="border-t-2 border-stone-100 pt-6 mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-stone-900">
                  Add your own outcomes (minimum 2, up to 5) <span className="text-red-600">*</span>
                </h4>
                <div className={`text-sm font-bold ${
                  hasMinCustomOutcomes ? 'text-green-600' : 'text-stone-500'
                }`}>
                  {validCustomOutcomesCount}/{MAX_CUSTOM_OUTCOMES} custom outcomes (minimum {MIN_CUSTOM_OUTCOMES} required)
                </div>
              </div>
              <p className="text-sm text-stone-600 mb-4">Write in present tense (I have...)</p>
              <div className="space-y-3">
                {customOutcomes.map((outcome, index) => (
                  <textarea
                    key={index}
                    value={outcome}
                    onChange={(e) => handleCustomOutcomeChange(index, e.target.value)}
                    placeholder={index < MIN_CUSTOM_OUTCOMES ? `I have... (custom outcome ${index + 1} - required)` : `I have... (custom outcome ${index + 1} - optional)`}
                    rows={2}
                    maxLength={150}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-600 transition-all resize-none"
                    disabled={isLoading}
                    required={index < MIN_CUSTOM_OUTCOMES}
                  />
                ))}
              </div>
            </div>

            {!canContinue && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-sm text-orange-800">
                  {selectedOutcomes.length < MAX_LIST_OUTCOMES
                    ? `Select ${MAX_LIST_OUTCOMES - selectedOutcomes.length} more outcome${MAX_LIST_OUTCOMES - selectedOutcomes.length !== 1 ? 's' : ''} from the list above`
                    : `Add at least ${MIN_CUSTOM_OUTCOMES - validCustomOutcomesCount} custom outcome${MIN_CUSTOM_OUTCOMES - validCustomOutcomesCount !== 1 ? 's' : ''} below to continue`}
                </p>
              </div>
            )}

            {canContinue && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Total: {totalSelected} outcomes ready! Click Continue below.
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
