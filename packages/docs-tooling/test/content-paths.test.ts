import { describe, expect, it } from "vitest";
import { fileToPage, pageToFile } from "../src/lib/content-paths.ts";

describe("content paths", () => {
  it("maps page ids to content files and back", () => {
    for (const [page, file] of [
      ["developers/docs/index", "docs/en/index.mdx"],
      ["el/developers/docs/core/pda", "docs/el/core/pda.mdx"],
      ["learn/what-is-solana", "learn/en/what-is-solana.mdx"],
      ["ko/learn/what-is-solana", "learn/ko/what-is-solana.mdx"],
      ["developers/cookbook/index", "cookbook/index.mdx"],
    ]) {
      expect(pageToFile(page!)).toBe(file);
      expect(fileToPage(file!)).toBe(page);
    }
    expect(pageToFile("ja/developers/cookbook/x")).toBeUndefined();
    expect(fileToPage("snippets/x.mdx")).toBeUndefined();
    expect(fileToPage("docs/xx/x.mdx")).toBeUndefined();
  });
});
