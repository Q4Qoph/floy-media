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
    setForm({ packageName: '', description: '', category: '', displayOrder: 0, isActive: true });
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const submit = async () => {
    if (!form.packageName.trim()) return;
    if (editingId) {
      await adminApi.updatePackage(token as string, editingId, form);
    } else {
      await adminApi.createPackage(token as string, form);
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
              Define the package name, category, ordering, and active status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} placeholder="Package name" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm h-20" />
        <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} placeholder="Display order" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
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
              {row.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{row.description}</p>}
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
