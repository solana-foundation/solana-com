import PostsClientPage from "./client-page";
import { fetchFeaturedPost, fetchLatestPosts } from "@/lib/post-data";

export const revalidate = 300;

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
