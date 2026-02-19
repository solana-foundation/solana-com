import { reader } from "../reader";
import { CategoryItem } from "../category-types";

export interface CategoryPostsResponse {
  category: CategoryItem | null;
}

/**
 * Fetch category by path from Keystatic
 */
export const fetchCategoryByPath = async (
  path: string
): Promise<CategoryPostsResponse> => {
  try {
    const category = await reader.collections.categories.read(path);

    if (!category) {
      return { category: null };
    }

    return {
      category: {
        id: path,
        name: String(category.name),
        slug: path,
      },
    };
  } catch (error) {
    console.error("Failed to fetch category by path from Keystatic:", error);
    return { category: null };
  }
};

/**
 * Fetch all categories from Keystatic
 */
export const fetchAllCategories = async (): Promise<CategoryItem[]> => {
  try {
    const slugs = await reader.collections.categories.list();
    const categories: CategoryItem[] = [];

    for (const slug of slugs) {
      const category = await reader.collections.categories.read(slug);
      if (category) {
        categories.push({
          id: slug,
          name: String(category.name),
          slug,
        });
      }
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch all categories from Keystatic:", error);
    return [];
  }
};
