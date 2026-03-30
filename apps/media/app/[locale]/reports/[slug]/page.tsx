import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowUpRight, ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import ErrorBoundary from "@/components/error-boundary";
import { ReportFormModal } from "@/components/report/report-form-modal";
import { Button } from "@/components/ui/button";
import { mdxComponents, preprocessMDX } from "@/components/mdx-components";
import { reader } from "@/lib/reader";
import { reportMetadata } from "@/lib/metadata";
import { formatPublishedAt } from "@/lib/keystatic/publishing";
import { isPublishedReport } from "@/lib/keystatic/report-status";

export const revalidate = 300;
export const dynamicParams = true;

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const report = await reader.collections.switchbacks.read(slug);

  if (!isPublishedReport(report)) {
    notFound();
  }

  const formattedDate = formatPublishedAt(report.publishedAt, "long");
  const headline = String(report.headline || report.title);
  const buttons =
    report.buttons?.filter((button) => button?.label && button?.url) || [];
  const categories = report.categories
    ? (
        await Promise.all(
          report.categories.map(async (categoryRef) => {
            if (!categoryRef?.category) {
              return null;
            }

            const category = await reader.collections.categories.read(
              String(categoryRef.category),
            );

            return category?.name ? String(category.name) : null;
          }),
        )
      ).filter((categoryName): categoryName is string => Boolean(categoryName))
    : [];

  return (
    <ErrorBoundary>
      <article className="relative min-h-screen bg-background text-white">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(153,69,255,0.1),transparent_60%),radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(20,241,149,0.06),transparent_50%)]" />

        {/* Hero section */}
        <div className="relative border-b border-[rgba(236,228,253,0.12)]">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10">
            <div className="flex flex-col gap-10 pb-10 pt-8 lg:flex-row lg:items-center lg:gap-16 lg:pb-16 lg:pt-12">
              {/* Text content */}
              <div className="flex flex-1 flex-col gap-6">
                <Link
                  href="/reports"
                  className="inline-flex w-fit items-center gap-2 text-sm text-[#ABABBA] transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-4" />
                  Back to Reports
                </Link>

                <div className="flex flex-col gap-4">
                  {report.eyebrow && (
                    <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#CA9FF5]">
                      {String(report.eyebrow)}
                    </span>
                  )}
                  <h1 className="max-w-3xl text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]">
                    {headline}
                  </h1>
                  {report.description && (
                    <p className="max-w-2xl text-base leading-7 text-[#ABABBA] md:text-lg">
                      {String(report.description)}
                    </p>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#ABABBA]">
                  {formattedDate && (
                    <span className="uppercase tracking-[0.15em]">
                      {formattedDate}
                    </span>
                  )}
                  {formattedDate && categories.length > 0 && (
                    <span className="text-[rgba(236,228,253,0.2)]">/</span>
                  )}
                  {categories.map((category) => (
                    <span key={category}>
                      <span className="rounded-full border border-[rgba(236,228,253,0.12)] px-3 py-1 text-[11px] capitalize text-[#CA9FF5]">
                        {category}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Body content */}
                <div className="prose prose-lg max-w-2xl prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-a:text-[#55E9AB] prose-a:no-underline hover:prose-a:underline prose-strong:text-white">
                  <MDXRemote
                    source={preprocessMDX(await report.body())}
                    components={mdxComponents}
                    options={{
                      mdxOptions: { remarkPlugins: [remarkGfm] },
                    }}
                  />
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {report.hubspotForm?.portalId &&
                    report.hubspotForm?.formId && (
                      <ReportFormModal
                        buttonLabel={
                          report.hubspotForm.buttonLabel ||
                          "Get the full report"
                        }
                        portalId={String(report.hubspotForm.portalId)}
                        formId={String(report.hubspotForm.formId)}
                        title={headline}
                      />
                    )}

                  {report.pdfUrl && (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
                    >
                      <a
                        href={String(report.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="size-4" />
                        Download Report
                      </a>
                    </Button>
                  )}

                  {buttons.map((button) => (
                    <Button
                      key={`${slug}-${button.label}-${button.url}`}
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full border-[rgba(236,228,253,0.12)] bg-transparent px-6 text-sm font-medium text-white hover:border-[rgba(236,228,253,0.32)] hover:bg-white/5 hover:text-white"
                    >
                      <a
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {button.label}
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Report image — right-aligned */}
              {report.image?.src && (
                <div className="min-w-[280px] shrink-0 self-start lg:max-w-[480px] xl:max-w-[520px]">
                  <Image
                    src={report.image.src}
                    alt={report.image.alt || headline}
                    width={1062}
                    height={1500}
                    priority
                    sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 100vw"
                    className="h-auto w-full rounded-2xl border border-[rgba(236,228,253,0.12)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </ErrorBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.switchbacks.list();
    const publishedSlugs: string[] = [];

    for (const slug of slugs) {
      const report = await reader.collections.switchbacks.read(slug);
      if (isPublishedReport(report)) {
        publishedSlugs.push(slug);
      }
    }

    return publishedSlugs.map((slug) => ({ slug }));
  } catch (error) {
    console.warn("Failed to generate static params for reports:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return reportMetadata(slug);
}
