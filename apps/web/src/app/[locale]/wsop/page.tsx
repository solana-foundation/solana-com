import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { fetchLatestLinks } from "@/lib/media/link";
import type { LinkItem } from "@/types/media";
import { WsopPage } from "./wsop-page";

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_TITLE = "Solana × World Series of Poker";
const PAGE_DESCRIPTION =
  "Solana is bringing instant digital buy-ins and payouts to the World Series of Poker - and crypto's biggest personalities to the feature table.";
const SOCIAL_IMAGE = "/src/img/wsop/solana-wsop.jpg";

type WsopContentMode = "preview" | "live";

// Change this one value to switch between project-owner preview content and
// published WSOP stories from apps/media/content/links.
const WSOP_CONTENT_MODE: WsopContentMode = "live";

const PREVIEW_STORIES: LinkItem[] = [
  {
    id: "preview-feature-table",
    title: "Inside the WSOP: Solana Edition feature table",
    url: "https://x.com/solana",
    date: "Preview",
    source: "Preview · Solana",
    linkType: "video",
    thumbnailImage: "/src/img/wsop/feature-table.webp",
  },
  {
    id: "preview-player-stories",
    title: "Meet the players taking crypto to poker’s biggest stage",
    url: "https://x.com/solana",
    date: "Preview",
    source: "Preview · Player stories",
    linkType: "video",
    thumbnailImage: "/src/img/wsop/solana-wsop.jpg",
  },
  {
    id: "preview-highlights",
    title: "Big hands and highlights from under the bright lights",
    url: "https://x.com/solana",
    date: "Preview",
    source: "Preview · Highlights",
    linkType: "video",
    thumbnailImage: "/src/img/wsop/feature-table.webp",
  },
];

export const revalidate = 300;

export default async function Page() {
  const stories =
    WSOP_CONTENT_MODE === "preview"
      ? PREVIEW_STORIES
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

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates,
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: "Solana × World Series of Poker",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [SOCIAL_IMAGE],
    },
  };
}
