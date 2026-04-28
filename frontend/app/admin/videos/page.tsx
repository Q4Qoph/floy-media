'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, mediaUrl } from '@/lib/api';
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

export default function AdminVideosPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const videos = useQuery({
    queryKey: ['admin-videos', token],
    queryFn: () => adminApi.listVideos(token as string),
    enabled: Boolean(token),
  });
  const categories = useQuery({
    queryKey: ['admin-video-categories', token],
    queryFn: () => adminApi.listGalleryCategories(token as string),
    enabled: Boolean(token),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    description: '',
    clientName: '',
    isPublic: true,
    isFeatured: false,
  });
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [notice, setNotice] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const reset = () => {
    setEditingId(null);
    setForm({ title: '', categoryId: '', description: '', clientName: '', isPublic: true, isFeatured: false });
    setVideo(null);
    setThumbnail(null);
  };

  const openCreate = () => {
    reset();
    setFormOpen(true);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      categoryId: item.categoryId || '',
      description: item.description || '',
      clientName: item.clientName || '',
      isPublic: item.isPublic ?? true,
      isFeatured: item.isFeatured ?? false,
    });
    setFormOpen(true);
  };

  const doCall = async (fn: () => Promise<unknown>, message: string) => {
    try {
      await fn();
      await videos.refetch();
      setNotice(message);
      reset();
      setFormOpen(false);
    } catch (error) {
      setNotice('Action failed. Please check the form and try again.');
    }
  };
  const build = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (video) fd.append('video', video);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    return fd;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-600">Manage video highlights shown on the website.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2]">
          Add Video
        </Button>
      </div>

      {notice ? <p className="text-sm text-gray-600">{notice}</p> : null}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">Current Videos</h2>
          {videos.isLoading ? <p className="text-sm text-gray-500">Loading...</p> : null}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(videos.data || []).map((v) => {
              const thumbnail = mediaUrl(v.thumbnailUrl);
              const videoSrc = mediaUrl(v.videoUrl);
              return (
              <div key={v.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="relative h-44 bg-gray-100">
                  {thumbnail ? (
                    <Image src={thumbnail} alt={v.title} fill className="object-cover" />
                  ) : videoSrc ? (
                    <video src={videoSrc} className="h-full w-full object-cover" controls muted />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No video file</div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                    Video
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900">{v.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{v.description || 'No description yet.'}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex gap-2 text-xs">
                      {v.isFeatured ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[#045be2]">Featured</span> : null}
                      {v.isPublic === false ? <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">Hidden</span> : null}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => startEdit(v)}>Edit</Button>
                  <ConfirmAction
                    triggerLabel="Delete"
                    title="Delete video?"
                    description="This action cannot be undone."
                    onConfirm={() => doCall(() => adminApi.deleteVideo(token as string, v.id), 'Video deleted.')}
                    variant="destructive"
                  />
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open);
        if (!open) reset();
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Video' : 'Add Video'}</DialogTitle>
            <DialogDescription>
              Add the video details, choose visibility, and attach the video or thumbnail files.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2">
            <option value="">No category</option>
            {(categories.data || []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client name (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 mb-2" />
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} /> Public</label>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
          </div>
          <input type="file" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="mb-2" />
          <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="mb-3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={() =>
                editingId
                  ? doCall(() => adminApi.updateVideo(token as string, editingId, build()), 'Video updated.')
                  : doCall(() => adminApi.createVideo(token as string, build()), 'Video created.')
              }
              className="bg-[#045be2] hover:bg-[#034dc2]"
            >
              {editingId ? 'Save Changes' : 'Create Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
