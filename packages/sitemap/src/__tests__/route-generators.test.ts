import { describe, expect, it } from "vitest";

import { SITE_URL } from "../constants";
import { accelerateRoutes } from "../routes/accelerate";
import { breakpointRoutes } from "../routes/breakpoint";
import { docsRoutes } from "../routes/docs";
import { marketingRoutes } from "../routes/marketing";
import { mediaRoutes } from "../routes/media";
import type { SitemapEntry } from "../types";

const generators = [
  ["marketingRoutes", marketingRoutes],
  ["docsRoutes", docsRoutes],
  ["mediaRoutes", mediaRoutes],
  ["accelerateRoutes", accelerateRoutes],
  ["breakpointRoutes", breakpointRoutes],
] as const;

const cache = new Map<string, SitemapEntry[]>();

async function generate(name: string, generator: () => unknown) {
  const cached = cache.get(name);

  if (cached) {
    return cached;
  }

  const entries = (await generator()) as SitemapEntry[];
  cache.set(name, entries);

  return entries;
}

describe.each(generators)("%s", (name, generator) => {
  it("produces entries", async () => {
    const entries = await generate(name, generator);

    expect(entries.length).toBeGreaterThan(0);
  });

  it("produces absolute solana.com urls", async () => {
    const entries = await generate(name, generator);
    const foreign = entries.filter(
      (entry) => !entry.url.startsWith(`${SITE_URL}/`),
    );

    expect(foreign).toEqual([]);
  });

  it("does not repeat a url", async () => {
    const entries = await generate(name, generator);
    const urls = entries.map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it("only leaves a trailing slash on the site root", async () => {
    const entries = await generate(name, generator);
    const trailing = entries.filter(
      (entry) => entry.url.endsWith("/") && entry.url !== `${SITE_URL}/`,
    );

    expect(trailing).toEqual([]);
  });

  it("never leaks dynamic route segments", async () => {
    const entries = await generate(name, generator);
    const dynamic = entries.filter((entry) => /[[\]]/.test(entry.url));

    expect(dynamic).toEqual([]);
  });

  it("never leaks route group or index segments", async () => {
    const entries = await generate(name, generator);
    const leaked = entries.filter((entry) =>
      /\/\(|\/index$/.test(new URL(entry.url).pathname),
    );

    expect(leaked).toEqual([]);
  });

  it("keeps priorities within the sitemap protocol range", async () => {
    const entries = await generate(name, generator);
    const outOfRange = entries.filter(
      (entry) =>
        entry.priority !== undefined &&
        (entry.priority < 0 || entry.priority > 1),
    );

    expect(outOfRange).toEqual([]);
  });

  it("emits parseable lastModified values", async () => {
    const entries = await generate(name, generator);
    const invalid = entries.filter((entry) => {
      if (entry.lastModified === undefined) {
        return false;
      }

      return Number.isNaN(new Date(entry.lastModified).getTime());
    });

    expect(invalid).toEqual([]);
  });
});

describe("marketingRoutes", () => {
  it("includes the localized home page", async () => {
    const urls = (await generate("marketingRoutes", marketingRoutes)).map(
      (entry) => entry.url,
    );

    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/es`);
  });

  it("gives the home page the highest priority", async () => {
    const entries = await generate("marketingRoutes", marketingRoutes);
    const home = entries.find((entry) => entry.url === `${SITE_URL}/`);

    expect(home?.priority).toBe(1);
  });
});

describe("docsRoutes", () => {
  it("includes the localized docs landing pages", async () => {
    const urls = (await generate("docsRoutes", docsRoutes)).map(
      (entry) => entry.url,
    );

    expect(urls).toContain(`${SITE_URL}/developers`);
    expect(urls).toContain(`${SITE_URL}/learn`);
    expect(urls).toContain(`${SITE_URL}/de/developers`);
  });

  it("maps mdx content into docs routes", async () => {
    const urls = (await generate("docsRoutes", docsRoutes)).map(
      (entry) => entry.url,
    );

    expect(urls.some((url) => url.startsWith(`${SITE_URL}/docs/`))).toBe(true);
  });

  it("keeps cookbook content on the default locale only", async () => {
    const urls = (await generate("docsRoutes", docsRoutes)).map(
      (entry) => entry.url,
    );
    const localizedCookbookPages = urls.filter((url) =>
      /^https:\/\/solana\.com\/[a-z]{2}\/developers\/cookbook\/.+/.test(url),
    );

    expect(localizedCookbookPages).toEqual([]);
  });
});

describe("mediaRoutes", () => {
  it("includes the localized media landing pages", async () => {
    const urls = (await generate("mediaRoutes", mediaRoutes)).map(
      (entry) => entry.url,
    );

    for (const route of ["/news", "/podcasts", "/reports", "/upgrades"]) {
      expect(urls).toContain(`${SITE_URL}${route}`);
      expect(urls).toContain(`${SITE_URL}/ko${route}`);
    }
  });

  it("does not expose the changelog category listing under /news", async () => {
    const urls = (await generate("mediaRoutes", mediaRoutes)).map(
      (entry) => entry.url,
    );

    expect(urls).not.toContain(`${SITE_URL}/news/category/changelog`);
  });

  it("does not publish posts dated in the future", async () => {
    const entries = await generate("mediaRoutes", mediaRoutes);
    const future = entries.filter(
      (entry) =>
        entry.url.startsWith(`${SITE_URL}/news/`) &&
        entry.lastModified !== undefined &&
        new Date(entry.lastModified).getTime() > Date.now(),
    );

    expect(future).toEqual([]);
  });
});

describe("accelerateRoutes", () => {
  it("prefixes every route with /accelerate", async () => {
    const entries = await generate("accelerateRoutes", accelerateRoutes);
    const misplaced = entries.filter(
      (entry) => !/\/(?:[a-z]{2}\/)?accelerate(?:\/|$)/.test(entry.url),
    );

    expect(misplaced).toEqual([]);
  });
});

describe("breakpointRoutes", () => {
  it("emits one localized entry for the breakpoint landing page", async () => {
    const urls = (await generate("breakpointRoutes", breakpointRoutes)).map(
      (entry) => entry.url,
    );

    expect(urls).toContain(`${SITE_URL}/breakpoint`);
    expect(urls).toContain(`${SITE_URL}/vi/breakpoint`);
  });
});
