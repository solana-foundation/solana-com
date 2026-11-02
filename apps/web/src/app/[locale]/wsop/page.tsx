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
// Keep the WSOP post visible until the tagged posts API responds.
const WSOP_POST_FALLBACK: NewsItem = {
  id: "wsop-announcement",
  title: "World Series of Poker, Dealt by Solana",
  date: "2026-06-10T12:50:00.000Z",
  link: "/news/world-series-of-poker",
  image: WSOP_SOCIAL_IMAGE,
  imageAspectRatio: "1200 / 630",
};

export const revalidate = 60;

export default async function Page() {
  const news = await fetchSolutionNews({
    tags: ["wsop"],
    limit: 4,
    includeLinks: false,
  });

  return <WsopPage news={news.length > 0 ? news : [WSOP_POST_FALLBACK]} />;
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
