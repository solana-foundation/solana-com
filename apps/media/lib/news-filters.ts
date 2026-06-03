import { PostItem } from "./post-types";

export const CASE_STUDIES_FILTER_LABEL = "Case Studies";

const CASE_STUDIES_TAG_VALUES = new Set(["case studies", "case-studies"]);

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
