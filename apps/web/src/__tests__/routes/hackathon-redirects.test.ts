import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;
const localePattern =
  "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)";

describe("Hackathon redirects", () => {
  it("keeps the archive at /hackathon and sends the plural alias there", () => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/hackathons",
          destination: "/hackathon",
          locale: false,
        }),
        expect.objectContaining({
          source: `${localePattern}/hackathons`,
          destination: "/:locale/hackathon",
          locale: false,
        }),
      ]),
    );
    expect(redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "/hackathon" }),
      ]),
    );
  });

  it.each([
    "/ignition",
    "/solanaszn",
    "/wormhole-hackathon",
    "/defi",
    "/riptide(.*)",
    "/summercamp(.*)",
    "/grizzlython(.*)",
    "/hyperdrive(.*)",
  ])("keeps historical alias %s on the archive", (source) => {
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source,
          destination: "/hackathon",
          locale: false,
        }),
        expect.objectContaining({
          source: `${localePattern}${source}`,
          destination: "/:locale/hackathon",
          locale: false,
        }),
      ]),
    );
  });
});
