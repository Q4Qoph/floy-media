'use client';

import { useQueries } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { publicApi } from '@/lib/api';

export default function BackendBootGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  const [siteSettingsQuery, heroQuery] = useQueries({
    queries: [
      {
        queryKey: ['public-site-settings'],
        queryFn: publicApi.getSiteSettings,
        retry: 2,
        retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 4000),
        enabled: !isAdminPath,
      },
      {
        queryKey: ['public-hero-section'],
        queryFn: publicApi.getHeroSection,
        retry: 2,
        retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 4000),
        enabled: !isAdminPath,
      },
    ],
  });

  const isPending = siteSettingsQuery.isPending || heroQuery.isPending;
  const isError = siteSettingsQuery.isError || heroQuery.isError;

  if (isAdminPath) return <>{children}</>;

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#045be2] animate-spin" />
          <p className="text-sm text-gray-600">Loading FloyMedia...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Unable to reach backend</h2>
          <p className="mt-2 text-sm text-gray-600">
            We tried 3 times. Please check your connection or backend server, then retry.
          </p>
          <button
            type="button"
            onClick={() => {
              void siteSettingsQuery.refetch();
              void heroQuery.refetch();
            }}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#045be2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#034dc2] transition-colors"
          >
            Retry now
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
