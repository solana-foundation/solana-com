import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { reader } from "@/lib/reader";
import { Section } from "@/components/layout/section";
import { components } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { CallToAction } from "@/components/ui/call-to-action";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";
import { DocumentRenderer } from "@keystatic/core/renderer";
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

  const postUrl = `/news/${slug}`;

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

                <SocialShare title={String(post.title)} className="gap-3 mb-6" />

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
          // Get the body content - Keystatic returns { node: [...] }
          const bodyResult = await post.body();
          // Extract the document array from the node property
          const bodyDoc = (bodyResult as any)?.node?.children || [];

          if (cta) {
            return (
              <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
                <div className="flex gap-8 lg:gap-12 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="prose dark:prose-dark w-full max-w-none">
                      <DocumentRenderer
                        document={bodyDoc}
                        renderers={components}
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
                <DocumentRenderer
                  document={bodyDoc}
                  renderers={components}
                />
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
            body={await switchback.body()}
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

  let authorName: string | undefined;
  if (post.author) {
    const author = await reader.collections.authors.read(post.author);
    if (author) {
      authorName = String(author.name);
    }
  }

  const title = post.seo?.title || String(post.title);
  const description = post.seo?.description || undefined;

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
      type: "article" as const,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: post.seo?.twitter?.twitterTitle || title,
      description: post.seo?.twitter?.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    authors: authorName ? [{ name: authorName }] : undefined,
  };
}
