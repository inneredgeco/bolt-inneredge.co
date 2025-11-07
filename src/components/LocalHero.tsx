import { MapPin, Video, Users } from 'lucide-react';

export function LocalHero() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin style={{ color: '#2d7471' }} size={24} />
            <span className="text-lg font-semibold" style={{ color: '#4a4a4a' }}>Serving San Diego & Beyond</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Virtual Life Coaching & Community for Men
          </h2>

          <p className="text-lg font-body mb-8 leading-relaxed" style={{ color: '#4a4a4a' }}>
            Inner Edge is a virtual men's coaching and community organization based in San Diego, CA. Experience powerful one-on-one coaching sessions from the comfort of your own space and join our men's community committed to personal growth and authentic living.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 card-hover">
              <Video style={{ color: '#2d7471' }} className="mb-3" size={32} />
              <h3 className="text-xl font-heading font-semibold mb-2" style={{ color: '#1a1a1a' }}>One-on-One Coaching</h3>
              <p className="font-body" style={{ color: '#4a4a4a' }}>
                Connect from anywhere via secure video conferencing. Get personalized guidance tailored to your unique journey, goals, and challenges.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 card-hover">
              <Users style={{ color: '#2d7471' }} className="mb-3" size={32} />
              <h3 className="text-xl font-heading font-semibold mb-2" style={{ color: '#1a1a1a' }}>Online Men's Community</h3>
              <p className="font-body" style={{ color: '#4a4a4a' }}>
                Join a supportive group of like-minded men committed to growth and authentic living. Access exclusive resources, group discussions, and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
