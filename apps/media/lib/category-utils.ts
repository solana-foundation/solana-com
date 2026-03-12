import { CategoryItem } from "./category-types";

// Type for category data from Keystatic
interface CategoryData {
  slug: string;
  name: string;
}

// Helper function to transform category data
export function transformCategory(
  categoryData?: CategoryData | null
): CategoryItem | null {
  if (!categoryData) return null;

  return {
    id: categoryData.slug,
    name: String(categoryData.name),
  };
}
