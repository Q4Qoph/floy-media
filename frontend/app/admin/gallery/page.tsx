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

export default function AdminGalleryPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const gallery = useQuery({
    queryKey: ['admin-gallery', token],
    queryFn: () => adminApi.listGallery(token as string),
    enabled: Boolean(token),
  });
  const categories = useQuery({
    queryKey: ['admin-gallery-categories', token],
    queryFn: () => adminApi.listGalleryCategories(token as string),
    enabled: Boolean(token),
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    categoryId: '',
    description: '',
    mediaType: 'IMAGE',
    location: '',
    clientName: '',
    isFeatured: false,
    isPublic: true,
  });
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '' });
  const [files, setFiles] = useState<FileList | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [notice, setNotice] = useState('');
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const categoryNameById = useMemo(
    () => new Map((categories.data || []).map((category) => [category.id, category.name])),
    [categories.data]
  );

  const resetItem = () => {
    setEditingItemId(null);
    setItemForm({ title: '', categoryId: '', description: '', mediaType: 'IMAGE', location: '', clientName: '', isFeatured: false, isPublic: true });
    setFile(null);
    setThumbnail(null);
  };

  const openCreateItem = () => {
    resetItem();
    setItemDialogOpen(true);
  };

  const resetCategory = () => {
    setEditingCategoryId(null);
    setCatForm({ name: '', slug: '', description: '' });
  };

  const openCreateCategory = () => {
    resetCategory();
    setCategoryDialogOpen(true);
  };

  const startEditItem = (item: any) => {
    setEditingItemId(item.id);
    setItemForm({
      title: item.title || '',
      categoryId: item.categoryId || '',
      description: item.description || '',
      mediaType: item.mediaType || 'IMAGE',
      location: item.location || '',
      clientName: item.clientName || '',
      isFeatured: item.isFeatured ?? false,
      isPublic: item.isPublic ?? true,
    });
    setItemDialogOpen(true);
  };

  const startEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setCatForm({ name: category.name || '', slug: category.slug || '', description: category.description || '' });
    setCategoryDialogOpen(true);
  };

  const run = async (fn: () => Promise<unknown>, message: string) => {
    try {
      await fn();
      await gallery.refetch();
      await categories.refetch();
      setNotice(message);
      return true;
    } catch (error) {
      setNotice('Action failed. Please check the form and try again.');
      return false;
    }
  };
  const buildItemFd = () => {
    const fd = new FormData();
    Object.entries(itemForm).forEach(([k, v]) => fd.append(k, String(v)));
    if (file) fd.append('file', file);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    return fd;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-600">Manage gallery media, categories, and bulk uploads.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(true)}>Bulk Upload</Button>
          <Button type="button" variant="outline" onClick={openCreateCategory}>Add Category</Button>
          <Button type="button" onClick={openCreateItem} className="bg-[#045be2] hover:bg-[#034dc2]">Add Gallery Item</Button>
        </div>
      </div>

      {notice ? <p className="text-sm text-gray-600">{notice}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Gallery Items</h2>
              <p className="text-sm text-gray-500">The actual media displayed on the website.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(gallery.data || []).map((g) => {
              const preview = mediaUrl(g.thumbnailUrl || g.fileUrl);
              const isVideo = g.mediaType === 'VIDEO';
              return (
                <div key={g.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="relative h-44 bg-gray-100">
                    {preview ? (
                      isVideo && !g.thumbnailUrl ? (
                        <video src={preview} className="h-full w-full object-cover" controls muted />
                      ) : (
                        <Image src={preview} alt={g.title} fill className="object-cover" />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">No media file</div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                      {g.mediaType || 'IMAGE'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-gray-900">{g.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{categoryNameById.get(g.categoryId || '') || 'No category'}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex gap-2 text-xs">
                        {g.isFeatured ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[#045be2]">Featured</span> : null}
                        {g.isPublic === false ? <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">Hidden</span> : null}
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => startEditItem(g)}>Edit</Button>
                        <ConfirmAction
                          triggerLabel="Delete"
                          title="Delete gallery item?"
                          description="This action cannot be undone."
                          onConfirm={() => run(() => adminApi.deleteGalleryItem(token as string, g.id), 'Gallery item deleted.')}
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

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="mb-4 text-sm text-gray-500">Used only to group media items.</p>
          {(categories.data || []).map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEditCategory(c)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-900 text-white">Edit</button>
                <ConfirmAction
                  triggerLabel="Delete"
                  title="Delete category?"
                  description="This action cannot be undone."
                  onConfirm={() => run(() => adminApi.deleteGalleryCategory(token as string, c.id), 'Category deleted.')}
                  variant="destructive"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Gallery Files</DialogTitle>
            <DialogDescription>Select one or more files to add to the gallery media library.</DialogDescription>
          </DialogHeader>
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="text-sm" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={async () => {
                const ok = await run(() => adminApi.uploadGalleryFiles(token as string, Array.from(files || [])), 'Files uploaded.');
                if (ok) setUploadDialogOpen(false);
              }}
              className="bg-[#045be2] hover:bg-[#034dc2]"
            >
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={(open) => {
        setItemDialogOpen(open);
        if (!open) resetItem();
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
            <DialogDescription>Set the media details, category, visibility, and optional files.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
          <input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} placeholder="Title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2">
            <option value="">No category</option>
            {(categories.data || []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 mb-2" />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={itemForm.mediaType} onChange={(e) => setItemForm({ ...itemForm, mediaType: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="IMAGE">IMAGE</option>
              <option value="VIDEO">VIDEO</option>
            </select>
            <input value={itemForm.location} onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })} placeholder="Location" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <input value={itemForm.clientName} onChange={(e) => setItemForm({ ...itemForm, clientName: e.target.value })} placeholder="Client Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={itemForm.isFeatured} onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })} /> Featured</label>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={itemForm.isPublic} onChange={(e) => setItemForm({ ...itemForm, isPublic: e.target.checked })} /> Public</label>
          </div>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-2" />
          <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="mb-2" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={async () => {
                const ok = await (
                editingItemId
                  ? run(() => adminApi.updateGalleryItem(token as string, editingItemId, buildItemFd()), 'Gallery item updated.')
                  : run(() => adminApi.createGalleryItem(token as string, buildItemFd()), 'Gallery item created.')
                );
                if (ok) {
                  resetItem();
                  setItemDialogOpen(false);
                }
              }}
              className="bg-[#045be2] hover:bg-[#034dc2]"
            >
              {editingItemId ? 'Save Changes' : 'Create Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
        setCategoryDialogOpen(open);
        if (!open) resetCategory();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Use categories to group gallery and video content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
          <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="Category name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="Slug (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
          <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 mb-3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={async () => {
                const ok = await (
                editingCategoryId
                  ? run(() => adminApi.updateGalleryCategory(token as string, editingCategoryId, catForm), 'Category updated.')
                  : run(() => adminApi.createGalleryCategory(token as string, catForm), 'Category created.')
                );
                if (ok) {
                  resetCategory();
                  setCategoryDialogOpen(false);
                }
              }}
              className="bg-[#045be2] hover:bg-[#034dc2]"
            >
              {editingCategoryId ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
