'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuth, canManageAdminUsers } from '@/lib/admin-auth';
import { adminApi, type AdminRoleDto } from '@/lib/api';
import {
  LayoutGrid,
  FileText,
  ImageIcon,
  Video,
  Wrench,
  Mail,
  Users,
  Package,
  LogOut,
  Search,
  Images,
  UserCog,
  Globe,
} from 'lucide-react';
function formatAdminRole(role: AdminRoleDto | string | undefined): string {
  if (!role) return '—';
  return role
    .toString()
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

function adminInitials(profile: { fullName?: string | null; email: string } | null): string {
  if (!profile) return '?';
  const name = profile.fullName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const e = profile.email?.trim();
  if (e) return e[0].toUpperCase();
  return '?';
}

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
  const [profile, setProfile] = useState<{
    email: string;
    fullName?: string | null;
    role: AdminRoleDto;
  } | null>(null);
  useEffect(() => {
    const token = adminAuth.getToken();
    if (!token) {
      setRole(null);
      setProfile(null);
      return;
    }
    adminApi
      .profile(token)
      .then((p) => {
        adminAuth.setSession(token, p.role);
        setRole(p.role);
        setProfile({ email: p.email, fullName: p.fullName ?? null, role: p.role });
      })
      .catch(() => {
        setRole(adminAuth.getRole());
        setProfile(null);
      });
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
            <div className="group relative flex shrink-0 justify-end">
              <button
                type="button"
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#045be2] to-[#0346a8] text-sm font-semibold text-white uppercase outline-none ring-[#045be2] hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Account"
              >
                {adminInitials(profile)}
              </button>
              {/* Padding bridges button → panel so hover doesn’t drop while moving the cursor */}
              <div
                className="pointer-events-none invisible absolute right-0 top-full z-20 w-[min(260px,calc(100vw-2rem))] pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
                role="region"
                aria-label="Signed-in admin details"
              >
                <div className="rounded-lg border border-gray-200 bg-white p-3 text-left text-xs text-gray-900 shadow-lg">
                  {profile ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Name</p>
                        <p className="mt-0.5 text-sm font-semibold leading-snug text-gray-900">
                          {profile.fullName?.trim() || 'Admin user'}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Email</p>
                        <p className="mt-0.5 break-all text-[11px] leading-snug text-gray-800">{profile.email}</p>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Role</p>
                        <p className="mt-0.5 text-[11px] font-medium text-gray-900">{formatAdminRole(profile.role)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-600">Loading account details…</p>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
