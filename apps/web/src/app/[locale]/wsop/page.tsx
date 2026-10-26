import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import { config } from "@/config";
import { WsopPage } from "./wsop-page";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import type { NewsItem } from "@/components/solutions/latest-news.v2";

const WSOP_PATH = "/wsop";
const WSOP_LOCALE = "en";
const WSOP_SOCIAL_IMAGE = "/src/img/wsop/paradise/paradise-social.jpg";
// Protected media previews cannot be fetched from the web preview server.
// Keep the currently published WSOP records visible until the tagged API responds.
const WSOP_NEWS_FALLBACK: NewsItem[] = [
  {
    id: "wsop-presenting-sponsor",
    title:
      "Solana is the official Presenting Sponsor of the 2026 WSOP and WSOP Paradise",
    date: "2026-06-16T06:47:00.000Z",
    link: "https://x.com/WSOP/status/2064695861901398228",
  },
  {
    id: "wsop-thestreet",
    title: "Solana brings crypto payments to WSOP for the first time",
    date: "2026-06-10T13:08:00.000Z",
    link: "https://www.thestreet.com/crypto/innovation/solana-brings-crypto-payments-to-wsop-for-the-first-time",
  },
  {
    id: "wsop-decrypt",
    title:
      "Solana Sponsors the World Series of Poker, Enabling Crypto Entry Fees and Payouts",
    date: "2026-06-10T13:01:20.000Z",
    link: "https://decrypt.co/370578/solana-sponsors-world-series-poker-crypto-entry-fees-payouts",
  },
  {
    id: "wsop-coindesk",
    title: "World Series of Poker Adds Solana Payments for Tournament Buy-Ins",
    date: "2026-06-10T13:00:00.000Z",
    link: "https://www.coindesk.com/tech/2026/06/09/world-series-of-poker-adds-solana-payments-for-tournament-buy-ins",
  },
  {
    id: "wsop-announcement",
    title: "World Series of Poker, Dealt by Solana",
    date: "2026-06-10T12:50:00.000Z",
    link: "/news/world-series-of-poker",
  },
].map((item) => ({
  ...item,
  image: WSOP_SOCIAL_IMAGE,
  imageAspectRatio: "1200 / 630",
}));

export const revalidate = 60;

export default async function Page() {
  const news = await fetchSolutionNews({
    tags: ["wsop"],
    limit: 5,
    fallbackImage: WSOP_SOCIAL_IMAGE,
    fallbackImageAspectRatio: "1200 / 630",
  });

  return <WsopPage news={news.length > 0 ? news : WSOP_NEWS_FALLBACK} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({
    locale: WSOP_LOCALE,
    namespace: "wsop.metadata",
  });
  const title = t("title");
  const description = t("description");
  const socialImageAlt = t("socialImageAlt");

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: WSOP_PATH,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: WSOP_PATH,
      siteName: config.siteMetadata.title,
      locale: WSOP_LOCALE,
      images: [
        {
          url: WSOP_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: config.siteMetadata.author,
      title,
      description,
      images: [
        {
          url: WSOP_SOCIAL_IMAGE,
          alt: socialImageAlt,
        },
      ],
    },
  };
}
