import { RepokitFilter, RepokitTemplate } from "@/lib/generated/repokit";
import { useMemo } from "react";
import { useRepokitFilters } from "./use-repokit-filters";

/**
 * Get all the filters that contain keywords defined in the template's keywords.
 *
 * @param template
 */
export function useRepokitTemplateFilters({
  template,
}: {
  template: RepokitTemplate;
}): RepokitFilter[] {
  const filters = useRepokitFilters();

  return useMemo(
    () =>
      filters
        .filter((filter) => filter.keywords?.length)
        .reduce(
          (acc, curr) =>
            curr.keywords.some((keyword) =>
              template.keywords.includes(keyword.id),
            )
              ? [
                  ...acc,
                  {
                    ...curr,
                    keywords: curr.keywords.filter((keyword) =>
                      template.keywords.includes(keyword.id),
                    ),
                  },
                ]
              : acc,
          [] as RepokitFilter[],
        ),
    [filters, template],
  );
}
