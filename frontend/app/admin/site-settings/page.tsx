'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { adminAuth } from '@/lib/admin-auth';
import { adminApi, mediaUrl, type SiteNavLinkItem } from '@/lib/api';
import { useAdminSiteSettings } from '@/lib/hooks';
import { Button } from '@/components/ui/button';

type PageField = { key: string; label: string; multiline?: boolean };
type PageEditorConfig = { key: string; label: string; fields: PageField[] };

const PAGE_EDITORS: PageEditorConfig[] = [
  {
    key: 'about',
    label: 'About Page',
    fields: [
      { key: 'eyebrow', label: 'Hero — eyebrow' },
      { key: 'title', label: 'Hero — title' },
      { key: 'description', label: 'Hero — description', multiline: true },
      { key: 'storyEyebrow', label: 'Our story — small label above copy' },
      { key: 'storyParagraph1', label: 'Our story — paragraph 1', multiline: true },
      { key: 'storyParagraph2', label: 'Our story — paragraph 2', multiline: true },
      { key: 'heroImageGalleryLink', label: 'Hero image — link text (overlay)' },
      { key: 'heroImageEmptyHint', label: 'Hero image — empty state hint', multiline: true },
      { key: 'heroImageEmptyBrowse', label: 'Hero image — empty state link label' },
      { key: 'missionTitle', label: 'Mission — card title' },
      { key: 'missionBody', label: 'Mission — body text', multiline: true },
      { key: 'visionTitle', label: 'Vision — card title' },
      { key: 'visionBody', label: 'Vision — body text', multiline: true },
      { key: 'coreValuesTitle', label: 'Core values — section title' },
      { key: 'coreValuesIntro', label: 'Core values — intro', multiline: true },
      { key: 'coreValuesList', label: 'Core values — list (one per line)', multiline: true },
      { key: 'whatWeHaveTitle', label: 'What we have — section title' },
      { key: 'whatWeHaveIntro', label: 'What we have — intro', multiline: true },
      { key: 'whatWeHaveLinkLabel', label: 'What we have — “View gallery” link text' },
      { key: 'showcaseEmptyMessage', label: 'What we have — empty grid message' },
      { key: 'whoWeServeTitle', label: 'Who we serve — section title' },
      { key: 'whoWeServeIntro', label: 'Who we serve — intro', multiline: true },
      { key: 'whoWeServeList', label: 'Who we serve — clients (one per line)', multiline: true },
      { key: 'whoWeServeOutro', label: 'Who we serve — closing line', multiline: true },
      { key: 'ctaTitle', label: 'Bottom CTA — headline' },
      { key: 'ctaDescription', label: 'Bottom CTA — subtext', multiline: true },
      { key: 'ctaPrimaryLabel', label: 'Bottom CTA — primary button label' },
      { key: 'ctaPrimaryHref', label: 'Bottom CTA — primary button link (path)' },
      { key: 'ctaSecondaryLabel', label: 'Bottom CTA — secondary button label' },
      { key: 'ctaSecondaryHref', label: 'Bottom CTA — secondary button link (path)' },
    ],
  },
  {
    key: 'services',
    label: 'Services Page',
    fields: [
      { key: 'eyebrow', label: 'Hero Eyebrow' },
      { key: 'title', label: 'Hero Title' },
      { key: 'description', label: 'Hero Description', multiline: true },
      { key: 'ctaTitle', label: 'CTA Title' },
      { key: 'ctaDescription', label: 'CTA Description', multiline: true },
      { key: 'ctaButton', label: 'CTA Button Label' },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery Page',
    fields: [
      { key: 'eyebrow', label: 'Hero Eyebrow' },
      { key: 'title', label: 'Hero Title' },
      { key: 'description', label: 'Hero Description', multiline: true },
      { key: 'ctaTitle', label: 'CTA Title' },
      { key: 'ctaDescription', label: 'CTA Description', multiline: true },
      { key: 'ctaButton', label: 'CTA Button Label' },
    ],
  },
  {
    key: 'videos',
    label: 'Videos Page',
    fields: [
      { key: 'eyebrow', label: 'Hero Eyebrow' },
      { key: 'title', label: 'Hero Title' },
      { key: 'description', label: 'Hero Description', multiline: true },
      { key: 'ctaTitle', label: 'CTA Title' },
      { key: 'ctaDescription', label: 'CTA Description', multiline: true },
      { key: 'ctaButton', label: 'CTA Button Label' },
    ],
  },
  {
    key: 'packages',
    label: 'Packages Page',
    fields: [
      { key: 'eyebrow', label: 'Hero Eyebrow' },
      { key: 'title', label: 'Hero Title' },
      { key: 'description', label: 'Hero Description', multiline: true },
      { key: 'ctaTitle', label: 'CTA Title' },
      { key: 'ctaDescription', label: 'CTA Description', multiline: true },
      { key: 'ctaButton', label: 'CTA Button Label' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Page',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  {
    key: 'joinTeam',
    label: 'Join Team Page',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  {
    key: 'bookings',
    label: 'Bookings Page',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  {
    key: 'booking',
    label: 'Booking Page',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
];

const linksToText = (links: SiteNavLinkItem[]) => links.map((link) => `${link.label}|${link.href}`).join('\n');

const textToLinks = (text: string): SiteNavLinkItem[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split('|');
      return {
        label: (label || '').trim(),
        href: (href || '').trim()
      };
    })
    .filter((x) => x.label && x.href);

export default function AdminSiteSettingsPage() {
  const token = useMemo(() => adminAuth.getToken(), []);
  const settings = useAdminSiteSettings(token);

  const [brandName, setBrandName] = useState('');
  const [navbarLogoUrl, setNavbarLogoUrl] = useState('');
  const [footerLogoUrl, setFooterLogoUrl] = useState('');
  const [navbarLinksText, setNavbarLinksText] = useState('');
  const [navbarCtaLabel, setNavbarCtaLabel] = useState('');
  const [navbarCtaHref, setNavbarCtaHref] = useState('');
  const [footerDescription, setFooterDescription] = useState('');
  const [footerExploreText, setFooterExploreText] = useState('');
  const [footerQuickText, setFooterQuickText] = useState('');
  const [footerContactEmail, setFooterContactEmail] = useState('');
  const [footerContactPhone, setFooterContactPhone] = useState('');
  const [footerContactAddress, setFooterContactAddress] = useState('');
  const [footerCopyrightText, setFooterCopyrightText] = useState('');
  const [pageContent, setPageContent] = useState<Record<string, Record<string, string>>>({});
  const [navbarLogoFile, setNavbarLogoFile] = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const d = settings.data;
    if (!d) return;
    setBrandName(d.brandName || '');
    setNavbarLogoUrl(d.navbarLogoUrl || '');
    setFooterLogoUrl(d.footerLogoUrl || '');
    setNavbarLinksText(linksToText(d.navbarLinks || []));
    setNavbarCtaLabel(d.navbarCtaLabel || '');
    setNavbarCtaHref(d.navbarCtaHref || '');
    setFooterDescription(d.footerDescription || '');
    setFooterExploreText(linksToText(d.footerExploreLinks || []));
    setFooterQuickText(linksToText(d.footerQuickLinks || []));
    setFooterContactEmail(d.footerContactEmail || '');
    setFooterContactPhone(d.footerContactPhone || '');
    setFooterContactAddress(d.footerContactAddress || '');
    setFooterCopyrightText(d.footerCopyrightText || '');
    setPageContent(d.pageContent || {});
    setNavbarLogoFile(null);
    setFooterLogoFile(null);
  }, [settings.data]);

  const saveSettings = async () => {
    setBusy(true);
    setNotice('');
    try {
      const fd = new FormData();
      fd.append('brandName', brandName);
      fd.append('navbarLogoUrl', navbarLogoUrl);
      fd.append('footerLogoUrl', footerLogoUrl);
      fd.append('navbarLinks', JSON.stringify(textToLinks(navbarLinksText)));
      fd.append('navbarCtaLabel', navbarCtaLabel);
      fd.append('navbarCtaHref', navbarCtaHref);
      fd.append('footerDescription', footerDescription);
      fd.append('footerExploreLinks', JSON.stringify(textToLinks(footerExploreText)));
      fd.append('footerQuickLinks', JSON.stringify(textToLinks(footerQuickText)));
      fd.append('footerContactEmail', footerContactEmail);
      fd.append('footerContactPhone', footerContactPhone);
      fd.append('footerContactAddress', footerContactAddress);
      fd.append('footerCopyrightText', footerCopyrightText);
      fd.append('pageContent', JSON.stringify(pageContent));
      if (navbarLogoFile) fd.append('navbarLogo', navbarLogoFile, navbarLogoFile.name);
      if (footerLogoFile) fd.append('footerLogo', footerLogoFile, footerLogoFile.name);
      await adminApi.updateSiteSettings(token as string, fd);
      await settings.refetch();
      setNotice('Site settings saved.');
    } catch {
      setNotice('Save failed. Check required fields and link format.');
    } finally {
      setBusy(false);
    }
  };

  const updatePageField = (pageKey: string, field: string, value: string) => {
    setPageContent((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || {}),
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage navbar and footer content, links, contact details, and logos.</p>
      </div>

      {notice ? (
        <div
          className={`p-4 rounded-lg text-sm border ${
            notice.includes('failed') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {notice}
        </div>
      ) : null}

      {settings.isLoading ? (
        <div className="h-96 rounded-xl bg-gray-100 animate-pulse" />
      ) : (
        <div className="space-y-8 bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Brand & Logos</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Navbar Logo</label>
                <div className="relative h-20 w-20 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden">
                  {navbarLogoUrl ? <Image src={mediaUrl(navbarLogoUrl)} alt="" fill className="object-cover" /> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNavbarLogoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-[#045be2]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Footer Logo</label>
                <div className="relative h-20 w-20 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden">
                  {footerLogoUrl ? <Image src={mediaUrl(footerLogoUrl)} alt="" fill className="object-cover" /> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFooterLogoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-[#045be2]"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Navbar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Label *</label>
                <input value={navbarCtaLabel} onChange={(e) => setNavbarCtaLabel(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link *</label>
                <input value={navbarCtaHref} onChange={(e) => setNavbarCtaHref(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links (one per line as Label|/path)</label>
              <textarea
                value={navbarLinksText}
                onChange={(e) => setNavbarLinksText(e.target.value)}
                rows={7}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-y"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Description *</label>
              <textarea value={footerDescription} onChange={(e) => setFooterDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-y" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explore Links (Label|/path)</label>
                <textarea value={footerExploreText} onChange={(e) => setFooterExploreText(e.target.value)} rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Links (Label|/path)</label>
                <textarea value={footerQuickText} onChange={(e) => setFooterQuickText(e.target.value)} rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-y" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input value={footerContactEmail} onChange={(e) => setFooterContactEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input value={footerContactPhone} onChange={(e) => setFooterContactPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
              <input value={footerContactAddress} onChange={(e) => setFooterContactAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text (optional)</label>
              <input value={footerCopyrightText} onChange={(e) => setFooterCopyrightText(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Page Content</h2>
            <p className="text-sm text-gray-600">
              Edit page copy using form fields. No JSON editing required.
            </p>
            <div className="space-y-5">
              {PAGE_EDITORS.map((page) => (
                <div key={page.key} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{page.label}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {page.fields.map((field) => (
                      <div key={`${page.key}-${field.key}`} className={field.multiline ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                        {field.multiline ? (
                          <textarea
                            value={pageContent?.[page.key]?.[field.key] || ''}
                            onChange={(e) => updatePageField(page.key, field.key, e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 resize-y"
                          />
                        ) : (
                          <input
                            value={pageContent?.[page.key]?.[field.key] || ''}
                            onChange={(e) => updatePageField(page.key, field.key, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="button" onClick={saveSettings} disabled={busy} className="bg-[#045be2] hover:bg-[#034dc2] text-white">
              {busy ? 'Saving...' : 'Save site settings'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
