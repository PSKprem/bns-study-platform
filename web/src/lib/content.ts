// Data-access layer: the single place that imports content JSON and returns
// typed objects. UI/features import from here — never from raw JSON directly.
// (See docs/architecture.md §3-4.)

import type {
  Chapter,
  Section,
  ExamQA,
  Flashcard,
  DictionaryTerm,
} from "../types/content";

import ch02 from "@data/chapters/ch-02.json";
import sectionsCh02 from "@data/sections/ch-02.json";
import qaCh02 from "@data/qa/ch-02.json";
import flashcardsCh02 from "@data/flashcards/ch-02.json";
import dictionaryJson from "@data/dictionary.json";

// Registries keyed by chapter id. Adding a chapter = add its JSON + one entry
// here; no other code changes (content is data, not code).
const chapters: Chapter[] = [ch02 as Chapter];

const sectionsByChapter: Record<string, Section[]> = {
  "ch-02": sectionsCh02 as Section[],
};

const qaByChapter: Record<string, ExamQA[]> = {
  "ch-02": qaCh02 as ExamQA[],
};

const flashcardsByChapter: Record<string, Flashcard[]> = {
  "ch-02": flashcardsCh02 as Flashcard[],
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

export function getFlashcards(chapterId: string): Flashcard[] {
  return flashcardsByChapter[chapterId] ?? [];
}

export function getDictionary(): DictionaryTerm[] {
  return dictionary;
}

export function getTerm(id: string): DictionaryTerm | undefined {
  return dictionary.find((t) => t.id === id);
}
