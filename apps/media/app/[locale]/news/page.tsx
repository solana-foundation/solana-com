import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPost, fetchLatestPosts } from "@/lib/post-data";
import { newsListingMetadata } from "@/lib/metadata";
import { getActiveCampaign } from "@/lib/news-campaign";
import { fetchNewsNavItemsWithPosts } from "@/lib/news-nav-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return newsListingMetadata();
}

export default async function PostsPage({
  params: _,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [featuredPost, latestPosts, navItems] = await Promise.all([
    fetchFeaturedPost(),
    fetchLatestPosts({ limit: 13 }),
    fetchNewsNavItemsWithPosts(),
  ]);
  const campaign = getActiveCampaign("news-front");

  return (
    <PostsClientPage
      campaign={campaign}
      featuredPost={featuredPost.post}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
      navItems={navItems}
    />
  );
}
