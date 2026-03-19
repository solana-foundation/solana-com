export function isPublishedPost(
  post: { status?: string | null } | null | undefined
) {
  return post?.status === "published";
}
