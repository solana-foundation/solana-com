import type { Metadata } from "next";
import CategoryPostsClientPage from "./client-page";
import { notFound } from "next/navigation";
import { fetchLatestPosts, LatestPostsResponse } from "@/lib/post-data";
import { fetchCategoryByPath } from "@/lib/category-data";
import { categoryListingMetadata } from "@/lib/metadata";
import { getActiveCampaign } from "@/lib/news-campaign";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;
  return categoryListingMetadata(categoryParam);
}

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
  } catch {
    return notFound();
  }

  if (!categoryName) {
    return notFound();
  }

  try {
    latestPosts = await fetchLatestPosts({ limit: 13, category: categoryName });
  } catch {
    return notFound();
  }
  const campaign = getActiveCampaign(`category:${categoryParam}`);

  return (
    <CategoryPostsClientPage
      category={categoryName}
      categorySlug={categoryParam}
      campaign={campaign}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
    />
  );
}
