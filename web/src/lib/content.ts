// Data-access layer: the single place that imports content JSON and returns
// typed objects. UI/features import from here — never from raw JSON directly.
// (See docs/architecture.md §3-4.)

import type {
  Chapter,
  CourseChapter,
  Section,
  ExamQA,
  MCQ,
  DictionaryTerm,
} from "../types/content";

import dictionaryJson from "@data/dictionary.json";
import courseOutlineJson from "@data/course-outline.json";

// Chapters register themselves: every file matching data/chapters/ch-XX.json
// (and its sections/qa/mcqs siblings) is picked up at build time. Adding a
// chapter is therefore JSON only — no code change (docs/adding-a-chapter.md).
type Json<T> = Record<string, T>;
const chapterFiles = import.meta.glob<Chapter>("@data/chapters/*.json", {
  eager: true,
  import: "default",
});
const sectionFiles = import.meta.glob<Section[]>("@data/sections/*.json", {
  eager: true,
  import: "default",
});
const qaFiles = import.meta.glob<ExamQA[]>("@data/qa/*.json", {
  eager: true,
  import: "default",
});
const mcqFiles = import.meta.glob<MCQ[]>("@data/mcqs/*.json", {
  eager: true,
  import: "default",
});

/** "…/data/sections/ch-02.json" → "ch-02" */
function idFromPath(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1).replace(/\.json$/, "");
}

function byChapterId<T>(files: Json<T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [path, data] of Object.entries(files)) out[idFromPath(path)] = data;
  return out;
}

const chapters: Chapter[] = Object.values(chapterFiles).sort((a, b) =>
  a.id.localeCompare(b.id),
);
const sectionsByChapter = byChapterId(sectionFiles);
const qaByChapter = byChapterId(qaFiles);
const mcqsByChapter = byChapterId(mcqFiles);

const dictionary: DictionaryTerm[] = dictionaryJson as DictionaryTerm[];
const courseOutline: CourseChapter[] = courseOutlineJson as CourseChapter[];

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

/** All 20 BNS chapters from the Gazette, each marked available or not yet. */
export function getCourseOutline(): (CourseChapter & { available: boolean })[] {
  return courseOutline.map((c) => ({
    ...c,
    available: chapters.some((ch) => ch.id === c.id),
  }));
}

export function getSections(chapterId: string): Section[] {
  return sectionsByChapter[chapterId] ?? [];
}

export function getSection(sectionId: string): Section | undefined {
  for (const list of Object.values(sectionsByChapter)) {
    const found = list.find((s) => s.id === sectionId);
    if (found) return found;
  }
  return undefined;
}

export function getQA(chapterId: string): ExamQA[] {
  return qaByChapter[chapterId] ?? [];
}

export function getMCQs(chapterId: string): MCQ[] {
  return mcqsByChapter[chapterId] ?? [];
}

export function getDictionary(): DictionaryTerm[] {
  return dictionary;
}

export function getTerm(id: string): DictionaryTerm | undefined {
  return dictionary.find((t) => t.id === id);
}

// Terms relevant to a chapter: any dictionary term linked to a section that
// belongs to this chapter. Derived from data (relatedSections) so it scales
// automatically as chapters and terms are added — no manual duplication.
export function getChapterTerms(chapterId: string): DictionaryTerm[] {
  const sectionIds = new Set(getSections(chapterId).map((s) => s.id));
  return dictionary.filter((t) =>
    t.relatedSections.some((sid) => sectionIds.has(sid)),
  );
}
