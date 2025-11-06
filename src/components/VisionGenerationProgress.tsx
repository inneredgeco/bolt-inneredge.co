import { useEffect, useState } from 'react';

interface VisionGenerationProgressProps {
  isComplete: boolean;
  onNavigate: () => void;
}

export function VisionGenerationProgress({ isComplete, onNavigate }: VisionGenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting your vision...');
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    const startTime = Date.now();
    const estimatedDuration = 60000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / estimatedDuration) * 100, 95);
      const remaining = Math.max(Math.ceil((estimatedDuration - elapsed) / 1000), 0);

      setProgress(newProgress);
      setTimeRemaining(remaining);

      if (newProgress < 20) {
        setMessage('Analyzing your vision...');
      } else if (newProgress < 40) {
        setMessage('Crafting your narrative...');
      } else if (newProgress < 60) {
        setMessage('Building your 12-month action plan...');
      } else if (newProgress < 80) {
        setMessage('Creating your personalized roadmap...');
      } else if (newProgress < 95) {
        setMessage('Almost there... finalizing your vision...');
      } else {
        setMessage('Taking a bit longer than expected...');
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setMessage('Your vision is ready!');
      setTimeout(() => {
        onNavigate();
      }, 800);
    }
  }, [isComplete, onNavigate]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800">
      <div className="text-center px-4">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="transform -rotate-90 w-64 h-64" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-1 transition-all duration-300">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 transition-opacity duration-300">
          {message}
        </h2>

        {!isComplete && progress < 95 && (
          <p className="text-lg text-brand-100 max-w-md mx-auto transition-opacity duration-300">
            Estimated time: {timeRemaining} seconds
          </p>
        )}

        {isComplete && (
          <div className="mt-6 animate-pulse">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
