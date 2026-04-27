'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <nav className="flex items-center justify-between h-16 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          FloyMedia
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/bookings" 
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg"
          >
            Book Now
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
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/bookings" 
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
