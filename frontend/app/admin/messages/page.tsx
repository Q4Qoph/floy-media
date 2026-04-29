'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminMessages } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
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

export default function AdminMessagesPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const messages = useAdminMessages(token);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (row: any) => {
    setSelectedMessage(row);
    setStatus(row.status || 'Reviewed');
    setNote(row.adminNotes || '');
    setEditOpen(true);
  };

  const updateRow = async () => {
    if (!selectedMessage) return;
    setBusyId(selectedMessage.id);
    try {
      await adminApi.updateMessage(token as string, selectedMessage.id, { status, adminNotes: note || undefined });
      await messages.refetch();
      setEditOpen(false);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRow = async (id: string) => {
    setBusyId(id);
    try {
      await adminApi.deleteMessage(token as string, id);
      await messages.refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-600 mt-1">Review incoming messages and update follow-up status.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">From</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Subject</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Message</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-3 w-32 rounded bg-gray-100 mb-2" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-40 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-56 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 rounded-full bg-gray-100" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-20 rounded-full bg-gray-100" />
                    </td>
                  </tr>
                ))
              : (messages.data || []).map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{row.fullName}</p>
                  <p className="text-sm text-gray-500">{row.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{row.subject}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600 line-clamp-2">{row.message}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={row.status?.toLowerCase() === 'closed' ? 'secondary' : row.status?.toLowerCase() === 'contacted' ? 'approved' : 'secondary'}>{row.status || 'New'}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="outline" onClick={() => openEdit(row)}>Open</Button>
                    <ConfirmAction
                      triggerLabel="Delete"
                      title="Delete message?"
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
        {!messages.isLoading && !messages.data?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet.</p>
          </div>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Message</DialogTitle>
            <DialogDescription>Read the full message and update the follow-up status.</DialogDescription>
          </DialogHeader>
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 text-sm">
                <p className="font-semibold text-gray-900">{selectedMessage.fullName}</p>
                <p className="text-gray-500">{selectedMessage.email}</p>
                <p className="mt-3 font-medium text-gray-900">{selectedMessage.subject}</p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['New', 'Reviewed', 'Contacted', 'Closed'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal follow-up note" />
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="button" onClick={updateRow} disabled={busyId === selectedMessage?.id} className="bg-[#045be2] hover:bg-[#034dc2]">
              {busyId === selectedMessage?.id ? 'Saving...' : 'Save Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
