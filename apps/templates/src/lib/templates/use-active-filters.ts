import { TemplateFilter, Template } from "../types/templates";
import { useFilters } from "./use-filters";
import { useMemo } from "react";

export function useActiveFilters({
  template: { keywords },
}: {
  template: Template;
}) {
  const filters = useFilters();

  return useMemo(() => {
    return filters.reduce((acc, filter) => {
      if (!filter.keywords) {
        return acc;
      }
      if (filter.keywords.some((keyword) => keywords.includes(keyword.id))) {
        return [
          ...acc,
          {
            ...filter,
            keywords: filter.keywords.filter((keyword) =>
              keywords.includes(keyword.id),
            ),
          },
        ];
      }
      return acc;
    }, [] as TemplateFilter[]);
  }, [filters, keywords]);
}
