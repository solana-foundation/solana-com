import { describe, expect, it, vi } from "vitest";
import rewritesAndRedirects from "@@/rewrites-redirects";
import { marketingRoutes } from "@solana-foundation/solana-com-sitemap";
import { generateMetadata as outlook2023Metadata } from "@/app/[locale]/2023outlook/page";
import { generateMetadata as outlook2024Metadata } from "@/app/[locale]/2024outlook/page";
import { generateMetadata as epoch1000Metadata } from "@/app/[locale]/epoch1000/page";
import { generateMetadata as epoch1000CardMetadata } from "@/app/[locale]/epoch1000/card/page";
import { archivedCampaignMetadata } from "@/components/archived-campaign-layout";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));
vi.mock("@/app/[locale]/2023outlook/outlook-2023", () => ({
  Outlook2023Page: () => null,
}));
vi.mock("@/app/[locale]/2024outlook/outlook-2024", () => ({
  Outlook2024Page: () => null,
}));
vi.mock("@/components/epoch1000/Epoch1000Experience", () => ({
  default: () => null,
}));

describe("dated page archive", () => {
  it.each([
    [
      "/community/report-2024-newsletter-sign-up",
      "/news/state-of-solana-breakpoint-2024",
    ],
    ["/nftshowdown", "/news/solana-nft-showdown-winners"],
    ["/playgg", "/news/solana-solstice-2023-community-review"],
  ])("redirects %s to %s in every route form", (source, destination) => {
    const redirects = rewritesAndRedirects.redirects;
    const localePattern =
      "/:locale(en|ar|de|el|es|fi|fr|id|it|ja|ko|nl|pl|pt|ru|tr|uk|vi|zh)";

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source,
          destination,
          permanent: true,
          locale: false,
        }),
        expect.objectContaining({
          source: `${localePattern}${source}`,
          destination: `/:locale${destination}`,
          permanent: true,
          locale: false,
        }),
      ]),
    );
  });

  it("keeps archived landing pages out of the marketing sitemap", async () => {
    const urls = (await marketingRoutes()).map(
      (entry) => new URL(entry.url).pathname,
    );
    const archivedPaths = [
      "/2023outlook",
      "/2024outlook",
      "/community/report-2024-newsletter-sign-up",
      "/epoch1000",
      "/epoch1000/card",
      "/art-basel",
      "/privacyhack",
      "/graveyard-hack",
      "/prediction-markets-hack",
      "/wsop",
      "/nftshowdown",
      "/playgg",
    ];

    expect(urls).toContain("/");
    for (const path of archivedPaths) {
      expect(urls).not.toContain(path);
      expect(urls).not.toContain(`/fr${path}`);
    }
  });

  it("sets self-canonical and noindex metadata on retained pages", async () => {
    const pages = [
      { generate: outlook2023Metadata, path: "/2023outlook" },
      { generate: outlook2024Metadata, path: "/2024outlook" },
      { generate: epoch1000Metadata, path: "/epoch1000" },
    ];

    for (const { generate, path } of pages) {
      const metadata = await generate({
        params: Promise.resolve({ locale: "fr" }),
      });
      expect(metadata.alternates?.canonical).toBe(`/fr${path}`);
      expect(metadata.robots).toEqual({ index: false, follow: true });
    }

    const cardMetadata = await epoch1000CardMetadata({
      params: Promise.resolve({ locale: "fr" }),
      searchParams: Promise.resolve({}),
    });
    expect(cardMetadata.alternates?.canonical).toBe("/fr/epoch1000/card");
    expect(cardMetadata.robots).toEqual({ index: false, follow: true });
    expect(archivedCampaignMetadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
