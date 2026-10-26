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
    id: "wsop-august-roundup",
    title: "Solana Ecosystem Roundup: August 2026",
    date: "2026-09-04T04:18:00.000Z",
    link: "/news/solana-ecosystem-roundup-august-2026",
  },
  {
    id: "wsop-july-roundup",
    title: "Solana Ecosystem Roundup: July 2026",
    date: "2026-08-05T09:33:00.000Z",
    link: "/news/solana-ecosystem-roundup-july-2026",
  },
  {
    id: "wsop-june-roundup",
    title: "Solana Ecosystem Roundup: June 2026",
    date: "2026-07-06T06:00:00.000Z",
    link: "/news/solana-ecosystem-roundup-june-2026",
  },
  {
    id: "wsop-announcement",
    title: "World Series of Poker, Dealt by Solana",
    date: "2026-06-10T12:50:00.000Z",
    link: "/news/world-series-of-poker",
  },
  {
    id: "wsop-presenting-sponsor",
    title:
      "Solana is the official Presenting Sponsor of the 2026 WSOP and WSOP Paradise",
    date: "2026-06-16T06:47:00.000Z",
    link: "https://x.com/WSOP/status/2064695861901398228",
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
    limit: 9,
    fallbackImage: WSOP_SOCIAL_IMAGE,
    fallbackImageAspectRatio: "1200 / 630",
  });

  const items = news.some((item) => item.link.startsWith("/news/"))
    ? news
    : WSOP_NEWS_FALLBACK;
  const postsFirst = [...items].sort(
    (left, right) =>
      Number(right.link.startsWith("/news/")) -
      Number(left.link.startsWith("/news/")),
  );

  return <WsopPage news={postsFirst.slice(0, 5)} />;
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
