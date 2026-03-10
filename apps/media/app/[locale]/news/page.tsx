import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPost, fetchLatestPosts } from "@/lib/post-data";
import { newsListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return newsListingMetadata();
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const featuredPost = await fetchFeaturedPost();
  const latestPosts = await fetchLatestPosts({ limit: 13 });

  return (
    <PostsClientPage
      featuredPost={featuredPost.post}
      latestPosts={latestPosts.posts}
      initialPageInfo={latestPosts.pageInfo}
    />
  );
}
