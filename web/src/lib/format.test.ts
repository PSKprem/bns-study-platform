import { describe, expect, it } from "vitest";
import { actParagraphs } from "./format";
import { getSection } from "./content";

describe("actParagraphs", () => {
  it("splits at sub-sections, Explanations and Illustrations", () => {
    expect(actParagraphs("(1) First rule. (2) Second rule. Explanation.—Meaning. Illustration. A does X.")).toEqual([
      "(1) First rule.",
      "(2) Second rule.",
      "Explanation.—Meaning.",
      "Illustration. A does X.",
    ]);
  });

  it("does not split cross-references inside a sentence", () => {
    const s = "sub-sections (2), (3), (4) and (5) of section 8 apply.";
    expect(actParagraphs(s)).toEqual([s]);
  });

  it("keeps nested clauses with their sub-section", () => {
    expect(actParagraphs("(6) (a) Ends on payment; (b) part-payment shortens it.")).toEqual([
      "(6) (a) Ends on payment; (b) part-payment shortens it.",
    ]);
  });

  it("loses no text on real sections", () => {
    for (const id of ["s-2", "s-3", "s-8"]) {
      const text = getSection(id)!.bareActText;
      expect(actParagraphs(text).join(" ").replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " "));
    }
    expect(actParagraphs(getSection("s-8")!.bareActText).length).toBeGreaterThanOrEqual(7);
  });
});
