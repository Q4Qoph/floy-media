'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { adminAuth } from '@/lib/admin-auth';
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

export default function AdminPackagesPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    packageName: '',
    description: '',
    category: '',
    price: 0,
    whatsIncludedText: '',
    displayOrder: 0,
    isActive: true,
  });
  const [formOpen, setFormOpen] = useState(false);
  const packagesQuery = useQuery({
    queryKey: ['admin-packages', token],
    queryFn: () => adminApi.listPackages(token as string),
    enabled: Boolean(token),
  });

  const reset = () => {
    setEditingId(null);
    setForm({
      packageName: '',
      description: '',
      category: '',
      price: 0,
      whatsIncludedText: '',
      displayOrder: 0,
      isActive: true
    });
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const submit = async () => {
    if (!form.packageName.trim()) return;
    const whatsIncluded = form.whatsIncludedText
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);
    const payload = {
      packageName: form.packageName.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      whatsIncluded,
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive
    };
    if (editingId) {
      await adminApi.updatePackage(token as string, editingId, payload);
    } else {
      await adminApi.createPackage(token as string, payload);
    }
    await packagesQuery.refetch();
    reset();
    setFormOpen(false);
  };

  const startEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setForm({
      packageName: pkg.packageName || '',
      description: pkg.description || '',
      category: pkg.category || '',
      price: pkg.price || 0,
      whatsIncludedText: Array.isArray(pkg.whatsIncluded) ? pkg.whatsIncluded.join('\n') : '',
      displayOrder: pkg.displayOrder || 0,
      isActive: pkg.isActive ?? true,
    });
    setFormOpen(true);
  };

  const remove = async (id: string) => {
    await adminApi.deletePackage(token as string, id);
    await packagesQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage service packages.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
          + Add Package
        </Button>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open);
        if (!open) reset();
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Package' : 'Add Package'}</DialogTitle>
            <DialogDescription>
              Set pricing, display order, and one included item per line.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Package name</label>
          <input value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} placeholder="Premium Wedding Package" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Wedding" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Price</label>
          <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })} placeholder="45000" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Display order</label>
          <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} placeholder="0" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short package summary..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 w-full" />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-600">What's included (one item per line)</label>
          <textarea value={form.whatsIncludedText} onChange={(e) => setForm({ ...form, whatsIncludedText: e.target.value })} placeholder={"Full day coverage\n600+ edited photos\n3-5 min highlight video\nDrone shots"} className="border border-gray-300 rounded-lg px-3 py-2 text-sm h-28 w-full" />
        </div>
        <label className="md:col-span-2 flex items-center gap-2 text-sm mt-1">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active
        </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="button" onClick={submit} className="bg-[#045be2] hover:bg-[#034dc2]">
              {editingId ? 'Save Changes' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {packagesQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(packagesQuery.data || []).map((row) => (
            <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-[#045be2] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{row.packageName}</h3>
                  <p className="text-sm text-gray-600">{row.category || 'General'}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {row.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">KES {Number(row.price || 0).toLocaleString()}</p>
              {row.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{row.description}</p>}
              {Array.isArray(row.whatsIncluded) && row.whatsIncluded.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {row.whatsIncluded.slice(0, 3).map((item: string, idx: number) => (
                    <li key={`${row.id}-incl-${idx}`} className="text-xs text-gray-600">• {item}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-500 mb-4">Order: {row.displayOrder ?? 0}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button type="button" size="sm" variant="outline" onClick={() => startEdit(row)} className="flex-1">Edit</Button>
                <ConfirmAction
                  triggerLabel="Delete"
                  title="Delete package?"
                  description="This action cannot be undone."
                  onConfirm={() => remove(row.id)}
                  variant="destructive"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {!packagesQuery.isLoading && !packagesQuery.data?.length && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">No packages yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
