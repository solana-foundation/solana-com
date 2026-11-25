import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";
import { locales } from "@workspace/i18n/config";

const LOCALE = `/:locale(${locales.join("|")})`;

function rule(source: string) {
  return rewritesAndRedirects.redirects.find((r) => r.source === source);
}

describe("old docs URLs", () => {
  it.each([
    // F178: the Tools > AI page, not "Build with AI agents".
    ["/docs/tools/ai", "/developers/docs/tools/ai"],
    ["/developers/guides/getstarted/intro-to-ai", "/developers/docs/tools/ai"],
    // F177: rent has its own page.
    ["/docs/core/rent", "/developers/docs/core/rent"],
    ["/docs/intro/rent", "/developers/docs/core/rent"],
    // F175: fragments the pages have.
    [
      "/cli",
      "/developers/docs/intro/installation/dependencies#install-solana-cli",
    ],
    [
      "/developers/guides/getstarted/scaffold-nextjs-anchor",
      "/developers/cookbook/development/crud-dapp",
    ],
    [
      "/developers/guides/getstarted/full-stack-solana-development",
      "/developers/cookbook/development/crud-dapp",
    ],
  ])("sends %s to %s, in every locale", (source, destination) => {
    expect(rule(source)).toMatchObject({ destination, locale: false });
    expect(rule(`${LOCALE}${source}`)).toMatchObject({
      destination: `/:locale${destination}`,
      locale: false,
    });
  });

  it.each([
    ["/docs/tools/ai.md", "/developers/docs/tools/ai.md"],
    [
      "/developers/guides/getstarted/intro-to-ai.md",
      "/developers/docs/tools/ai.md",
    ],
  ])("sends the Markdown twin %s to %s", (source, destination) => {
    expect(rule(source)).toMatchObject({ destination });
    expect(rule(`${LOCALE}${source}`)).toMatchObject({
      destination: `/:locale${destination}`,
    });
  });

  it("no longer sends anything to the fragments no page has", () => {
    const destinations = rewritesAndRedirects.redirects.map(
      (r) => r.destination,
    );
    for (const gone of [
      "#deploy-your-first-solana-application",
      "#install-the-solana-cli",
    ])
      expect(destinations.filter((d) => d.includes(gone))).toEqual([]);
  });

  it("never redirects an old docs URL to itself", () => {
    for (const r of rewritesAndRedirects.redirects)
      expect(r.destination.split("#")[0]).not.toBe(r.source);
  });
});
