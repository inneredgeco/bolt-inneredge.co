import { useEffect, useState } from 'react';

interface VisionGenerationProgressProps {
  isComplete: boolean;
  onNavigate: () => void;
}

const encouragingMessages = [
  "Your transformation starts here...",
  "Building something meaningful takes time...",
  "Great things are worth the wait...",
  "Your future self will thank you...",
  "Creating your roadmap to success..."
];

const getProgressMessage = (progress: number): string => {
  if (progress < 20) return "Analyzing your vision inputs...";
  if (progress < 40) return "Crafting your personalized narrative...";
  if (progress < 60) return "Building your 12-month action plan...";
  if (progress < 80) return "Refining your vision details...";
  if (progress < 90) return "Almost there! Finalizing your roadmap...";
  if (progress < 95) return "AI is working hard to create a great vision and plan for you...";
  return "Putting the finishing touches on your vision...";
};

export function VisionGenerationProgress({ isComplete, onNavigate }: VisionGenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(getProgressMessage(0));
  const [subMessage, setSubMessage] = useState(encouragingMessages[0]);

  useEffect(() => {
    const startTime = Date.now();
    const estimatedDuration = 90000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      let newProgress;
      if (elapsed < 30000) {
        // First 30 seconds: 0-50%
        newProgress = (elapsed / 30000) * 50;
      } else if (elapsed < 60000) {
        // Next 30 seconds: 50-80%
        newProgress = 50 + ((elapsed - 30000) / 30000) * 30;
      } else {
        // After 60 seconds: 80-95% (slow crawl)
        newProgress = 80 + ((elapsed - 60000) / 30000) * 15;
      }

      // Cap at 95% until API actually completes
      newProgress = Math.min(newProgress, 95);

      setProgress(newProgress);
      setMessage(getProgressMessage(newProgress));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % encouragingMessages.length;
      setSubMessage(encouragingMessages[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setMessage('Your vision is ready!');
      setSubMessage('Redirecting to your personalized roadmap...');
      setTimeout(() => {
        onNavigate();
      }, 1000);
    }
  }, [isComplete, onNavigate]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800">
      <div className="text-center px-4">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className={`absolute inset-0 rounded-full ${!isComplete ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <svg className="transform -rotate-90 w-64 h-64 relative" viewBox="0 0 200 200">
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
              className="transition-all duration-700 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))'
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-1 transition-all duration-500">
                {Math.floor(progress)}%
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-500">
          {message}
        </h2>

        <p className="text-lg text-brand-100 max-w-md mx-auto transition-all duration-500 min-h-[28px]">
          {subMessage}
        </p>

        {isComplete && (
          <div className="mt-8 animate-bounce">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
