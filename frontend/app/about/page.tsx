'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageIcon } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicGallery } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

function resolveMediaUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const u = mediaUrl(raw);
  return u || null;
}

export default function AboutPage() {
  const { data: gallery = [], isLoading } = usePublicGallery();

  const withImages = gallery
    .map((item) => {
      const src = resolveMediaUrl(item.thumbnailUrl || item.fileUrl);
      if (!src) return null;
      return { id: item.id, src, title: item.title, category: item.categoryName || item.category?.name || '' };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const storyImage = withImages[0] ?? null;
  const secondaryImage = withImages[1] ?? null;
  const portfolioSlice = withImages.slice(0, 6);

  return (
    <div className="w-full">
      <PageHero
        title="About FloyMedia"
        description="We Shoot Your World. We Tell Your Story."
        eyebrow="Our Identity"
        variant="indigo"
      />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
              {isLoading ? (
                <div className="absolute inset-0 animate-pulse bg-gray-200" />
              ) : storyImage ? (
                <Image src={storyImage.src} alt={storyImage.title} fill className="object-cover" sizes="50vw" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <ImageIcon size={40} strokeWidth={1.25} />
                  <span className="text-sm">Add gallery images to show visuals here</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                FloyMedia is a creative media production company built around photography, videography, storytelling,
                and digital content creation. We help individuals, families, companies, brands, sports teams, NGOs,
                schools, churches, and community organizations capture their moments and communicate their stories
                professionally.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe every person, event, business, and community has a story worth preserving and sharing. Our
                role is to turn those stories into high-quality photos, videos, digital galleries, and media content for
                memories, marketing, branding, and communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Mission, Vision & Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Mission',
                description:
                  'To provide professional photography, videography, and creative media production services that help clients capture moments, tell stories, promote brands, document impact, and communicate visually with confidence.',
              },
              {
                title: 'Vision',
                description:
                  'To become a trusted creative media company in East Africa known for high-quality photography, videography, storytelling, and digital media delivery.',
              },
              {
                title: 'Creativity',
                description: 'Creativity in every frame and every story.',
              },
              {
                title: 'Professionalism',
                description: 'Reliable, respectful, and high-standard service delivery.',
              },
              {
                title: 'Reliability',
                description: 'We keep our promises and deliver on schedule.',
              },
              {
                title: 'Storytelling',
                description: 'Every photo and video should communicate meaning and emotion.',
              },
              {
                title: 'Quality',
                description: 'We focus on polished, professional output for every client.',
              },
              {
                title: 'Innovation',
                description: 'We continue improving our craft, tools, and delivery.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Final Brand Statement</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            FloyMedia is a modern creative media company built to capture stories, preserve memories, promote brands,
            document impact, and deliver professional visual content for people, businesses, organizations, and
            communities.
          </p>
          <p className="text-xl font-semibold text-blue-700 mt-6">FloyMedia: We Shoot Your World. We Tell Your Story.</p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">From the portfolio</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A selection of work from your published gallery (managed in admin).
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : portfolioSlice.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500">
              No gallery images yet. Publish items in the admin gallery to populate this section.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {portfolioSlice.map((item) => (
                <Link key={item.id} href="/gallery" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-56">
                    <Image src={item.src} alt={item.title} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.category ? <p className="text-blue-600 font-semibold text-sm">{item.category}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <p className="text-center text-gray-600 mb-8">
            Supported by a talented team of photographers, videographers, editors, and production specialists
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Do Well</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
              {secondaryImage ? (
                <Image src={secondaryImage.src} alt={secondaryImage.title} fill className="object-cover" sizes="50vw" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <ImageIcon size={40} strokeWidth={1.25} />
                  <span className="text-sm px-6 text-center">Second gallery image appears here when available</span>
                </div>
              )}
            </div>

            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Photography</h3>
                  <p className="text-gray-600">
                    From portrait sessions to large-scale events, we capture moments with technical excellence and
                    artistic vision.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Cinematic Videography</h3>
                  <p className="text-gray-600">
                    We produce cinema-quality videos using state-of-the-art equipment and creative storytelling
                    techniques.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Post-Production Mastery</h3>
                  <p className="text-gray-600">
                    Expert editing, color grading, motion graphics, and sound design transform raw footage into polished
                    output.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Content</h3>
                  <p className="text-gray-600">
                    Leveraging cutting-edge AI technology to enhance creativity and expand content possibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Work Together?</h2>
          <p className="text-xl text-white/90 mb-8">Let&apos;s create something amazing and bring your vision to life</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bookings"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
            >
              Book a Session
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
