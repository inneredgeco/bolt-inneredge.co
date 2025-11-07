import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';
import { Download, Plus } from 'lucide-react';

interface VisionData {
  id: string;
  name: string;
  email: string;
  area_of_life: string;
  vision_narrative: string;
  action_plan: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export function VisionResultsPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'narrative' | 'plan'>('narrative');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const AREA_TITLES: Record<string, string> = {
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

  const getAreaTitle = (areaId: string): string => {
    return AREA_TITLES[areaId] || areaId;
  };

  const getVisionDate = (): string => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (submissionId) {
      loadVisionData(submissionId);
    }
  }, [submissionId]);

  const loadVisionData = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('vision_submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading vision:', fetchError);
        setError('Failed to load your vision. Please check your link and try again.');
        return;
      }

      if (!data) {
        setError('Vision not found. Please check your link and try again.');
        return;
      }

      if (data.status !== 'completed') {
        if (data.status === 'generating') {
          setError('Your vision is still being generated. Please wait a moment and refresh the page.');
        } else {
          navigate(`/vision-builder/resume/${id}`);
        }
        return;
      }

      setVisionData({
        id: data.id,
        name: data.name,
        email: data.email,
        area_of_life: data.area_of_life,
        vision_narrative: data.vision_narrative,
        action_plan: data.action_plan,
        status: data.status,
        created_at: data.created_at,
        completed_at: data.completed_at,
      });
    } catch (err) {
      console.error('Error loading vision:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseActionPlan = (actionPlanText: string) => {
    const months: Array<{
      number: number;
      title: string;
      date: string;
      goal: string;
      weeks: string[];
      checkin: string;
    }> = [];

    const monthMatches = actionPlanText.matchAll(/MONTH (\d+):(.*?)(?=MONTH \d+:|$)/gis);

    for (const match of monthMatches) {
      const monthNumber = parseInt(match[1], 10);
      const section = match[2];

      const lines = section.split('\n').filter(line => line.trim());

      let title = '';
      let date = '';
      let goal = '';
      const weeks: string[] = [];
      let checkin = '';

      lines.forEach((line, idx) => {
        const trimmedLine = line.trim();

        if (idx === 0 && !trimmedLine.startsWith('SMART Goal:') && !trimmedLine.match(/Week \d+:/i)) {
          title = trimmedLine;
        } else if (idx === 1 && !trimmedLine.startsWith('SMART Goal:') && !trimmedLine.match(/Week \d+:/i) && !trimmedLine.startsWith('Monthly Check-in:')) {
          date = trimmedLine;
        } else if (trimmedLine.startsWith('SMART Goal:')) {
          goal = trimmedLine.replace('SMART Goal:', '').trim();
        } else if (trimmedLine.match(/Week \d+:/i)) {
          weeks.push(trimmedLine.replace(/Week \d+:/i, '').trim());
        } else if (trimmedLine.startsWith('Monthly Check-in:')) {
          checkin = trimmedLine.replace('Monthly Check-in:', '').trim();
        }
      });

      months.push({
        number: monthNumber,
        title: title,
        date: date,
        goal,
        weeks,
        checkin,
      });
    }

    return months.sort((a, b) => a.number - b.number);
  };

  const handleDownloadPDF = async () => {
    if (!visionData) return;

    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      const createdDate = new Date(visionData.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      const visionDate = oneYearFromNow.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-vision-pdf`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: visionData.name,
          areaOfLife: getAreaTitle(visionData.area_of_life),
          visionNarrative: visionData.vision_narrative,
          actionPlan: visionData.action_plan,
          createdDate,
          visionDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${visionData.name.replace(/[^a-zA-Z0-9]/g, '_')}_Vision.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError('PDF generation failed. Please try again or use the print option.');
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <SEOHead
          title="Your Vision Results | Inner Edge"
          description="View your personalized 1-year vision and action plan"
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

  if (error || !visionData) {
    return (
      <>
        <SEOHead
          title="Vision Not Found | Inner Edge"
          description="Vision not found or unavailable"
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
            <p className="text-stone-600 mb-6">{error || 'Vision not found'}</p>
            <Link
              to="/vision-builder"
              className="inline-block bg-brand-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-700 transition-all"
            >
              Create New Vision
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const months = parseActionPlan(visionData.action_plan);

  return (
    <>
      <SEOHead
        title={`Your Vision Results | Inner Edge`}
        description="Your personalized 1-year vision and action plan"
      />
      <Header />

      <div className="min-h-screen bg-stone-50">
        <div className="relative overflow-hidden py-16 px-4" style={{
          background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
        }}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-0 top-0 w-[800px] h-[800px]" style={{
              background: 'radial-gradient(circle at center, rgba(138, 214, 206, 0.15) 0%, transparent 60%)',
              filter: 'blur(100px)',
              transform: 'translate(-30%, -20%)'
            }}></div>
            <div className="absolute right-0 bottom-0 w-[1000px] h-[1000px]" style={{
              background: 'radial-gradient(circle at center, rgba(107, 201, 191, 0.2) 0%, rgba(138, 214, 206, 0.1) 40%, transparent 70%)',
              filter: 'blur(120px)',
              transform: 'translate(20%, 30%)'
            }}></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-brand-100 rounded-full text-sm font-bold mb-4 text-brand-700">
              Vision for {getVisionDate()}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Your Vision is Ready, {visionData.name}!
            </h1>
            <p className="text-xl text-brand-700">
              Your personalized 1-year vision for {getAreaTitle(visionData.area_of_life)}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {pdfError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {pdfError}
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center mb-8 print:hidden">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download as PDF
                </>
              )}
            </button>
            <Link
              to="/vision-builder"
              className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              <Plus size={20} />
              Create New Vision
            </Link>
          </div>

          <div className="mb-8 print:hidden">
            <div className="flex border-b-2 border-stone-200">
              <button
                onClick={() => setActiveTab('narrative')}
                className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
                  activeTab === 'narrative'
                    ? 'text-brand-600 border-b-4 border-brand-600 -mb-0.5'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Vision Narrative
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
                  activeTab === 'plan'
                    ? 'text-brand-600 border-b-4 border-brand-600 -mb-0.5'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                12-Month Action Plan
              </button>
            </div>
          </div>

          {activeTab === 'narrative' && (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                <div
                  className="whitespace-pre-wrap text-stone-800 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{
                    __html: visionData.vision_narrative.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-6 mb-8">
              {months.map((month) => (
                <div
                  key={month.number}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-brand-600">
                      Month {month.number}: {month.title}
                    </h3>
                    {month.date && (
                      <p className="text-stone-600 text-sm mt-1">{month.date}</p>
                    )}
                  </div>

                  {month.goal && (
                    <div className="mb-4 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-600">
                      <h4 className="text-sm font-semibold text-brand-800 uppercase mb-2">
                        SMART Goal
                      </h4>
                      <p className="text-stone-800">{month.goal}</p>
                    </div>
                  )}

                  {month.weeks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-700 uppercase mb-3">
                        Weekly Breakdown
                      </h4>
                      <ul className="space-y-2">
                        {month.weeks.map((week, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-stone-700 pt-0.5">{week}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {month.checkin && (
                    <div className="p-4 bg-stone-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-stone-700 uppercase mb-2">
                        Monthly Check-in
                      </h4>
                      <p className="text-stone-600 italic">{month.checkin}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }

          body {
            background: white;
          }

          .bg-gradient-to-br {
            background: #2d7471 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
