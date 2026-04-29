'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminBookings } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all booking requests from customers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Booking Requests</h2>
        </div>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"><input type="checkbox" className="rounded border-gray-300" /></TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell><span className="inline-block h-4 w-4 rounded border border-gray-200 bg-gray-100" /></TableCell>
                      <TableCell>
                        <div className="h-4 w-32 rounded bg-gray-100 mb-2" />
                        <div className="h-3 w-24 rounded bg-gray-100" />
                      </TableCell>
                      <TableCell><div className="h-3 w-24 rounded bg-gray-100" /></TableCell>
                      <TableCell><div className="h-3 w-20 rounded bg-gray-100" /></TableCell>
                      <TableCell><div className="h-5 w-16 rounded-full bg-gray-100" /></TableCell>
                      <TableCell className="text-right">
                        <div className="ml-auto h-8 w-20 rounded-full bg-gray-100" />
                      </TableCell>
                    </TableRow>
                  ))
                : (bookings.data || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{row.fullName}</p>
                    <p className="text-sm text-gray-500">{row.email}</p>
                  </TableCell>
                  <TableCell className="text-gray-700">{row.serviceRequired}</TableCell>
                  <TableCell className="text-sm text-gray-600">{row.projectDate || 'Not set'}</TableCell>
                  <TableCell><Badge variant={row.status?.toLowerCase() === 'confirmed' ? 'approved' : 'secondary'}>{row.status || 'New'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => openEdit(row)}>Review</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!bookings.isLoading && !(bookings.data || []).length && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">No bookings yet.</p>
            </div>
          )}
      </div>

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
              {busyId === selectedBooking?.id ? 'Saving...' : 'Save Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
