import client from "@/tina/__generated__/client";
import { transformCategory } from "./category-utils";
import { CategoryItem } from "./category-types";

export interface CategoryPostsResponse {
  category: CategoryItem | null;
}

/**
 * Fetch category posts from TinaCMS
 */
export const fetchCategoryByPath = async (
  path: string
): Promise<CategoryPostsResponse> => {
  try {
    const response = await client.queries.category({
      relativePath: `${path}.mdx`,
    });

    if (!response.data.category) {
      return { category: null };
    }

    const category = transformCategory(response.data.category);

    return {
      category,
    };
  } catch (error) {
    console.error("Failed to fetch category by path from TinaCMS:", error);
    return { category: null };
  }
};
