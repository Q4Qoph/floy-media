'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminTeamApplications } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Applications</h1>
        <p className="text-sm text-gray-600">Review candidates and update their status.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(apps.data || []).map((row) => (
          <Card key={row.id}>
            <CardContent className="pt-6">
            <p className="font-semibold text-gray-900">{row.fullName}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
            <p className="text-sm text-gray-700 mt-1">{row.skillArea} • {row.experienceLevel}</p>
            <Badge className="mt-2" variant="secondary">{row.status}</Badge>
            <div className="flex gap-2 mt-3">
              <Button type="button" size="sm" onClick={() => openEdit(row)}>Review</Button>
              <ConfirmAction
                triggerLabel="Delete"
                title="Delete application?"
                description="This action cannot be undone."
                onConfirm={() => deleteRow(row.id)}
                variant="destructive"
                disabled={busyId === row.id}
              />
            </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review candidate details and update their application status.</DialogDescription>
          </DialogHeader>
          {selectedApplication ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
                <div><span className="text-gray-500">Name</span><p className="font-medium">{selectedApplication.fullName}</p></div>
                <div><span className="text-gray-500">Phone</span><p className="font-medium">{selectedApplication.phoneNumber}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{selectedApplication.email}</p></div>
                <div><span className="text-gray-500">Location</span><p className="font-medium">{selectedApplication.location || 'N/A'}</p></div>
                <div><span className="text-gray-500">Skill</span><p className="font-medium">{selectedApplication.skillArea}</p></div>
                <div><span className="text-gray-500">Experience</span><p className="font-medium">{selectedApplication.experienceLevel}</p></div>
              </div>
              {selectedApplication.message ? <p className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">{selectedApplication.message}</p> : null}
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
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
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="button" onClick={updateRow} disabled={busyId === selectedApplication?.id} className="bg-[#045be2] hover:bg-[#034dc2]">
              Save Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
