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
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-600 mt-1">Manage video highlights shown on the website.</p>
        </div>
        <Button type="button" onClick={openCreate} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
          Add Video
        </Button>
      </div>

      {notice ? <p className="text-sm text-gray-600">{notice}</p> : null}

      <div className="">
        {videos.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 h-72 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(videos.data || []).map((v) => {
              const thumbnail = mediaUrl(v.thumbnailUrl);
              const videoSrc = mediaUrl(v.videoUrl);
              return (
              <div key={v.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#045be2] transition-all duration-200 group">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {thumbnail ? (
                    <Image src={thumbnail} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                  ) : videoSrc ? (
                    <video src={videoSrc} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" controls muted />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No video file</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                  <span className="absolute left-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    VIDEO
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-semibold text-gray-900 line-clamp-2 mb-2">{v.title}</p>
                  <p className="line-clamp-2 text-sm text-gray-600 mb-3">{v.description || 'No description yet.'}</p>
                  {v.clientName && <p className="text-xs text-gray-500 mb-3">Client: <span className="font-medium text-gray-700">{v.clientName}</span></p>}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {v.isFeatured && <span className="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-[#045be2]">Featured</span>}
                    {v.isPublic === false && <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Hidden</span>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(v)} className="flex-1">Edit</Button>
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
              );
            })}
          </div>
        )}
        {!videos.isLoading && !videos.data?.length && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No videos yet. Add one to get started.</p>
          </div>
        )}
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
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Memorable video title" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition">
              <option value="">No category</option>
              {(categories.data || []).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client name (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell viewers what this video is about" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm h-24 focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition resize-none" />
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="rounded" /> <span>Public</span></label>
            <label className="text-sm font-medium flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" /> <span>Featured</span></label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video File</label>
            <input type="file" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#045be2] hover:file:bg-blue-100 cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (optional)</label>
            <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
          </div>
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
