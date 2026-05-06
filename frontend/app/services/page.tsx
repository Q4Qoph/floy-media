'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Camera, Film, Scissors, Drone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicServices } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

function resolveMediaUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const u = mediaUrl(raw);
  return u || null;
}

export default function ServicesPage() {
  const { data: apiServices = [], isLoading } = usePublicServices();
  const displayedServices = apiServices.map((item, idx) => ({
    id: item.id,
    title: item.serviceName,
    icon: [Camera, Film, Scissors, Drone][idx % 4],
    image: resolveMediaUrl(item.imageUrl),
    description: [item.shortDescription, item.fullDescription].find((s) => s?.trim())?.trim() || '',
    features: (item.includedItems && item.includedItems.length
      ? item.includedItems
      : (item.fullDescription || '')
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean)
    ).slice(0, 6),
    pricing: 'Tailor-made pricing',
  }));

  return (
    <div className="w-full">
      <PageHero
        title="Our Services"
        description="FloyMedia offers complete creative media solutions including photography, videography, and storytelling for individuals, businesses, and organizations."
        eyebrow="What We Offer"
        variant="blue"
      />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {isLoading && <div className="py-20 text-center text-gray-500">Loading services...</div>}

          {!isLoading && displayedServices.length === 0 && (
            <div className="py-20 text-center text-gray-500 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              No services available yet. Add services in the admin dashboard.
            </div>
          )}

          {!isLoading &&
            displayedServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={service.id} className="mb-20 last:mb-0">
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                    <div className="w-full lg:w-1/2">
                      <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
                        {service.image ? (
                          <Image src={service.image} alt={service.title} fill className="object-cover" sizes="50vw" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Icon className="text-gray-400 mb-3" size={56} strokeWidth={1.25} />
                            <span className="text-sm text-gray-500">Image not set in admin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Icon className="text-white" size={24} />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900">{service.title}</h2>
                      </div>

                      {service.description ? (
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                      ) : null}

                      {service.features.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
                            What&apos;s Included
                          </h3>
                          <ul className="space-y-3">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <span className="text-lg font-bold text-gray-900">{service.pricing}</span>
                        <Link
                          href="/bookings"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Book Now
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-xl text-white/90 mb-8">
            We offer custom packages tailored to your specific needs and budget
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
          >
            Contact Us for Custom Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
