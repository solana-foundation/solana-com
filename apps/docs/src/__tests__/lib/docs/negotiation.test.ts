import { describe, expect, it } from "vitest";
import { prefersMarkdown } from "@/lib/docs/negotiation";

describe("prefersMarkdown", () => {
  it("serves Markdown when it is asked for by name", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/x-markdown")).toBe(true);
    expect(prefersMarkdown("TEXT/Markdown; charset=utf-8")).toBe(true);
    expect(prefersMarkdown("text/markdown, text/html;q=0.9, */*;q=0.8")).toBe(
      true,
    );
    // A tie goes to Markdown: browsers never list it.
    expect(prefersMarkdown("text/markdown, text/html")).toBe(true);
    expect(prefersMarkdown("text/html, text/markdown")).toBe(true);
    expect(prefersMarkdown("text/markdown, */*")).toBe(true);
  });

  it("keeps HTML for browsers, wildcards and no Accept header", () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown("")).toBe(false);
    expect(prefersMarkdown("*/*")).toBe(false);
    expect(prefersMarkdown("text/*")).toBe(false);
    expect(
      prefersMarkdown(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      ),
    ).toBe(false);
    expect(prefersMarkdown("text/plain")).toBe(false);
  });

  it("respects quality values", () => {
    expect(prefersMarkdown("text/html, text/markdown;q=0.1")).toBe(false);
    expect(prefersMarkdown("text/html;q=0.5, text/markdown;q=0.6")).toBe(true);
    expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
    expect(prefersMarkdown("text/markdown;q=0.5, text/*;q=0.9")).toBe(false);
    // text/html's own entry beats the broader text/*.
    expect(
      prefersMarkdown("text/markdown;q=0.5, text/html;q=0.4, text/*;q=0.9"),
    ).toBe(true);
    expect(prefersMarkdown("text/markdown;q=0.8, text/html;q=0")).toBe(true);
    expect(prefersMarkdown("text/markdown;q=oops, text/html")).toBe(false);
  });
});
