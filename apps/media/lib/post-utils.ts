import { PostItem, ContentDocument } from "./post-types";
import { format } from "date-fns";

// Type for post data from Keystatic reader
export interface PostData {
  slug: string;
  title: string;
  date: string | null;
  description: ContentDocument;
  heroImage: string | null;
  author: string | null;
  tags: readonly string[] | null;
  categories: readonly string[] | null;
}

// Helper function to transform post data from Keystatic format
export function transformPost(
  postData: PostData,
  resolvedAuthor?: { name: string; avatar: string | null } | null,
  resolvedTags?: string[],
  resolvedCategories?: string[]
): PostItem {
  const date = postData.date ? new Date(postData.date) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  return {
    id: postData.slug,
    published: formattedDate,
    title: postData.title,
    tags: resolvedTags || [],
    categories: resolvedCategories || [],
    url: `/news/${postData.slug}`,
    description: postData.description,
    heroImage:
      postData.heroImage || "/media-assets/uploads/posts/default-blog.webp",
    author: {
      name: resolvedAuthor?.name || "Solana Foundation",
      avatar: resolvedAuthor?.avatar || null,
    },
  };
}
