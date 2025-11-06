import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep5Props {
  onComplete: (doingActions: string[]) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

const MIN_ACTIONS = 8;
const MAX_ACTIONS = 10;
const REQUIRED_CUSTOM_ACTIONS = 2;

const actionsByArea: Record<string, string[]> = {
  'health-fitness': [
    'I am exercising 4-5 times per week',
    'I am meal prepping healthy foods on Sundays',
    'I am drinking 8 glasses of water daily',
    'I am getting 7-8 hours of quality sleep',
    'I am taking daily walks outdoors',
    'I am lifting weights consistently',
    'I am practicing mindful eating',
    'I am tracking my nutrition',
    'I am stretching and doing mobility work',
    'I am choosing stairs over elevators',
    'I am cooking nutritious meals at home',
    'I am limiting processed foods',
    'I am enjoying movement and exercise',
    'I am prioritizing recovery and rest',
    'I am celebrating small wins',
    'I am staying consistent with my routine',
    'I am setting weekly fitness goals',
    'I am finding joy in physical activity',
  ],
  'career-business': [
    'I am setting clear professional goals',
    'I am developing new skills regularly',
    'I am networking with industry leaders',
    'I am taking on challenging projects',
    'I am communicating effectively with my team',
    'I am managing my time strategically',
    'I am seeking feedback and learning from it',
    'I am mentoring others in my field',
    'I am staying current with industry trends',
    'I am building my personal brand',
    'I am celebrating my achievements',
    'I am setting healthy work boundaries',
    'I am investing in professional development',
    'I am leading with confidence and clarity',
    'I am creating systems for success',
    'I am collaborating effectively with others',
    'I am taking calculated risks',
    'I am solving problems creatively',
  ],
  'finances': [
    'I am tracking my income and expenses',
    'I am saving 20% of my income monthly',
    'I am investing in my future consistently',
    'I am eliminating unnecessary expenses',
    'I am building multiple income streams',
    'I am educating myself about money',
    'I am reviewing my budget weekly',
    'I am paying off debt strategically',
    'I am building my emergency fund',
    'I am making informed investment decisions',
    'I am negotiating for better rates',
    'I am automating my savings',
    'I am planning for retirement',
    'I am giving generously to others',
    'I am celebrating financial milestones',
    'I am being intentional with purchases',
    'I am growing my net worth',
    'I am practicing financial discipline',
  ],
  'romantic-relationship': [
    'I am communicating openly and honestly',
    'I am scheduling regular date nights',
    'I am expressing appreciation daily',
    'I am listening actively to my partner',
    'I am showing affection consistently',
    'I am supporting my partner\'s dreams',
    'I am being fully present together',
    'I am resolving conflicts constructively',
    'I am creating special moments together',
    'I am maintaining physical intimacy',
    'I am sharing my feelings openly',
    'I am respecting boundaries and needs',
    'I am surprising my partner with thoughtfulness',
    'I am growing together as a couple',
    'I am laughing and having fun together',
    'I am prioritizing our relationship',
    'I am being vulnerable and authentic',
    'I am celebrating our love daily',
  ],
  'friendships-community': [
    'I am reaching out to friends regularly',
    'I am being present in conversations',
    'I am showing up for important moments',
    'I am initiating plans and gatherings',
    'I am being vulnerable and authentic',
    'I am celebrating friends\' successes',
    'I am offering help without being asked',
    'I am listening without judgment',
    'I am making time for meaningful connections',
    'I am joining community groups',
    'I am being reliable and consistent',
    'I am expressing gratitude to friends',
    'I am creating space for new friendships',
    'I am contributing to my community',
    'I am staying connected despite distance',
    'I am being generous with my time',
    'I am building deeper relationships',
    'I am fostering a sense of belonging',
  ],
  'personal-development': [
    'I am reading for 30 minutes daily',
    'I am practicing meditation regularly',
    'I am journaling my thoughts and progress',
    'I am learning new skills consistently',
    'I am seeking feedback for growth',
    'I am stepping outside my comfort zone',
    'I am reflecting on my values regularly',
    'I am setting and reviewing personal goals',
    'I am practicing gratitude daily',
    'I am challenging limiting beliefs',
    'I am investing in courses and coaching',
    'I am taking responsibility for my life',
    'I am cultivating positive habits',
    'I am learning from my mistakes',
    'I am surrounding myself with growth-minded people',
    'I am practicing self-compassion',
    'I am celebrating my progress',
    'I am becoming my best self',
  ],
  'family-relationships': [
    'I am scheduling quality time together',
    'I am being present during family moments',
    'I am communicating with patience',
    'I am listening to understand',
    'I am showing appreciation regularly',
    'I am creating family traditions',
    'I am supporting family members\' goals',
    'I am resolving conflicts peacefully',
    'I am expressing love openly',
    'I am being reliable and dependable',
    'I am participating in family activities',
    'I am respecting boundaries and differences',
    'I am sharing meals together regularly',
    'I am building stronger connections',
    'I am being forgiving and compassionate',
    'I am celebrating family milestones',
    'I am putting family first',
    'I am creating lasting memories',
  ],
  'spirituality': [
    'I am meditating daily',
    'I am practicing prayer or contemplation',
    'I am reading spiritual texts regularly',
    'I am attending services or gatherings',
    'I am spending time in nature',
    'I am practicing mindfulness throughout my day',
    'I am cultivating inner peace',
    'I am serving others with love',
    'I am practicing gratitude for all blessings',
    'I am listening to my inner wisdom',
    'I am aligning my actions with my values',
    'I am seeking deeper meaning',
    'I am practicing forgiveness',
    'I am connecting with something greater',
    'I am living with purpose and intention',
    'I am embracing spiritual practices',
    'I am growing in faith and trust',
    'I am finding peace in stillness',
  ],
  'fun-recreation': [
    'I am scheduling time for play weekly',
    'I am trying new activities regularly',
    'I am pursuing hobbies I love',
    'I am exploring new places',
    'I am laughing and enjoying life',
    'I am being spontaneous and adventurous',
    'I am spending time in nature',
    'I am engaging in creative activities',
    'I am playing games and having fun',
    'I am taking breaks from work',
    'I am celebrating life\'s moments',
    'I am connecting with joy daily',
    'I am traveling to new destinations',
    'I am attending events and concerts',
    'I am making time for leisure',
    'I am being playful and carefree',
    'I am creating fun memories',
    'I am prioritizing enjoyment',
  ],
};

export function VisionBuilderStep5({ onComplete, onBack, initialData, isLoading }: VisionBuilderStep5Props) {
  const [selectedActions, setSelectedActions] = useState<string[]>(initialData.doing_actions || []);
  const [customActions, setCustomActions] = useState<string[]>(['', '']);

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

  const availableActions = actionsByArea[initialData.area_of_life || ''] || [];

  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter(a => a !== action));
    } else {
      if (selectedActions.length < MAX_ACTIONS) {
        setSelectedActions([...selectedActions, action]);
      }
    }
  };

  const handleCustomActionChange = (index: number, value: string) => {
    const newCustomActions = [...customActions];
    newCustomActions[index] = value;
    setCustomActions(newCustomActions);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validCustomActions = customActions.filter(a => a.trim().length > 0).map(a => a.trim());
    const allActions = [...selectedActions, ...validCustomActions];

    if (allActions.length >= MIN_ACTIONS && allActions.length <= MAX_ACTIONS) {
      onComplete(allActions);
    }
  };

  const validCustomActionsCount = customActions.filter(a => a.trim().length > 0).length;
  const totalSelected = selectedActions.length + validCustomActionsCount;
  const hasRequiredCustomActions = validCustomActionsCount >= REQUIRED_CUSTOM_ACTIONS;
  const canContinue = totalSelected >= MIN_ACTIONS && totalSelected <= MAX_ACTIONS && hasRequiredCustomActions;

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
              Step 4 of 6
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '66.67%' }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            What will you be DOING in your ideal {getAreaTitle(initialData.area_of_life)}?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Select 6-8 actions from the list, and add 2 of your own
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-900">Select Your Actions</h3>
              <div className={`text-lg font-bold ${
                totalSelected < MIN_ACTIONS ? 'text-orange-600' :
                totalSelected > MAX_ACTIONS ? 'text-red-600' :
                'text-brand-600'
              }`}>
                {totalSelected}/{MAX_ACTIONS} actions selected
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {availableActions.map((action) => {
                const isSelected = selectedActions.includes(action);
                const isDisabled = !isSelected && selectedActions.length >= MAX_ACTIONS;

                return (
                  <label
                    key={action}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50 border-2 border-brand-600 shadow-sm'
                        : isDisabled
                        ? 'bg-stone-50 border-2 border-stone-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-2 border-stone-200 hover:border-brand-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAction(action)}
                      disabled={isDisabled || isLoading}
                      className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                    />
                    <span className={`text-base ${isSelected ? 'text-brand-900 font-medium' : 'text-stone-700'}`}>
                      {action}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="border-t-2 border-stone-100 pt-6 mt-6">
              <h4 className="text-lg font-bold text-stone-900 mb-2">
                Add 2 custom actions <span className="text-red-600">*</span>
              </h4>
              <p className="text-sm text-stone-600 mb-4">Write in present tense (I am...) - These are required</p>
              <div className="space-y-3">
                {customActions.map((action, index) => (
                  <textarea
                    key={index}
                    value={action}
                    onChange={(e) => handleCustomActionChange(index, e.target.value)}
                    placeholder={`I am... (custom action ${index + 1} - required)`}
                    rows={2}
                    maxLength={150}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-600 transition-all resize-none"
                    disabled={isLoading}
                    required
                  />
                ))}
              </div>
            </div>

            {(totalSelected < MIN_ACTIONS || !hasRequiredCustomActions) && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-sm text-orange-800">
                  {!hasRequiredCustomActions
                    ? `You must add ${REQUIRED_CUSTOM_ACTIONS} custom actions to continue`
                    : `Please select at least ${MIN_ACTIONS - totalSelected} more action${MIN_ACTIONS - totalSelected !== 1 ? 's' : ''} to continue`}
                </p>
              </div>
            )}

            {totalSelected > MAX_ACTIONS && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-sm text-red-800">
                  You've selected {totalSelected - MAX_ACTIONS} too many action{totalSelected - MAX_ACTIONS !== 1 ? 's' : ''}. Please remove some to continue.
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
