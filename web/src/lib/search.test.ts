import { describe, it, expect } from "vitest";
import { search } from "./search";

describe("search", () => {
  it("returns nothing for an empty query", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("finds a chapter by title text", () => {
    const results = search("punishments");
    expect(results.some((r) => r.type === "chapter")).toBe(true);
  });

  it("finds a section", () => {
    const results = search("solitary confinement");
    expect(results.some((r) => r.type === "section")).toBe(true);
  });

  it("finds a dictionary term", () => {
    const results = search("dishonestly");
    expect(results.some((r) => r.type === "term")).toBe(true);
  });

  it("gives each result a navigable path and a title", () => {
    const results = search("punishment");
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.path).toMatch(/^\//);
      expect(r.title.length).toBeGreaterThan(0);
    }
  });
});
