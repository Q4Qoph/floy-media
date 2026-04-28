'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useAdminServices } from '@/lib/hooks';
import { adminAuth } from '@/lib/admin-auth';
import { adminApi, mediaUrl } from '@/lib/api';
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

export default function AdminServicesPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const services = useAdminServices(token);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    serviceName: '',
    shortDescription: '',
    fullDescription: '',
    displayOrder: 1,
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const reset = () => {
    setEditingId(null);
    setForm({ serviceName: '', shortDescription: '', fullDescription: '', displayOrder: 1, isActive: true });
    setImage(null);
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const startEdit = (service: any) => {
    setEditingId(service.id);
    setForm({
      serviceName: service.serviceName || '',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      displayOrder: service.displayOrder || 1,
      isActive: service.isActive ?? true,
    });
    setFormOpen(true);
  };

  const act = async (fn: () => Promise<unknown>, message: string) => {
    setBusy(true);
    try {
      await fn();
      await services.refetch();
      setNotice(message);
      reset();
      setFormOpen(false);
    } catch (error) {
      setNotice('Action failed. Please check the form and try again.');
    } finally {
      setBusy(false);
    }
  };

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (image) fd.append('image', image);
    return fd;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-600">Manage services with image uploads.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2]">
          Add Service
        </Button>
      </div>

      {notice ? <p className="text-sm text-gray-600">{notice}</p> : null}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">Current Services</h2>
        {services.isLoading ? <p className="text-sm text-gray-500">Loading...</p> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(services.data || []).map((s) => (
            <div key={s.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative h-40 bg-gray-100">
                {s.imageUrl ? (
                  <Image src={mediaUrl(s.imageUrl)} alt={s.serviceName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">No service image</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900">{s.serviceName}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{s.shortDescription || s.fullDescription || 'No description yet.'}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs ${s.isActive ? 'bg-blue-50 text-[#045be2]' : 'bg-gray-100 text-gray-600'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(s)}>Edit</Button>
                    <ConfirmAction
                      triggerLabel="Delete"
                      title="Delete service?"
                      description="This action cannot be undone."
                      onConfirm={() => act(() => adminApi.deleteService(token as string, s.id), 'Service deleted.')}
                      variant="destructive"
                      disabled={busy}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open);
        if (!open) reset();
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>
              Keep service names, descriptions, display order, and imagery up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
          <input value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} placeholder="Service Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Short Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <textarea value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="Full Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-28 mb-2" />
          <div className="flex items-center gap-3 mb-2">
            <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          </div>
          <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mb-3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={() =>
                editingId
                  ? act(() => adminApi.updateService(token as string, editingId, buildFormData()), 'Service updated.')
                  : act(() => adminApi.createService(token as string, buildFormData()), 'Service created.')
              }
              disabled={busy}
              className="bg-[#045be2] hover:bg-[#034dc2]"
            >
              {editingId ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
