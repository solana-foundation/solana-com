import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLatestLinks } from "@/lib/media/link";
import { WsopPage } from "./wsop-page";

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_TITLE = "Solana × World Series of Poker";
const PAGE_DESCRIPTION =
  "Solana is bringing instant digital buy-ins and payouts to the World Series of Poker—and crypto's biggest personalities to the feature table.";

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { locale } = await params;

  if (locale !== "en") {
    notFound();
  }

  const { links } = await fetchLatestLinks({
    limit: 8,
    tag: "wsop",
    linkType: "video",
  });

  return <WsopPage videos={links} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "en") {
    return {};
  }

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: {
      canonical: "/wsop",
    },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      type: "website",
      url: "/wsop",
      images: [
        {
          url: "/src/img/wsop/feature-table.webp",
          width: 2000,
          height: 1139,
          alt: "The World Series of Poker feature table, presented by Solana",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: ["/src/img/wsop/feature-table.webp"],
    },
  };
}
