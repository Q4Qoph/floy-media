'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicGallery } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

function resolveMediaUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const u = mediaUrl(raw);
  return u || null;
}

export default function GalleryPage() {
  const { data: apiGallery = [], isLoading } = usePublicGallery();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const normalizedItems = apiGallery
    .map((item) => {
      const image = resolveMediaUrl(item.thumbnailUrl || item.fileUrl);
      if (!image) return null;
      return {
        id: item.id,
        category: item.categoryName || item.category?.name || 'General',
        title: item.title,
        image,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const dynamicCategories = ['All', ...Array.from(new Set(normalizedItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? normalizedItems
      : normalizedItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full">
      <PageHero
        title="Gallery"
        description="Explore the FloyMedia collection of photography and videography projects including weddings, corporate shoots, sports, family sessions, product photography, events, and community work."
        eyebrow="Portfolio"
        variant="teal"
      />

      <section className="py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {dynamicCategories.length <= 1 ? null : (
            <div className="flex flex-wrap gap-3 justify-center">
              {dynamicCategories.map((category) => (
                <button
                  key={category}
                  type="button"
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
          )}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {isLoading ? (
            <div className="py-16 text-center text-gray-500">Loading gallery...</div>
          ) : normalizedItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-600">
              <p className="font-medium">No gallery items yet</p>
              <p className="mt-2 text-sm text-gray-500">Publish gallery entries from the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
          )}

          {!isLoading && filteredItems.length === 0 && normalizedItems.length > 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No projects in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Gallery Is Regularly Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Book FloyMedia for your next wedding, event, corporate shoot, family session, or community project.
          </p>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
          >
            Book Your Session
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
