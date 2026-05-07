'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Users,
  Zap,
  Camera,
  Film,
  Scissors,
  Drone,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePublicFeaturedGallery, usePublicHeroSection, usePublicServices } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ─── Reusable  variants ───────────────────────────────────────────────

const EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD, delay },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD, delay },
  }),
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD, delay },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_STANDARD, delay },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD },
  },
};

// Shared viewport config so every whileInView triggers once
const viewport = { once: true, margin: '-80px' };

// ───────────────────────────────────────────────────────────────────────────────

function resolveMediaUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const u = mediaUrl(raw);
  return u || null;
}

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: services = [], isLoading: servicesLoading } = usePublicServices();
  const { data: featuredGallery = [], isLoading: featuredLoading } = usePublicFeaturedGallery();
  const { data: heroSection, isLoading: heroLoading } = usePublicHeroSection();

  const featuredWorks = featuredGallery
    .map((item) => {
      const image = resolveMediaUrl(item.thumbnailUrl || item.fileUrl);
      if (!image) return null;
      return {
        id: item.id,
        image,
        title: item.title,
        category: item.categoryName || item.category?.name || '',
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 6);

  const mosaicCandidates =
    heroSection?.mosaicImages?.length === 3
      ? (heroSection.mosaicImages as string[]).map((u) => resolveMediaUrl(u))
      : [];
  const hasFullMosaic =
    mosaicCandidates.length === 3 && mosaicCandidates.every((u): u is string => typeof u === 'string' && u.length > 0);
  const mosaicUrls = hasFullMosaic ? (mosaicCandidates as [string, string, string]) : null;

  const heroCarouselWorks = (heroSection?.carouselItems ?? [])
    .map((item, idx) => {
      const image = resolveMediaUrl(item.imageUrl);
      if (!image) return null;
      return {
        id: `hero-slide-${idx}`,
        image,
        title: item.title || '',
        category: item.subtitle || '',
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const slide = heroCarouselWorks[currentImageIndex] ?? null;

  const headlineLine1 = heroSection?.headlineLine1?.trim() ?? '';
  const headlineLine2 = heroSection?.headlineLine2?.trim() ?? '';
  const introText = heroSection?.introText?.trim() ?? '';

  const serviceIcons = [Camera, Film, Scissors, Drone];
  const featuredServices = services.slice(0, 4);

  useEffect(() => {
    if (heroCarouselWorks.length === 0) {
      setCurrentImageIndex(0);
      return;
    }
    setCurrentImageIndex((i) => (i >= heroCarouselWorks.length ? 0 : i));
  }, [heroCarouselWorks.length]);

  const nextImage = () => {
    if (heroCarouselWorks.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % heroCarouselWorks.length);
  };

  const prevImage = () => {
    if (heroCarouselWorks.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + heroCarouselWorks.length) % heroCarouselWorks.length);
  };

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {heroLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-24 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-200 rounded-lg w-40" />
              </div>
              <div className="h-96 bg-gray-100 rounded-3xl" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-0">

              {/* LEFT column */}
              <motion.div
                className="w-full lg:w-1/2 flex flex-col justify-between lg:pr-10 xl:pr-12"
                initial="hidden"
                animate="visible"
                variants={slideLeft}
              >
                <div className="text-center lg:text-left">
                  {(headlineLine1 || headlineLine2) && (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
                      {headlineLine1 && (
                        <motion.span
                          className="block"
                          custom={0.1}
                          initial="hidden"
                          animate="visible"
                          variants={fadeUp}
                        >
                          {headlineLine1}
                        </motion.span>
                      )}
                      {headlineLine2 && (
                        <motion.span
                          className="block text-[#045be2]"
                          custom={0.22}
                          initial="hidden"
                          animate="visible"
                          variants={fadeUp}
                        >
                          {headlineLine2}
                        </motion.span>
                      )}
                    </h1>
                  )}

                  {introText && (
                    <motion.p
                      className="text-sm md:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8"
                      custom={0.34}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      {introText}
                    </motion.p>
                  )}

                  {!headlineLine1 && !headlineLine2 && !introText && (
                    <motion.p
                      className="text-sm text-gray-500 max-w-lg mx-auto lg:mx-0 mb-8"
                      custom={0.1}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      Homepage hero copy and images are managed in the admin dashboard (Homepage Hero).
                    </motion.p>
                  )}

                  <motion.div
                    className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start"
                    custom={0.46}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                  >
                    <Link
                      href="/bookings"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#045be2] hover:bg-[#034dc2] text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Book a Shoot
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Request a Quote
                    </Link>
                  </motion.div>
                </div>

                {/* Mosaic */}
                <motion.div
                  className="mt-12 lg:mt-14 grid grid-cols-2 gap-4 md:gap-6"
                  custom={0.58}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <div className="col-span-1 row-span-2">
                    <motion.div
                      className="relative w-full h-full min-h-52 md:min-h-72 rounded-3xl overflow-hidden bg-gray-100"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {mosaicUrls ? (
                        <Image
                          src={mosaicUrls[0]}
                          alt=""
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 26rem"
                        />
                      ) : null}
                    </motion.div>
                  </div>
                  <motion.div
                    className="relative w-full h-36 md:h-44 rounded-3xl overflow-hidden bg-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mosaicUrls ? (
                      <Image
                        src={mosaicUrls[1]}
                        alt=""
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 26rem"
                      />
                    ) : null}
                  </motion.div>
                  <motion.div
                    className="relative w-full h-36 md:h-44 rounded-3xl overflow-hidden bg-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mosaicUrls ? (
                      <Image
                        src={mosaicUrls[2]}
                        alt=""
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 26rem"
                      />
                    ) : null}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* RIGHT column — carousel */}
              <motion.div
                className="w-full lg:w-1/2 flex min-h-0"
                initial="hidden"
                animate="visible"
                variants={slideRight}
                custom={0.2}
              >
                <div className="flex flex-1 flex-col bg-neutral-50 rounded-3xl p-6 md:p-8 lg:p-10 min-h-[22rem] lg:min-h-0 lg:h-full">
                  <div className="flex flex-1 flex-col gap-5 min-h-0">
                    {slide ? (
                      <>
                        <div className="relative w-full flex-1 min-h-52 sm:min-h-60 lg:min-h-[12rem] rounded-3xl overflow-hidden bg-gray-200">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={slide.id}
                              className="absolute inset-0"
                              initial={{ opacity: 0, scale: 1.04 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.97 }}
                              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Image
                                src={slide.image}
                                alt={slide.title || 'Carousel'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 36rem"
                              />
                            </motion.div>
                          </AnimatePresence>

                          {heroCarouselWorks.length > 1 && (
                            <div className="absolute bottom-4 right-4 flex gap-2">
                              <motion.button
                                type="button"
                                onClick={prevImage}
                                className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                                aria-label="Previous image"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ChevronLeft size={20} />
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={nextImage}
                                className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                                aria-label="Next image"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ChevronRight size={20} />
                              </motion.button>
                            </div>
                          )}
                        </div>

                        {heroCarouselWorks.length > 0 && (
                          <div className="grid shrink-0 grid-cols-3 gap-3">
                            {heroCarouselWorks.map((work, idx) => (
                              <motion.button
                                key={work.id}
                                type="button"
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`relative w-full h-20 md:h-24 rounded-xl overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                                  }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <Image
                                  src={work.image}
                                  alt={work.title}
                                  fill
                                  className="object-cover"
                                  sizes="120px"
                                />
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/60 px-6 text-center text-sm text-gray-500">
                        <p>Add carousel items with images in Admin → Homepage Hero to show highlights here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* scroll arrow */}
          <motion.div
            className="flex justify-center mt-10 md:mt-12 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="animate-bounce" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FloyMedia offers complete creative media solutions including photography, videography, and storytelling
              for individuals, businesses, and organizations.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {servicesLoading && (
              <div className="col-span-full text-center text-sm text-gray-500">Loading services...</div>
            )}
            {!servicesLoading &&
              featuredServices.map((service, idx) => {
                const Icon = serviceIcons[idx % serviceIcons.length];
                const img = resolveMediaUrl(service.imageUrl);
                const blurb =
                  [service.shortDescription, service.fullDescription].find((s) => s?.trim())?.trim() || '';
                return (
                  <motion.div key={service.id} variants={staggerChild}>
                    <Link href="/services" className="group block">
                      <motion.div
                        className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100"
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={service.serviceName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Icon className="text-gray-400" size={48} strokeWidth={1.25} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6">
                          <Icon className="text-white mb-3" size={28} />
                          <h3 className="text-xl font-bold text-white">{service.serviceName}</h3>
                        </div>
                      </motion.div>
                      {blurb ? <p className="text-gray-600 text-sm mb-3">{blurb}</p> : null}
                    </Link>
                  </motion.div>
                );
              })}
            {!servicesLoading && featuredServices.length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500">
                No services published yet. Add services in the admin dashboard.
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Explore Detailed Services
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose FloyMedia</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Combining expertise with cutting-edge technology</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {/* Card 1 */}
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all"
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Award-Winning</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-recognized excellence with years of experience delivering exceptional results
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all"
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Cutting-edge AI technology for content generation and enhanced creative capabilities
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all"
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional photographers, videographers, and editors dedicated to your vision
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          <motion.div
            className="flex items-center justify-between mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Works</h2>
              <p className="text-lg text-gray-600">Showcasing our latest projects and creative excellence</p>
            </div>
            <Link
              href="/gallery"
              className="hidden md:inline-flex items-center gap-2 text-[#045be2] hover:text-[#034dc2] font-semibold"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          {featuredLoading ? (
            <div className="py-16 text-center text-sm text-gray-500">Loading featured works...</div>
          ) : featuredWorks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-600">
              <p className="mb-2">No featured gallery items yet.</p>
              <p className="text-sm text-gray-500">
                Mark gallery entries as featured in the admin dashboard to populate this section.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
            >
              {featuredWorks.map((work) => (
                <motion.div key={work.id} variants={staggerChild}>
                  <Link href="/gallery" className="group block">
                    <motion.div
                      className="relative h-72 rounded-2xl overflow-hidden mb-4 bg-gray-100"
                      whileHover={{ scale: 1.02, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <p className="text-gray-900 font-semibold group-hover:text-[#045be2] transition-colors">{work.title}</p>
                    {work.category ? <p className="text-gray-600 text-sm">{work.category}</p> : null}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="text-center md:hidden"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#045be2] hover:bg-[#034dc2] text-white font-semibold rounded-lg transition-colors"
            >
              View Full Gallery
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-[#045be2] via-[#034dc2] to-[#2b7bff]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            Book FloyMedia for Your Next Project
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-8 leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0.12}
          >
            Book FloyMedia for your next event, shoot, brand project, corporate function, sports coverage, family
            session, product campaign, or community documentation project.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            custom={0.24}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#045be2] hover:bg-gray-100 font-semibold rounded-lg transition-colors"
              >
                Book Now
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
              >
                Request a Quote
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}