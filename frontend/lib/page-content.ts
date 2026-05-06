export type PageContentMap = Record<string, Record<string, string>>;

export const getPageText = (
  map: PageContentMap | undefined,
  pageKey: string,
  field: string,
  fallback: string
): string => map?.[pageKey]?.[field] || fallback;

/** Multiline CMS field: one list item per line. */
export const getPageLines = (
  map: PageContentMap | undefined,
  pageKey: string,
  field: string,
  fallback: string[]
): string[] => {
  const raw = map?.[pageKey]?.[field];
  if (!raw?.trim()) return fallback;
  const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return lines.length ? lines : fallback;
};
