import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { fetchLatestPosts } from "@/lib/media/post";
import type { PostItem } from "@/types/media";
import {
  DeliveryVsPaymentPage,
  type RelatedStory,
} from "./delivery-vs-payment";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

const RELATED_POST_QUERIES = [
  { category: "institutions", tag: "finance" },
  { category: "institutions", tag: "token" },
  { category: "payments", tag: "stablecoins" },
] as const;

const getPublishedAt = (post: PostItem) => {
  const timestamp = new Date(post.publishedAt ?? post.published).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getRelevanceScore = (post: PostItem) => {
  const text = `${post.title} ${post.description}`.toLowerCase();
  const weightedTerms = [
    ["settlement", 8],
    ["real-world asset", 7],
    ["tokeniz", 6],
    ["treasury", 4],
    ["stablecoin", 3],
    ["payment", 2],
    ["asset", 2],
    ["trade", 2],
    ["bond", 2],
  ] as const;
  const taxonomy = [...post.categories, ...post.tags].map((item) =>
    item.toLowerCase(),
  );

  return weightedTerms.reduce(
    (score, [term, weight]) => score + (text.includes(term) ? weight : 0),
    taxonomy.reduce(
      (score, item) =>
        score +
        (item === "institutions" || item === "finance" || item === "payments"
          ? 2
          : item === "stablecoins" || item === "token"
            ? 3
            : 0),
      0,
    ),
  );
};

const toRelatedStory = (post: PostItem): RelatedStory => ({
  eyebrow: post.categories[0] ?? post.tags[0] ?? "News",
  title: post.title,
  description: post.description,
  href: post.url,
});

async function getRelatedStories(): Promise<RelatedStory[]> {
  const responses = await Promise.all(
    RELATED_POST_QUERIES.map((query) =>
      fetchLatestPosts({ ...query, limit: 6 }),
    ),
  );
  const seenUrls = new Set<string>();

  return responses
    .flatMap(({ posts }) => posts)
    .sort(
      (left, right) =>
        getRelevanceScore(right) - getRelevanceScore(left) ||
        getPublishedAt(right) - getPublishedAt(left),
    )
    .filter((post) => {
      if (seenUrls.has(post.url)) return false;
      seenUrls.add(post.url);
      return true;
    })
    .slice(0, 3)
    .map(toRelatedStory);
}

export default async function Page() {
  const relatedStories = await getRelatedStories();

  return <DeliveryVsPaymentPage relatedStories={relatedStories} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...getBaseMetadata(locale),
    title: "Delivery versus Payment",
    description:
      "Settle an asset and its payment together in one atomic transaction on Solana.",
  };
}
