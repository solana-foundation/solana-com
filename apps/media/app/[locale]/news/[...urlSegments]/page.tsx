import React from "react";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";
import PostClientPage from "./client-page";
import type { Metadata } from "next";

export const revalidate = 300;
export const dynamicParams = true;

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}) {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join("/");

  let data;
  try {
    data = await client.queries.post({
      relativePath: `${filepath}.mdx`,
    });
  } catch (error) {
    notFound();
  }

  return <PostClientPage {...data} />;
}

export async function generateStaticParams() {
  try {
    let posts = await client.queries.postConnection();
    const allPosts = posts;

    if (!allPosts.data.postConnection.edges) {
      return [];
    }

    while (posts.data?.postConnection.pageInfo.hasNextPage) {
      posts = await client.queries.postConnection({
        after: posts.data.postConnection.pageInfo.endCursor,
      });

      if (!posts.data.postConnection.edges) {
        break;
      }

      allPosts.data.postConnection.edges.push(
        ...posts.data.postConnection.edges
      );
    }

    return (
      allPosts.data?.postConnection.edges.map((edge) => ({
        urlSegments: edge?.node?._sys.breadcrumbs,
      })) || []
    );
  } catch (error) {
    // During build, if the server isn't available, return empty array
    // This allows the build to complete even if static generation fails
    console.warn("Failed to generate static params for posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join("/");

  let post;
  try {
    const res = await client.queries.post({ relativePath: `${filepath}.mdx` });
    post = res.data.post;
  } catch (error) {
    // Fallback metadata if query fails during build
    return {
      title: "Post Not Found",
      description: "",
    };
  }

  const title = post.seo?.title || post.title;
  const description =
    (typeof post.seo?.description === "string" && post.seo.description) ||
    undefined;

  const ogImage =
    post.seo?.openGraph?.ogImage ||
    post.seo?.twitter?.twitterImage ||
    post.heroImage;

  const twitterImage = post.seo?.twitter?.twitterImage || ogImage;

  return {
    title,
    description,
    robots: {
      index: post.seo?.noIndex ? false : true,
      follow: post.seo?.noFollow ? false : true,
      googleBot: {
        index: post.seo?.noIndex ? false : true,
        follow: post.seo?.noFollow ? false : true,
      },
    },
    openGraph: {
      title: post.seo?.openGraph?.ogTitle || title,
      description: post.seo?.openGraph?.ogDescription || description,
      url: post.seo?.openGraph?.ogUrl || undefined,
      type: Array.isArray(post.seo?.openGraph?.ogType)
        ? post.seo.openGraph.ogType[0]
        : (post.seo?.openGraph?.ogType as any) || "article",
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: post.seo?.twitter?.twitterTitle || title,
      description: post.seo?.twitter?.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
  };
}
