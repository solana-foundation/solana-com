import { useMemo } from "react";
import { RepokitFilter, RepokitTemplate } from "@/lib/generated/repokit";
import { RepokitUrlState, useRepokitUrlState } from "./use-repokit-url-state";
import { filterTemplates } from "./filter-templates";
import { useRepokitFilters } from "./use-repokit-filters";
import { useRepokitTemplates } from "./use-repokit-templates";

export function useRepokitFilterState(): RepokitUrlState & {
  filters: RepokitFilter[];
  templates: RepokitTemplate[];
} {
  const filters = useRepokitFilters();
  const templates = useRepokitTemplates();
  const state = useRepokitUrlState();

  return {
    ...state,
    filters,
    templates: useMemo(
      () => filterTemplates({ ...state, templates }),
      [state, templates],
    ),
  };
}
