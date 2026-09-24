import type { NewsItem } from "@/components/solutions/latest-news.v2";
import { fetchLatestPosts } from "@/lib/media/post";
import { getMediaImageProxyUrl } from "@/lib/media/solution-news";
import type { PostItem } from "@/types/media";

const ARTICLE_LIMIT = 3;
const QUERY_LIMIT = 50;

const RELEVANCE_TERMS = [
  /alpenglow/i,
  /consensus/i,
  /finality/i,
  /slot times?/i,
];

function relevanceScore(post: PostItem) {
  return RELEVANCE_TERMS.reduce((score, term) => {
    const titleMatch = term.test(post.title) ? 4 : 0;
    const descriptionMatch = term.test(post.description) ? 2 : 0;

    return score + titleMatch + descriptionMatch;
  }, 0);
}

function publishedTimestamp(post: PostItem) {
  const timestamp = new Date(post.publishedAt || post.published).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export async function fetchAlpenglowNews(): Promise<NewsItem[]> {
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

  return posts
    .map((post) => ({ post, score: relevanceScore(post) }))
    .filter(({ post, score }) => score > 0 && Boolean(post.heroImage))
    .sort(
      (left, right) =>
        right.score - left.score ||
        publishedTimestamp(right.post) - publishedTimestamp(left.post),
    )
    .slice(0, ARTICLE_LIMIT)
    .map(({ post }) => ({
      id: post.id,
      title: post.title,
      date: post.publishedAt || post.published,
      image: getMediaImageProxyUrl(post.heroImage)!,
      link: post.url,
    }));
}
