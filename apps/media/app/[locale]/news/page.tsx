import type { Metadata } from "next";
import PostsClientPage from "./client-page";
import { fetchFeaturedPost, fetchLatestPosts } from "@/lib/post-data";
import { config } from "@/lib/config";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `${config.publicUrl}/news`;
  const title = "Solana News";
  const description =
    "Latest news and updates from the Solana ecosystem. Breaking coverage on DeFi, NFTs, developer updates, and Web3 innovation.";

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
