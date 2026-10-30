import { describe, expect, it, vi } from "vitest";

// "payments" is a tab's first page; "payments/checkout" sits in that tab;
// "core/accounts" has a ja translation; the cookbook has no tab.
vi.mock("@/lib/docs/source", () => {
  const titles: Record<string, string> = {
    "developers/docs": "Start building on Solana",
    "developers/docs/payments": "Payments",
    "developers/docs/payments/checkout": "Accept a payment",
    "developers/docs/core/accounts": "Accounts",
    "developers/cookbook/wallets/create-keypair": "How to Create a Keypair",
  };
  return {
    docsSource: {
      getPage(slugs: string[], locale = "en") {
        const key = slugs.join("/");
        if (!titles[key]) return undefined;
        const translated = key.endsWith("accounts") && locale === "ja";
        return {
          path: `${translated ? locale : "en"}/${key}.mdx`,
          url: `${locale === "en" ? "" : `/${locale}`}/${key}`,
          slugs,
          locale,
          data: {
            title: titles[key],
            description: `About ${titles[key]}.`,
            keywords: key.endsWith("checkout") ? ["usdc", "checkout"] : [],
          },
        };
      },
    },
  };
});
vi.mock("@/lib/docs/navigation", () => {
  const tab = (locale: string) => ({
    key: "payments",
    title: "Payments",
    hidden: false,
    url: `${locale === "en" ? "" : `/${locale}`}/developers/docs/payments`,
  });
  return {
    getDocsNavigation: (locale: string) => ({
      tabs: [tab(locale)],
      byUrl: new Map(
        ["payments", "payments/checkout"].map((p) => [
          `${locale === "en" ? "" : `/${locale}`}/developers/docs/${p}`,
          { tab: tab(locale), groups: [] },
        ]),
      ),
    }),
    localizedPageUrl: (_locale: string, page: { url: string }) => page.url,
  };
});

const { resolveDocsPage } = await import("@/lib/docs/page-data");
const { docsPageJsonLd, DOCS_WEBSITE } =
  await import("@/lib/docs/structured-data");

const SITE = "https://solana.com";
const graph = (locale: string, slugs: string[]) =>
  docsPageJsonLd(resolveDocsPage(locale, slugs)!)["@graph"] as Record<
    string,
    unknown
  >[];
const node = (nodes: Record<string, unknown>[], type: string) =>
  nodes.find((n) => n["@type"] === type)!;
const trail = (nodes: Record<string, unknown>[]) =>
  (
    node(nodes, "BreadcrumbList").itemListElement as {
      name: string;
      item: string;
      position: number;
    }[]
  ).map((i) => [i.position, i.name, i.item]);

describe("docs page JSON-LD", () => {
  it("describes the page as a TechArticle of the docs", () => {
    const nodes = graph("en", ["developers", "docs", "payments", "checkout"]);
    const url = `${SITE}/developers/docs/payments/checkout`;
    expect(node(nodes, "TechArticle")).toEqual({
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: "Accept a payment",
      description: "About Accept a payment.",
      url,
      mainEntityOfPage: url,
      inLanguage: "en",
      image: `${SITE}/opengraph/developers/docs/payments/checkout`,
      keywords: "usdc, checkout",
      isPartOf: { "@id": `${SITE}/developers/docs#website` },
      publisher: { "@id": `${SITE}/#organization` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    });
  });

  it("gives the breadcrumb from Solana down to the page", () => {
    expect(
      trail(graph("en", ["developers", "docs", "payments", "checkout"])),
    ).toEqual([
      [1, "Solana", SITE],
      [2, "Solana Developer Docs", `${SITE}/developers/docs`],
      [3, "Payments", `${SITE}/developers/docs/payments`],
      [4, "Accept a payment", `${SITE}/developers/docs/payments/checkout`],
    ]);
    // A tab's first page is the last crumb, once.
    expect(trail(graph("en", ["developers", "docs", "payments"]))).toEqual([
      [1, "Solana", SITE],
      [2, "Solana Developer Docs", `${SITE}/developers/docs`],
      [3, "Payments", `${SITE}/developers/docs/payments`],
    ]);
    expect(trail(graph("en", ["developers", "docs"]))).toEqual([
      [1, "Solana", SITE],
      [2, "Start building on Solana", `${SITE}/developers/docs`],
    ]);
    expect(
      trail(
        graph("en", ["developers", "cookbook", "wallets", "create-keypair"]),
      ),
    ).toEqual([
      [1, "Solana", SITE],
      [2, "Cookbook", `${SITE}/developers/cookbook`],
      [
        3,
        "How to Create a Keypair",
        `${SITE}/developers/cookbook/wallets/create-keypair`,
      ],
    ]);
  });

  it("follows the canonical URL in other locales", () => {
    const ja = graph("ja", ["developers", "docs", "core", "accounts"]);
    expect(node(ja, "TechArticle").url).toBe(
      `${SITE}/ja/developers/docs/core/accounts`,
    );
    expect(node(ja, "TechArticle").inLanguage).toBe("ja");
    expect(trail(ja)[1]).toEqual([
      2,
      "Solana Developer Docs",
      `${SITE}/ja/developers/docs`,
    ]);
    // Untranslated: the English page, as its canonical.
    const de = graph("de", ["developers", "docs", "payments", "checkout"]);
    expect(node(de, "TechArticle").url).toBe(
      `${SITE}/developers/docs/payments/checkout`,
    );
    expect(trail(de)[2]).toEqual([
      3,
      "Payments",
      `${SITE}/developers/docs/payments`,
    ]);
  });

  it("names the docs search and a publisher without contact details", () => {
    const nodes = graph("en", ["developers", "docs", "core", "accounts"]);
    expect(node(nodes, "WebSite")).toBe(DOCS_WEBSITE);
    expect(DOCS_WEBSITE.potentialAction).toEqual({
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/developers/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    });
    const org = node(nodes, "Organization");
    expect(org).toMatchObject({ name: "Solana Foundation", url: SITE });
    expect(org.sameAs).toContain("https://x.com/solana");
    expect(org).not.toHaveProperty("contactPoint");
    expect(org).not.toHaveProperty("address");
  });
});
