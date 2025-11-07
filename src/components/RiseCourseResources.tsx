import { FileText, Headphones, Video, BookOpen, ExternalLink, Play, Pause, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from './SEOHead';
import { Header } from './Header';
import { Footer } from './Footer';

interface Resource {
  title: string;
  type: 'pdf' | 'audio' | 'video' | 'link';
  url?: string;
}

interface Module {
  number: number;
  resources: Resource[];
}

export function RiseCourseResources() {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioRefs] = useState<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {}, []);

  const modules: Module[] = [
    {
      number: 1,
      resources: [
        { title: 'RISE Workbook', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/RISE_Workbook.pdf' },
        { title: 'Opening Ceremony', type: 'audio', url: 'https://inner-edge-audio-files.b-cdn.net/Opening%20Ceremony.mp3' }
      ]
    },
    {
      number: 2,
      resources: [
        { title: 'The Feeling Wheel', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/The%20Feeling%20Wheel.pdf' },
        { title: 'Benefits of Oxygen in Breathwork', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Benefits%20of%20Oxygen%20in%20Breathwork.pdf' },
        { title: 'Emotional Release Techniques', type: 'link', url: '/emotional-release-techniques' },
        { title: 'Forgiveness Meditation', type: 'audio', url: 'https://inner-edge-audio-files.b-cdn.net/Forgiveness%20Meditation%20-%20Music%20with%20Voice%20Over.mp3' }
      ]
    },
    {
      number: 3,
      resources: [
        { title: 'Life Design Canvas', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Life%20Design%20Canvas%20Samples%20%26%20Template.pdf' },
        { title: '3-month Goal Roadmap', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/3-Month%20Goal%20Roadmap.pdf' }
      ]
    },
    {
      number: 4,
      resources: [
        { title: 'Habit Building Tracker', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Habit-Building%20Tracker.pdf' },
        { title: 'Book Recommendation: "Atomic Habits"', type: 'link', url: 'https://links.inneredge.co/book-atomic-habits' },
        { title: 'Pomodoro Technique', type: 'link', url: 'https://www.todoist.com/productivity-methods/pomodoro-technique' },
        { title: 'Common Boundary Setting Conversations', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Common%20Boundary%20Setting%20Conversion.pdf' }
      ]
    },
    {
      number: 5,
      resources: [
        { title: 'Chakras', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Chakras.pdf' },
        { title: 'Edging', type: 'pdf', url: 'https://inner-edge-audio-files.b-cdn.net/Edging%20-%20Step-by-Step%20Guide.pdf' },
        { title: 'Closing Ceremony', type: 'audio', url: 'https://inner-edge-audio-files.b-cdn.net/Closing%20Ceremony.mp3' }
      ]
    }
  ];

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'audio':
        return <Headphones className="text-teal-600" size={20} />;
      case 'video':
        return <Video className="text-blue-600" size={20} />;
      case 'link':
        return <ExternalLink className="text-slate-600" size={20} />;
    }
  };

  const getResourceTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'audio':
        return 'Audio';
      case 'video':
        return 'Video';
      case 'link':
        return 'Link';
    }
  };

  const toggleAudio = (audioUrl: string) => {
    if (!audioRefs[audioUrl]) {
      audioRefs[audioUrl] = new Audio(audioUrl);
      audioRefs[audioUrl].addEventListener('ended', () => {
        setPlayingAudio(null);
      });
    }

    if (playingAudio === audioUrl) {
      audioRefs[audioUrl].pause();
      setPlayingAudio(null);
    } else {
      if (playingAudio && audioRefs[playingAudio]) {
        audioRefs[playingAudio].pause();
      }
      audioRefs[audioUrl].play();
      setPlayingAudio(audioUrl);
    }
  };

  const renderResource = (resource: Resource, idx: number) => {
    if (resource.type === 'audio' && resource.url) {
      return (
        <div key={idx} className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getResourceIcon(resource.type)}
              <span className="font-medium text-slate-900">
                {resource.title}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {getResourceTypeLabel(resource.type)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAudio(resource.url!)}
              className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
            >
              {playingAudio === resource.url ? (
                <><Pause size={16} /> Pause</>
              ) : (
                <><Play size={16} /> Play</>
              )}
            </button>
            <a
              href={resource.url}
              download
              className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      );
    }

    if (resource.type === 'link' && resource.url) {
      if (resource.url.startsWith('/')) {
        return (
          <Link
            key={idx}
            to={resource.url}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {getResourceIcon(resource.type)}
              <span className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
                {resource.title}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {getResourceTypeLabel(resource.type)}
            </span>
          </Link>
        );
      } else {
        return (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {getResourceIcon(resource.type)}
              <span className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
                {resource.title}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {getResourceTypeLabel(resource.type)}
            </span>
          </a>
        );
      }
    }

    if (resource.type === 'pdf' && resource.url) {
      return (
        <a
          key={idx}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            {getResourceIcon(resource.type)}
            <span className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
              {resource.title}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {getResourceTypeLabel(resource.type)}
          </span>
        </a>
      );
    }

    return (
      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          {getResourceIcon(resource.type)}
          <span className="font-medium text-slate-900">
            {resource.title}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {getResourceTypeLabel(resource.type)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="RISE Course Resources - Inner Edge"
        description="Access your RISE course materials including workbooks, audio meditations, life design canvas, goal roadmaps, and habit building trackers. Complete resources for personal transformation."
        keywords="RISE course, personal development resources, life coaching materials, goal setting workbook, habit tracker, forgiveness meditation"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/rise-course-resources"
        ogUrl="https://www.inneredge.co/rise-course-resources"
      />
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
      }}>
        {/* Soft Abstract Gradient Shapes */}
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

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Course Materials
          </p>
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
            RISE Course Resources
          </h1>
          <p className="text-lg md:text-xl text-brand-700 max-w-2xl mx-auto">
            Access all your course materials, worksheets, and supplementary resources organized by module.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Modules */}
        <div className="space-y-8">
          {modules.map((module) => (
            <div key={module.number} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">
                  Module {module.number}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {module.resources.map((resource, idx) => renderResource(resource, idx))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 relative overflow-hidden rounded-2xl p-8 text-center" style={{
          background: 'linear-gradient(to bottom right, #ffffff 0%, #f0f9f8 40%, #d4ebe8 100%)'
        }}>
          {/* Soft Abstract Gradient Shapes */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-0 top-0 w-[500px] h-[500px]" style={{
              background: 'radial-gradient(circle at center, rgba(138, 214, 206, 0.15) 0%, transparent 60%)',
              filter: 'blur(80px)',
              transform: 'translate(-20%, -20%)'
            }}></div>
            <div className="absolute right-0 bottom-0 w-[600px] h-[600px]" style={{
              background: 'radial-gradient(circle at center, rgba(107, 201, 191, 0.2) 0%, rgba(138, 214, 206, 0.1) 40%, transparent 70%)',
              filter: 'blur(100px)',
              transform: 'translate(20%, 20%)'
            }}></div>
          </div>

          <div className="relative">
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Need Help?
            </h2>
            <p className="text-brand-700 mb-6">
              If you have any questions about the course materials or need assistance accessing resources.
            </p>
            <a
              href="mailto:contact@inneredge.co"
              className="inline-block bg-brand-600 text-white px-6 py-3 rounded-full font-bold hover:bg-brand-700 transition-all hover:scale-105 shadow-lg"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
