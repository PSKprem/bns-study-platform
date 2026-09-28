import { describe, it, expect } from "vitest";
import {
  getChapters,
  getChapter,
  getSections,
  getSection,
  getQA,
  getMCQs,
  getDictionary,
  getTerm,
  getChapterTerms,
} from "./content";

describe("content loaders", () => {
  it("returns all chapters", () => {
    const chapters = getChapters();
    expect(chapters.length).toBeGreaterThanOrEqual(2);
    expect(chapters.map((c) => c.id)).toContain("ch-01");
    expect(chapters.map((c) => c.id)).toContain("ch-02");
  });

  it("gets a chapter by id and returns undefined for unknown ids", () => {
    expect(getChapter("ch-02")?.title).toBe("Of Punishments");
    expect(getChapter("does-not-exist")).toBeUndefined();
  });

  it("returns sections for a chapter and an empty array for unknown chapters", () => {
    expect(getSections("ch-02").length).toBe(10); // s.4-13
    expect(getSections("ch-01").length).toBe(3); // s.1-3
    expect(getSections("nope")).toEqual([]);
  });

  it("finds a section by id across chapters", () => {
    expect(getSection("s-4")?.chapterId).toBe("ch-02");
    expect(getSection("s-1")?.chapterId).toBe("ch-01");
    expect(getSection("s-999")).toBeUndefined();
  });

  it("returns QA and MCQs per chapter", () => {
    expect(getQA("ch-02").length).toBeGreaterThan(0);
    expect(getMCQs("ch-02").length).toBeGreaterThan(0);
    expect(getQA("nope")).toEqual([]);
    expect(getMCQs("nope")).toEqual([]);
  });

  it("looks up dictionary terms", () => {
    expect(getDictionary().length).toBeGreaterThan(0);
    expect(getTerm("dishonestly")?.term).toBe("Dishonestly");
    expect(getTerm("not-a-term")).toBeUndefined();
  });

  it("derives chapter-relevant dictionary terms from section links", () => {
    const ch01Terms = getChapterTerms("ch-01");
    const ids = ch01Terms.map((t) => t.id);
    // 'dishonestly' is linked to s-2 (a Chapter I section) → should appear
    expect(ids).toContain("dishonestly");
    // 'solitary-confinement' is linked to Chapter II sections only → should NOT appear
    expect(ids).not.toContain("solitary-confinement");

    const ch02Terms = getChapterTerms("ch-02");
    const ids2 = ch02Terms.map((t) => t.id);
    expect(ids2).toContain("solitary-confinement");
    expect(getChapterTerms("nope")).toEqual([]);
  });
});
