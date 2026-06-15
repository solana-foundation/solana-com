import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPost, fetchLatestPosts } from "@/lib/post-data";
import { newsListingMetadata } from "@/lib/metadata";
import { fetchNewsFilterOptions } from "@/lib/news-filter-options";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return newsListingMetadata();
}

export default async function PostsPage({
  params: _,
}: {
  params: Promise<{ locale: string }>;
}) {
  const featuredPost = await fetchFeaturedPost();
  const latestPosts = await fetchLatestPosts({ limit: 13 });
  const filterOptions = await fetchNewsFilterOptions();

  return (
    <PostsClientPage
      featuredPost={featuredPost.post}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
      filterOptions={filterOptions}
    />
  );
}
