import { describe, expect, it } from "vitest";
import {
  ALPENGLOW_SOCIAL_IMAGE,
  buildAlpenglowJsonLd,
  serializeJsonLd,
} from "@/app/[locale]/alpenglow/structured-data";

describe("Alpenglow SEO", () => {
  it("connects the canonical page to its social image and breadcrumb", () => {
    const data = buildAlpenglowJsonLd({
      title: "Alpenglow: Solana's 150ms Finality Upgrade",
      description: "Alpenglow consensus overview",
      locale: "en",
      path: "/alpenglow",
    });

    expect(data["@graph"][0]).toMatchObject({
      "@type": "WebPage",
      url: "https://solana.com/alpenglow",
      inLanguage: "en",
      primaryImageOfPage: {
        url: `https://solana.com${ALPENGLOW_SOCIAL_IMAGE}`,
        width: 1200,
        height: 630,
      },
    });
    expect(data["@graph"][1]).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: expect.arrayContaining([
        expect.objectContaining({ name: "Alpenglow", position: 2 }),
      ]),
    });
  });

  it("escapes HTML-sensitive characters in JSON-LD", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c");
  });
});
