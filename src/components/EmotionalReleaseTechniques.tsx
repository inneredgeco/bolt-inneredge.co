import { Play, Clock, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SEOHead } from './SEOHead';
import { Header } from './Header';
import { Footer } from './Footer';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  description: string;
  videoUrl: string;
}

export function EmotionalReleaseTechniques() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);


  console.log('EmotionalReleaseTechniques component rendered');

  const videos: Video[] = [
    {
      id: '1',
      title: 'Shaking',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/85e7a6d1-deb2-43c5-89d2-44d0fdbf1c6c/thumbnail.jpg',
      duration: '2:08',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/85e7a6d1-deb2-43c5-89d2-44d0fdbf1c6c?autoplay=true&loop=false&muted=false&preload=true&responsive=true'
    },
    {
      id: '2',
      title: 'Hand and Pillow Scream',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/36aa7918-cb48-420a-b4a6-e74eaa6bbcfe/thumbnail.jpg',
      duration: '1:31',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/36aa7918-cb48-420a-b4a6-e74eaa6bbcfe?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '3',
      title: 'Power Stomp',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/00a345b6-036f-4e33-930d-cdac0ed5011b/thumbnail.jpg',
      duration: '0:25',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/00a345b6-036f-4e33-930d-cdac0ed5011b?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '4',
      title: 'Tantrum',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/ba094f17-71bb-47f1-b3b0-60dee00c8733/thumbnail.jpg',
      duration: '0:29',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/ba094f17-71bb-47f1-b3b0-60dee00c8733?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '5',
      title: 'Pillow Pounding',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/34292201-56c3-43d9-870d-2f65efb4e5b7/thumbnail.jpg',
      duration: '0:54',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/34292201-56c3-43d9-870d-2f65efb4e5b7?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '6',
      title: 'Pillow Hip Thrusting',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/26c8731e-80e3-4aa3-bd20-87e5aed9a5d6/thumbnail.jpg',
      duration: '0:42',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/26c8731e-80e3-4aa3-bd20-87e5aed9a5d6?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '7',
      title: 'Surrender Whaling',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/f533ade3-403d-473f-876f-c3306890c033/thumbnail.jpg',
      duration: '1:24',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/f533ade3-403d-473f-876f-c3306890c033?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    },
    {
      id: '8',
      title: 'Fetal Freeze',
      thumbnail: 'https://vz-e46fce52-e37.b-cdn.net/3545cb7e-d3bd-44aa-84d5-995ceeb837fa/thumbnail.jpg',
      duration: '1:14',
      views: '',
      description: '',
      videoUrl: 'https://iframe.mediadelivery.net/embed/414719/3545cb7e-d3bd-44aa-84d5-995ceeb837fa?autoplay=false&loop=false&muted=true&preload=true&responsive=true'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        pagePath="/emotional-release-techniques"
        fallbackTitle="Emotional Release Techniques - Inner Edge"
        fallbackDescription="Watch video demonstrations of powerful emotional release techniques including shaking, power stomp, and pillow pounding. Learn effective methods for emotional processing."
        fallbackOgImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        canonical="https://www.inneredge.co/emotional-release-techniques"
        ogUrl="https://www.inneredge.co/emotional-release-techniques"
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">
            Learn & Practice
          </p>
          <Play className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Emotional Release Techniques
          </h1>
          <p className="text-lg md:text-xl text-brand-700 max-w-3xl mx-auto">
            Master powerful techniques to release stored emotions, process trauma, and unlock your true potential. Each video provides practical tools you can use immediately.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {selectedVideo && (
          <div className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-slate-900 relative">
              <iframe
                src={selectedVideo.videoUrl}
                loading="lazy"
                style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              ></iframe>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {selectedVideo.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                {selectedVideo.views && (
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{selectedVideo.views} views</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
              {selectedVideo.description && (
                <p className="text-slate-700 leading-relaxed">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {selectedVideo ? 'More Videos' : 'All Videos'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-200 overflow-hidden group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="bg-brand-500 rounded-full p-4 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    {video.views && (
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{video.views}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12" id="fd-form-68d43dbaf56b4cbc083efbc0"></div>

        <div className="mt-16 relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center" style={{
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
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Ready to Go Deeper?
            </h2>
            <p className="text-xl text-brand-700 mb-8 max-w-2xl mx-auto">
              These techniques are just the beginning. Join our program for personalized guidance and support.
            </p>
            <a
              href="https://links.inneredge.co/menscommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-700 transition-all hover:scale-105 shadow-lg"
            >
              Join the Community
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
