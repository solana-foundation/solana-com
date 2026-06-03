import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;

describe("Ecosystem redirects", () => {
  it("redirects legacy ecosystem subpaths to the new ecosystem hub", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/ecosystem/:path+",
          destination: "/ecosystem",
        }),
      ]),
    );
  });

  it("keeps locale-prefixed legacy ecosystem subpaths on the localized hub", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source:
            "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)/ecosystem/:path+",
          destination: "/:locale/ecosystem",
        }),
      ]),
    );
  });

  it("does not redirect the live ecosystem hub to the homepage", () => {
    expect(redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/ecosystem(.*)",
          destination: "/",
        }),
      ]),
    );
  });
});
