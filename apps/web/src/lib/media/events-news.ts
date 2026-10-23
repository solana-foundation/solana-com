import { fetchLatestPosts } from "@/lib/media/post";
import type { PostItem } from "@/types/media";

const NEWS_LIMIT = 4;
const POSTS_PER_TOPIC = 2;

const postDate = (post: PostItem) =>
  Date.parse(post.publishedAt || post.published) || 0;

export async function fetchEventsNews(): Promise<PostItem[]> {
  const [eventPosts, communityPosts] = await Promise.all([
    fetchLatestPosts({ tag: "events", limit: 8 }),
    fetchLatestPosts({ category: "community", limit: 8 }),
  ]);

  const newestFirst = (posts: PostItem[]) =>
    [...posts].sort((a, b) => postDate(b) - postDate(a));
  const selected = new Map<string, PostItem>();

  for (const post of newestFirst(eventPosts.posts).slice(0, POSTS_PER_TOPIC)) {
    selected.set(post.url, post);
  }
  for (const post of newestFirst(communityPosts.posts)) {
    if (selected.size === NEWS_LIMIT) break;
    if (!selected.has(post.url)) selected.set(post.url, post);
  }

  for (const post of newestFirst([
    ...eventPosts.posts,
    ...communityPosts.posts,
  ])) {
    if (selected.size === NEWS_LIMIT) break;
    selected.set(post.url, post);
  }

  return newestFirst([...selected.values()]).slice(0, NEWS_LIMIT);
}
