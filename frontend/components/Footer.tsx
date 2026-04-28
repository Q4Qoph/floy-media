'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-flex mb-4">
              <Image src="/logo.png" alt="FloyMedia logo" width={80} height={70} className="rounded-md" />
            </Link>
            <p className="text-xs md:text-sm text-black/70 leading-relaxed">
              FloyMedia is a creative media production company providing photography, videography, event coverage,
              corporate shoots, sports media, family photography, product content, and visual storytelling services.
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
                  Wedding & Event Coverage
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-black transition-colors">
                  Corporate & Sports Media
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
                <a href="tel:+254702781292" className="hover:text-black transition-colors">
                  +254 702 781 292
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>+254 714 591 221</span>
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
