import { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Briefcase, DollarSign, Users, Sprout, Home, Sparkles, PartyPopper } from 'lucide-react';
import { VisionSubmissionData } from './VisionBuilderPage';

interface VisionBuilderStep2Props {
  onComplete: (areaOfLife: string) => void;
  onBack: () => void;
  initialData: VisionSubmissionData;
  isLoading: boolean;
}

interface LifeArea {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const lifeAreas: LifeArea[] = [
  {
    id: 'health-fitness',
    title: 'Health & Fitness',
    icon: ({ size, className }) => <span className={className} style={{ fontSize: size }}>💪</span>,
    description: 'Transform your physical health and vitality',
  },
  {
    id: 'career-business',
    title: 'Career & Business',
    icon: Briefcase,
    description: 'Elevate your professional life and impact',
  },
  {
    id: 'finances',
    title: 'Finances',
    icon: DollarSign,
    description: 'Build wealth and financial freedom',
  },
  {
    id: 'romantic-relationship',
    title: 'Romantic Relationship',
    icon: Heart,
    description: 'Deepen love and connection',
  },
  {
    id: 'friendships-community',
    title: 'Friendships & Community',
    icon: Users,
    description: 'Cultivate meaningful relationships',
  },
  {
    id: 'personal-development',
    title: 'Personal Development',
    icon: Sprout,
    description: 'Grow into your best self',
  },
  {
    id: 'family-relationships',
    title: 'Family Relationships',
    icon: Home,
    description: 'Strengthen family bonds',
  },
  {
    id: 'spirituality',
    title: 'Spirituality',
    icon: Sparkles,
    description: 'Connect with deeper meaning',
  },
  {
    id: 'fun-recreation',
    title: 'Fun & Recreation',
    icon: PartyPopper,
    description: 'Create more joy and adventure',
  },
];

export function VisionBuilderStep2({ onComplete, onBack, initialData, isLoading }: VisionBuilderStep2Props) {
  const [selectedArea, setSelectedArea] = useState<string>(initialData.area_of_life || '');

  const handleSubmit = () => {
    if (selectedArea) {
      onComplete(selectedArea);
    }
  };

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
              Step 1 of 6
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '16.66%' }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            Which area of life do you want to transform?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Choose the one area you want to focus on for the next year
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lifeAreas.map((area) => {
            const Icon = area.icon;
            const isSelected = selectedArea === area.id;

            return (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                disabled={isLoading}
                className={`bg-white rounded-xl p-6 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-3 border-brand-600 shadow-lg transform scale-105'
                    : 'border-2 border-stone-200 hover:border-brand-300 hover:shadow-md hover:scale-102'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  isSelected ? 'bg-brand-100' : 'bg-stone-100'
                }`}>
                  <Icon size={24} className={isSelected ? 'text-brand-600' : 'text-stone-600'} />
                </div>

                <h3 className={`text-xl font-bold mb-2 ${
                  isSelected ? 'text-brand-600' : 'text-stone-900'
                }`}>
                  {area.title}
                </h3>

                <p className="text-sm text-stone-600">
                  {area.description}
                </p>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-brand-600 font-semibold text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedArea && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                isLoading
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
        )}
      </div>
    </div>
  );
}
