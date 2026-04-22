import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, ArrowLeft } from "lucide-react";
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
      <article className="relative min-h-screen bg-black text-white text-left">
        {/* Hero section */}
        <div className="relative mx-auto w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="pt-8 md:pt-10 xl:pt-12">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 text-sm tracking-[-0.14px] text-white opacity-[0.64] transition-opacity hover:opacity-100"
            >
              <ArrowLeft className="size-4" />
              Back to Reports
            </Link>
          </div>
          <div className="flex flex-col gap-10 pb-[64px] pt-8 md:pb-[112px] md:pt-10 lg:flex-row lg:items-start lg:gap-14 xl:pb-[160px] xl:pt-12">
            {/* Text content */}
            <div className="flex flex-1 flex-col">
              {report.eyebrow && (
                <p className="m-0 mb-4 md:mb-6 font-medium text-base md:text-lg tracking-[-0.16px] md:tracking-[-0.18px] text-white opacity-[0.64]">
                  {String(report.eyebrow)}
                </p>
              )}
              <h1 className="m-0 max-w-3xl font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
                {headline}
              </h1>
              {report.description && (
                <p className="max-w-xl text-lg md:text-2xl mt-[12px] xl:mt-[24px] mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33] text-white opacity-[0.64]">
                  {String(report.description)}
                </p>
              )}

              {/* Meta row */}
              {(formattedDate || categories.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 mt-8 md:mt-10">
                  {formattedDate && (
                    <span className="text-[13px] font-medium tracking-[-0.13px] text-white opacity-[0.64]">
                      {formattedDate}
                    </span>
                  )}
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] capitalize tracking-[-0.11px] text-white/80"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Body content */}
              <div className="prose prose-lg max-w-xl mt-8 md:mt-10 prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-p:text-white/[0.64] prose-p:tracking-[-0.18px] prose-p:leading-[1.5] prose-a:text-[#14F195] prose-a:no-underline hover:prose-a:underline prose-strong:text-white">
                <MDXRemote
                  source={preprocessMDX(await report.body())}
                  components={mdxComponents}
                  options={{
                    mdxOptions: { remarkPlugins: [remarkGfm] },
                  }}
                />
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mt-8 md:mt-10">
                {report.hubspotForm?.portalId && report.hubspotForm?.formId && (
                  <ReportFormModal
                    buttonLabel={
                      report.hubspotForm.buttonLabel || "Get the full report"
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
                    className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                  >
                    <a
                      href={String(report.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowDownToLine
                        aria-hidden
                        className="-ml-2 p-1 !size-6 bg-black text-white rounded-full"
                        strokeWidth={3}
                      />
                      Download Report
                    </a>
                  </Button>
                )}

                {buttons.map((button) => (
                  <Button
                    key={`${slug}-${button.label}-${button.url}`}
                    asChild
                    size="lg"
                    className="rounded-full text-base md:text-lg px-5 bg-white/10 text-white hover:!bg-white/15 tracking-[-0.16px] md:tracking-[-0.18px] backdrop-blur-sm"
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
              <div className="shrink-0 grow-0 self-start lg:sticky lg:top-10">
                <div className="relative aspect-[1062/1500] w-[200px] md:w-[280px] xl:w-[360px] overflow-hidden rounded-md">
                  <Image
                    src={report.image.src}
                    alt={report.image.alt || headline}
                    fill
                    priority
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 280px, 200px"
                    className="object-cover"
                    quality={100}
                  />
                </div>
              </div>
            )}
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
