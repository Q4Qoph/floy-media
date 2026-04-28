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
import { useState } from 'react';

const featuredWorks = [
  { id: 1, image: '/images/service-photography.jpg', title: 'Wedding Photography', category: 'Photography' },
  { id: 2, image: '/images/service-videography.jpg', title: 'Corporate Video', category: 'Videography' },
  { id: 3, image: '/images/service-editing.jpg', title: 'Brand Campaign', category: 'Editing' },
  { id: 4, image: '/images/service-drone.jpg', title: 'Aerial Photography', category: 'Drone' },
  { id: 5, image: '/images/team-director.jpg', title: 'Product Photography', category: 'Photography' },
  { id: 6, image: '/images/team-cinematographer.jpg', title: 'Event Coverage', category: 'Videography' },
] as const;

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const slide = featuredWorks[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % featuredWorks.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + featuredWorks.length) % featuredWorks.length);
  };

  return (
    <div className="w-full">
      {/* Hero — floy-style columns inside same max-width as rest of page; no boxed “cards” */}
      <section className="bg-white pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-0">
            {/* Left: copy + mosaic (floy: plain white column, padding only) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between lg:pr-10 xl:pr-12">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
                  We Shoot Your World.
                  <span className="block text-[#045be2]">
                    We Tell Your Story.
                  </span>
                </h1>
                <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                  FloyMedia is a creative media production company providing professional photography, videography,
                  event coverage, corporate shoots, sports media, family photography, product content, and visual
                  storytelling for individuals, brands, businesses, and communities.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
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
                </div>
              </div>

              <div className="mt-12 lg:mt-14 grid grid-cols-2 gap-4 md:gap-6">
                <div className="col-span-1 row-span-2">
                  <div className="relative w-full h-full min-h-52 md:min-h-72 rounded-3xl overflow-hidden bg-gray-100">
                    <Image
                      src="/images/service-photography.jpg"
                      alt="Featured work"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 26rem"
                    />
                  </div>
                </div>
                <div className="relative w-full h-36 md:h-44 rounded-3xl overflow-hidden bg-gray-100">
                  <Image
                    src="/images/service-videography.jpg"
                    alt="Featured work"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 26rem"
                  />
                </div>
                <div className="relative w-full h-36 md:h-44 rounded-3xl overflow-hidden bg-gray-100">
                  <Image
                    src="/images/service-editing.jpg"
                    alt="Featured work"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 26rem"
                  />
                </div>
              </div>
            </div>

            {/* Right: floy gray panel — main image grows so the column matches the left; no dead band */}
            <div className="w-full lg:w-1/2 flex min-h-0">
              <div className="flex flex-1 flex-col bg-neutral-50 rounded-3xl p-6 md:p-8 lg:p-10 min-h-[22rem] lg:min-h-0 lg:h-full">
                <div className="flex flex-1 flex-col gap-5 min-h-0">
                  <div className="relative w-full flex-1 min-h-52 sm:min-h-60 lg:min-h-[12rem] rounded-3xl overflow-hidden bg-gray-200">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 36rem"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        type="button"
                        onClick={prevImage}
                        className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid shrink-0 grid-cols-3 gap-3">
                    {featuredWorks.map((work, idx) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-full h-20 md:h-24 rounded-xl overflow-hidden transition-all ${
                          idx === currentImageIndex ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={work.image} alt={work.title} fill className="object-cover" sizes="120px" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10 md:mt-12 text-gray-400">
            <div className="animate-bounce" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Short Intro</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              FloyMedia captures stories through powerful visuals. From weddings and family moments to corporate shoots,
              sports coverage, product photography, community projects, and brand campaigns, we help clients preserve
              memories, promote their work, and communicate with impact.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FloyMedia offers complete creative media solutions including photography, videography, and storytelling
              for individuals, businesses, and organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/services" className="group">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src="/images/service-photography.jpg"
                  alt="Professional Photography"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Camera className="text-white mb-3" size={28} />
                  <h3 className="text-xl font-bold text-white">Photography</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">Studio and on-location photography for all occasions</p>
            </Link>

            <Link href="/services" className="group">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src="/images/service-videography.jpg"
                  alt="Professional Videography"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Film className="text-white mb-3" size={28} />
                  <h3 className="text-xl font-bold text-white">Videography</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">Cinematic video production with professional equipment</p>
            </Link>

            <Link href="/services" className="group">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src="/images/service-editing.jpg"
                  alt="Video Editing"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Scissors className="text-white mb-3" size={28} />
                  <h3 className="text-xl font-bold text-white">Editing & Effects</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">Professional post-production with creative effects</p>
            </Link>

            <Link href="/services" className="group">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src="/images/service-drone.jpg"
                  alt="Drone Services"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Drone className="text-white mb-3" size={28} />
                  <h3 className="text-xl font-bold text-white">Drone Services</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">Aerial photography and videography expertise</p>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Explore Detailed Services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section — unchanged copy */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose FloyMedia</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Combining expertise with cutting-edge technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Award-Winning</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-recognized excellence with years of experience delivering exceptional results
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Cutting-edge AI technology for content generation and enhanced creative capabilities
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#045be2] to-[#2b7bff] rounded-xl flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional photographers, videographers, and editors dedicated to your vision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery Section — unchanged copy */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Works</h2>
              <p className="text-lg text-gray-600">Showcasing our latest projects and creative excellence</p>
            </div>
            <Link href="/gallery" className="hidden md:inline-flex items-center gap-2 text-[#045be2] hover:text-[#034dc2] font-semibold">
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredWorks.map((work) => (
              <Link key={work.id} href="/gallery" className="group">
                <div className="relative h-72 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-gray-900 font-semibold group-hover:text-[#045be2] transition-colors">{work.title}</p>
                <p className="text-gray-600 text-sm">{work.category}</p>
              </Link>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#045be2] hover:bg-[#034dc2] text-white font-semibold rounded-lg transition-colors"
            >
              View Full Gallery
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section — unchanged copy */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-[#045be2] via-[#034dc2] to-[#2b7bff]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Book FloyMedia for Your Next Project</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Book FloyMedia for your next event, shoot, brand project, corporate function, sports coverage, family
            session, product campaign, or community documentation project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bookings"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#045be2] hover:bg-gray-100 font-semibold rounded-lg transition-colors"
            >
              Book Now
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
            >
              Request a Quote
            </Link>
            <a href="tel:+254702781292" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors">
              Call: +254 702 781 292
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
