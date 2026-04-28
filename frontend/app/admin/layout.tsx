'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = adminAuth.getToken();
    const isLogin = pathname === '/admin/login';

    if (!token && !isLogin) {
      router.replace('/admin/login');
      return;
    }

    if (token && isLogin) {
      router.replace('/admin/dashboard');
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;

  if (pathname === '/admin/login') return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}
