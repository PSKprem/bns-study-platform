// Data-access layer: the single place that imports content JSON and returns
// typed objects. UI/features import from here — never from raw JSON directly.
// (See docs/architecture.md §3-4.)

import type {
  Chapter,
  Section,
  ExamQA,
  MCQ,
  DictionaryTerm,
} from "../types/content";

import ch01 from "@data/chapters/ch-01.json";
import ch02 from "@data/chapters/ch-02.json";
import sectionsCh01 from "@data/sections/ch-01.json";
import sectionsCh02 from "@data/sections/ch-02.json";
import qaCh01 from "@data/qa/ch-01.json";
import qaCh02 from "@data/qa/ch-02.json";
import mcqsCh01 from "@data/mcqs/ch-01.json";
import mcqsCh02 from "@data/mcqs/ch-02.json";
import dictionaryJson from "@data/dictionary.json";

// Registries keyed by chapter id. Adding a chapter = add its JSON + one entry
// here; no other code changes (content is data, not code).
const chapters: Chapter[] = [ch01 as Chapter, ch02 as Chapter];

const sectionsByChapter: Record<string, Section[]> = {
  "ch-01": sectionsCh01 as Section[],
  "ch-02": sectionsCh02 as Section[],
};

const qaByChapter: Record<string, ExamQA[]> = {
  "ch-01": qaCh01 as ExamQA[],
  "ch-02": qaCh02 as ExamQA[],
};

const mcqsByChapter: Record<string, MCQ[]> = {
  "ch-01": mcqsCh01 as MCQ[],
  "ch-02": mcqsCh02 as MCQ[],
};

const dictionary: DictionaryTerm[] = dictionaryJson as DictionaryTerm[];

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
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
