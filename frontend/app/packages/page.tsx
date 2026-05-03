'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { usePublicPackages } from '@/lib/hooks';

export default function PackagesPage() {
  const { data: apiPackages = [], isLoading } = usePublicPackages();

  const displayedPackages = apiPackages.map((pkg, idx) => ({
    id: pkg.id,
    name: pkg.packageName,
    price: 'Custom',
    description: pkg.description?.trim() || '',
    features: [pkg.category, pkg.isActive ? 'Active offering' : 'Currently inactive'].filter(Boolean) as string[],
    highlighted: idx % 3 === 1,
  }));

  return (
    <div className="w-full">
      <PageHero
        title="Our Packages"
        description="FloyMedia offers tailor-made pricing based on project type, location, duration, production needs, editing requirements, and delivery format."
        eyebrow="Pricing"
        variant="slate"
      />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {isLoading && <div className="py-16 text-center text-gray-500">Loading packages...</div>}

          {!isLoading && displayedPackages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-600">
              <p className="font-medium">No packages published yet</p>
              <p className="mt-2 text-sm text-gray-500">Add packages from the admin dashboard.</p>
            </div>
          )}

          {!isLoading && displayedPackages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-8 transition-all ${
                    pkg.highlighted
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl transform scale-105'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  {pkg.description ? (
                    <p className={`text-sm mb-6 ${pkg.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                      {pkg.description}
                    </p>
                  ) : null}
                  <div className={`text-4xl font-bold mb-8 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <CheckCircle
                          className={`flex-shrink-0 ${pkg.highlighted ? 'text-white' : 'text-blue-600'}`}
                          size={18}
                        />
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
          )}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Every Project Is Customized</h2>
          <p className="text-xl text-gray-600 mb-8">Every project is customized to client needs.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Request Custom Quote
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
