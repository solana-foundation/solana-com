import { describe, expect, it } from "vitest";
import {
  buildChangelogJsonLd,
  serializeJsonLd,
} from "@/app/[locale]/changelog/structured-data";
import type { PostItem } from "@/lib/post-types";

const POSTS: PostItem[] = [
  {
    id: "solana-changelog-july-23-2026",
    published: "Jul 23, 2026",
    publishedAt: "2026-07-23T13:04:00.000Z",
    title: "Solana Changelog: July 23, 2026",
    tags: ["Developer"],
    categories: ["Changelog"],
    url: "/news/solana-changelog-july-23-2026",
    description: "Agave and program SDKs shipped updates.",
    heroImage: "/uploads/changelog.webp",
    author: { name: "Solana Foundation", avatar: null },
  },
];

describe("buildChangelogJsonLd", () => {
  it("describes the canonical collection, breadcrumb, and ordered issues", () => {
    const data = buildChangelogJsonLd({
      posts: POSTS,
      locale: "en",
      title: "Solana Changelog",
      description: "Weekly Solana developer updates.",
    }) as any;

    expect(data["@graph"][0]).toEqual(
      expect.objectContaining({
        "@type": "CollectionPage",
        url: "https://solana.com/changelog",
        dateModified: POSTS[0]?.publishedAt,
      }),
    );
    expect(data["@graph"][1]["@type"]).toBe("BreadcrumbList");
    expect(data["@graph"][2]).toEqual(
      expect.objectContaining({
        "@type": "ItemList",
        numberOfItems: 1,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
      }),
    );
    expect(data["@graph"][3]).toEqual(
      expect.objectContaining({
        "@type": "BlogPosting",
        url: "https://solana.com/news/solana-changelog-july-23-2026",
      }),
    );
  });

  it("uses the localized canonical URL", () => {
    const data = buildChangelogJsonLd({
      posts: POSTS,
      locale: "de",
      title: "Solana Changelog",
      description: "Weekly Solana developer updates.",
    }) as any;

    expect(data["@graph"][0].url).toBe("https://solana.com/de/changelog");
  });

  it("escapes markup in dynamic JSON-LD values", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain(
      "\\u003c/script>",
    );
  });
});
