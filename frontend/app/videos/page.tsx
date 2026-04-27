'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'Wedding Highlight Reel',
    category: 'Weddings',
    thumbnail: '/images/service-videography.jpg',
    duration: '3:45',
    description: 'A cinematic wedding highlight of our beautiful couple\'s special day',
  },
  {
    id: 2,
    title: 'Corporate Event Coverage',
    category: 'Corporate',
    thumbnail: '/images/service-editing.jpg',
    duration: '5:20',
    description: 'Professional coverage of a corporate annual gala',
  },
  {
    id: 3,
    title: 'Product Launch Video',
    category: 'Product',
    thumbnail: '/images/service-drone.jpg',
    duration: '2:15',
    description: 'Dynamic product launch video with aerial shots',
  },
  {
    id: 4,
    title: 'Sports Event Highlights',
    category: 'Sports',
    thumbnail: '/images/team-director.jpg',
    duration: '4:30',
    description: 'Fast-paced sports event highlights and action sequences',
  },
  {
    id: 5,
    title: 'NGO Impact Story',
    category: 'NGO',
    thumbnail: '/images/team-cinematographer.jpg',
    duration: '6:10',
    description: 'Inspiring story of community impact and change',
  },
  {
    id: 6,
    title: 'Family Documentary',
    category: 'Family',
    thumbnail: '/images/team-editor.jpg',
    duration: '8:45',
    description: 'Beautiful family documentary capturing precious moments',
  },
];

export default function VideosPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Video Highlights</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our latest cinematic productions and professional video work
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="group">
                <div className="relative h-72 rounded-2xl overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="text-blue-600 fill-blue-600" size={32} />
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-semibold">
                    {video.duration}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {video.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need Professional Video Production?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let us create stunning video content for your brand or event
          </p>
          <Link href="/bookings" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors">
            Request a Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
