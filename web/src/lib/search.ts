// Client-side search across all content using Fuse.js. Builds a flat index of
// searchable items tagged by type, so results can be grouped (FR-9).

import Fuse from "fuse.js";
import {
  getChapters,
  getDictionary,
  getQA,
  getSections,
} from "./content";
import { chapterPath, sectionPath, termPath } from "./routes";

export type SearchType = "chapter" | "section" | "term" | "qa";

export interface SearchItem {
  type: SearchType;
  id: string;
  title: string;
  text: string;
  /** Route path to navigate to this result. */
  path: string;
}

function buildItems(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const c of getChapters()) {
    items.push({
      type: "chapter",
      id: c.id,
      title: `Chapter ${c.number} — ${c.title}`,
      text: `${c.shortDescription} ${c.summary}`,
      path: chapterPath(c.id),
    });

    for (const s of getSections(c.id)) {
      items.push({
        type: "section",
        id: s.id,
        title: `Section ${s.number} — ${s.title}`,
        text: `${s.plainMeaning} ${s.bareActText}`,
        path: sectionPath(s.id),
      });
    }

    for (const q of getQA(c.id)) {
      items.push({
        type: "qa",
        id: q.id,
        title: q.question,
        text: q.modelAnswer,
        // Open the chapter directly on its Exam Q&A tab, not the Summary.
        path: chapterPath(c.id, "qa"),
      });
    }
  }

  for (const t of getDictionary()) {
    items.push({
      type: "term",
      id: t.id,
      title: t.term,
      text: `${t.meaningEn} ${t.meaningHi}`,
      // Jump straight to this term, not the top of the dictionary.
      path: termPath(t.id),
    });
  }

  return items;
}

const items = buildItems();

const fuse = new Fuse(items, {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "text", weight: 0.4 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
});

export function search(query: string): SearchItem[] {
  const q = query.trim();
  if (!q) return [];
  return fuse.search(q).map((r) => r.item);
}
