import { describe, expect, it, vi } from "vitest";

// Two English pages; only "payments" has a translation (ja). Like Fumadocs,
// a fallback page keeps the English file but takes the requested locale.
vi.mock("@/lib/docs/source", () => {
  const page = (locale: string, slug: string, file: string) => ({
    path: `${file}/developers/docs/${slug}.mdx`,
    url: `${locale === "en" ? "" : `/${locale}`}/developers/docs/${slug}`,
    slugs: ["developers", "docs", slug],
    locale,
    data: { title: slug },
  });
  return {
    docsSource: {
      getPage(slugs: string[], locale = "en") {
        const slug = slugs.at(-1)!;
        if (!["payments", "quickstart"].includes(slug)) return undefined;
        const translated = slug === "payments" && locale === "ja";
        return page(locale, slug, translated ? locale : "en");
      },
    },
  };
});
vi.mock("@/lib/docs/navigation", () => ({
  getDocsNavigation: () => ({ tabs: [], byUrl: new Map() }),
  localizedPageUrl: (_locale: string, page: { url: string }) => page.url,
}));

const { resolveDocsPage } = await import("@/lib/docs/page-data");
const { docsPageMetadata } = await import("@/lib/docs/metadata");

const SITE = "https://solana.com";
const metadata = (locale: string, slug: string) => {
  const resolved = resolveDocsPage(locale, ["developers", "docs", slug])!;
  const meta = docsPageMetadata(resolved);
  return {
    contentLocale: resolved.contentLocale,
    canonical: meta.alternates?.canonical,
    languages: meta.alternates?.languages,
    ogUrl: (meta.openGraph as { url?: string }).url,
    ogLocale: (meta.openGraph as { locale?: string }).locale,
  };
};

describe("docs page metadata", () => {
  it("a translated page is its own canonical", () => {
    expect(metadata("ja", "payments")).toEqual({
      contentLocale: "ja",
      canonical: `${SITE}/ja/developers/docs/payments`,
      ogUrl: `${SITE}/ja/developers/docs/payments`,
      ogLocale: "ja",
      languages: {
        "x-default": `${SITE}/developers/docs/payments`,
        en: `${SITE}/developers/docs/payments`,
        ja: `${SITE}/ja/developers/docs/payments`,
      },
    });
  });

  it("an untranslated page at a locale URL points at English", () => {
    expect(metadata("de", "payments")).toEqual({
      contentLocale: "en",
      canonical: `${SITE}/developers/docs/payments`,
      ogUrl: `${SITE}/developers/docs/payments`,
      ogLocale: "en",
      languages: {
        "x-default": `${SITE}/developers/docs/payments`,
        en: `${SITE}/developers/docs/payments`,
        ja: `${SITE}/ja/developers/docs/payments`,
      },
    });
    expect(metadata("de", "quickstart").languages).toEqual({
      "x-default": `${SITE}/developers/docs/quickstart`,
      en: `${SITE}/developers/docs/quickstart`,
    });
  });
});
