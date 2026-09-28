import { describe, expect, it } from "vitest";
import { chapterPath, parseChapterTab, sectionPath, termAnchorId, termPath } from "./routes";

describe("chapter tabs in the URL", () => {
  it("parses tab slugs and defaults to summary", () => {
    expect(parseChapterTab("qa")).toBe("qa");
    expect(parseChapterTab(null)).toBe("summary");
    expect(parseChapterTab("nonsense")).toBe("summary");
  });

  it("keeps old label-style links working (e.g. ?tab=Sections)", () => {
    expect(parseChapterTab("Sections")).toBe("sections");
    expect(parseChapterTab("Exam Q&A")).toBe("qa");
    expect(parseChapterTab("Practice (MCQ)")).toBe("mcq");
  });
});

describe("link builders", () => {
  it("builds chapter links, omitting the default tab", () => {
    expect(chapterPath("ch-02")).toBe("/chapter/ch-02");
    expect(chapterPath("ch-02", "summary")).toBe("/chapter/ch-02");
    expect(chapterPath("ch-02", "sections")).toBe("/chapter/ch-02?tab=sections");
  });

  it("builds section and term deep links", () => {
    expect(sectionPath("s-4")).toBe("/section/s-4");
    expect(termPath("good-faith")).toBe("/dictionary?term=good-faith");
    expect(termAnchorId("good-faith")).toBe("term-good-faith");
  });
});
