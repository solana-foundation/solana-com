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
    category: "Assets",
    title: "Launch a Token-2022 asset",
    description:
      "Create a mint with metadata, pausability, and built-in controls.",
    href: "/docs/tokenization/quickstart",
  },
  {
    category: "Assets",
    title: "Explore tokenized assets",
    description: "Issue, control, settle, and operate assets onchain.",
    href: "/docs/tokenization",
  },
  {
    category: "Games",
    title: "Get started with game development",
    description: "Build onchain games with the Solana games cookbook.",
    href: "/developers/cookbook/games/getting-started-with-game-development",
  },
  {
    category: "Infrastructure",
    title: "Explore developer tools",
    description: "Find SDKs, local testing, infrastructure, and references.",
    href: "/docs/tools",
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
