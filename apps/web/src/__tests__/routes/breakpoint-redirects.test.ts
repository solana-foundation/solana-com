import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;

describe("Breakpoint redirects", () => {
  it("redirects root Breakpoint subroutes to their canonical prefixed URLs", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/travel",
          destination: "/breakpoint/travel",
        }),
        expect.objectContaining({
          source: "/schedule",
          destination: "/breakpoint/schedule",
        }),
        expect.objectContaining({
          source: "/sponsors",
          destination: "/breakpoint/sponsors",
        }),
        expect.objectContaining({
          source: "/tickets",
          destination: "/breakpoint/registration",
        }),
      ]),
    );
  });

  it("keeps locale-prefixed aliases on the Breakpoint route namespace", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source:
            "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)/travel",
          destination: "/:locale/breakpoint/travel",
        }),
      ]),
    );
  });

  it("does not collapse the live sponsors page back to the Breakpoint home page", () => {
    expect(redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/breakpoint/sponsors",
          destination: "/breakpoint",
        }),
      ]),
    );
  });
});
