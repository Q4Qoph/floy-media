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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-600">Manage highlighted and historical projects.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2]">
          Add Project
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
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="button" onClick={submit} className="bg-[#045be2] hover:bg-[#034dc2]">
              {editingId ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Project</th>
              <th className="text-left px-4 py-3">Client</th>
              <th className="text-left px-4 py-3">Featured</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(projectsQuery.data || []).map((row) => (
              <tr key={row.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{row.projectName}</td>
                <td className="px-4 py-3">{row.clientName || 'N/A'}</td>
                <td className="px-4 py-3">{row.isFeatured ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => startEdit(row)} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white">Edit</button>
                  <ConfirmAction
                    triggerLabel="Delete"
                    title="Delete project?"
                    description="This action cannot be undone."
                    onConfirm={() => remove(row.id)}
                    variant="destructive"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
