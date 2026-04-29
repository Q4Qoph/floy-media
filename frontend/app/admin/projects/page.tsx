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

export default function AdminProjectsPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    projectDate: '',
    description: '',
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const projectsQuery = useQuery({
    queryKey: ['admin-projects', token],
    queryFn: () => adminApi.listProjects(token as string),
    enabled: Boolean(token),
  });

  const reset = () => {
    setEditingId(null);
    setForm({ projectName: '', clientName: '', projectDate: '', description: '', isFeatured: false });
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const submit = async () => {
    if (!form.projectName.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      projectDate: form.projectDate ? new Date(form.projectDate).toISOString() : undefined,
    };
    if (editingId) {
      await adminApi.updateProject(token as string, editingId, payload);
    } else {
      await adminApi.createProject(token as string, payload);
    }
    await projectsQuery.refetch();
    reset();
    setFormOpen(false);
    setSaving(false);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      projectName: p.projectName || '',
      clientName: p.clientName || '',
      projectDate: p.projectDate ? String(p.projectDate).slice(0, 10) : '',
      description: p.description || '',
      isFeatured: Boolean(p.isFeatured),
    });
    setFormOpen(true);
  };

  const remove = async (id: string) => {
    await adminApi.deleteProject(token as string, id);
    await projectsQuery.refetch();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-600 mt-1">Manage highlighted and historical projects.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
          + Add Project
        </Button>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open);
        if (!open) reset();
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              Capture project details for featured work and historical records.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Project name" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client name" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input type="date" value={form.projectDate} onChange={(e) => setForm({ ...form, projectDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm h-20" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="button" onClick={submit} disabled={saving} className="bg-[#045be2] hover:bg-[#034dc2]">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Project Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Client</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-700">Featured</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projectsQuery.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-3 w-40 rounded bg-gray-100 mb-2" />
                      <div className="h-3 w-28 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-32 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="mx-auto h-5 w-16 rounded-full bg-gray-100" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-20 rounded-full bg-gray-100" />
                    </td>
                  </tr>
                ))
              : (projectsQuery.data || []).map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{row.projectName}</td>
                <td className="px-6 py-4 text-gray-600">{row.clientName || '—'}</td>
                <td className="px-6 py-4 text-gray-600">{row.projectDate ? new Date(row.projectDate).toLocaleDateString() : '—'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${row.isFeatured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.isFeatured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(row)}>Edit</Button>
                    <ConfirmAction
                      triggerLabel="Delete"
                      title="Delete project?"
                      description="This action cannot be undone."
                      onConfirm={() => remove(row.id)}
                      variant="destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!projectsQuery.isLoading && !projectsQuery.data?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects yet. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
