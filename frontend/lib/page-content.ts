export type PageContentMap = Record<string, Record<string, string>>;

export const getPageText = (
  map: PageContentMap | undefined,
  pageKey: string,
  field: string,
  fallback: string
): string => map?.[pageKey]?.[field] || fallback;
