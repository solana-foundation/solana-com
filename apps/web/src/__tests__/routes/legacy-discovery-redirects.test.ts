import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

describe("legacy discovery URLs", () => {
  it.each([
    ["/rss", "/news/rss.xml"],
    ["/feed.xml", "/news/rss.xml"],
    ["/sitemap-0.xml", "/sitemap.xml"],
    ["/sitemap-index.xml", "/sitemap.xml"],
    ["/sitemap_index.xml", "/sitemap.xml"],
  ])("redirects %s to the live resource", (source, destination) => {
    expect(rewritesAndRedirects.redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source, destination, locale: false }),
      ]),
    );
  });

  it.each([
    ["/developers/guides/getstarted/tokens", "/docs/tokens"],
    ["/developers/guides/getstarted/actions", "/docs/tools/actions"],
    [
      "/developers/guides/advanced/security-best-practices",
      "/docs/tools/production-readiness",
    ],
  ])("breaks the redirect loop for %s", (source, destination) => {
    expect(rewritesAndRedirects.redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source, destination, locale: false }),
        expect.objectContaining({
          source: `${source}.md`,
          destination: `${destination}.md`,
          locale: false,
        }),
      ]),
    );
  });
});
