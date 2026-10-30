import { describe, expect, it } from "vitest";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination";
import { docsRedirects } from "../redirects";

const rules = docsRedirects().map((rule) => ({
  rule,
  match: getPathMatch(rule.source, { strict: true, removeUnnamedParams: true }),
}));

/** The first rule that matches `path`, resolved with Next.js' own matcher. */
function redirect(path: string) {
  for (const { rule, match } of rules) {
    const params = match(path);
    if (!params) continue;
    const { newUrl } = prepareDestination({
      appendParamsToQuery: false,
      destination: rule.destination,
      params: params as Record<string, string | string[]>,
      query: {},
    });
    return { destination: newUrl, permanent: rule.permanent };
  }
  return null;
}

describe("docs redirects", () => {
  it("send old /docs URLs to /developers/docs", () => {
    expect(redirect("/docs")?.destination).toBe("/developers/docs");
    expect(redirect("/docs/core/accounts")?.destination).toBe(
      "/developers/docs/core/accounts",
    );
    expect(redirect("/docs/intro/quick-start")?.destination).toBe(
      "/developers/docs/quickstart",
    );
    expect(redirect("/docs/payments/quickstart")?.destination).toBe(
      "/developers/docs/payments/checkout/browser",
    );
    expect(redirect("/docs/payments/accept-payments/solana-pay")).toEqual({
      destination: "/developers/docs/tools/commerce-kit/quickstart/solana-pay",
      permanent: true,
    });
    expect(redirect("/developers/bootcamp/anything/here")?.destination).toBe(
      "/developers/docs/video-guides/2026-developer-bootcamp",
    );
  });

  it("keep the locale", () => {
    expect(redirect("/el/docs/core")?.destination).toBe(
      "/el/developers/docs/core",
    );
    expect(redirect("/ja/docs/intro/quick-start")?.destination).toBe(
      "/ja/developers/docs/quickstart",
    );
  });

  it("have .md twins", () => {
    expect(redirect("/docs.md")?.destination).toBe("/developers/docs.md");
    expect(redirect("/docs/core/pda.md")?.destination).toBe(
      "/developers/docs/core/pda.md",
    );
    expect(redirect("/docs/intro/quick-start.md")?.destination).toBe(
      "/developers/docs/quickstart.md",
    );
    // A destination's #anchor is dropped from its Markdown twin.
    expect(redirect("/docs/tokenization.md")?.destination).toBe(
      "/developers/docs/assets.md",
    );
    expect(redirect("/ja/docs/tokenization.md")?.destination).toBe(
      "/ja/developers/docs/assets.md",
    );
  });

  it("never match a /developers/docs page", () => {
    for (const path of [
      "/developers/docs",
      "/developers/docs/core",
      "/developers/docs.md",
      "/ja/developers/docs/quickstart",
      "/el/developers/docs/core.md",
    ]) {
      expect(redirect(path)).toBeNull();
    }
  });

  it("never point at /docs", () => {
    for (const { rule } of rules) {
      expect(rule.destination).not.toMatch(/^(\/:locale)?\/docs([/.]|$)/);
    }
  });
});
