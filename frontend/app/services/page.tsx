'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Camera, Film, Scissors, Drone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicServices } from '@/lib/hooks';
import { mediaUrl } from '@/lib/api';

export default function ServicesPage() {
  const { data: apiServices = [], isLoading } = usePublicServices();
  const displayedServices = apiServices.map((item, idx) => ({
    id: item.id,
    title: item.serviceName,
    icon: [Camera, Film, Scissors, Drone][idx % 4],
    image:
      mediaUrl(item.imageUrl) ||
      ['/images/service-photography.jpg', '/images/service-videography.jpg', '/images/service-editing.jpg', '/images/service-drone.jpg'][idx % 4],
    description: item.shortDescription || item.fullDescription || 'Professional media service package.',
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

      {/* Services Detail Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {isLoading && (
            <div className="py-20 text-center text-gray-500">Loading services...</div>
          )}

          {!isLoading && displayedServices.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No services available yet.
            </div>
          )}

          {!isLoading && displayedServices.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={service.id} className="mb-20 last:mb-0">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-96 rounded-2xl overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Icon className="text-white" size={24} />
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900">{service.title}</h2>
                    </div>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">What's Included</h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <span className="text-lg font-bold text-gray-900">{service.pricing}</span>
                      <Link href="/bookings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
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

      {/* Package Options */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pricing</h2>
            <p className="text-lg text-gray-600">Every project is customized to your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'What Determines Cost',
                description: 'Your quote depends on:',
                price: 'Custom',
                features: ['Project type', 'Location', 'Duration', 'Production needs'],
              },
              {
                name: 'Included in Planning',
                description: 'We consider:',
                price: 'Custom',
                features: ['Editing requirements', 'Delivery format', 'Project timeline', 'Output volume'],
                highlighted: true,
              },
              {
                name: 'Best Approach',
                description: 'Get a tailored package',
                price: 'Custom',
                features: ['Request a quote', 'Share project brief', 'Get custom package', 'Confirm booking'],
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition-all ${
                  pkg.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-6 ${pkg.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                  {pkg.description}
                </p>
                <div className={`text-4xl font-bold mb-8 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <CheckCircle className={`flex-shrink-0 ${pkg.highlighted ? 'text-white' : 'text-blue-600'}`} size={18} />
                      <span className={pkg.highlighted ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/bookings"
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    pkg.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-white/90 mb-8">
            We offer custom packages tailored to your specific needs and budget
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors">
            Contact Us for Custom Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
