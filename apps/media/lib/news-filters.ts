import { PostItem } from "./post-types";

export const CASE_STUDIES_FILTER_LABEL = "Case Studies";
export const CASE_STUDIES_FILTER_SLUG = "case-studies";

const CASE_STUDIES_TAG_VALUES = new Set([
  "case studies",
  CASE_STUDIES_FILTER_SLUG,
]);

function isCaseStudiesTag(tag: string): boolean {
  return CASE_STUDIES_TAG_VALUES.has(tag.trim().toLowerCase());
}

export function getNewsFilterOptions(posts: Array<PostItem | null>): string[] {
  const filterSet = new Set<string>();

  for (const post of posts) {
    for (const category of post?.categories ?? []) {
      if (category) {
        filterSet.add(category);
      }
    }

    if (post?.tags?.some(isCaseStudiesTag)) {
      filterSet.add(CASE_STUDIES_FILTER_LABEL);
    }
  }

  return Array.from(filterSet).sort((a, b) => a.localeCompare(b));
}

export function filterPostsByNewsFilter(
  posts: Array<PostItem | null>,
  selectedFilter: string | null,
): Array<PostItem | null> {
  if (!selectedFilter) {
    return posts;
  }

  return posts.filter((post) => {
    if (post?.categories?.includes(selectedFilter)) {
      return true;
    }

    return (
      selectedFilter === CASE_STUDIES_FILTER_LABEL &&
      post?.tags?.some(isCaseStudiesTag)
    );
  });
}

export function newsFilterToPath(filter: string | null): string {
  if (!filter) {
    return "/news";
  }

  return `/news/${newsFilterToSlug(filter)}`;
}

export function newsFilterToSlug(filter: string): string {
  return filter
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isCaseStudiesFilter(filter: string | null): boolean {
  return filter === CASE_STUDIES_FILTER_LABEL;
}
