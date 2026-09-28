import { describe, it, expect } from "vitest";
import {
  getChapters,
  getCourseOutline,
  getSections,
  getMCQs,
  getQA,
  getDictionary,
  getTerm,
} from "./content";

// These tests guard content quality across ALL chapters, so a mistake in any
// chapter's JSON (or a future chapter) is caught automatically.

describe("data integrity", () => {
  const chapters = getChapters();
  const dictionary = getDictionary();

  it("has unique chapter ids", () => {
    const ids = chapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("course outline covers all 20 chapters and sections 1-358 with no gaps", () => {
    const outline = getCourseOutline();
    expect(outline.length).toBe(20);
    let expected = 1;
    for (const c of outline) {
      const [from, to = from] = c.sectionRange.split("-").map(Number);
      expect(from, `${c.id} should start at s.${expected}`).toBe(expected);
      expected = to + 1;
    }
    expect(expected - 1).toBe(358);
  });

  it("every published chapter matches its course-outline entry", () => {
    const outline = getCourseOutline();
    for (const c of chapters) {
      const o = outline.find((x) => x.id === c.id);
      expect(o, `${c.id} missing from course-outline.json`).toBeDefined();
      expect(o?.available).toBe(true);
      expect(c.sectionRange).toBe(o?.sectionRange);
      expect(c.number).toBe(o?.number);
    }
  });

  it("every chapter's sections fill its section range, and sub-headings cover each once", () => {
    for (const c of chapters) {
      const sections = getSections(c.id);
      const [from, to = from] = c.sectionRange.split("-").map(Number);
      expect(sections.map((s) => Number(s.number))).toEqual(
        Array.from({ length: to - from + 1 }, (_, i) => from + i),
      );
      const grouped = c.subHeadings.flatMap((g) => g.sectionIds);
      expect(new Set(grouped).size, `${c.id} sub-headings repeat a section`).toBe(grouped.length);
      expect([...grouped].sort()).toEqual(sections.map((s) => s.id).sort());
    }
  });

  it("every chapter has required fields", () => {
    for (const c of chapters) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.summary.length).toBeGreaterThan(50);
      expect(c.keyPoints.length).toBeGreaterThan(0);
      expect(c.fastRevision.length).toBeGreaterThan(0);
      expect(c.mindMap).toContain("#");
    }
  });

  it("every section carries a verification status, source and lastVerified", () => {
    for (const c of chapters) {
      for (const s of getSections(c.id)) {
        expect(["verified", "unverified"]).toContain(s.verification.status);
        expect(s.verification.source.length).toBeGreaterThan(0);
        expect(s.lastVerified).toBeTruthy();
        expect(s.chapterId).toBe(c.id);
      }
    }
  });

  it("every section's term references resolve to a real dictionary term", () => {
    for (const c of chapters) {
      for (const s of getSections(c.id)) {
        for (const ref of s.termRefs) {
          expect(getTerm(ref), `term '${ref}' in ${s.id} should exist`).toBeDefined();
        }
      }
    }
  });

  it("every MCQ has a valid correctIndex and options", () => {
    for (const c of chapters) {
      for (const q of getMCQs(c.id)) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(0);
      }
    }
  });

  it("every QA has a question and a model answer", () => {
    for (const c of chapters) {
      for (const qa of getQA(c.id)) {
        expect(qa.question.length).toBeGreaterThan(0);
        expect(qa.modelAnswer.length).toBeGreaterThan(0);
        expect(["basic", "medium", "hard"]).toContain(qa.difficulty);
      }
    }
  });

  it("every dictionary term is bilingual (English + Hindi) with a unique id", () => {
    const ids = dictionary.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of dictionary) {
      expect(t.term.length).toBeGreaterThan(0);
      expect(t.meaningEn.length).toBeGreaterThan(0);
      expect(t.meaningHi.length).toBeGreaterThan(0);
    }
  });
});
