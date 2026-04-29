'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useCreateContactMessage } from '@/lib/hooks';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const contactMutation = useCreateContactMessage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await contactMutation.mutateAsync({
      fullName: formData.name,
      phoneNumber: formData.phone || undefined,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full">
      <PageHero
        title="Get In Touch"
        description="Contact FloyMedia for photography, videography, event coverage, corporate shoots, family photography, sports media, product shoots, and creative content production."
        eyebrow="Bookings & Inquiries"
        variant="blue"
      />

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">For Bookings and Inquiries</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                    placeholder="What is this about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  {!contactMutation.isPending && <ArrowRight size={20} />}
                </button>
              </form>

              {contactMutation.isError && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                  Failed to send message. Please try again.
                </div>
              )}

              {/* Success Message */}
              {submitted && (
                <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-green-900">Message sent!</p>
                    <p className="text-green-700 text-sm">We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-5 p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-[#045be2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700 font-medium">hello@floymedia.com</p>
                    <p className="text-gray-600 text-sm mt-1">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-5 p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-[#045be2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-700 font-medium">+254 702 781 292</p>
                    <p className="text-gray-700 font-medium">+254 714 591 221</p>
                    <p className="text-gray-600 text-sm mt-1">Call or WhatsApp for faster support</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-5 p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-[#045be2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Service Region</h3>
                    <p className="text-gray-700 font-medium">East Africa</p>
                    <p className="text-gray-600 text-sm mt-1">Available for local and destination projects</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/bookings" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <ArrowRight size={18} />
                    Book a Session
                  </a>
                  <a href="/packages" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <ArrowRight size={18} />
                    View Packages
                  </a>
                  <a href="/services" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <ArrowRight size={18} />
                    Our Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
            <p className="text-white text-xl font-semibold">Map Integration - Studio Location</p>
          </div>
        </div>
      </section>
    </div>
  );
}
