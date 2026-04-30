'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { adminAuth } from '@/lib/admin-auth';
import { adminApi, mediaUrl, type HeroCarouselItem } from '@/lib/api';
import { useAdminHeroSection } from '@/lib/hooks';
import { Button } from '@/components/ui/button';

const emptyCarouselRow = (): HeroCarouselItem => ({
  imageUrl: '',
  title: '',
  subtitle: '',
});

export default function AdminHeroPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const section = useAdminHeroSection(token);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [headlineLine1, setHeadlineLine1] = useState('');
  const [headlineLine2, setHeadlineLine2] = useState('');
  const [introText, setIntroText] = useState('');
  const [mosaicUrls, setMosaicUrls] = useState<string[]>(['', '', '']);
  const [mosaicFiles, setMosaicFiles] = useState<(File | null)[]>([null, null, null]);
  const [carousel, setCarousel] = useState<HeroCarouselItem[]>([]);
  const [slideFiles, setSlideFiles] = useState<(File | null)[]>([]);

  useEffect(() => {
    const d = section.data;
    if (!d) return;
    setHeadlineLine1(d.headlineLine1);
    setHeadlineLine2(d.headlineLine2);
    setIntroText(d.introText);
    setMosaicUrls([...d.mosaicImages]);
    const items = (d.carouselItems || []).map((c) => ({ ...c }));
    setCarousel(items.length ? items : [emptyCarouselRow()]);
    setSlideFiles(Array(items.length || 1).fill(null));
    setMosaicFiles([null, null, null]);
  }, [section.data]);

  const persist = async () => {
    setBusy(true);
    setNotice('');
    try {
      const fd = new FormData();
      fd.append('headlineLine1', headlineLine1);
      fd.append('headlineLine2', headlineLine2);
      fd.append('introText', introText);
      fd.append('mosaicImage1', mosaicUrls[0] || '');
      fd.append('mosaicImage2', mosaicUrls[1] || '');
      fd.append('mosaicImage3', mosaicUrls[2] || '');
      fd.append('carouselItems', JSON.stringify(carousel));
      mosaicFiles.forEach((f, i) => {
        if (f) fd.append(`mosaic${i}`, f, f.name);
      });
      slideFiles.forEach((f, i) => {
        if (f) fd.append(`slide${i}`, f, f.name);
      });
      await adminApi.updateHeroSection(token as string, fd);
      await section.refetch();
      setNotice('Homepage hero saved.');
      setMosaicFiles([null, null, null]);
      setSlideFiles(Array(carousel.length).fill(null));
    } catch {
      setNotice('Save failed. Check required fields and image uploads.');
    } finally {
      setBusy(false);
    }
  };

  const addSlide = () => {
    if (carousel.length >= 12) return;
    setCarousel([...carousel, emptyCarouselRow()]);
    setSlideFiles([...slideFiles, null]);
  };

  const removeSlide = (idx: number) => {
    if (carousel.length <= 1) return;
    setCarousel(carousel.filter((_, i) => i !== idx));
    setSlideFiles(slideFiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage Hero</h1>
        <p className="text-sm text-gray-600 mt-1">
          Edit the full hero: headline (two lines), intro paragraph, three mosaic images, and the right-hand carousel (order matches list top to bottom).
        </p>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-lg text-sm border ${
            notice.includes('failed') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {notice}
        </div>
      )}

      {section.isLoading ? (
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div className="space-y-8 bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline — line 1 *</label>
              <input
                value={headlineLine1}
                onChange={(e) => setHeadlineLine1(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline — line 2 (accent) *</label>
              <input
                value={headlineLine2}
                onChange={(e) => setHeadlineLine2(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intro paragraph *</label>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50 resize-y"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Mosaic (3 images)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">Slot {i + 1}</p>
                  <div className="relative h-36 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    {mosaicUrls[i] ? (
                      <Image src={mediaUrl(mosaicUrls[i])} alt="" fill className="object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      const next = [...mosaicFiles];
                      next[i] = f;
                      setMosaicFiles(next);
                    }}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-[#045be2]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Right carousel</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSlide} disabled={carousel.length >= 12}>
                + Add slide
              </Button>
            </div>
            <div className="space-y-4">
              {carousel.map((row, idx) => (
                <div key={idx} className="border border-gray-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1">Preview</p>
                    <div className="relative h-24 w-full rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      {row.imageUrl ? (
                        <Image src={mediaUrl(row.imageUrl)} alt="" fill className="object-cover" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400">No URL</div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-[#045be2]"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        const next = [...slideFiles];
                        next[idx] = f;
                        setSlideFiles(next);
                      }}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-gray-600">Title</label>
                    <input
                      value={row.title}
                      onChange={(e) => {
                        const next = [...carousel];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setCarousel(next);
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-gray-600">Subtitle</label>
                    <input
                      value={row.subtitle}
                      onChange={(e) => {
                        const next = [...carousel];
                        next[idx] = { ...next[idx], subtitle: e.target.value };
                        setCarousel(next);
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeSlide(idx)} disabled={carousel.length <= 1}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={persist} disabled={busy} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
              {busy ? 'Saving…' : 'Save homepage hero'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
