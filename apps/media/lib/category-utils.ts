import {
  CategoryConnectionEdges,
  CategoryQuery,
} from "@/tina/__generated__/types";
import { CategoryItem } from "./category-types";

// Helper function to transform category data
export function transformCategory(
  categoryData?: Partial<
    CategoryConnectionEdges["node"] | CategoryQuery["category"]
  >
): CategoryItem | null {
  if (!categoryData) return null;

  return {
    id: categoryData.id,
    name: categoryData.name,
  };
}
