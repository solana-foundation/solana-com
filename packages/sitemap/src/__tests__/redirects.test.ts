import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, LOCALES, SITE_URL } from "../constants";
import { excludeRedirectSources, getRedirectSourceUrls } from "../redirects";

const redirectSources = getRedirectSourceUrls();

describe("getRedirectSourceUrls", () => {
  it("collects redirect sources from the web app config", () => {
    expect(redirectSources.size).toBeGreaterThan(0);
  });

  it("returns absolute solana.com urls", () => {
    const foreign = [...redirectSources].filter(
      (url) => !url.startsWith(`${SITE_URL}/`),
    );

    expect(foreign).toEqual([]);
  });

  it("skips pattern sources that cannot map to a single url", () => {
    const patterns = [...redirectSources].filter((url) =>
      /[:*()]/.test(new URL(url).pathname),
    );

    expect(patterns).toEqual([]);
  });

  it("covers every non-default locale for each collected source", () => {
    const defaultLocaleSource = [...redirectSources].find((url) => {
      const [firstSegment] = new URL(url).pathname.slice(1).split("/");

      return Boolean(firstSegment) && !LOCALES.includes(firstSegment ?? "");
    });

    expect(defaultLocaleSource).toBeDefined();

    const pathname = new URL(defaultLocaleSource as string).pathname;

    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) {
        continue;
      }

      expect(redirectSources.has(`${SITE_URL}/${locale}${pathname}`)).toBe(
        true,
      );
    }
  });
});

describe("excludeRedirectSources", () => {
  it("drops entries whose url is a redirect source", () => {
    const [redirected] = [...redirectSources];
    const keeper = { url: `${SITE_URL}/definitely-not-a-redirect-source` };

    expect(
      excludeRedirectSources([{ url: redirected as string }, keeper]),
    ).toEqual([keeper]);
  });

  it("leaves entries untouched when nothing matches", () => {
    const entries = [
      { url: `${SITE_URL}/definitely-not-a-redirect-source` },
      { url: `${SITE_URL}/another-page-that-is-not-redirected` },
    ];

    expect(excludeRedirectSources(entries)).toEqual(entries);
  });

  it("handles an empty sitemap", () => {
    expect(excludeRedirectSources([])).toEqual([]);
  });
});
