import { describe, expect, it } from "vitest";
import {
  buildCollectionJsonLd,
  buildDetailJsonLd,
  getLocalizedPageUrl,
  serializeJsonLd,
  toPublicUrl,
} from "@/lib/structured-data";
import {
  buildPodcastEpisodeJsonLd,
  buildReportJsonLd,
  buildUpgradeJsonLd,
} from "@/lib/content-structured-data";
import type { PodcastEpisode, PodcastShow } from "@/lib/podcast-types";

describe("media structured-data helpers", () => {
  it("normalizes public and localized URLs", () => {
    expect(toPublicUrl("/news/example")).toBe(
      "https://solana.com/news/example",
    );
    expect(getLocalizedPageUrl("/podcasts", "de")).toBe(
      "https://solana.com/de/podcasts",
    );
    expect(toPublicUrl("javascript:alert(1)")).toBeUndefined();
  });

  it("builds reusable collection, breadcrumb, and item-list graphs", () => {
    const data = buildCollectionJsonLd({
      path: "/reports",
      locale: "en",
      title: "Solana Reports",
      description: "Research from the Solana ecosystem.",
      listName: "Reports",
      entities: [
        {
          "@type": "Report",
          "@id": "https://solana.com/reports/example#report",
        },
      ],
    }) as any;

    expect(data["@graph"].map((item: any) => item["@type"])).toEqual([
      "CollectionPage",
      "BreadcrumbList",
      "ItemList",
      "Report",
    ]);
  });

  it("escapes markup in dynamic JSON-LD values", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain(
      "\\u003c/script>",
    );
  });

  it("preserves entity identifiers and localizes breadcrumb URLs", () => {
    const data = buildDetailJsonLd({
      path: "/reports/example",
      locale: "de",
      entity: {
        "@type": "Report",
        "@id": "https://solana.com/de/reports/example#article",
      },
      breadcrumbs: [
        { name: "Solana", path: "/" },
        { name: "Reports", path: "/reports" },
      ],
    }) as any;

    expect(data["@graph"][0]["@id"]).toBe(
      "https://solana.com/de/reports/example#article",
    );
    expect(data["@graph"][1].itemListElement[1].item).toBe(
      "https://solana.com/de/reports",
    );
  });

  it("uses the correct schema types for reports and upgrades", () => {
    const report = buildReportJsonLd({
      slug: "network-health",
      locale: "en",
      title: "Solana Network Health",
      description: "Network performance research.",
      publishedAt: "2026-07-23T12:00:00.000Z",
    }) as any;
    const upgrade = buildUpgradeJsonLd({
      slug: "feature-gate",
      locale: "en",
      title: "Feature gate activation",
      description: "Validator action required.",
      publishedAt: "2026-07-24T12:00:00.000Z",
    }) as any;

    expect(report["@graph"][0]["@type"]).toBe("Report");
    expect(upgrade["@graph"][0]["@type"]).toBe("TechArticle");
  });

  it("connects podcast episodes to their parent series", () => {
    const podcast = {
      id: "validated",
      title: "Validated",
      slug: "validated",
      description: "Builder conversations.",
      descriptionPlainText: "Builder conversations.",
      coverImage: "/uploads/podcasts/validated.webp",
      featured: true,
      displayOrder: 1,
      status: "active",
      hosts: [{ name: "Austin Federa" }],
    } satisfies PodcastShow;
    const episode = {
      id: "episode-1",
      slug: "shipping-solana-2026-07-23",
      recordingId: "episode-1",
      podcastSlug: "validated",
      title: "Shipping Solana",
      publishedDate: "2026-07-23T12:00:00.000Z",
      duration: 1800,
      audioUrl: "https://cdn.example.com/episode.mp3",
      status: "ready",
    } satisfies PodcastEpisode;
    const data = buildPodcastEpisodeJsonLd({
      podcast,
      episode,
      locale: "en",
    }) as any;

    expect(data["@graph"][0]).toEqual(
      expect.objectContaining({
        "@type": "PodcastEpisode",
        duration: "PT1800S",
        partOfSeries: {
          "@id": "https://solana.com/podcasts/validated#podcast",
        },
      }),
    );
  });
});
