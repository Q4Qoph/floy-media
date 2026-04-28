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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(overview.data || {}).map(([key, value]) => (
          <div key={key} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{key}</p>
            <p className="text-2xl font-bold text-gray-900">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard title="Recent Bookings" loading={bookings.isLoading} items={bookings.data} render={(x) => `${x.fullName} • ${x.serviceRequired}`} />
        <ListCard title="Messages" loading={messages.isLoading} items={messages.data} render={(x) => `${x.fullName} • ${x.subject}`} />
        <ListCard title="Team Applications" loading={teamApplications.isLoading} items={teamApplications.data} render={(x) => `${x.fullName} • ${x.skillArea}`} />
        <ListCard title="Services" loading={services.isLoading} items={services.data} render={(x) => x.serviceName} />
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
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      <div className="space-y-2">
        {(items || []).slice(0, 8).map((item) => (
          <div key={item.id} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
            {render(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
