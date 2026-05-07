'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import { useCreateTeamApplication, usePublicSiteSettings } from '@/lib/hooks';
import { getPageText } from '@/lib/page-content';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';

export default function JoinTeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    portfolio: '',
    experience: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const teamMutation = useCreateTeamApplication();
  const { data: siteSettings } = usePublicSiteSettings();
  const content = siteSettings?.pageContent;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await teamMutation.mutateAsync({
      fullName: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      skillArea: formData.position,
      experienceLevel: formData.experience,
      portfolioLink: formData.portfolio || undefined,
      message: formData.message || undefined,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full">
      <PageHero
        title={getPageText(content, 'joinTeam', 'title', 'Join Our Team')}
        description={getPageText(
          content,
          'joinTeam',
          'description',
          'Join the FloyMedia creative team. We are building a network of photographers, videographers, editors, designers, drone operators, and storytellers.'
        )}
        eyebrow={getPageText(content, 'joinTeam', 'eyebrow', 'Careers')}
        variant="indigo"
      />

      {/* Application Form */}
      <motion.section
        className="py-20 md:py-32 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
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

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Position Interest *</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Select a position</option>
                <option value="photographer">Photographer</option>
                <option value="videographer">Videographer</option>
                <option value="editor">Video Editor</option>
                <option value="drone-pilot">Drone Pilot</option>
                <option value="production-assistant">Production Assistant</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Years of Experience *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Select experience level</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-plus">10+ years</option>
              </select>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Portfolio URL</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="https://yourportfolio.com"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Why Do You Want To Join FloyMedia?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="Tell us about yourself and why you'd be a great fit for our team..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              disabled={teamMutation.isPending}
            >
              {teamMutation.isPending ? 'Submitting...' : 'Submit Application'}
              <ArrowRight size={20} />
            </button>
          </form>

          {teamMutation.isError && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              Failed to submit application. Please try again.
            </div>
          )}

          {/* Success Message */}
          {submitted && (
            <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-green-900">Application submitted!</p>
                <p className="text-green-700 text-sm">If you are passionate about media, storytelling, or creative work, we welcome you to apply.</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Why Join Us */}
      <motion.section
        className="py-20 md:py-32 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">Why Join FloyMedia</h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer}>
            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Competitive Compensation</h3>
              <p className="text-gray-600">We offer competitive rates and benefits for all team members</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cutting-Edge Equipment</h3>
              <p className="text-gray-600">Access to the latest professional photography and videography gear</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Creative Freedom</h3>
              <p className="text-gray-600">Work on diverse projects that push your creative boundaries</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Growth</h3>
              <p className="text-gray-600">Training and development opportunities to advance your career</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Team</h3>
              <p className="text-gray-600">Work with talented creatives in a supportive environment</p>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-2xl border-2 border-gray-200" variants={staggerItem}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Flexible Schedule</h3>
              <p className="text-gray-600">Balance between project work and personal time</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
