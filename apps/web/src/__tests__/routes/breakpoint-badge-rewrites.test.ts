import { describe, expect, it } from "vitest";
import { BREAKPOINT_BADGE_URL } from "@@/apps-urls";
import rewritesAndRedirects from "@@/rewrites-redirects";

const beforeFiles = rewritesAndRedirects.rewrites.beforeFiles;
const redirects = rewritesAndRedirects.redirects;
const indexOf = (source: string) =>
  beforeFiles.findIndex((rewrite) => rewrite.source === source);

describe("Breakpoint badge site", () => {
  it("proxies /breakpoint/badge to the badge server, path kept", () => {
    expect(beforeFiles).toEqual(
      expect.arrayContaining([
        {
          source: "/breakpoint/badge",
          destination: `${BREAKPOINT_BADGE_URL}/breakpoint/badge`,
          locale: false,
        },
        {
          source: "/breakpoint/badge/:path*",
          destination: `${BREAKPOINT_BADGE_URL}/breakpoint/badge/:path*`,
          locale: false,
        },
      ]),
    );
  });

  it("matches before the Breakpoint app's catch-all", () => {
    expect(indexOf("/breakpoint/badge/:path*")).toBeGreaterThanOrEqual(0);
    expect(indexOf("/breakpoint/badge/:path*")).toBeLessThan(
      indexOf("/breakpoint/:path*"),
    );
    expect(indexOf("/breakpoint/badge")).toBeLessThan(
      indexOf("/breakpoint/:path*"),
    );
  });

  it("sends locale-prefixed URLs to the English-only site, never in a loop", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source:
            "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)/breakpoint/badge/:path*",
          destination: "/breakpoint/badge/:path*",
          permanent: false,
        }),
      ]),
    );
    expect(
      redirects.filter((r) => r.source.startsWith("/breakpoint/badge")),
    ).toEqual([]);
  });
});
