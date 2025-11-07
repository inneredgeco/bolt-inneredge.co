import { MapPin, Video, Users } from 'lucide-react';

export function LocalHero() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="text-teal-600" size={24} />
            <span className="text-lg font-semibold text-gray-700">Serving San Diego & Beyond</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Virtual Life Coaching & Community for Men
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Inner Edge is a virtual men's coaching and community organization based in San Diego, CA. Experience powerful one-on-one coaching sessions from the comfort of your own space and join our men's community committed to personal growth and authentic living.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Video className="text-teal-600 mb-3" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">One-on-One Coaching</h3>
              <p className="text-gray-600">
                Connect from anywhere via secure video conferencing. Get personalized guidance tailored to your unique journey, goals, and challenges.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="text-teal-600 mb-3" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Men's Community</h3>
              <p className="text-gray-600">
                Join a supportive group of like-minded men committed to growth and authentic living. Access exclusive resources, group discussions, and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
