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

  let categoryName: string | null = null;
  let latestPosts: LatestPostsResponse | null = null;

  try {
    const { category } = await fetchCategoryByPath(categoryParam);
    categoryName = category?.name || null;
  } catch (error) {
    return notFound();
  }

  try {
    latestPosts = await fetchLatestPosts({ limit: 13, category: categoryName });
  } catch (error) {
    return notFound();
  }

  if (!categoryName) {
    return notFound();
  }

  return (
    <CategoryPostsClientPage
      category={categoryName}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
    />
  );
}
