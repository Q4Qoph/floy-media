'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/team-applications', label: 'Team Applications' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/projects', label: 'Projects' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-5">
          <div className="mb-6 flex items-center">
            <Link href="/admin/dashboard" className="inline-flex items-center rounded-md p-2">
              <Image src="/logo.png" alt="FloyMedia logo" width={72} height={72} className="rounded-md" />
            </Link>
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href ? 'bg-[#045be2] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
              onClick={() => {
                adminAuth.clear();
                router.push('/admin/login');
              }}
            >
              Logout
            </button>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
