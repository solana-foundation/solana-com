import { PostConnectionEdges } from "@/tina/__generated__/types";
import { PostItem } from "./post-types";
import { format } from "date-fns";

// Helper function to transform post data
export function transformPost(postData: PostConnectionEdges): PostItem | null {
  const post = postData?.node;
  if (!post) return null;

  const date = post.date ? new Date(post.date) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  return {
    id: post.id,
    published: formattedDate,
    title: post.title,
    tags:
      post.tags
        ?.map((tag) => tag?.tag?.name)
        .filter((name): name is string => name !== undefined) || [],
    categories:
      post.categories?.map((category) => category?.category?.name) || [],
    url: `/news/${post._sys?.breadcrumbs?.join("/") || ""}`,
    description: post.description,
    heroImage: post.heroImage || "/uploads/posts/default-blog.webp",
    author: {
      name: post.author?.name || "Solana Foundation",
      avatar: post.author?.avatar,
    },
    cursor: postData.cursor,
  } as PostItem;
}
