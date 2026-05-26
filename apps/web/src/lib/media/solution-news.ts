import type { NewsItem } from "@/components/solutions/latest-news.v2";
import { fetchLatestLinks } from "@/lib/media/link";
import { fetchLatestPosts } from "@/lib/media/post";
import type { LinkItem, PostItem } from "@/types/media";

export type SolutionNewsQuery = {
  categories?: string[];
  tags?: string[];
  limit?: number;
  excludeUrls?: string[];
  maxAgeDays?: number;
  includePosts?: boolean;
  includeLinks?: boolean;
  fallbackImage?: string;
  fallbackImageAspectRatio?: string;
  fallbackImagesByUrl?: Record<string, string>;
  fallbackImageAspectRatioByUrl?: Record<string, string>;
  fallbackImageFitByUrl?: Record<string, "cover" | "contain">;
};

const DEFAULT_LIMIT = 4;
const QUERY_LIMIT_MULTIPLIER = 2;

const buildQueries = ({
  categories = [],
  tags = [],
}: SolutionNewsQuery): Array<{ category?: string; tag?: string }> => {
  if (categories.length > 0 && tags.length > 0) {
    return categories.flatMap((category) =>
      tags.map((tag) => ({
        category,
        tag,
      })),
    );
  }

  if (categories.length > 0) {
    return categories.map((category) => ({ category }));
  }

  if (tags.length > 0) {
    return tags.map((tag) => ({ tag }));
  }

  return [{}];
};

const getPostTimestamp = (post: PostItem) => {
  const candidate = post.publishedAt || post.published;
  const timestamp = candidate ? new Date(candidate).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getLinkTimestamp = (link: LinkItem) => {
  const timestamp = link.date ? new Date(link.date).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getMediaImageProxyUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) {
    return null;
  }

  const searchParams = new URLSearchParams({
    path: imagePath,
  });

  return `/api/media/image?${searchParams.toString()}`;
};

const toPostNewsItem = (post: PostItem): NewsItem | null => {
  const image = getMediaImageProxyUrl(post.heroImage);

  if (!image) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    date: post.publishedAt || undefined,
    image,
    link: post.url,
  };
};

const toLinkNewsItem = (
  link: LinkItem,
  query: SolutionNewsQuery,
): NewsItem | null => {
  const fallbackImageByUrl = query.fallbackImagesByUrl?.[link.url];
  const image =
    fallbackImageByUrl ||
    (link.thumbnailImage ? getMediaImageProxyUrl(link.thumbnailImage) : null) ||
    query.fallbackImage;

  if (!image) {
    return null;
  }

  return {
    id: link.id,
    title: link.title,
    date: link.date || undefined,
    image,
    link: link.url,
    imageAspectRatio:
      query.fallbackImageAspectRatioByUrl?.[link.url] ||
      (fallbackImageByUrl || !link.thumbnailImage
        ? query.fallbackImageAspectRatio
        : undefined),
    imageFit: query.fallbackImageFitByUrl?.[link.url],
  };
};

type SolutionNewsSource =
  | {
      type: "post";
      url: string;
      timestamp: number;
      item: PostItem;
    }
  | {
      type: "link";
      url: string;
      timestamp: number;
      item: LinkItem;
    };

export const fetchSolutionNews = async (
  query: SolutionNewsQuery,
): Promise<NewsItem[]> => {
  const limit = query.limit ?? DEFAULT_LIMIT;
  const excludeUrls = new Set(query.excludeUrls ?? []);
  const perQueryLimit = Math.max(limit * QUERY_LIMIT_MULTIPLIER, 6);
  const includePosts = query.includePosts ?? true;
  const includeLinks = query.includeLinks ?? true;
  const minimumTimestamp =
    typeof query.maxAgeDays === "number"
      ? Date.now() - query.maxAgeDays * 24 * 60 * 60 * 1000
      : null;

  const responses = await Promise.all(
    buildQueries(query).map((params) =>
      Promise.all([
        includePosts
          ? fetchLatestPosts({
              ...params,
              limit: perQueryLimit,
            })
          : Promise.resolve({ posts: [] }),
        includeLinks
          ? fetchLatestLinks({
              ...params,
              limit: perQueryLimit,
            })
          : Promise.resolve({ links: [] }),
      ]),
    ),
  );

  const items: SolutionNewsSource[] = [];

  for (const [postsResponse, linksResponse] of responses) {
    for (const post of postsResponse.posts) {
      const timestamp = getPostTimestamp(post);
      if (minimumTimestamp !== null && timestamp < minimumTimestamp) {
        continue;
      }

      items.push({
        type: "post",
        url: post.url,
        timestamp,
        item: post,
      });
    }

    for (const link of linksResponse.links) {
      const timestamp = getLinkTimestamp(link);
      if (minimumTimestamp !== null && timestamp < minimumTimestamp) {
        continue;
      }

      items.push({
        type: "link",
        url: link.url,
        timestamp,
        item: link,
      });
    }
  }

  const dedupedItems: SolutionNewsSource[] = [];
  const seenUrls = new Set<string>();

  for (const item of items.sort(
    (left, right) => right.timestamp - left.timestamp,
  )) {
    if (excludeUrls.has(item.url) || seenUrls.has(item.url)) {
      continue;
    }

    seenUrls.add(item.url);
    dedupedItems.push(item);
  }

  return dedupedItems
    .map((item) =>
      item.type === "post"
        ? toPostNewsItem(item.item)
        : toLinkNewsItem(item.item, query),
    )
    .filter((item): item is NewsItem => item !== null)
    .slice(0, limit);
};
