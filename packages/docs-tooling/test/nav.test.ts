import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { internalPath } from "../src/nav/build.ts";
import { loadEnglishPages, urlOf } from "../src/nav/pages.ts";
import type { NavFile } from "../src/nav/types.ts";
import { navPageRefs, verifyNav } from "../src/nav/verify-nav.ts";

let root: string;
let docs: string;

function put(rel: string, content = "---\ntitle: T\n---\n") {
  const f = path.join(docs, rel);
  mkdirSync(path.dirname(f), { recursive: true });
  writeFileSync(f, content);
}

/*
 * Fixture: docs/guide (a separator group, a nested folder with an index and
 * an expanded group), docs/other, a cookbook page, and a partial ja copy.
 */
beforeAll(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "nav-test-"));
  docs = path.join(root, "apps/docs/content");
  put("docs/en/index.mdx");
  put("docs/en/guide/index.mdx", "---\ntitle: Guide\nindex: true\n---\n");
  put("docs/en/guide/a.mdx");
  put("docs/en/guide/b.mdx");
  put("docs/en/guide/orphan.mdx");
  put("docs/en/guide/sub/index.mdx");
  put("docs/en/guide/sub/c.mdx");
  put("docs/en/guide/ts/d.mdx");
  put("docs/en/other.mdx");
  put("cookbook/index.mdx");
  // ja: translations need no nav entry.
  put("docs/ja/index.mdx");
  put("docs/ja/stale.mdx");
});
afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const NAV: NavFile = {
  tabs: [
    {
      tab: "Start",
      groups: [
        {
          group: "Start",
          pages: ["developers/docs/index", "developers/docs/other"],
        },
        {
          group: "Guide",
          root: "developers/docs/guide/index",
          directory: "card",
          pages: [
            "developers/docs/guide/a",
            {
              group: "Section",
              pages: [
                {
                  group: "Sub",
                  root: "developers/docs/guide/sub/index",
                  expanded: true,
                  pages: ["developers/docs/guide/sub/c"],
                },
                "developers/docs/guide/ts/d",
              ],
            },
            "developers/docs/guide/b",
            "developers/docs/guide/orphan",
          ],
        },
        { group: "Cookbook", pages: ["developers/cookbook/index"] },
      ],
    },
    {
      tab: "Videos",
      href: "https://solana.com/developers/docs/other",
      align: "end",
    },
  ],
};

describe("navPageRefs", () => {
  it("walks pages listed straight in a tab (no group header)", () => {
    const nav: NavFile = {
      tabs: [
        {
          tab: "Start here",
          pages: [
            "developers/docs/index",
            {
              group: "Quickstart",
              root: "developers/docs/quickstart",
              pages: ["developers/docs/quickstart/a"],
            },
          ],
        },
      ],
    };
    expect(navPageRefs(nav)).toEqual([
      "developers/docs/index",
      "developers/docs/quickstart",
      "developers/docs/quickstart/a",
    ]);
  });
});

describe("pages and URLs", () => {
  it("lists English pages only", () => {
    const pages = loadEnglishPages(docs);
    expect(pages).toContain("developers/docs/guide/sub/index");
    expect(pages).toContain("developers/cookbook/index");
    expect([...pages].some((p) => p.startsWith("ja/"))).toBe(false);
  });

  it("maps internal hrefs and URLs", () => {
    expect(internalPath("https://solana.com/docs/x")).toBe("/docs/x");
    expect(internalPath("/developers/docs/x")).toBe("/developers/docs/x");
    expect(internalPath("https://example.com/docs/x")).toBeUndefined();
    expect(urlOf("developers/docs/core/index")).toBe("/developers/docs/core");
    expect(urlOf("developers/docs/index")).toBe("/developers/docs");
  });
});

describe("verify-nav on a fixture project", () => {
  it("passes with exact coverage, then catches drift", () => {
    mkdirSync(path.join(docs, "navigation"), { recursive: true });
    writeFileSync(path.join(docs, "navigation/en.json"), JSON.stringify(NAV));
    let v = verifyNav({ docsRoot: docs });
    expect(v.errors).toEqual([]);

    // An English page that is in no nav entry fails.
    put("docs/en/stale.mdx");
    v = verifyNav({ docsRoot: docs });
    expect(v.errors).toContain(
      'en: page "developers/docs/stale" is in no nav entry',
    );
    rmSync(path.join(docs, "docs/en/stale.mdx"));
  });

  it("flags duplicates and missing files in en.json", () => {
    const nav: NavFile = {
      tabs: [
        {
          tab: "T",
          groups: [
            {
              group: "G",
              pages: [
                "developers/docs/index",
                "developers/docs/index",
                "developers/docs/nope",
              ],
            },
          ],
        },
      ],
    };
    writeFileSync(path.join(docs, "navigation/en.json"), JSON.stringify(nav));
    const v = verifyNav({ docsRoot: docs });
    expect(v.errors).toContain('en: "developers/docs/index" appears 2 times');
    expect(v.errors).toContain(
      'en: nav entry "developers/docs/nope" has no file',
    );
    expect(
      v.errors.some((e) =>
        e.includes('"developers/docs/other" is in no nav entry'),
      ),
    ).toBe(true);
  });
});

describe("committed navigation (apps/docs/content)", () => {
  it("has exact coverage", () => {
    const v = verifyNav();
    expect(v.errors).toEqual([]);
  });
});
