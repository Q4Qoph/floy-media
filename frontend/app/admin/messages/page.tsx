'use client';

import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
import { useAdminMessages } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-600">Read incoming messages and update follow-up status in context.</p>
      </div>
      <div className="space-y-3">
        {(messages.data || []).map((row) => (
          <Card key={row.id}>
            <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{row.fullName}</p>
                <p className="text-sm text-gray-500">{row.email}</p>
                <p className="text-sm text-gray-700 mt-1">{row.subject}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{row.message}</p>
                <Badge className="mt-2" variant="secondary">{row.status}</Badge>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={() => openEdit(row)}>Open</Button>
                <ConfirmAction
                  triggerLabel="Delete"
                  title="Delete message?"
                  description="This action cannot be undone."
                  onConfirm={() => deleteRow(row.id)}
                  variant="destructive"
                  disabled={busyId === row.id}
                />
              </div>
            </div>
            </CardContent>
          </Card>
        ))}
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
              Save Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
