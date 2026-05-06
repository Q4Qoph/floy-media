'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { mediaUrl } from '@/lib/api';
import { usePublicSiteSettings } from '@/lib/hooks';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { data: siteSettings } = usePublicSiteSettings();

  const defaultMainLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/videos', label: 'Videos' },
    { href: '/packages', label: 'Packages' }
  ];
  const defaultQuickLinks = [
    { href: '/bookings', label: 'Bookings' },
    { href: '/join-team', label: 'Join Team' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin/login', label: 'Staff / Admin Login' }
  ];
  const mainLinks = siteSettings?.footerExploreLinks?.length ? siteSettings.footerExploreLinks : defaultMainLinks;
  const quickLinks = siteSettings?.footerQuickLinks?.length ? siteSettings.footerQuickLinks : defaultQuickLinks;
  const footerDescription = siteSettings?.footerDescription ||
    'FloyMedia is a creative media production company providing photography, videography, event coverage, corporate shoots, sports media, family photography, product content, and visual storytelling services.';
  const footerLogo = mediaUrl(siteSettings?.footerLogoUrl || '/logo.png');
  const footerEmail = siteSettings?.footerContactEmail || 'hello@floymedia.com';
  const footerPhone = siteSettings?.footerContactPhone || '+254 702 781 292';
  const footerAddress = siteSettings?.footerContactAddress || 'Nairobi, Kenya';
  const copyrightText = siteSettings?.footerCopyrightText?.trim();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-flex mb-4">
              <Image src={footerLogo} alt="FloyMedia logo" width={80} height={70} className="rounded-md object-cover" />
            </Link>
            <p className="text-xs md:text-sm text-black/70 leading-relaxed">
              {footerDescription}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">EXPLORE</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">QUICK LINKS</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-xs text-black mb-6 tracking-widest">CONTACT</h4>
            <ul className="space-y-3 text-xs md:text-sm text-black/60">
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0" />
                <a href={`mailto:${footerEmail}`} className="hover:text-black transition-colors">
                  {footerEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0" />
                <a href={`tel:${footerPhone.replace(/\s+/g, '')}`} className="hover:text-black transition-colors">
                  {footerPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>{footerAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 pt-8">
          <p className="text-center text-xs md:text-sm text-black/60">
            {copyrightText || `© ${currentYear} FloyMedia. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
