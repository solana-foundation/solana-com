import type { Metadata } from "next";
import CategoryPostsClientPage from "./client-page";
import { notFound, permanentRedirect } from "next/navigation";
import { getAlternates } from "@workspace/i18n/alternates";
import { fetchLatestPosts, LatestPostsResponse } from "@/lib/post-data";
import { fetchCategoryByPath } from "@/lib/category-data";
import {
  categoryListingMetadata,
  changelogListingMetadata,
} from "@/lib/metadata";
import { isChangelogCategory } from "@/lib/changelog";
import { getActiveCampaign } from "@/lib/news-campaign";
import type { NewsNavItem } from "@/lib/news-nav";
import { fetchNewsNavItemsWithPosts } from "@/lib/news-nav-data";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPostCollectionJsonLd } from "@/lib/content-structured-data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam, locale } = await params;

  if (isChangelogCategory(categoryParam)) {
    return changelogListingMetadata(locale);
  }

  return categoryListingMetadata(categoryParam, locale);
}

export default async function CategoryPostsPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { category: categoryParam, locale } = await params;

  if (isChangelogCategory(categoryParam)) {
    permanentRedirect(String(getAlternates("/changelog", locale).canonical));
  }

  let categoryName: string | null = null;
  let latestPosts: LatestPostsResponse | null = null;
  let navItems: NewsNavItem[] = [];

  try {
    const [{ category }, filteredNavItems] = await Promise.all([
      fetchCategoryByPath(categoryParam),
      fetchNewsNavItemsWithPosts(),
    ]);
    categoryName = category?.name || null;
    navItems = filteredNavItems;
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
  const title = `${categoryName} News`;
  const description = `Read the latest ${categoryName} news, product updates, ecosystem stories, developer releases, and analysis from across the Solana network.`;
  const structuredData = buildPostCollectionJsonLd({
    posts: latestPosts.posts,
    path: `/news/category/${categoryParam}`,
    locale,
    title,
    description,
    listName: `Latest ${categoryName} news`,
    aboutName: `${categoryName} on Solana`,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <CategoryPostsClientPage
        category={categoryName}
        categorySlug={categoryParam}
        campaign={campaign}
        latestPosts={latestPosts.posts}
        initialPageInfo={latestPosts.pageInfo}
        navItems={navItems}
      />
    </>
  );
}
