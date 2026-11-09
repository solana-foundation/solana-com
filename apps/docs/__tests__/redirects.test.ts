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
    const { newUrl, parsedDestination } = prepareDestination({
      appendParamsToQuery: false,
      destination: rule.destination,
      params: params as Record<string, string | string[]>,
      query: {},
    });
    // newUrl is the path only; an external destination (no params) as is.
    const destination = parsedDestination.hostname ? rule.destination : newUrl;
    return { destination, permanent: rule.permanent };
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
    // Live's Solana Pay QR quickstart is the checkout's QR code step.
    expect(redirect("/docs/payments/quickstart")?.destination).toBe(
      "/developers/docs/payments/checkout/browser",
    );
    expect(redirect("/docs/payments/quickstart.md")?.destination).toBe(
      "/developers/docs/payments/checkout/browser.md",
    );
    expect(redirect("/docs/payments/accept-payments/solana-pay")).toEqual({
      destination: "/developers/docs/tools/solana-pay",
      permanent: true,
    });
    expect(
      redirect("/docs/payments/accept-payments/payment-button")?.destination,
    ).toBe("/developers/docs/tools/solana-pay");
    expect(redirect("/docs/payments/production-readiness")?.destination).toBe(
      "/developers/docs/tools/transaction-landing#transaction-landing",
    );
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

  it("send bootcamp pages to their video page, and .md twins to its .md twin", () => {
    const cases: [string, string][] = [
      ["/developers/bootcamp", "2026-developer-bootcamp"],
      ["/developers/bootcamp.md", "2026-developer-bootcamp.md"],
      ["/developers/bootcamp/foundations", "2026-developer-bootcamp#chapters"],
      [
        "/developers/bootcamp/foundations/hello-world",
        "2026-developer-bootcamp#hello-world",
      ],
      [
        "/developers/bootcamp/program-patterns/stable-coin",
        "2026-developer-bootcamp#stablecoin",
      ],
      [
        "/developers/bootcamp/shipping-production/production-readiness",
        "2026-developer-bootcamp#production-readiness",
      ],
      // A lesson without its own chapter: the top of the page.
      [
        "/developers/bootcamp/foundations/unknown-lesson",
        "2026-developer-bootcamp",
      ],
      [
        "/developers/bootcamp/foundations/hello-world.md",
        "2026-developer-bootcamp.md",
      ],
      ["/developers/bootcamp/foundations.md", "2026-developer-bootcamp.md"],
      ["/developers/bootcamp/depin", "building-depin-projects"],
      ["/developers/bootcamp/depin.md", "building-depin-projects.md"],
      ["/developers/bootcamp/depin/intro", "building-depin-projects"],
      ["/developers/bootcamp/depin/intro.md", "building-depin-projects.md"],
      ["/developers/bootcamp/solana-crashcourse", "solana-crash-course"],
      ["/developers/bootcamp/solana-crashcourse.md", "solana-crash-course.md"],
      [
        "/developers/bootcamp/solana-crashcourse/accounts.md",
        "solana-crash-course.md",
      ],
    ];
    for (const [path, page] of cases) {
      expect(redirect(path)?.destination, path).toBe(
        `/developers/docs/video-guides/${page}`,
      );
      expect(redirect(`/ja${path}`)?.destination, `/ja${path}`).toBe(
        `/ja/developers/docs/video-guides/${page}`,
      );
    }
  });

  it("keep an old link's #anchor where the old page's sections are spread over the new page", () => {
    // A destination #anchor would replace the old one; anchorAliases and
    // the legacy anchors send each old section to its new place.
    for (const [path, page] of [
      [
        "/docs/payments/agentic-payments/x402/making-a-payment",
        "/developers/docs/payments/pay-sh",
      ],
      [
        "/docs/payments/agentic-payments/x402-quickstart",
        "/developers/docs/payments/pay-sh",
      ],
      ["/docs/tokenization", "/developers/docs/assets"],
      [
        "/docs/tools/solana-pay/quickstart",
        "/developers/docs/tools/solana-pay",
      ],
    ]) {
      expect(redirect(path)?.destination, path).toBe(page);
      expect(redirect(`/ja${path}`)?.destination, path).toBe(`/ja${page}`);
    }
  });

  it("send the old rent URLs and their .md twins to the rent page", () => {
    for (const [path, page] of [
      ["/docs/intro/rent", "/developers/docs/core/rent"],
      ["/docs/intro/rent.md", "/developers/docs/core/rent.md"],
      ["/docs/core/rent", "/developers/docs/core/rent"],
      ["/docs/core/rent.md", "/developers/docs/core/rent.md"],
      ["/ja/docs/intro/rent.md", "/ja/developers/docs/core/rent.md"],
    ])
      expect(redirect(path)?.destination, path).toBe(page);
  });

  it("send the programs FAQ and its .md twin to Stack Exchange", () => {
    for (const path of [
      "/docs/programs/faq",
      "/docs/programs/faq.md",
      "/ja/docs/programs/faq",
      "/ja/docs/programs/faq.md",
    ]) {
      expect(redirect(path)?.destination, path).toBe(
        "https://solana.stackexchange.com",
      );
    }
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
