'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Camera, Film, Scissors, Drone } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Professional Photography',
    icon: Camera,
    image: '/images/service-photography.jpg',
    description: 'Capturing your moments with artistic excellence and technical precision.',
    features: [
      'Studio & On-Location Photography',
      'Weddings & Events',
      'Corporate Headshots',
      'Product Photography',
      'Real Estate Photography',
      'Professional Editing & Retouching',
    ],
    pricing: 'Starting from $500',
  },
  {
    id: 2,
    title: 'Cinematic Videography',
    icon: Film,
    image: '/images/service-videography.jpg',
    description: 'Bringing your story to life with cinematic quality and creative storytelling.',
    features: [
      'Event Videography',
      'Corporate Videos',
      'Promotional Content',
      '4K & High-Speed Filming',
      'Multi-Camera Production',
      'Professional Color Grading',
    ],
    pricing: 'Starting from $1,200',
  },
  {
    id: 3,
    title: 'Video Editing & Post-Production',
    icon: Scissors,
    image: '/images/service-editing.jpg',
    description: 'Transforming raw footage into polished, professional content.',
    features: [
      'Video Editing & Assembly',
      'Color Correction & Grading',
      'Motion Graphics & Animation',
      'Sound Design & Mixing',
      'Visual Effects',
      'Caption & Subtitle Design',
    ],
    pricing: 'Starting from $400',
  },
  {
    id: 4,
    title: 'Drone Services',
    icon: Drone,
    image: '/images/service-drone.jpg',
    description: 'Stunning aerial photography and videography from unique perspectives.',
    features: [
      'Aerial Photography',
      'Drone Videography',
      'Real Estate Aerial Shots',
      'Event Coverage',
      'High-Resolution Footage',
      'Licensed & Insured Operations',
    ],
    pricing: 'Starting from $800',
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive creative solutions tailored to your unique needs and vision
          </p>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {services.map((service, index) => {
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Flexible Packages</h2>
            <p className="text-lg text-gray-600">Choose the perfect package for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                description: 'Perfect for small projects',
                price: '$500',
                features: ['2 Hours Shoot', 'Basic Editing', '50 Final Images', 'Unlimited Revisions'],
              },
              {
                name: 'Professional',
                description: 'Most popular choice',
                price: '$1,500',
                features: ['Full Day Coverage', 'Advanced Editing', '200+ Final Images', 'Drone Shots', 'Rush Delivery'],
                highlighted: true,
              },
              {
                name: 'Premium',
                description: 'For demanding projects',
                price: '$3,500',
                features: ['Multi-Day Coverage', '4K Video', '500+ Images', 'Custom Color Grade', 'Cinematic Edit'],
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition-all ${
                  pkg.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl'
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
