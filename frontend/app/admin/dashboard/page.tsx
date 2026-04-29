'use client';

import { useMemo } from 'react';
import { useAdminBookings, useAdminMessages, useAdminOverview, useAdminServices, useAdminTeamApplications } from '@/lib/hooks';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminDashboardPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const overview = useAdminOverview(token);
  const bookings = useAdminBookings(token);
  const messages = useAdminMessages(token);
  const teamApplications = useAdminTeamApplications(token);
  const services = useAdminServices(token);
  const isStatsLoading = overview.isLoading || !overview.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your FloyMedia admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {isStatsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-lg p-5 shadow-sm animate-pulse"
              >
                <div className="mb-3 h-3 w-24 rounded-full bg-gray-100" />
                <div className="h-8 w-16 rounded-lg bg-gray-100" />
              </div>
            ))
          : Object.entries(overview.data || {}).map(([key, value]) => (
              <div
                key={key}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-[#045be2] transition-all"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
                <p className="text-4xl font-bold text-gray-900">{value as number}</p>
              </div>
            ))}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard title="Recent Bookings" loading={bookings.isLoading} items={bookings.data} render={(x) => `${x.fullName} • ${x.serviceRequired}`} />
        <ListCard title="Recent Messages" loading={messages.isLoading} items={messages.data} render={(x) => `${x.fullName} • ${x.subject}`} />
        <ListCard title="Team Applications" loading={teamApplications.isLoading} items={teamApplications.data} render={(x) => `${x.fullName} • ${x.skillArea}`} />
        <ListCard title="Active Services" loading={services.isLoading} items={services.data} render={(x) => x.serviceName} />
      </div>
    </div>
  );
}

function ListCard({
  title,
  loading,
  items,
  render,
}: {
  title: string;
  loading: boolean;
  items: any[] | undefined;
  render: (item: any) => string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-40 rounded-full bg-gray-100" />
                <div className="h-3 w-24 rounded-full bg-gray-100" />
              </div>
              <div className="h-6 w-16 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(items || []).slice(0, 6).map((item) => (
            <div key={item.id} className="text-sm text-gray-700 pb-3 border-b border-gray-100 last:border-0 last:pb-0 hover:text-[#045be2] transition-colors">
              {render(item)}
            </div>
          ))}
          {!(items || []).length && <p className="text-sm text-gray-500">No items yet</p>}
        </div>
      )}
    </div>
  );
}
