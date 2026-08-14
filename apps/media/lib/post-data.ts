// Re-export from Keystatic implementation
export {
  fetchLatestPosts,
  fetchFeaturedPost,
  fetchFeaturedPosts,
  fetchPublishedPostBySlug,
  readPostBySlug,
  type LatestPostsParams,
  type LatestPostsResponse,
  type FeaturedPostResponse,
  type FeaturedPostsParams,
  type FeaturedPostsResponse,
} from "./keystatic/post-data";
