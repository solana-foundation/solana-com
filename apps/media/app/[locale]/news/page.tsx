import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPosts, fetchLatestPosts } from "@/lib/post-data";
import { newsListingMetadata } from "@/lib/metadata";
import { getActiveCampaign } from "@/lib/news-campaign";
import { fetchNewsNavItemsWithPosts } from "@/lib/news-nav-data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return newsListingMetadata(locale);
}

export default async function PostsPage({
  params: _,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [featuredPosts, latestPosts, navItems] = await Promise.all([
    fetchFeaturedPosts(),
    fetchLatestPosts({ limit: 13, excludeTag: "featured" }),
    fetchNewsNavItemsWithPosts(),
  ]);
  const campaign = getActiveCampaign("news-front");

  return (
    <PostsClientPage
      campaign={campaign}
      featuredPosts={featuredPosts.posts}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
      navItems={navItems}
    />
  );
}
