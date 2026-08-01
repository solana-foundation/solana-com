import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { fetchLatestLinks } from "@/lib/media/link";
import type { LinkItem } from "@/types/media";
import { WsopPage } from "./wsop-page";

type Props = {
  params: Promise<{ locale: string }>;
};

const SOCIAL_IMAGE = "/src/img/wsop/solana-wsop.jpg";

type WsopContentMode = "preview" | "live";

// Change this one value to switch between project-owner preview content and
// published WSOP stories from apps/media/content/links.
const WSOP_CONTENT_MODE: WsopContentMode = "live";

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "wsop.previewStories",
  });
  const previewStories: LinkItem[] = [
    {
      id: "preview-feature-table",
      title: t("featureTable.title"),
      url: "https://x.com/solana",
      date: t("date"),
      source: t("featureTable.source"),
      linkType: "video",
      thumbnailImage: "/src/img/wsop/feature-table.webp",
    },
    {
      id: "preview-player-stories",
      title: t("playerStories.title"),
      url: "https://x.com/solana",
      date: t("date"),
      source: t("playerStories.source"),
      linkType: "video",
      thumbnailImage: "/src/img/wsop/solana-wsop.jpg",
    },
    {
      id: "preview-highlights",
      title: t("highlights.title"),
      url: "https://x.com/solana",
      date: t("date"),
      source: t("highlights.source"),
      linkType: "video",
      thumbnailImage: "/src/img/wsop/feature-table.webp",
    },
  ];
  const stories =
    WSOP_CONTENT_MODE === "preview"
      ? previewStories
      : (
          await fetchLatestLinks({
            limit: 8,
            tag: "wsop",
          })
        ).links;

  return <WsopPage stories={stories} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getAlternates("/wsop", locale);
  const t = await getTranslations({ locale, namespace: "wsop.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates,
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: t("socialImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [SOCIAL_IMAGE],
    },
  };
}
