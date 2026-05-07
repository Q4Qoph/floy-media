'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/BookingForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import { usePublicSiteSettings } from '@/lib/hooks';
import { getPageText } from '@/lib/page-content';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';

export default function BookingPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: siteSettings } = usePublicSiteSettings();
  const content = siteSettings?.pageContent;

  return (
    <div className="w-full">
      <PageHero
        title={getPageText(content, 'booking', 'title', 'Book Your Project')}
        description={getPageText(
          content,
          'booking',
          'description',
          "Let's discuss your creative vision and bring it to life with our professional media production services."
        )}
        eyebrow={getPageText(content, 'booking', 'eyebrow', 'Project Consultation')}
        variant="blue"
      />

      {/* Main Content */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a
                        href="tel:+12345678900"
                        className="text-foreground/70 hover:text-primary transition-colors"
                      >
                        +1 (234) 567-8900
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:hello@floymedia.com"
                        className="text-foreground/70 hover:text-primary transition-colors"
                      >
                        hello@floymedia.com
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-foreground/70">
                        123 Creative Ave<br />
                        Studio City, CA 90000
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-foreground/70">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-8 border-t border-border">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { href: '/services', label: 'View Services' },
                    { href: '/about', label: 'Learn About Us' },
                    { href: '/', label: 'Back to Home' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-foreground/70 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Response Time:</span> We typically respond to booking inquiries within 24 hours.
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold mb-2">Tell Us About Your Project</h2>
                <p className="text-foreground/70 mb-8">
                  Fill out the form below and we&apos;ll get back to you with a custom proposal.
                </p>

                <BookingForm onSuccess={() => setSubmitSuccess(true)} />
              </div>

              {/* Additional Info */}
              {!submitSuccess && (
                <div className="mt-8 p-6 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">What to Expect</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Initial consultation to understand your vision</li>
                    <li>✓ Detailed project proposal with timeline and budget</li>
                    <li>✓ Pre-production planning and storyboarding</li>
                    <li>✓ Professional execution and post-production</li>
                    <li>✓ Delivery in all requested formats</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-16 md:py-24 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <motion.div className="space-y-6" variants={staggerContainer}>
            {[
              {
                q: 'How long does a typical project take?',
                a: 'Timeline varies based on project scope. Photography sessions can be completed in 1-2 days, while video projects typically take 2-4 weeks from pre-production to delivery. We&apos;ll provide a detailed timeline in your proposal.',
              },
              {
                q: 'What is your pricing structure?',
                a: 'We offer custom pricing based on your specific needs, project scope, and timeline. Our rates vary from $1,200 for drone services to $5,000+ for comprehensive video production packages.',
              },
              {
                q: 'Do you offer package deals?',
                a: 'Yes! We offer bundled services at competitive rates. For example, combining photography with videography can result in better pricing. Contact us for a custom quote.',
              },
              {
                q: 'What formats do you deliver?',
                a: 'We deliver in all standard formats including RAW files, JPG, PNG, MP4, ProRes, and more. Specific formats can be discussed during your consultation.',
              },
              {
                q: 'Can you work with tight deadlines?',
                a: 'We&apos;ll do our best to accommodate rush projects. Additional fees may apply for expedited timelines. Contact us directly to discuss your deadline.',
              },
              {
                q: 'Do you offer revisions?',
                a: 'Yes, we include revisions as part of our service. We&apos;ll work with you until you&apos;re completely satisfied with the final product.',
              },
            ].map((item, idx) => (
              <motion.div key={idx} className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors" variants={staggerItem}>
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Scroll up to submit your booking request or call us directly at +1 (234) 567-8900.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
