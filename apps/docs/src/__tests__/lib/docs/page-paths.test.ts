import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsPagePaths,
  isDocsPagePath,
  isKnownDocsPage,
  knownDocsPagePaths,
  pagePathOf,
} from "@/lib/docs/page-paths";

describe("docs page paths", () => {
  it("maps content files to their public paths", () => {
    expect(pagePathOf("docs/en/core/accounts.mdx")).toEqual({
      locale: "en",
      path: "/developers/docs/core/accounts",
    });
    expect(pagePathOf("docs/en/index.mdx")).toEqual({
      locale: "en",
      path: "/developers/docs",
    });
    expect(pagePathOf("docs/ja/core/index.mdx")).toEqual({
      locale: "ja",
      path: "/developers/docs/core",
    });
    expect(pagePathOf("cookbook/index.mdx")).toEqual({
      locale: "en",
      path: "/developers/cookbook",
    });
    expect(pagePathOf("docs/en/(group)/x.mdx")?.path).toBe(
      "/developers/docs/x",
    );
    expect(pagePathOf("snippets/a.mdx")).toBeNull();
    // Learn articles are apps/web's.
    expect(pagePathOf("learn/en/what-is-solana.mdx")).toBeNull();
    expect(pagePathOf("docs.json")).toBeNull();
  });

  it("lists English paths, and translations only where English has none", () => {
    expect(
      docsPagePaths([
        "docs/en/a.mdx",
        "docs/ja/a.mdx",
        "docs/ja/only-ja.mdx",
        "cookbook/b.mdx",
        "snippets/c.mdx",
      ]),
    ).toEqual([
      "/developers/cookbook/b",
      "/developers/docs/a",
      "/ja/developers/docs/only-ja",
    ]);
  });

  it("knows a page at its English and locale URLs", () => {
    const known = new Set(["/developers/docs/a", "/ja/developers/docs/b"]);
    expect(isKnownDocsPage("/developers/docs/a", undefined, known)).toBe(true);
    expect(isKnownDocsPage("/developers/docs/a", "de", known)).toBe(true);
    expect(isKnownDocsPage("/developers/docs/b", "ja", known)).toBe(true);
    expect(isKnownDocsPage("/developers/docs/b", "de", known)).toBe(false);
    expect(isKnownDocsPage("/developers/docs/missing", undefined, known)).toBe(
      false,
    );
    // Without the build's list (dev, tests), every page counts as known.
    expect(isKnownDocsPage("/developers/docs/missing", undefined, null)).toBe(
      true,
    );
    expect(knownDocsPagePaths(undefined)).toBeNull();
    expect(knownDocsPagePaths('["/x"]')?.has("/x")).toBe(true);
  });

  it("covers the docs and cookbook, not the landings or Learn", () => {
    expect(isDocsPagePath("/developers/docs")).toBe(true);
    expect(isDocsPagePath("/developers/docs/core")).toBe(true);
    expect(isDocsPagePath("/developers/cookbook/wallets/x")).toBe(true);
    expect(isDocsPagePath("/learn/what-is-solana")).toBe(false);
    expect(isDocsPagePath("/learn")).toBe(false);
    expect(isDocsPagePath("/developers")).toBe(false);
    expect(isDocsPagePath("/developers/docs-x")).toBe(false);
  });

  it("finds the real content's pages", () => {
    const dir = path.resolve(__dirname, "../../../../content");
    const paths = docsPagePaths(
      readdirSync(dir, { recursive: true }) as string[],
    );
    for (const page of [
      "/developers/docs",
      "/developers/docs/core/accounts",
      "/developers/cookbook",
      "/developers/cookbook/wallets/create-keypair",
    ])
      expect(paths).toContain(page);
    expect(paths.some((p) => p.includes("/snippets"))).toBe(false);
  });
});
