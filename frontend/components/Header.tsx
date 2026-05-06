'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { mediaUrl } from '@/lib/api';
import { usePublicSiteSettings } from '@/lib/hooks';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const { data: siteSettings } = usePublicSiteSettings();

  if (isAdminRoute) return null;

  const defaultNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/videos', label: 'Videos' },
    { href: '/packages', label: 'Packages' },
    { href: '/bookings', label: 'Bookings' },
    { href: '/join-team', label: 'Join Team' },
    { href: '/contact', label: 'Contact' },
  ];
  const navLinks = siteSettings?.navbarLinks?.length ? siteSettings.navbarLinks : defaultNavLinks;
  const ctaLabel = siteSettings?.navbarCtaLabel || 'Book Now';
  const ctaHref = siteSettings?.navbarCtaHref || '/bookings';
  const logoSrc = mediaUrl(siteSettings?.navbarLogoUrl || '/logo.png');

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors px-2 py-1 rounded-md ${
      isActive ? 'text-[#045be2] bg-[#eaf1ff]' : 'text-gray-700 hover:text-[#045be2]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <nav className="flex items-center justify-between h-24 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center p-2">
          <Image src={logoSrc} alt="FloyMedia logo" width={72} height={72} className="rounded-md object-cover" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getLinkClassName(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href={ctaHref}
            className="text-sm font-semibold text-white bg-[#fd780c] hover:bg-[#e76b08] transition-colors px-6 py-2 rounded-lg"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-900" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  pathname === link.href ? 'text-[#045be2] bg-[#eaf1ff]' : 'text-gray-700 hover:text-[#045be2]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href={ctaHref}
              className="text-sm font-semibold text-white bg-[#fd780c] hover:bg-[#e76b08] transition-colors px-6 py-2 rounded-lg text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
