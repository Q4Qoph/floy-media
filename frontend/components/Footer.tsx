'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-2xl font-light mb-4">
              FloyMedia
            </h3>
            <p className="text-xs md:text-sm text-black/70 leading-relaxed">
              Professional creative media production and digital services for brands that demand excellence.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">SERVICES</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              <li>
                <Link href="/#services" className="hover:text-black transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-black transition-colors">
                  Videography
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-black transition-colors">
                  Editing
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-black transition-colors">
                  Drone Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">COMPANY</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-black transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">CONTACT</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:hello@floymedia.com" className="hover:text-black transition-colors">
                  hello@floymedia.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-black transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>New York, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 pt-8">
          <p className="text-center text-xs md:text-sm text-black/60">
            {`© ${currentYear} FloyMedia. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
