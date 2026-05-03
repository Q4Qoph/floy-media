'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicVideos } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

function resolveMediaUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const u = mediaUrl(raw);
  return u || null;
}

export default function VideosPage() {
  const { data: apiVideos = [], isLoading } = usePublicVideos();

  const displayedVideos = apiVideos.map((video) => {
    const thumb = resolveMediaUrl(video.thumbnailUrl);
    return {
      id: video.id,
      title: video.title,
      category: video.clientName?.trim() || 'Video',
      thumbnail: thumb,
      videoUrl: mediaUrl(video.videoUrl) || '',
      description: video.description?.trim() || '',
    };
  });

  return (
    <div className="w-full">
      <PageHero
        title="Video Highlights"
        description="Watch FloyMedia video productions including wedding films, corporate videos, sports highlights, event coverage, brand stories, documentaries, and social media reels."
        eyebrow="Watch & Explore"
        variant="orange"
      />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {isLoading && <div className="py-16 text-center text-gray-500">Loading videos...</div>}

          {!isLoading && displayedVideos.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-600">
              <p className="font-medium">No videos published yet</p>
              <p className="mt-2 text-sm text-gray-500">Add video highlights from the admin dashboard.</p>
            </div>
          )}

          {!isLoading && displayedVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedVideos.map((video) => (
                <div key={video.id} className="group">
                  {video.videoUrl ? (
                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative h-72 rounded-2xl overflow-hidden bg-gray-100 mb-6">
                        {video.thumbnail ? (
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <Play className="text-white/90" size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="text-blue-600 fill-blue-600" size={32} />
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="relative h-72 rounded-2xl overflow-hidden bg-gray-100 mb-6 flex items-center justify-center text-sm text-gray-500">
                      Video URL missing in admin
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {video.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    {video.description ? <p className="text-gray-600 text-sm">{video.description}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need Video Coverage?</h2>
          <p className="text-xl text-white/90 mb-8">
            FloyMedia delivers high-quality video storytelling for people, brands, businesses, and communities.
          </p>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
          >
            Request a Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
