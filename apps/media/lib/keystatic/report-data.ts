import { format } from "date-fns";
import { reader } from "../reader";
import type { PageInfo, ReportItem } from "../report-types";

export interface LatestReportsParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
}

export interface LatestReportsResponse {
  reports: ReportItem[];
  pageInfo?: PageInfo;
}

export interface FeaturedReportResponse {
  report: ReportItem | null;
}

function isPublishedReport(
  report: Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
): report is NonNullable<
  Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
> {
  return Boolean(report && report.isReport && report.status === "published");
}

async function resolveCategoryNames(
  categories: Awaited<
    ReturnType<typeof reader.collections.switchbacks.read>
  >["categories"]
): Promise<string[]> {
  const categoryNames: string[] = [];

  if (!categories) {
    return categoryNames;
  }

  for (const item of categories) {
    const categorySlug = item?.category ? String(item.category) : null;
    if (!categorySlug) continue;

    const category = await reader.collections.categories.read(categorySlug);
    if (category?.name) {
      categoryNames.push(String(category.name));
    }
  }

  return categoryNames;
}

async function resolveTagNames(
  tags: Awaited<ReturnType<typeof reader.collections.switchbacks.read>>["tags"]
): Promise<string[]> {
  const tagNames: string[] = [];

  if (!tags) {
    return tagNames;
  }

  for (const item of tags) {
    const tagSlug = item?.tag ? String(item.tag) : null;
    if (!tagSlug) continue;

    const tag = await reader.collections.tags.read(tagSlug);
    if (tag?.name) {
      tagNames.push(String(tag.name));
    }
  }

  return tagNames;
}

async function matchesCategoryOrTag(
  report: NonNullable<
    Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
  >,
  normalizedCategory?: string,
  normalizedTag?: string
): Promise<boolean> {
  let matchesCategory = !normalizedCategory;
  if (normalizedCategory && report.categories) {
    for (const categoryRef of report.categories) {
      const categorySlug = categoryRef?.category
        ? String(categoryRef.category)
        : null;
      if (!categorySlug) continue;

      const category = await reader.collections.categories.read(categorySlug);
      const categoryName = String(category?.name || "").toLowerCase();

      if (
        categoryName === normalizedCategory ||
        categorySlug.toLowerCase() === normalizedCategory
      ) {
        matchesCategory = true;
        break;
      }
    }
  }

  let matchesTag = !normalizedTag;
  if (normalizedTag && report.tags) {
    for (const tagRef of report.tags) {
      const tagSlug = tagRef?.tag ? String(tagRef.tag) : null;
      if (!tagSlug) continue;

      const tag = await reader.collections.tags.read(tagSlug);
      const tagName = String(tag?.name || "").toLowerCase();

      if (
        tagName === normalizedTag ||
        tagSlug.toLowerCase() === normalizedTag
      ) {
        matchesTag = true;
        break;
      }
    }
  }

  return matchesCategory && matchesTag;
}

async function transformReport(
  slug: string,
  report: Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
): Promise<ReportItem | null> {
  if (!report) return null;

  const dateString =
    typeof report.date === "string" ? report.date : String(report.date || "");
  const date = dateString ? new Date(dateString) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  const [categories, tags] = await Promise.all([
    resolveCategoryNames(report.categories),
    resolveTagNames(report.tags),
  ]);

  return {
    id: slug,
    title: String(report.title),
    published: formattedDate,
    tags,
    categories,
    url: `/reports/${slug}`,
    description: report.description ? String(report.description) : "",
    heroImage: report.image?.src || null,
    eyebrow: report.eyebrow ? String(report.eyebrow) : null,
    headline: report.headline ? String(report.headline) : null,
    pdfUrl: report.pdfUrl ? String(report.pdfUrl) : null,
    cursor: slug,
  };
}

export const fetchLatestReports = async (
  params: LatestReportsParams = {}
): Promise<LatestReportsResponse> => {
  try {
    const allSlugs = await reader.collections.switchbacks.list();
    const limit = params.limit ?? 10;
    const normalizedCategory = params.category?.trim().toLowerCase();
    const normalizedTag = params.tag?.trim().toLowerCase();

    const reportsWithDates: Array<{
      slug: string;
      date: Date | null;
      report: NonNullable<
        Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
      >;
    }> = [];

    for (const slug of allSlugs) {
      try {
        const report = await reader.collections.switchbacks.read(slug);
        if (!isPublishedReport(report)) continue;

        const dateString =
          typeof report.date === "string"
            ? report.date
            : String(report.date || "");

        if (
          !(await matchesCategoryOrTag(
            report,
            normalizedCategory,
            normalizedTag
          ))
        ) {
          continue;
        }

        reportsWithDates.push({
          slug,
          date: dateString ? new Date(dateString) : null,
          report,
        });
      } catch (error) {
        console.error(`Failed to read report "${slug}":`, error);
      }
    }

    reportsWithDates.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = reportsWithDates.findIndex(
        (item) => item.slug === params.cursor
      );
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedReports = reportsWithDates.slice(
      startIndex,
      startIndex + limit
    );
    const reports: ReportItem[] = [];

    for (const item of paginatedReports) {
      const transformed = await transformReport(item.slug, item.report);
      if (transformed) {
        reports.push(transformed);
      }
    }

    return {
      reports,
      pageInfo: {
        hasNextPage: startIndex + limit < reportsWithDates.length,
        hasPreviousPage: startIndex > 0,
        startCursor: paginatedReports[0]?.slug ?? null,
        endCursor: paginatedReports[paginatedReports.length - 1]?.slug ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch latest reports from Keystatic:", error);
    return { reports: [] };
  }
};

export const fetchFeaturedReport =
  async (): Promise<FeaturedReportResponse> => {
    try {
      const allSlugs = await reader.collections.switchbacks.list();
      const featuredCandidates: Array<{
        slug: string;
        date: Date | null;
        report: NonNullable<
          Awaited<ReturnType<typeof reader.collections.switchbacks.read>>
        >;
      }> = [];

      for (const slug of allSlugs) {
        try {
          const report = await reader.collections.switchbacks.read(slug);
          if (!isPublishedReport(report) || !report.tags) continue;

          const isFeatured = report.tags.some(
            (tagItem) => tagItem?.tag && String(tagItem.tag) === "featured"
          );

          if (!isFeatured) continue;

          const dateString =
            typeof report.date === "string"
              ? report.date
              : String(report.date || "");

          featuredCandidates.push({
            slug,
            date: dateString ? new Date(dateString) : null,
            report,
          });
        } catch (error) {
          console.error(
            `Failed to read report "${slug}" in fetchFeaturedReport:`,
            error
          );
        }
      }

      featuredCandidates.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.getTime() - a.date.getTime();
      });

      if (featuredCandidates.length === 0) {
        return { report: null };
      }

      return {
        report: await transformReport(
          featuredCandidates[0].slug,
          featuredCandidates[0].report
        ),
      };
    } catch (error) {
      console.error("Failed to fetch featured report from Keystatic:", error);
      return { report: null };
    }
  };
