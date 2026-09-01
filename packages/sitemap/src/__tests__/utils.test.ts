import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, LOCALES, SITE_URL } from "../constants";
import {
  createEntry,
  createLocalizedEntries,
  dedupeEntries,
  getFileLastModified,
  localizedPaths,
  normalizePath,
  toAbsoluteUrl,
  walkFiles,
} from "../utils";

describe("normalizePath", () => {
  it("returns the site root for empty and root-ish paths", () => {
    expect(normalizePath("")).toBe("/");
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("//")).toBe("/");
  });

  it("adds a leading slash when one is missing", () => {
    expect(normalizePath("developers")).toBe("/developers");
    expect(normalizePath("developers/cookbook")).toBe("/developers/cookbook");
  });

  it("strips trailing slashes so entries never duplicate", () => {
    expect(normalizePath("/developers/")).toBe("/developers");
    expect(normalizePath("/developers///")).toBe("/developers");
    expect(normalizePath("developers/")).toBe("/developers");
  });
});

describe("toAbsoluteUrl", () => {
  it("prefixes normalized paths with the canonical site origin", () => {
    expect(toAbsoluteUrl("/docs")).toBe(`${SITE_URL}/docs`);
    expect(toAbsoluteUrl("docs/")).toBe(`${SITE_URL}/docs`);
    expect(toAbsoluteUrl("/")).toBe(`${SITE_URL}/`);
  });
});

describe("localizedPaths", () => {
  it("emits the default locale unprefixed followed by every other locale", () => {
    const paths = localizedPaths("/docs");

    expect(paths).toHaveLength(LOCALES.length);
    expect(paths[0]).toBe("/docs");
    expect(paths).not.toContain(`/${DEFAULT_LOCALE}/docs`);

    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) {
        continue;
      }

      expect(paths).toContain(`/${locale}/docs`);
    }
  });

  it("keeps the home page free of a trailing slash for every locale", () => {
    const paths = localizedPaths("/");

    expect(paths[0]).toBe("/");
    expect(paths).toContain("/es");
    expect(paths.some((entry) => entry.endsWith("//"))).toBe(false);
  });

  it("normalizes the incoming path before localizing it", () => {
    expect(localizedPaths("docs/")).toContain("/fr/docs");
  });

  it("never produces duplicate paths", () => {
    const paths = localizedPaths("/developers/cookbook");

    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("createEntry", () => {
  it("builds an absolute url and preserves the provided metadata", () => {
    expect(
      createEntry("/docs", { changeFrequency: "weekly", priority: 0.8 }),
    ).toEqual({
      url: `${SITE_URL}/docs`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  it("omits metadata that was not supplied", () => {
    expect(createEntry("/docs")).toEqual({ url: `${SITE_URL}/docs` });
  });
});

describe("createLocalizedEntries", () => {
  it("applies the same metadata to every localized url", () => {
    const entries = createLocalizedEntries("/news", {
      changeFrequency: "daily",
      priority: 0.8,
    });

    expect(entries).toHaveLength(LOCALES.length);
    expect(entries[0]?.url).toBe(`${SITE_URL}/news`);
    expect(entries.map((entry) => entry.url)).toContain(`${SITE_URL}/ja/news`);
    expect(entries.every((entry) => entry.changeFrequency === "daily")).toBe(
      true,
    );
  });
});

describe("dedupeEntries", () => {
  it("keeps the first entry for each url", () => {
    const entries = dedupeEntries([
      { url: `${SITE_URL}/docs`, priority: 0.9 },
      { url: `${SITE_URL}/docs`, priority: 0.1 },
      { url: `${SITE_URL}/learn` },
    ]);

    expect(entries).toEqual([
      { url: `${SITE_URL}/docs`, priority: 0.9 },
      { url: `${SITE_URL}/learn` },
    ]);
  });

  it("treats locale variants of the same route as distinct urls", () => {
    const entries = dedupeEntries([
      { url: `${SITE_URL}/docs` },
      { url: `${SITE_URL}/es/docs` },
    ]);

    expect(entries).toHaveLength(2);
  });

  it("returns an empty list unchanged", () => {
    expect(dedupeEntries([])).toEqual([]);
  });
});

describe("filesystem helpers", () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-utils-"));
    fs.mkdirSync(path.join(tempDir, "nested", "deeper"), { recursive: true });
    fs.writeFileSync(path.join(tempDir, "index.mdx"), "root");
    fs.writeFileSync(path.join(tempDir, "nested", "page.mdx"), "nested");
    fs.writeFileSync(
      path.join(tempDir, "nested", "deeper", "page.mdx"),
      "deeper",
    );
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("walks nested directories and returns only file paths", () => {
    const files = walkFiles(tempDir).map((filePath) =>
      path.relative(tempDir, filePath).split(path.sep).join("/"),
    );

    expect(files.sort()).toEqual([
      "index.mdx",
      "nested/deeper/page.mdx",
      "nested/page.mdx",
    ]);
  });

  it("reports the last modified time as an ISO timestamp", () => {
    const lastModified = getFileLastModified(path.join(tempDir, "index.mdx"));

    expect(lastModified).toBe(new Date(lastModified).toISOString());
  });
});
