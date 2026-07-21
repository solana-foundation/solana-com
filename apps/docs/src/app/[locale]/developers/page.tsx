import { DevelopersPage } from "./developers";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";
import { getYTVideos } from "@/utils/followerFunctions";
import { getIndexMetadata } from "@@/src/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const featuredResources = [
  {
    category: "Payments",
    title: "Accept payments on Solana",
    description:
      "Take stablecoin payments with instant settlement and sub-cent fees.",
    href: "/docs/payments",
  },
  {
    category: "Tokenization",
    title: "Issue a stablecoin",
    description:
      "Launch a fiat-backed stablecoin with built-in compliance controls.",
    href: "/docs/tokenization/stablecoins",
  },
  {
    category: "DeFi",
    title: "Build a trading bot",
    description:
      "Automated trading on Solana, from market data to landed transaction.",
    href: "/docs/defi/trading-bot",
  },
  {
    category: "Tokenization",
    title: "Tokenize a real-world asset",
    description: "Bring funds, treasuries, and securities onchain.",
    href: "/docs/tokenization/real-world-assets",
  },
  {
    category: "Games",
    title: "Get started with game development",
    description: "Build onchain games with the Solana games cookbook.",
    href: "/developers/cookbook/games/getting-started-with-game-development",
  },
  {
    category: "Infrastructure",
    title: "Index onchain data",
    description: "Stream and query transactions, balances, and program events.",
    href: "/docs/tools/indexing",
  },
];

export default async function Page() {
  const latestChangelogVideo = await getLatestChangelogVideo();
  return (
    <DevelopersPage
      latestChangelogVideo={latestChangelogVideo ?? undefined}
      guides={featuredResources}
    />
  );
}

async function getLatestChangelogVideo() {
  try {
    let latestChangelogVideo = null;
    const videos = await getYTVideos(undefined, YT_PLAYLIST_CHANGELOG);
    if (videos.length) {
      latestChangelogVideo = videos.sort((a, b) => {
        if (!b.snippet.publishedAt || !a.snippet.publishedAt) return 0;
        return (
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime()
        );
      })[0];
    }
    return latestChangelogVideo;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers.title",
    descriptionKey: "developers.description",
    path: "/developers",
    locale,
  });
}
