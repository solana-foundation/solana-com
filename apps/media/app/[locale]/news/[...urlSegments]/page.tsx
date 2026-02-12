import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { reader } from "@/lib/reader";
import { Section } from "@/components/layout/section";
import { mdxComponents, preprocessMDX } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { CallToAction } from "@/components/ui/call-to-action";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";
import { MDXRemote } from "next-mdx-remote/rsc";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 300;
export const dynamicParams = true;

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.urlSegments.join("/");

  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  // Resolve author
  let author = null;
  if (post.author) {
    author = await reader.collections.authors.read(post.author);
  }

  // Resolve CTA
  let cta = null;
  if (post.cta) {
    cta = await reader.collections.ctas.read(post.cta);
  }

  // Resolve switchback
  let switchback = null;
  if (post.switchback) {
    switchback = await reader.collections.switchbacks.read(post.switchback);
  }

  const date = post.date ? new Date(post.date) : null;
  let formattedDate = "";
  if (date && !isNaN(date.getTime())) {
    formattedDate = format(date, "d MMMM yyyy");
  }

  return (
    <ErrorBoundary>
      <Section>
        <div className="relative w-full py-12 px-4 md:px-6 lg:px-8 pt-8 md:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
              <div className="flex-1 lg:max-w-xl">
                <h1 className="w-full mb-6 text-5xl md:text-6xl font-bold tracking-tight text-left">
                  {String(post.title)}
                </h1>

                <SocialShare
                  title={String(post.title)}
                  className="gap-3 mb-6"
                />

                <p className="text-base text-gray-400 mb-8 lg:mb-0">
                  <span>{formattedDate}</span>
                  {author && (
                    <>
                      <span>, by </span>
                      <span>{String(author.name)}</span>
                    </>
                  )}
                </p>
              </div>

              {post.heroImage && (
                <div className="flex-1 lg:max-w-md mt-8 lg:mt-0">
                  <div className="relative">
                    <Image
                      priority={true}
                      src={post.heroImage}
                      alt={String(post.title)}
                      width={400}
                      height={400}
                      className="relative z-10 block w-full h-auto opacity-100"
                      style={{ maxWidth: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {await (async () => {
          const rawMdxSource = await post.body();
          const mdxSource = preprocessMDX(rawMdxSource);

          if (cta) {
            return (
              <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
                <div className="flex gap-8 lg:gap-12 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="prose dark:prose-dark w-full max-w-none">
                      <MDXRemote
                        source={mdxSource}
                        components={mdxComponents}
                      />
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-50 lg:flex-shrink-0 relative">
                    <div className="sticky top-24">
                      <CallToAction
                        eyebrow={cta.eyebrow || undefined}
                        headline={cta.headline || undefined}
                        description={cta.description || undefined}
                        button={{
                          label: cta.button?.label || "",
                          url: cta.button?.url || "",
                        }}
                        className={cta.className || undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
              <div className="prose dark:prose-dark w-full max-w-none">
                <MDXRemote source={mdxSource} components={mdxComponents} />
              </div>
            </div>
          );
        })()}
      </Section>
      {switchback && (
        <Section className="max-w-6xl mx-auto">
          <Switchback
            title={String(switchback.title)}
            image={{
              src: switchback.image?.src ?? "",
              alt: switchback.image?.alt ?? "",
            }}
            eyebrow={switchback.eyebrow || undefined}
            body={
              <MDXRemote
                source={preprocessMDX(await switchback.body())}
                components={mdxComponents}
              />
            }
            buttons={switchback.buttons?.map((button) => ({
              label: button?.label || "",
              url: button?.url || "",
            }))}
          />
        </Section>
      )}
    </ErrorBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.posts.list();
    return slugs.map((slug) => ({
      urlSegments: slug.split("/"),
    }));
  } catch (error) {
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
  const slug = resolvedParams.urlSegments.join("/");

  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "",
    };
  }

  // Get author name for meta
  let authorName: string | undefined;
  if (post.author) {
    const author = await reader.collections.authors.read(post.author);
    if (author) {
      authorName = String(author.name);
    }
  }

  // Derive SEO from post title, description, and hero image
  const title = String(post.title);

  // Description is a plain text field, not a content document, so access it directly
  const description = post.description
    ? String(post.description).trim()
    : undefined;

  // Use hero image for OG and Twitter images
  const ogImage = post.heroImage || config.siteMetadata.socialShare;

  // Build canonical URL
  const canonicalUrl = `${config.siteUrl}/news/${slug}`;

  return {
    title,
    description: description || undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      type: "article",
      siteName: config.siteMetadata.title,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime: post.date || undefined,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
      creator: config.social.twitter.name
        ? `@${config.social.twitter.name}`
        : undefined,
    },
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
