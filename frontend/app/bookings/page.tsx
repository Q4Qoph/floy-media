'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function BookingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full">
      <PageHero
        title="Book Your Session"
        description="Book FloyMedia for your next event, shoot, brand project, corporate function, sports coverage, family session, product campaign, or community documentation project."
        eyebrow="Quick Booking"
        variant="teal"
      />

      {/* Booking Form Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-2xl mx-auto px-6 md:px-8">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Service Type *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Select a service</option>
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="weddings-events">Wedding & Event Coverage</option>
                <option value="corporate">Corporate Shoots</option>
                <option value="sports">Sports Media</option>
                <option value="family">Family & Lifestyle Shoots</option>
                <option value="product">Product & Brand Photography</option>
                <option value="ngo">NGO & Community Documentation</option>
                <option value="custom">Custom Package</option>
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Budget Range</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Select budget range</option>
                <option value="tailored">Tailor-made pricing</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="Tell us more about your project..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Submit Booking Request
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-green-900">Booking request submitted!</p>
                <p className="text-green-700 text-sm">We'll contact you within 24 hours to confirm your session.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fill Out Form</h3>
              <p className="text-gray-600">Provide your details and project requirements</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-gray-600">We'll contact you to confirm details and finalize</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Magic</h3>
              <p className="text-gray-600">We'll deliver amazing photos and videos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
