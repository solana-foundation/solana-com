import { describe, expect, it } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";

const redirects = rewritesAndRedirects.redirects;
const localePattern =
  "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)";

const retiredRoutes = [
  {
    path: "consume-cus-on-sbpf-failure",
    destination:
      "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0182-conditional-cu-metering.md",
  },
  {
    path: "direct-mapping",
    destination:
      "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0219-stricter-abi-and-runtime-constraints.md",
  },
  {
    path: "reserve-minimal-cus-for-builtins",
    destination:
      "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0170-builtin-instruction-cost-and-budget.md",
  },
  {
    path: "tsynmcspg4xficj1v3tdb4c7crmr5tsbhlz4sf7rrna",
    destination:
      "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0138-deprecate-legacy-vote-instructions.md",
  },
];

function expectPermanentRedirect(source: string, destination: string) {
  expect(redirects).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        source,
        destination,
        permanent: true,
        locale: false,
      }),
    ]),
  );
}

function expectRedirectBefore(source: string, fallbackSource: string) {
  const sourceIndex = redirects.findIndex(
    (redirect) => redirect.source === source,
  );
  const fallbackIndex = redirects.findIndex(
    (redirect) => redirect.source === fallbackSource,
  );

  expect(sourceIndex).toBeGreaterThanOrEqual(0);
  expect(fallbackIndex).toBeGreaterThan(sourceIndex);
}

describe("Retired feature-gate routes", () => {
  it.each(retiredRoutes)(
    "redirects $path to its canonical proposal",
    (route) => {
      const source = `/docs/references/feature-gates/${route.path}`;
      expectPermanentRedirect(source, route.destination);
      expectPermanentRedirect(`${localePattern}${source}`, route.destination);
    },
  );

  it.each(retiredRoutes)(
    "places $path ahead of the overlapping catch-all",
    (route) => {
      const source = `/docs/references/feature-gates/${route.path}`;
      const fallbackSource = "/docs/references/feature-gates/:path*";

      expectRedirectBefore(source, fallbackSource);
      expectRedirectBefore(
        `${localePattern}${source}`,
        `${localePattern}${fallbackSource}`,
      );
    },
  );

  it("redirects the retired section and unknown slugs to the tracker", () => {
    const source = "/docs/references/feature-gates/:path*";
    const destination =
      "https://github.com/anza-xyz/agave/wiki/Feature-Gate-Tracker-Schedule";

    expectPermanentRedirect(source, destination);
    expectPermanentRedirect(`${localePattern}${source}`, destination);
  });
});
