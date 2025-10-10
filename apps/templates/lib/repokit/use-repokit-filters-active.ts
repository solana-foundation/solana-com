import { RepokitFilter, RepokitTemplate } from "@/lib/generated/repokit/types";
import { useRepokitFilters } from "@/lib/repokit/use-repokit-filters";
import { useMemo } from "react";

export function useRepokitFiltersActive({
  template: { keywords },
}: {
  template: RepokitTemplate;
}) {
  const filters = useRepokitFilters();

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
    }, [] as RepokitFilter[]);
  }, [filters, keywords]);
}
