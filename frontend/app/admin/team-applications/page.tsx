'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminTeamApplications } from '@/lib/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ConfirmAction } from '@/components/admin/ConfirmAction';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminTeamApplicationsPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const apps = useAdminTeamApplications(token);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (row: any) => {
    setSelectedApplication(row);
    setStatus(row.status || 'Reviewed');
    setEditOpen(true);
  };

  const updateRow = async () => {
    if (!selectedApplication) return;
    setBusyId(selectedApplication.id);
    try {
      await adminApi.updateTeamApplication(token as string, selectedApplication.id, {
        fullName: selectedApplication.fullName,
        phoneNumber: selectedApplication.phoneNumber,
        email: selectedApplication.email,
        skillArea: selectedApplication.skillArea,
        status,
      });
      await apps.refetch();
      setEditOpen(false);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRow = async (id: string) => {
    setBusyId(id);
    try {
      await adminApi.deleteTeamApplication(token as string, id);
      await apps.refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Applications</h1>
        <p className="text-sm text-gray-600 mt-1">Review candidates and manage their applications.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Applicant</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Skill Area</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Experience</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {apps.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-3 w-32 rounded bg-gray-100 mb-2" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-32 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 rounded-full bg-gray-100" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-20 rounded-full bg-gray-100" />
                    </td>
                  </tr>
                ))
              : (apps.data || []).map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{row.fullName}</p>
                  <p className="text-sm text-gray-500">{row.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{row.skillArea}</td>
                <td className="px-6 py-4 text-gray-600">{row.experienceLevel || 'Not specified'}</td>
                <td className="px-6 py-4 text-gray-600">{row.phoneNumber || '—'}</td>
                <td className="px-6 py-4">
                  <Badge variant={row.status?.toLowerCase() === 'approved' ? 'approved' : row.status?.toLowerCase() === 'rejected' ? 'rejected' : 'secondary'}>{row.status || 'New'}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="outline" onClick={() => openEdit(row)}>
                      View details
                    </Button>
                    <ConfirmAction
                      triggerLabel="Delete"
                      title="Delete application?"
                      description="This action cannot be undone."
                      onConfirm={() => deleteRow(row.id)}
                      variant="destructive"
                      disabled={busyId === row.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!apps.isLoading && !apps.data?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications yet.</p>
          </div>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View full applicant information and update status.</DialogDescription>
          </DialogHeader>
          {selectedApplication ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Applicant Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
                <div><span className="text-gray-500">Name</span><p className="font-medium text-gray-900">{selectedApplication.fullName || 'N/A'}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium text-gray-900 break-all">{selectedApplication.email || 'N/A'}</p></div>
                <div><span className="text-gray-500">Phone</span><p className="font-medium text-gray-900">{selectedApplication.phoneNumber || 'N/A'}</p></div>
                <div><span className="text-gray-500">Location</span><p className="font-medium text-gray-900">{selectedApplication.location || 'N/A'}</p></div>
                <div><span className="text-gray-500">Skill Area</span><p className="font-medium text-gray-900">{selectedApplication.skillArea || 'N/A'}</p></div>
                <div><span className="text-gray-500">Experience</span><p className="font-medium text-gray-900">{selectedApplication.experienceLevel || 'N/A'}</p></div>
                <div><span className="text-gray-500">Current Status</span><p className="font-medium text-gray-900">{selectedApplication.status || 'Pending'}</p></div>
                <div><span className="text-gray-500">Availability</span><p className="font-medium text-gray-900">{selectedApplication.availability || 'N/A'}</p></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-gray-500">Portfolio Link</span>
                  {selectedApplication.portfolioLink ? (
                    <a
                      href={selectedApplication.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-medium text-[#045be2] underline underline-offset-2 break-all"
                    >
                      {selectedApplication.portfolioLink}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium text-gray-900">N/A</p>
                  )}
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-gray-500">Social Media</span>
                  {selectedApplication.socialMediaLink ? (
                    <a
                      href={selectedApplication.socialMediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-medium text-[#045be2] underline underline-offset-2 break-all"
                    >
                      {selectedApplication.socialMediaLink}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium text-gray-900">N/A</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 text-sm">
                <span className="text-gray-500">Equipment Owned</span>
                <p className="mt-1 font-medium text-gray-900 whitespace-pre-wrap">{selectedApplication.equipmentOwned || 'N/A'}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 text-sm">
                <span className="text-gray-500">Message</span>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedApplication.message || 'N/A'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Update Application Status</p>
                <p className="text-xs text-gray-500">Choose the current review stage for this applicant.</p>
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select application status" />
                </SelectTrigger>
                <SelectContent>
                  {['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Close</Button>
            <Button type="button" onClick={updateRow} disabled={busyId === selectedApplication?.id} className="bg-[#045be2] hover:bg-[#034dc2]">
              {busyId === selectedApplication?.id ? 'Saving...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
