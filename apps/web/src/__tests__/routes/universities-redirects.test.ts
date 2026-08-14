import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;

describe("Universities redirects", () => {
  it("redirects the universities route and its subpaths to developers", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/universities/:path*",
          destination: "/developers",
        }),
      ]),
    );
  });

  it("keeps locale-prefixed universities routes on localized developers pages", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source:
            "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)/universities/:path*",
          destination: "/:locale/developers",
        }),
      ]),
    );
  });
});
