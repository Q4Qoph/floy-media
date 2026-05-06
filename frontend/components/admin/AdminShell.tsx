'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuth, canManageAdminUsers } from '@/lib/admin-auth';
import { adminApi } from '@/lib/api';
import {
  LayoutGrid,
  FileText,
  ImageIcon,
  Video,
  Wrench,
  Mail,
  Users,
  Package,
  FolderOpen,
  LogOut,
  Search,
  Bell,
  Images,
  UserCog,
  Globe,
} from 'lucide-react';

const baseLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/bookings', label: 'Bookings', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/hero', label: 'Homepage Hero', icon: Images },
  { href: '/admin/site-settings', label: 'Site Settings', icon: Globe },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/team-applications', label: 'Team Applications', icon: Users },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  // { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
];

const usersLink = { href: '/admin/users', label: 'Users & roles', icon: UserCog };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<ReturnType<typeof adminAuth.getRole>>(null);
  useEffect(() => {
    const token = adminAuth.getToken();
    if (!token) {
      setRole(null);
      return;
    }
    if (!adminAuth.getRole()) {
      adminApi
        .profile(token)
        .then((p) => {
          adminAuth.setSession(token, p.role);
          setRole(p.role);
        })
        .catch(() => setRole(adminAuth.getRole()));
    } else {
      setRole(adminAuth.getRole());
    }
  }, []);
  const links = canManageAdminUsers(role) ? [...baseLinks, usersLink] : baseLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <Link href="/admin/dashboard" className="inline-flex items-center rounded-lg p-2 hover:bg-gray-50 transition">
              <Image src="/logo.png" alt="FloyMedia logo" width={48} height={48} className="rounded-md" />
              <span className="ml-3 font-semibold text-gray-900">FloyMedia</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#045be2] to-[#0346a8] text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              onClick={() => {
                adminAuth.clear();
                router.push('/');
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 flex-1 max-w-sm">
              <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#045be2] focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Mail size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-[#045be2] to-[#0346a8] rounded-full"></div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
