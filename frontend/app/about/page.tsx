'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About FloyMedia</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Crafting visual stories with creativity, expertise, and cutting-edge technology
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/team-director.jpg"
                alt="Our team"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                FloyMedia was founded with a simple mission: to create stunning visual content that tells authentic stories and captures moments that matter. What started as a small creative studio has evolved into a full-service media production company serving brands, businesses, and individuals across diverse industries.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Over the years, we've worked with hundreds of clients, delivered thousands of projects, and earned recognition for our exceptional work. But our greatest achievement is the lasting relationships we've built with our clients and the trust they place in us to bring their visions to life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we combine traditional photography and videography expertise with cutting-edge AI technology to deliver content that's not just beautiful, but strategically designed to engage and inspire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Creativity',
                description: 'We push creative boundaries and think outside the box to deliver unique, memorable content.',
              },
              {
                title: 'Excellence',
                description: 'Every project receives our full attention and expertise to ensure outstanding results.',
              },
              {
                title: 'Collaboration',
                description: 'We work closely with our clients to understand their vision and bring it to life.',
              },
              {
                title: 'Innovation',
                description: 'We embrace new technologies and techniques to stay ahead of industry trends.',
              },
              {
                title: 'Integrity',
                description: 'We conduct our business with honesty, transparency, and professional ethics.',
              },
              {
                title: 'Impact',
                description: 'We create content that makes a difference and drives real results for our clients.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">By The Numbers</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { stat: '500+', label: 'Projects Completed' },
              { stat: '300+', label: 'Happy Clients' },
              { stat: '15+', label: 'Years Experience' },
              { stat: '50+', label: 'Team Members' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
                  {item.stat}
                </div>
                <p className="text-lg text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Meet Our Leadership</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Alex Johnson',
                title: 'Founder & Creative Director',
                image: '/images/team-director.jpg',
              },
              {
                name: 'Sarah Chen',
                title: 'Director of Videography',
                image: '/images/team-cinematographer.jpg',
              },
              {
                name: 'Marcus Williams',
                title: 'Head of Post-Production',
                image: '/images/team-editor.jpg',
              },
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold">{member.title}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mb-8">
            Supported by a talented team of photographers, videographers, editors, and production specialists
          </p>
        </div>
      </section>

      {/* What We Do Well */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Do Well</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/service-videography.jpg"
                alt="Videography"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Photography</h3>
                  <p className="text-gray-600">From portrait sessions to large-scale events, we capture moments with technical excellence and artistic vision.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Cinematic Videography</h3>
                  <p className="text-gray-600">We produce cinema-quality videos using state-of-the-art equipment and creative storytelling techniques.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Post-Production Mastery</h3>
                  <p className="text-gray-600">Expert editing, color grading, motion graphics, and sound design transform raw footage into polished masterpieces.</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Content</h3>
                  <p className="text-gray-600">Leveraging cutting-edge AI technology to enhance creativity and expand content possibilities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Work Together?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let's create something amazing and bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bookings" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors">
              Book a Session
              <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
