import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Download, ArrowUpRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import ErrorBoundary from "@/components/error-boundary";
import { ReportFormModal } from "@/components/report/report-form-modal";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { mdxComponents, preprocessMDX } from "@/components/mdx-components";
import { reader } from "@/lib/reader";
import { reportMetadata } from "@/lib/metadata";

export const revalidate = 300;
export const dynamicParams = true;

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const report = await reader.collections.switchbacks.read(slug);

  if (!report || !report.isReport || report.status !== "published") {
    notFound();
  }

  const date = report.date ? new Date(report.date) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "d MMMM yyyy") : "";
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
              String(categoryRef.category)
            );

            return category?.name ? String(category.name) : null;
          })
        )
      ).filter((categoryName): categoryName is string => Boolean(categoryName))
    : [];

  return (
    <ErrorBoundary>
      <Section>
        <div className="relative overflow-hidden bg-[#07101d] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(82,158,255,0.32),transparent_55%),radial-gradient(85%_85%_at_100%_0%,rgba(25,237,152,0.16),transparent_60%),radial-gradient(75%_75%_at_50%_100%,rgba(153,69,255,0.12),transparent_75%)]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-6 md:py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="mb-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-fit px-0 text-white/70 hover:bg-transparent hover:text-white"
                  >
                    <Link href="/reports">Back to Reports</Link>
                  </Button>
                </div>
                {report.eyebrow && (
                  <span className="text-xs uppercase tracking-[0.35em] text-sky-300/80">
                    {String(report.eyebrow)}
                  </span>
                )}
                <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] md:text-7xl">
                  {headline}
                </h1>
                {report.description && (
                  <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                    {String(report.description)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm uppercase tracking-[0.22em] text-white/60">
                {formattedDate && <span>{formattedDate}</span>}
                {categories.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>

              <div className="prose prose-invert max-w-2xl text-white/86 prose-headings:text-white prose-p:text-white/78 prose-strong:text-white prose-a:text-sky-300">
                <MDXRemote
                  source={preprocessMDX(await report.body())}
                  components={mdxComponents}
                  options={{
                    mdxOptions: { remarkPlugins: [remarkGfm] },
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {report.hubspotForm?.formUrl && (
                  <ReportFormModal
                    buttonLabel={
                      report.hubspotForm.buttonLabel || "Get the full report"
                    }
                    formUrl={String(report.hubspotForm.formUrl)}
                    title={headline}
                  />
                )}

                {report.pdfUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-6 text-sm uppercase tracking-[0.25em]"
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
                    className="rounded-full border-white/20 bg-white/5 px-6 text-sm uppercase tracking-[0.25em] text-white hover:bg-white/10 hover:text-white"
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

            {report.image?.src && (
              <div className="flex flex-1 justify-end">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)] lg:max-w-[520px]">
                  <Image
                    src={report.image.src}
                    alt={report.image.alt || headline}
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await reader.collections.switchbacks.list();
    const publishedSlugs: string[] = [];

    for (const slug of slugs) {
      const report = await reader.collections.switchbacks.read(slug);
      if (report?.isReport && report.status === "published") {
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
