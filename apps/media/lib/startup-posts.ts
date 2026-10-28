import { fetchLatestPosts } from "@/lib/keystatic/post-data";
import { contentDocumentToPlainText } from "@/lib/content-renderer";
import { parsePublishedAt } from "@/lib/keystatic/publishing";

const LIMIT = 4;

/** Product launches and hackathon stories are Media's existing founder taxonomies. */
export async function fetchStartupPosts() {
  const responses = await Promise.all(
    ["product", "hackathon"].map((tag) =>
      fetchLatestPosts({
        tag,
        excludeCategory: "changelog",
        limit: LIMIT,
        throwOnError: true,
      }),
    ),
  );
  const seen = new Set<string>();

  return responses
    .flatMap(({ posts }) => posts)
    .sort(
      (left, right) =>
        (parsePublishedAt(right.publishedAt)?.getTime() ?? 0) -
        (parsePublishedAt(left.publishedAt)?.getTime() ?? 0),
    )
    .filter((post) => {
      if (seen.has(post.url)) return false;
      seen.add(post.url);
      return true;
    })
    .slice(0, LIMIT)
    .map((post) => ({
      ...post,
      description: contentDocumentToPlainText(post.description),
    }));
}
