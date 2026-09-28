// One place that builds in-app links, so search results, term chips and
// "back" buttons can never drift out of sync with the routes and tab names.

export const CHAPTER_TABS = [
  { slug: "summary", label: "Summary" },
  { slug: "key-points", label: "Key Points" },
  { slug: "mind-map", label: "Mind Map" },
  { slug: "revision", label: "Fast Revision" },
  { slug: "mcq", label: "Practice (MCQ)" },
  { slug: "qa", label: "Exam Q&A" },
  { slug: "sections", label: "Sections" },
  { slug: "dictionary", label: "Dictionary" },
] as const;

export type ChapterTab = (typeof CHAPTER_TABS)[number]["slug"];

export const DEFAULT_CHAPTER_TAB: ChapterTab = "summary";

/** Element ids linking each chapter tab to its panel (WAI-ARIA tabs). */
export const tabId = (slug: ChapterTab): string => `tab-${slug}`;
export const panelId = (slug: ChapterTab): string => `panel-${slug}`;

/** Old links used tab labels (e.g. ?tab=Sections); keep them working. */
const LEGACY_TAB_LABELS: Record<string, ChapterTab> = Object.fromEntries(
  CHAPTER_TABS.map((t) => [t.label.toLowerCase(), t.slug]),
);

/** Resolves a ?tab= value (new slug or old label) to a tab slug. */
export function parseChapterTab(value: string | null): ChapterTab {
  if (!value) return DEFAULT_CHAPTER_TAB;
  const v = value.toLowerCase();
  if (CHAPTER_TABS.some((t) => t.slug === v)) return v as ChapterTab;
  return LEGACY_TAB_LABELS[v] ?? DEFAULT_CHAPTER_TAB;
}

export function chapterPath(chapterId: string, tab?: ChapterTab): string {
  return tab && tab !== DEFAULT_CHAPTER_TAB
    ? `/chapter/${chapterId}?tab=${tab}`
    : `/chapter/${chapterId}`;
}

export function sectionPath(sectionId: string): string {
  return `/section/${sectionId}`;
}

/** Deep link that opens the dictionary scrolled to (and highlighting) one term. */
export function termPath(termId: string): string {
  return `/dictionary?term=${encodeURIComponent(termId)}`;
}

export function termAnchorId(termId: string): string {
  return `term-${termId}`;
}
