import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Download, Mail, Plus, Share2, Check } from 'lucide-react';
import { generateVisionPDF } from '../utils/generateVisionPDF';

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
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([1]));
  const [copySuccess, setCopySuccess] = useState(false);
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

  const toggleMonth = (monthNumber: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthNumber)) {
      newExpanded.delete(monthNumber);
    } else {
      newExpanded.add(monthNumber);
    }
    setExpandedMonths(newExpanded);
  };

  const parseActionPlan = (actionPlanText: string) => {
    const months: Array<{
      number: number;
      title: string;
      goal: string;
      weeks: string[];
      checkin: string;
    }> = [];

    const monthSections = actionPlanText.split(/MONTH \d+:/i);

    monthSections.forEach((section, index) => {
      if (index === 0 || !section.trim()) return;

      const lines = section.split('\n').filter(line => line.trim());
      const titleLine = lines[0]?.trim() || '';

      let goal = '';
      const weeks: string[] = [];
      let checkin = '';

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('SMART Goal:')) {
          goal = trimmedLine.replace('SMART Goal:', '').trim();
        } else if (trimmedLine.match(/Week \d+:/i)) {
          weeks.push(trimmedLine.replace(/Week \d+:/i, '').trim());
        } else if (trimmedLine.startsWith('Monthly Check-in:')) {
          checkin = trimmedLine.replace('Monthly Check-in:', '').trim();
        }
      });

      months.push({
        number: index,
        title: titleLine,
        goal,
        weeks,
        checkin,
      });
    });

    return months.reverse();
  };

  const handleDownloadPDF = async () => {
    if (!visionData) return;

    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      const createdDate = new Date(visionData.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      const visionDate = oneYearFromNow.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      generateVisionPDF({
        name: visionData.name,
        areaOfLife: getAreaTitle(visionData.area_of_life),
        visionNarrative: visionData.vision_narrative,
        actionPlan: visionData.action_plan,
        createdDate,
        visionDate,
      });

      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError('PDF generation failed. Please try again or use the print option.');
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailCopy = async () => {
    alert('Email functionality coming soon! For now, you can print or download this page.');
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const url = window.location.href;
    const text = `I just created my 1-year vision with @inneredge!`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
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
        <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
              Vision for {getVisionDate()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Vision is Ready, {visionData.name}!
            </h1>
            <p className="text-xl text-brand-100">
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
            <button
              onClick={handleEmailCopy}
              className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              <Mail size={20} />
              Email Me a Copy
            </button>
            <Link
              to="/vision-builder"
              className="flex items-center gap-2 px-6 py-3 text-stone-700 hover:text-brand-600 font-semibold transition-colors"
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
                <div className="whitespace-pre-wrap text-stone-800 leading-relaxed text-lg">
                  {visionData.vision_narrative}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4 mb-8">
              {months.map((month) => (
                <div
                  key={month.number}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleMonth(month.number)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-stone-900">
                        Month {month.number}: {month.title}
                      </h3>
                    </div>
                    {expandedMonths.has(month.number) ? (
                      <ChevronUp className="text-brand-600 flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-stone-400 flex-shrink-0" size={24} />
                    )}
                  </button>

                  {expandedMonths.has(month.number) && (
                    <div className="px-6 pb-6 border-t border-stone-100">
                      {month.goal && (
                        <div className="mt-4 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-600">
                          <h4 className="text-sm font-semibold text-brand-800 uppercase mb-2">
                            SMART Goal
                          </h4>
                          <p className="text-stone-800">{month.goal}</p>
                        </div>
                      )}

                      {month.weeks.length > 0 && (
                        <div className="mt-4">
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
                        <div className="mt-4 p-4 bg-stone-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-stone-700 uppercase mb-2">
                            Monthly Check-in
                          </h4>
                          <p className="text-stone-600 italic">{month.checkin}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center mb-12 print:hidden">
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
            <button
              onClick={handleEmailCopy}
              className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 border-2 border-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              <Mail size={20} />
              Email Me a Copy
            </button>
            <Link
              to="/vision-builder"
              className="flex items-center gap-2 px-6 py-3 text-stone-700 hover:text-brand-600 font-semibold transition-colors"
            >
              <Plus size={20} />
              Create New Vision
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center print:hidden">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Share Your Commitment</h2>
            <p className="text-stone-600 mb-6">
              Let others know you're creating positive change in your life
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition-colors"
              >
                <Share2 size={20} />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-6 py-3 bg-[#4267B2] text-white rounded-lg font-semibold hover:bg-[#365899] transition-colors"
              >
                <Share2 size={20} />
                Share on Facebook
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-900 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <Check size={20} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
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
