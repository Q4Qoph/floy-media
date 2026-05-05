'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Focus, Layers, Sparkles, Target } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicGallery } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

const CORE_VALUES = [
  'Creativity',
  'Professionalism',
  'Reliability',
  'Storytelling',
  'Quality',
  'Client-centered service',
  'Community impact',
  'Innovation',
];

const WHO_WE_SERVE = [
  'Private individuals',
  'Couples',
  'Families',
  'Companies',
  'Small businesses',
  'Schools',
  'Churches',
  'NGOs',
  'Sports teams',
  'Event organizers',
  'Product-based businesses',
  'Influencers',
  'Community groups',
  'Real estate businesses',
];

const WHAT_WE_DO = [
  'Photography',
  'Videography',
  'Wedding and event coverage',
  'Corporate shoots',
  'Product photography',
  'Sports media',
  'Family and lifestyle photography',
  'Brand storytelling',
  'Social media content creation',
  'NGO and community impact documentation',
  'Digital gallery delivery',
  'Client media archive management',
];

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
      return { id: item.id, src, title: item.title };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const heroImage = withImages[0] ?? null;
  const showcaseImages = withImages.slice(1, 5);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="About us"
        title="About FloyMedia"
        description="FloyMedia is a creative media company built on photography, videography, storytelling, and digital content. We help individuals, families, organizations, and brands capture moments and share their stories with clarity and impact."
      />

      {/* Intro + image — image height scales with width (3:2), aligns with story block */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-widest text-[#045be2] uppercase">Our story</p>
              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>
                  FloyMedia is a creative media production company built around photography, videography, storytelling,
                  and digital content creation. We help individuals, families, companies, brands, sports teams, NGOs,
                  schools, churches, and community organizations capture their moments and communicate their stories
                  professionally.
                </p>
                <p>
                  We believe every person, event, business, and community has a story worth preserving and sharing. Our role
                  is to turn those stories into high-quality photos, videos, digital galleries, and media content that can be
                  used for memories, marketing, documentation, branding, and communication.
                </p>
              </div>
            </div>

            <div className="w-full lg:justify-self-end">
              <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md aspect-[3/2]">
                {isLoading ? (
                  <div className="absolute inset-0 animate-pulse bg-gray-200" />
                ) : heroImage ? (
                  <>
                    <Image
                      src={heroImage.src}
                      alt={heroImage.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-14 pb-4 px-5">
                      <p className="text-white text-sm font-medium truncate">{heroImage.title}</p>
                      <Link href="/gallery" className="text-white/90 text-xs font-semibold mt-1 inline-block hover:underline">
                        View gallery →
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-gray-500">
                    <Layers className="mb-3 text-gray-400" size={36} strokeWidth={1.25} />
                    <p className="text-sm max-w-xs">Gallery images will appear here when added in admin.</p>
                    <Link href="/gallery" className="mt-3 text-sm font-semibold text-[#045be2] hover:underline">
                      Browse gallery
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision — same card language as rest of site */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <article className="rounded-2xl bg-white border-2 border-gray-200 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#045be2]">
                <Target size={20} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To provide professional photography, videography, and creative media production services that help clients
              capture moments, tell stories, promote brands, document impact, and communicate visually with confidence.
            </p>
          </article>

          <article className="rounded-2xl bg-white border-2 border-gray-200 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#045be2]">
                <Sparkles size={20} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become a trusted creative media company in East Africa, known for high-quality photography, videography,
              storytelling, digital gallery delivery, corporate media production, and community impact documentation.
            </p>
          </article>
        </div>
      </section>

      {/* Core values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Core values</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The principles that guide how we work with every client and every project.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CORE_VALUES.map((label) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center transition-colors hover:border-blue-300"
              >
                <Focus className="mx-auto mb-2 text-[#045be2]" size={18} />
                <p className="font-medium text-gray-900 text-sm leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we have — light section like gallery/services */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What we have</h2>
              <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                A glimpse of work from our gallery—projects and visuals we produce for clients.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#045be2] hover:text-[#034dc2]"
            >
              View full gallery
              <ArrowRight size={18} />
            </Link>
          </div>

          {!isLoading && showcaseImages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
              No additional gallery images yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading
                ? [0, 1, 2, 3].map((idx) => (
                    <div key={`sk-${idx}`} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
                  ))
                : showcaseImages.map((item) => (
                    <Link
                      key={item.id}
                      href="/gallery"
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 border border-gray-200 shadow-sm"
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who we serve</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-2xl">
            FloyMedia works with different types of clients, including:
          </p>
          <div className="flex flex-wrap gap-2">
            {WHO_WE_SERVE.map((label) => (
              <span
                key={label}
                className="rounded-full bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium border border-gray-200"
              >
                {label}
              </span>
            ))}
          </div>
          <p className="mt-10 text-gray-600 leading-relaxed max-w-2xl">
            FloyMedia supports both personal and professional media needs.
          </p>
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
