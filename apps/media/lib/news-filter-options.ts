import "server-only";

import { fetchAllCategories } from "@/lib/category-data";
import { fetchLatestPosts } from "@/lib/post-data";
import {
  CASE_STUDIES_FILTER_LABEL,
  CASE_STUDIES_FILTER_SLUG,
} from "@/lib/news-filters";

export async function fetchNewsFilterOptions(): Promise<string[]> {
  const categories = await fetchAllCategories();
  const options: string[] = [];
  const caseStudies = await fetchLatestPosts({
    limit: 1,
    tag: CASE_STUDIES_FILTER_SLUG,
  });

  if (caseStudies.posts.length > 0) {
    options.push(CASE_STUDIES_FILTER_LABEL);
  }

  for (const category of categories) {
    const latestPosts = await fetchLatestPosts({
      limit: 1,
      category: category.name,
    });

    if (latestPosts.posts.length > 0) {
      options.push(category.name);
    }
  }

  return options;
}
