'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
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
    includedItemsText: '',
    displayOrder: 1,
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const sortedServices = [...(services.data || [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const reset = () => {
    setEditingId(null);
    setForm({ serviceName: '', shortDescription: '', includedItemsText: '', displayOrder: 1, isActive: true });
    setImage(null);
    setImagePreviewUrl('');
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const startEdit = (service: any) => {
    const legacyIncludedItems = String(service.fullDescription || '')
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    setEditingId(service.id);
    setImage(null);
    setImagePreviewUrl(mediaUrl(service.imageUrl));
    setForm({
      serviceName: service.serviceName || '',
      shortDescription: service.shortDescription || '',
      includedItemsText: Array.isArray(service.includedItems)
        ? service.includedItems.join('\n')
        : legacyIncludedItems.join('\n'),
      displayOrder: service.displayOrder || 1,
      isActive: service.isActive ?? true,
    });
    setFormOpen(true);
  };

  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

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
    fd.append('serviceName', form.serviceName);
    fd.append('shortDescription', form.shortDescription);
    fd.append('includedItems', form.includedItemsText);
    fd.append('displayOrder', String(form.displayOrder));
    fd.append('isActive', String(form.isActive));
    if (image) fd.append('image', image, image.name);
    return fd;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all service offerings with images and descriptions.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
          + Add Service
        </Button>
      </div>

      {notice && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{notice}</div>}

      {services.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedServices.map((s) => {
            const includedItems = Array.isArray(s.includedItems)
              ? s.includedItems
              : String(s.fullDescription || '')
                  .split(/\r?\n|,/)
                  .map((item) => item.trim())
                  .filter(Boolean);
            return (
              <div
                key={s.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-[#045be2] transition-all"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  {s.imageUrl ? (
                    <Image src={mediaUrl(s.imageUrl)} alt={s.serviceName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold text-gray-900">{s.serviceName}</p>
                    <span className="inline-flex rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700">
                      #{s.displayOrder ?? 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {s.shortDescription || 'No short description'}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      What's Included
                    </p>
                    {includedItems.length ? (
                      <ul className="text-sm text-gray-700 space-y-1">
                        {includedItems.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="line-clamp-1">- {item}</li>
                        ))}
                        {includedItems.length > 3 && (
                          <li className="text-xs text-gray-500">+{includedItems.length - 3} more</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No items listed</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" size="sm" variant="outline" onClick={() => startEdit(s)}>
                        Edit
                      </Button>
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
            );
          })}
        </div>
      )}
      {!services.isLoading && !sortedServices.length && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">No services yet. Create one to get started.</p>
        </div>
      )}

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
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
            <input value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} placeholder="e.g., Wedding Videography" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief overview for listings" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
            <textarea value={form.includedItemsText} onChange={(e) => setForm({ ...form, includedItemsText: e.target.value })} placeholder={"One item per line\nWedding shoots\nFamily portraits\nEdited delivery"} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm h-32 focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50" />
            </div>
            <div className="flex items-end">
              <label className="text-sm font-medium flex items-center gap-2.5 cursor-pointer px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-300 w-full"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> <span>Active</span></label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#045be2] hover:file:bg-blue-100 cursor-pointer"
            />
            {imagePreviewUrl ? (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">
                  {image ? 'Selected image preview' : 'Current image'}
                </p>
                <div className="relative h-36 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={imagePreviewUrl}
                    alt="Service preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">No image selected.</p>
            )}
          </div>
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
