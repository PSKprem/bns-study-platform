import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  chapterReadFraction,
  getProgress,
  parseProgress,
  recordMcqScore,
  resetProgress,
  setLastVisited,
  setSectionRead,
} from "./progress";

// Tests run in Node, so provide a minimal in-memory localStorage.
beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  resetProgress();
});

describe("parseProgress", () => {
  it("returns empty progress for missing or corrupt data", () => {
    expect(parseProgress(null).readSections).toEqual([]);
    expect(parseProgress("not json").readSections).toEqual([]);
    expect(parseProgress("[1,2]").mcqBest).toEqual({});
  });

  it("drops malformed fields but keeps valid ones", () => {
    const p = parseProgress(
      JSON.stringify({
        readSections: ["s-4", 7, null],
        mcqBest: { "ch-02": { score: 8, total: 10 }, bad: { score: "x" } },
        lastVisited: { path: "/x" },
      }),
    );
    expect(p.readSections).toEqual(["s-4"]);
    expect(p.mcqBest).toEqual({ "ch-02": { score: 8, total: 10 } });
    expect(p.lastVisited).toBeNull();
  });
});

describe("progress store", () => {
  it("marks and unmarks sections as read", () => {
    setSectionRead("s-4", true);
    setSectionRead("s-5", true);
    expect(getProgress().readSections).toEqual(["s-4", "s-5"]);
    setSectionRead("s-4", false);
    expect(getProgress().readSections).toEqual(["s-5"]);
  });

  it("keeps only the best MCQ score, compared as a percentage", () => {
    expect(recordMcqScore("ch-02", 6, 10)).toBe(true);
    expect(recordMcqScore("ch-02", 5, 10)).toBe(false);
    expect(getProgress().mcqBest["ch-02"]).toEqual({ score: 6, total: 10 });
    expect(recordMcqScore("ch-02", 9, 12)).toBe(true); // 75% beats 60%
    expect(getProgress().mcqBest["ch-02"]).toEqual({ score: 9, total: 12 });
  });

  it("remembers the last page visited", () => {
    setLastVisited("/section/s-8", "Section 8");
    expect(getProgress().lastVisited).toEqual({ path: "/section/s-8", label: "Section 8" });
  });

  it("computes the fraction of a chapter read", () => {
    setSectionRead("s-1", true);
    const p = getProgress();
    expect(chapterReadFraction(["s-1", "s-2", "s-3", "s-4"], p)).toBe(0.25);
    expect(chapterReadFraction([], p)).toBe(0);
  });
});
