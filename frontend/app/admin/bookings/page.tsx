'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminBookings } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function AdminBookingsPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const bookings = useAdminBookings(token);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (row: any) => {
    setSelectedBooking(row);
    setStatus(row.status || 'Reviewed');
    setNote(row.adminNotes || '');
    setEditOpen(true);
  };

  const updateRow = async () => {
    if (!selectedBooking) return;
    setBusyId(selectedBooking.id);
    try {
      await adminApi.updateBooking(token as string, selectedBooking.id, { status, adminNotes: note || undefined });
      await bookings.refetch();
      setEditOpen(false);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRow = async (id: string) => {
    setBusyId(id);
    try {
      await adminApi.deleteBooking(token as string, id);
      await bookings.refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-600">View booking details and update each request from its own edit modal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(bookings.data || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{row.fullName}</p>
                    <p className="text-gray-500">{row.email}</p>
                  </TableCell>
                  <TableCell className="text-gray-700">{row.serviceRequired}</TableCell>
                  <TableCell><Badge variant="secondary">{row.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" onClick={() => openEdit(row)}>Review</Button>
                      <ConfirmAction
                        triggerLabel="Delete"
                        title="Delete booking?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteRow(row.id)}
                        variant="destructive"
                        disabled={busyId === row.id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {bookings.isLoading ? <p className="pt-4 text-sm text-gray-500">Loading bookings...</p> : null}
          {!bookings.isLoading && !(bookings.data || []).length ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No bookings yet.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Booking</DialogTitle>
            <DialogDescription>Update the booking status after reviewing the client request details.</DialogDescription>
          </DialogHeader>
          {selectedBooking ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
                <div><span className="text-gray-500">Client</span><p className="font-medium">{selectedBooking.fullName}</p></div>
                <div><span className="text-gray-500">Phone</span><p className="font-medium">{selectedBooking.phoneNumber || 'N/A'}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{selectedBooking.email}</p></div>
                <div><span className="text-gray-500">Service</span><p className="font-medium">{selectedBooking.serviceRequired}</p></div>
                <div><span className="text-gray-500">Date</span><p className="font-medium">{selectedBooking.projectDate || 'Not set'}</p></div>
                <div><span className="text-gray-500">Location</span><p className="font-medium">{selectedBooking.location || 'Not set'}</p></div>
              </div>
              {selectedBooking.message || selectedBooking.specialRequirements ? (
                <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
                  {selectedBooking.message || selectedBooking.specialRequirements}
                </div>
              ) : null}
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['New', 'Reviewed', 'Contacted', 'Quoted', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal admin note" />
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="button" onClick={updateRow} disabled={busyId === selectedBooking?.id} className="bg-[#045be2] hover:bg-[#034dc2]">
              Save Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
