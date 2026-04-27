'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = ['All', 'Weddings', 'Corporate', 'Sports', 'Family', 'Product', 'Events', 'NGO'];

const galleryItems = [
  { id: 1, category: 'Weddings', title: 'Bride & Groom', image: '/images/service-photography.jpg' },
  { id: 2, category: 'Corporate', title: 'Team Collaboration', image: '/images/service-videography.jpg' },
  { id: 3, category: 'Sports', title: 'Action Shot', image: '/images/service-editing.jpg' },
  { id: 4, category: 'Family', title: 'Family Portraits', image: '/images/service-drone.jpg' },
  { id: 5, category: 'Product', title: 'Product Photography', image: '/images/team-director.jpg' },
  { id: 6, category: 'Events', title: 'Event Coverage', image: '/images/team-cinematographer.jpg' },
  { id: 7, category: 'Weddings', title: 'Wedding Ceremony', image: '/images/team-editor.jpg' },
  { id: 8, category: 'Corporate', title: 'Corporate Event', image: '/images/service-photography.jpg' },
  { id: 9, category: 'NGO', title: 'Community Work', image: '/images/service-videography.jpg' },
  { id: 10, category: 'Family', title: 'Kids Photography', image: '/images/service-editing.jpg' },
  { id: 11, category: 'Sports', title: 'Sports Event', image: '/images/service-drone.jpg' },
  { id: 12, category: 'Product', title: 'Product Launch', image: '/images/team-director.jpg' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our portfolio of professional photography and videography across various categories
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
              >
                <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-start p-6">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.category}</p>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No images found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Love What You See?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let's create something amazing together with your own custom shoot
          </p>
          <Link href="/bookings" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors">
            Book Your Session
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
