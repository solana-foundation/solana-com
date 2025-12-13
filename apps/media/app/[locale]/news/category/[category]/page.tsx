import CategoryPostsClientPage from "./client-page";
import { notFound } from "next/navigation";
import { fetchLatestPosts, LatestPostsResponse } from "@/lib/post-data";
import { fetchCategoryByPath } from "@/lib/category-data";

export const revalidate = 300;

export default async function CategoryPostsPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { category: categoryParam } = await params;

  const { category } = await fetchCategoryByPath(categoryParam);
  const categoryName: string | null = category?.name || null;

  if (!categoryName) {
    return notFound();
  }

  const latestPosts: LatestPostsResponse = await fetchLatestPosts({
    limit: 13,
    category: categoryName,
  });

  return (
    <CategoryPostsClientPage
      category={categoryName}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
    />
  );
}
