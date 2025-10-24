import { TemplateFilter, Template } from "../types/templates";
import { useMemo } from "react";
import { useFilters } from "./use-filters";

/**
 * Get all the filters that contain keywords defined in the template's keywords.
 *
 * @param template
 */
export function useTemplateFilters({
  template,
}: {
  template: Template;
}): TemplateFilter[] {
  const filters = useFilters();

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
          [] as TemplateFilter[],
        ),
    [filters, template],
  );
}
