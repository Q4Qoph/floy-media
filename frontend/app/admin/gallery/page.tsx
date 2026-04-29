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
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-600 mt-1">Manage gallery media, categories, and bulk uploads.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(true)}>Bulk Upload</Button>
          <Button type="button" variant="outline" onClick={openCreateCategory}>Add Category</Button>
          <Button type="button" onClick={openCreateItem} className="bg-[#045be2] hover:bg-[#034dc2] text-white">Add Gallery Item</Button>
        </div>
      </div>

      {notice ? <p className="text-sm text-gray-600">{notice}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(gallery.data || []).map((g) => {
              const preview = mediaUrl(g.thumbnailUrl || g.fileUrl);
              const isVideo = g.mediaType === 'VIDEO';
              return (
                <div key={g.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white  hover:shadow-md hover:border-[#045be2] transition-all duration-200 group">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {preview ? (
                      isVideo && !g.thumbnailUrl ? (
                        <video src={preview} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" controls muted />
                      ) : (
                        <Image src={preview} alt={g.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">No media</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                    <span className="absolute left-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      {g.mediaType || 'IMAGE'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-gray-900 line-clamp-2 flex-1">{g.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{categoryNameById.get(g.categoryId || '') || 'Uncategorized'}</p>
                    {g.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{g.description}</p>}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {g.isFeatured && <span className="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-[#045be2]">Featured</span>}
                      {g.isPublic === false && <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Hidden</span>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" size="sm" variant="outline" onClick={() => startEditItem(g)} className="flex-1">Edit</Button>
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
              );
            })}
          </div>
          {!gallery.data?.length && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No gallery items yet. Add one to get started.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <p className="mb-6 text-sm text-gray-500 mt-1">Used only to group media items.</p>
          <div className="space-y-3">
            {(categories.data || []).map((c) => (
              <div key={c.id} className="p-4 border border-gray-100 rounded-lg hover:border-[#045be2] hover:bg-blue-50 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{c.slug}</p>
                    {c.description && <p className="text-xs text-gray-600 mt-2">{c.description}</p>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEditCategory(c)}>Edit</Button>
                    <ConfirmAction
                      triggerLabel="Delete"
                      title="Delete category?"
                      description="This action cannot be undone."
                      onConfirm={() => run(() => adminApi.deleteGalleryCategory(token as string, c.id), 'Category deleted.')}
                      variant="destructive"
                    />
                  </div>
                </div>
              </div>
            ))}
            {!categories.data?.length && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No categories yet. Create one to get started.</p>
              </div>
            )}
          </div>
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
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} placeholder="Gallery item title" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition">
              <option value="">No category</option>
              {(categories.data || []).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Add a description for this item" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm h-24 focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select value={itemForm.mediaType} onChange={(e) => setItemForm({ ...itemForm, mediaType: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition">
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input value={itemForm.location} onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })} placeholder="Event location" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input value={itemForm.clientName} onChange={(e) => setItemForm({ ...itemForm, clientName: e.target.value })} placeholder="Client name (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={itemForm.isFeatured} onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })} className="rounded" /> <span>Featured Item</span></label>
            <label className="text-sm font-medium flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={itemForm.isPublic} onChange={(e) => setItemForm({ ...itemForm, isPublic: e.target.checked })} className="rounded" /> <span>Public</span></label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#045be2] hover:file:bg-blue-100 cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (optional)</label>
            <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
          </div>
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
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
            <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g., Wedding, Corporate, Portraits" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
            <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="auto-generated from name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition font-mono text-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Optional description for this category" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm h-24 focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition resize-none" />
          </div>
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
