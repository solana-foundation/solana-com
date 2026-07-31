import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPosts, fetchLatestPosts } from "@/lib/post-data";
import {
  NEWS_SEO_DESCRIPTION,
  NEWS_SEO_TITLE,
  newsListingMetadata,
} from "@/lib/metadata";
import { getActiveCampaign } from "@/lib/news-campaign";
import { fetchNewsNavItemsWithPosts } from "@/lib/news-nav-data";
import { CHANGELOG_CATEGORY } from "@/lib/changelog";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPostCollectionJsonLd } from "@/lib/content-structured-data";

export const revalidate = 300;

const FEATURED_MASTHEAD_LIMIT = 5;
const LATEST_POSTS_LIMIT = 13;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return newsListingMetadata(locale);
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [featuredPosts, latestPosts, navItems] = await Promise.all([
    fetchFeaturedPosts({
      limit: FEATURED_MASTHEAD_LIMIT,
      excludeCategory: CHANGELOG_CATEGORY,
    }),
    fetchLatestPosts({
      limit: LATEST_POSTS_LIMIT,
      excludeCategory: CHANGELOG_CATEGORY,
      excludeTag: "featured",
    }),
    fetchNewsNavItemsWithPosts(),
  ]);
  const campaign = getActiveCampaign("news-front");
  const structuredDataPosts = Array.from(
    new Map(
      [...featuredPosts.posts, ...latestPosts.posts].map((post) => [
        post.id,
        post,
      ]),
    ).values(),
  );
  const structuredData = buildPostCollectionJsonLd({
    posts: structuredDataPosts,
    path: "/news",
    locale,
    title: NEWS_SEO_TITLE,
    description: NEWS_SEO_DESCRIPTION,
    listName: "Latest Solana news",
    aboutName: "Solana ecosystem news and developer updates",
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <PostsClientPage
        campaign={campaign}
        featuredPosts={featuredPosts.posts}
        latestPosts={latestPosts.posts}
        initialPageInfo={latestPosts.pageInfo}
        navItems={navItems}
      />
    </>
  );
}
