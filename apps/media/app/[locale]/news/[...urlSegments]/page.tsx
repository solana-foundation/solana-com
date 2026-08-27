import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { reader } from "@/lib/reader";
import { Section } from "@/components/layout/section";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowToBottom as ArrowDownToLine } from "@boxicons/react/ArrowToBottom";
import { mdxComponents, preprocessMDX } from "@/components/mdx-components";
import ErrorBoundary from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/ui/call-to-action";
import { TableOfContents } from "@/components/ui/table-of-contents";
import Switchback from "@/components/ui/switchback";
import { SocialShare } from "@/components/ui/social-share";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { newsPostMetadata } from "@/lib/metadata";
import { fetchPublishedPostBySlug } from "@/lib/post-data";
import { extractHeadings } from "@/lib/extract-headings";
import { formatPublishedAt } from "@/lib/keystatic/publishing";
import { isPublishedReport } from "@/lib/keystatic/report-status";
import { isChangelogCategory } from "@/lib/changelog";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/content-structured-data";
import { toPlainText } from "@/lib/structured-data";
import { ReportFormModal } from "@/components/report/report-form-modal";

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
  let isChangelogPost = false;
  if (post.categories) {
    for (const catItem of post.categories) {
      const categorySlug =
        typeof catItem === "string"
          ? catItem
          : catItem && typeof catItem === "object" && "category" in catItem
            ? catItem.category
            : null;

      if (!categorySlug) continue;

      if (isChangelogCategory(categorySlug)) {
        isChangelogPost = true;
      }

      const catData = await reader.collections.categories.read(categorySlug);
      if (catData?.name) {
        const resolvedCategoryName = String(catData.name);
        categoryName ??= resolvedCategoryName;

        if (isChangelogCategory(resolvedCategoryName)) {
          isChangelogPost = true;
        }
      }
    }
  }

  const tagNames = post.tags
    ? (
        await Promise.all(
          post.tags.map(async (tagItem: unknown) => {
            const tagSlug =
              typeof tagItem === "string"
                ? tagItem
                : tagItem && typeof tagItem === "object" && "tag" in tagItem
                  ? tagItem.tag
                  : null;

            if (!tagSlug) return null;
            const tagData = await reader.collections.tags.read(tagSlug);
            return tagData?.name ? String(tagData.name) : null;
          }),
        )
      ).filter((tagName): tagName is string => Boolean(tagName))
    : [];

  const backLink = isChangelogPost
    ? { href: "/changelog" as const, label: "Back to Changelog" }
    : { href: "/news" as const, label: "Back to News" };

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

  // Reports use their own collection, so post promotions must resolve them
  // separately from reusable switchbacks.
  let report = null;
  if (post.report) {
    const resolvedReport = await reader.collections.reports.read(post.report);
    report = isPublishedReport(resolvedReport) ? resolvedReport : null;
  }

  const formattedDate = formatPublishedAt(post.publishedAt, "long");
  const title = String(post.title);
  const structuredData = buildArticleJsonLd({
    slug,
    locale: resolvedParams.locale,
    title,
    description: post.description ? toPlainText(post.description) : undefined,
    image: post.heroImage,
    publishedAt: post.publishedAt,
    authorName: author?.name ? String(author.name) : undefined,
    category: categoryName,
    tags: tagNames,
    backPath: backLink.href,
    backLabel: backLink.label.replace(/^Back to /, ""),
  });

  return (
    <ErrorBoundary>
      <JsonLd data={structuredData} />
      <Section>
        <div className="relative w-full py-12 pt-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

          <div className="max-w-[720px] mx-auto w-full px-4 md:px-6 lg:px-8">
            <div className="mb-6">
              <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
                <Link href={backLink.href}>
                  <ArrowLeft className="size-4" />
                  <span>{backLink.label}</span>
                </Link>
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {categoryName && (
                <span className="text-primary font-semibold uppercase tracking-wider text-xs">
                  {categoryName}
                </span>
              )}
              <span className="text-gray-400">{formattedDate}</span>
              {author && (
                <span className="flex items-center gap-2 text-gray-400">
                  <span>by</span>
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      alt={String(author.name)}
                      width={12}
                      height={12}
                    />
                  )}
                  <span>{String(author.name)}</span>
                </span>
              )}
            </div>

            <h1 className="w-full mb-10 text-4xl md:text-5xl font-bold tracking-tight text-left">
              {title}
            </h1>

            {post.heroImage && (
              <div className="rounded-lg overflow-hidden">
                <Image
                  priority={true}
                  src={post.heroImage}
                  alt={title}
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
          const headings = extractHeadings(rawMdxSource);

          return (
            <div className="relative mx-auto mt-12 max-w-[720px] px-4 md:px-6 lg:px-8">
              <article className="prose prose-lg dark:prose-dark w-full max-w-none">
                <MDXRemote
                  source={mdxSource}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeSlug],
                    },
                  }}
                />
              </article>

              <SocialShare title={title} variant="card" />

              <aside className="hidden xl:block absolute top-0 bottom-0 left-full ml-12 w-56">
                <div className="sticky top-24 space-y-8">
                  <TableOfContents headings={headings} />

                  {cta && (
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
                  )}
                </div>
              </aside>
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
            buttons={switchback.buttons?.map(
              (button: { label?: string; url?: string } | undefined) => ({
                label: button?.label || "",
                url: button?.url || "",
              }),
            )}
          />
        </Section>
      )}
      {report && (
        <Section>
          <Switchback
            title={String(report.headline || report.title)}
            image={{
              src: report.image?.src ?? "",
              alt: report.image?.alt ?? "",
            }}
            eyebrow={report.eyebrow || undefined}
            body={
              <MDXRemote
                source={preprocessMDX(await report.body())}
                components={mdxComponents}
                options={{
                  mdxOptions: { remarkPlugins: [remarkGfm] },
                }}
              />
            }
            buttons={report.buttons?.flatMap(
              (button: { label?: string; url?: string } | undefined) =>
                button?.label && button.url
                  ? [{ label: button.label, url: button.url }]
                  : [],
            )}
            actions={
              <>
                {report.hubspotForm?.portalId && report.hubspotForm?.formId && (
                  <ReportFormModal
                    buttonLabel={
                      report.hubspotForm.buttonLabel || "Get the full report"
                    }
                    portalId={String(report.hubspotForm.portalId)}
                    formId={String(report.hubspotForm.formId)}
                    formUrl={
                      report.hubspotForm.formUrl
                        ? String(report.hubspotForm.formUrl)
                        : undefined
                    }
                    title={String(report.headline || report.title)}
                  />
                )}
                {report.pdfUrl && (
                  <Button asChild size="lg">
                    <a
                      href={String(report.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowDownToLine className="size-4" />
                      Download Report
                    </a>
                  </Button>
                )}
              </>
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
      const post = await fetchPublishedPostBySlug(slug);
      if (post) {
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
  return newsPostMetadata(slug, resolvedParams.locale);
}
