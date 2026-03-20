import { isPublishedAtOrBefore } from "./publishing";

export function isPublishedPost(
  post:
    | { status?: string | null; publishedAt?: string | null }
    | null
    | undefined,
  now: Date = new Date()
) {
  return (
    post?.status === "published" && isPublishedAtOrBefore(post.publishedAt, now)
  );
}
