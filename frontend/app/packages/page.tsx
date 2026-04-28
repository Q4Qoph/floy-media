'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';

const packages = [
  {
    name: 'Photography Starter',
    price: '$500',
    description: 'Perfect for small projects and beginner clients',
    features: ['2 Hours Shoot', 'Basic Editing', '50 Final Images', 'Digital Gallery', 'Unlimited Revisions'],
  },
  {
    name: 'Photography Professional',
    price: '$1,500',
    description: 'Most popular photography package',
    price: '$1,500',
    features: ['Full Day Coverage', 'Advanced Editing', '200+ Final Images', 'Drone Shots', 'Rush Delivery', 'Print Rights'],
    highlighted: true,
  },
  {
    name: 'Photography Premium',
    price: '$3,500',
    description: 'For demanding photography projects',
    features: ['2-Day Coverage', '4K Video', '500+ Images', 'Custom Color Grade', 'Cinematic Edit', 'Private Screening'],
  },
  {
    name: 'Video Production Starter',
    price: '$1,200',
    description: 'Essential video production',
    features: ['4 Hours Shoot', 'Basic Editing', 'HD Quality', '2K Resolution', 'Stock Music', 'Single Revision Round'],
  },
  {
    name: 'Video Production Professional',
    price: '$3,500',
    description: 'Full-service video production',
    features: ['Full Day Shoot', 'Advanced Editing', '4K/8K Recording', 'Color Grading', 'Custom Music', '3 Revision Rounds'],
    highlighted: true,
  },
  {
    name: 'Video Production Premium',
    price: '$7,500',
    description: 'High-end cinematic production',
    features: ['Multi-Day Shoot', 'Cinematic Grade', 'Motion Graphics', 'Sound Design', 'Unlimited Revisions', 'Premiere Screening'],
  },
];

export default function PackagesPage() {
  return (
    <div className="w-full">
      <PageHero
        title="Our Packages"
        description="FloyMedia offers tailor-made pricing based on project type, location, duration, production needs, editing requirements, and delivery format."
        eyebrow="Pricing"
        variant="slate"
      />

      {/* Packages Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition-all ${
                  pkg.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl transform scale-105'
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
                  Choose Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Every Project Is Customized</h2>
          <p className="text-xl text-gray-600 mb-8">
            Every project is customized to client needs.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Request Custom Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
