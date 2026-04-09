import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { reader } from "@/lib/reader";
import { Section } from "@/components/layout/section";
import { mdxComponents, preprocessMDX } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { CallToAction } from "@/components/ui/call-to-action";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { newsPostMetadata } from "@/lib/metadata";
import { fetchPublishedPostBySlug } from "@/lib/post-data";
import { isPublishedPost } from "@/lib/keystatic/post-status";
import { formatPublishedAt } from "@/lib/keystatic/publishing";
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

  const post = await fetchPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Resolve author
  let author = null;
  if (post.author) {
    author = await reader.collections.authors.read(post.author);
  }

  // Resolve category
  let categoryName: string | null = null;
  if (post.categories) {
    for (const catItem of post.categories) {
      if (catItem && typeof catItem === "object" && "category" in catItem) {
        if (catItem.category) {
          const catData = await reader.collections.categories.read(
            catItem.category,
          );
          if (catData?.name) {
            categoryName = String(catData.name);
            break;
          }
        }
      }
    }
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

  const formattedDate = formatPublishedAt(post.publishedAt, "long");

  return (
    <ErrorBoundary>
      <Section>
        <div className="relative w-full py-12 pt-8 md:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

          <div className="max-w-[720px] mx-auto w-full px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {categoryName && (
                <span className="text-primary font-semibold uppercase tracking-wider text-xs">
                  {categoryName}
                </span>
              )}
              <span className="text-gray-400">{formattedDate}</span>
              {author && (
                <span className="text-gray-400">by {String(author.name)}</span>
              )}
            </div>

            <h1 className="w-full mb-10 text-4xl md:text-5xl font-bold tracking-tight text-left">
              {String(post.title)}
            </h1>

            {post.heroImage && (
              <div className="rounded-lg overflow-hidden">
                <Image
                  priority={true}
                  src={post.heroImage}
                  alt={String(post.title)}
                  width={720}
                  height={400}
                  className="w-full h-auto"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            )}
          </div>
        </div>

        {await (async () => {
          const rawMdxSource = await post.body();
          const mdxSource = preprocessMDX(rawMdxSource);

          if (cta) {
            return (
              <div className="max-w-5xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
                  <div className="min-w-0 lg:flex-1 max-w-[720px]">
                    <article className="prose prose-lg dark:prose-dark w-full max-w-none">
                      <MDXRemote
                        source={mdxSource}
                        components={mdxComponents}
                        options={{
                          mdxOptions: { remarkPlugins: [remarkGfm] },
                        }}
                      />
                    </article>

                    <SocialShare
                      title={String(post.title)}
                      className="mt-12 pt-8 border-t border-white/10 gap-3"
                    />
                  </div>

                  <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:self-stretch">
                    <CallToAction
                      eyebrow={cta.eyebrow || undefined}
                      headline={cta.headline || undefined}
                      description={cta.description || undefined}
                      button={{
                        label: cta.button?.label || "",
                        url: cta.button?.url || "",
                      }}
                      className={["sticky top-24", cta.className]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  </aside>
                </div>
              </div>
            );
          }

          return (
            <div className="max-w-[720px] mx-auto mt-12 px-4 md:px-6 lg:px-8">
              <article className="prose prose-lg dark:prose-dark w-full max-w-none">
                <MDXRemote
                  source={mdxSource}
                  components={mdxComponents}
                  options={{
                    mdxOptions: { remarkPlugins: [remarkGfm] },
                  }}
                />
              </article>

              <SocialShare
                title={String(post.title)}
                className="mt-12 pt-8 border-t border-white/10 gap-3"
              />
            </div>
          );
        })()}
      </Section>
      {switchback && (
        <Section>
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
                options={{
                  mdxOptions: { remarkPlugins: [remarkGfm] },
                }}
              />
            }
            buttons={switchback.buttons?.map((button) => ({
              label: button?.label || "",
              url: button?.url || "",
            }))}
            isReport={switchback.isReport || undefined}
            hubspotForm={
              switchback.hubspotForm?.portalId && switchback.hubspotForm?.formId
                ? {
                    buttonLabel:
                      switchback.hubspotForm.buttonLabel ||
                      "Get the full report",
                    portalId: String(switchback.hubspotForm.portalId),
                    formId: String(switchback.hubspotForm.formId),
                  }
                : undefined
            }
            pdfUrl={switchback.pdfUrl ? String(switchback.pdfUrl) : undefined}
            headline={switchback.headline || undefined}
            description={
              switchback.description
                ? String(switchback.description)
                : undefined
            }
          />
        </Section>
      )}
    </ErrorBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.posts.list();
    const publishedSlugs: string[] = [];

    for (const slug of slugs) {
      const post = await reader.collections.posts.read(slug);
      if (isPublishedPost(post)) {
        publishedSlugs.push(slug);
      }
    }

    return publishedSlugs.map((slug) => ({
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
  return newsPostMetadata(slug);
}
