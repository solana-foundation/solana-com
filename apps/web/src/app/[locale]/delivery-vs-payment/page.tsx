import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
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

const toRelatedStory = (
  post: PostItem,
  fallbackEyebrow: string,
): RelatedStory => ({
  eyebrow: post.categories[0] ?? post.tags[0] ?? fallbackEyebrow,
  title: post.title,
  description: post.description,
  href: post.url,
});

async function getRelatedStories(
  fallbackEyebrow: string,
): Promise<RelatedStory[]> {
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
    .map((post) => toRelatedStory(post, fallbackEyebrow));
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "deliveryVsPayment.stories",
  });
  const relatedStories = await getRelatedStories(t("news"));

  return <DeliveryVsPaymentPage relatedStories={relatedStories} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "deliveryVsPayment.metadata",
  });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates("/delivery-vs-payment", locale);
  const base = getBaseMetadata(locale);

  return {
    ...base,
    title,
    description,
    alternates,
    openGraph: {
      ...base.openGraph,
      type: "website",
      title,
      description,
      url: alternates.canonical,
      siteName: "Solana",
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title,
      description,
    },
  };
}
