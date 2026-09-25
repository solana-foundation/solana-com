import type { NewsItem } from "@/components/solutions/latest-news.v2";
import { fetchLatestLinks } from "@/lib/media/link";
import { fetchLatestPosts } from "@/lib/media/post";
import { getMediaImageProxyUrl } from "@/lib/media/solution-news";
import type { LinkItem, PostItem } from "@/types/media";

const ARTICLE_LIMIT = 3;
const QUERY_LIMIT = 50;

const RELEVANCE_TERMS = [
  /alpenglow/i,
  /consensus/i,
  /finality/i,
  /slot times?/i,
];

function relevanceScore(
  item: Pick<PostItem | LinkItem, "title" | "description">,
) {
  return RELEVANCE_TERMS.reduce((score, term) => {
    const titleMatch = term.test(item.title) ? 4 : 0;
    const descriptionMatch = term.test(item.description ?? "") ? 2 : 0;

    return score + titleMatch + descriptionMatch;
  }, 0);
}

function publishedTimestamp(date: string | null | undefined) {
  const timestamp = date ? new Date(date).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export async function fetchAlpenglowNews(): Promise<NewsItem[]> {
  const postsPromise = (async () => {
    const posts: PostItem[] = [];
    const seenCursors = new Set<string>();
    let cursor: string | undefined;

    do {
      const page = await fetchLatestPosts({ limit: QUERY_LIMIT, cursor });
      posts.push(...page.posts);
      const nextCursor = page.pageInfo?.hasNextPage
        ? (page.pageInfo.endCursor ?? undefined)
        : undefined;
      if (!nextCursor || seenCursors.has(nextCursor)) break;
      seenCursors.add(nextCursor);
      cursor = nextCursor;
    } while (cursor);

    return posts;
  })();

  const [posts, { links }] = await Promise.all([
    postsPromise,
    fetchLatestLinks({
      limit: QUERY_LIMIT,
      tag: "alpenglow",
      linkType: "article",
    }),
  ]);

  return [
    ...posts.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.publishedAt || post.published,
      image: post.heroImage,
      link: post.url,
      score: relevanceScore(post),
    })),
    ...links.map((link) => ({
      id: link.id,
      title: link.title,
      date: link.date,
      image: link.thumbnailImage,
      link: link.url,
      score: relevanceScore(link),
    })),
  ]
    .filter((item) => item.score > 0 && Boolean(item.image))
    .sort(
      (left, right) =>
        right.score - left.score ||
        publishedTimestamp(right.date) - publishedTimestamp(left.date),
    )
    .slice(0, ARTICLE_LIMIT)
    .map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      image: getMediaImageProxyUrl(item.image)!,
      link: item.link,
    }));
}
