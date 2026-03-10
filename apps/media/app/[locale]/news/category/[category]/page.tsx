import type { Metadata } from "next";
import CategoryPostsClientPage from "./client-page";
import { notFound } from "next/navigation";
import { fetchLatestPosts, LatestPostsResponse } from "@/lib/post-data";
import { fetchCategoryByPath } from "@/lib/category-data";
import { config } from "@/lib/config";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;

  let categoryName: string | null = null;
  try {
    const { category } = await fetchCategoryByPath(categoryParam);
    categoryName = category?.name || null;
  } catch {
    return { title: "Category Not Found" };
  }

  if (!categoryName) {
    return { title: "Category Not Found" };
  }

  const title = `${categoryName} News`;
  const description = `Latest ${categoryName} news and updates from the Solana ecosystem.`;
  const canonicalUrl = `${config.publicUrl}/news/category/${categoryParam}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: config.siteMetadata.title,
      images: [
        {
          url: config.siteMetadata.socialShare,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [config.siteMetadata.socialShare],
      creator: `@${config.social.twitter.name}`,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
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
  } catch (error) {
    return notFound();
  }

  if (!categoryName) {
    return notFound();
  }

  try {
    latestPosts = await fetchLatestPosts({ limit: 13, category: categoryName });
  } catch (error) {
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
