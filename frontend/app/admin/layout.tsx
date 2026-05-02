'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import AdminShell from '@/components/admin/AdminShell';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/forgot-password', '/admin/reset-password']);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = adminAuth.getToken();
    const isPublic = pathname ? PUBLIC_ADMIN_PATHS.has(pathname) : false;

    if (!token && !isPublic) {
      router.replace('/admin/login');
      return;
    }

    if (token && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  if (pathname && PUBLIC_ADMIN_PATHS.has(pathname)) return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}
