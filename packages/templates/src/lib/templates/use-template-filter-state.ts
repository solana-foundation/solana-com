import { useMemo } from "react";
import { TemplateFilter, Template } from "../types/templates";
import {
  TemplateUrlState,
  useTemplateUrlState,
} from "./use-template-url-state";
import { filterTemplates } from "./filter-templates";
import { useFilters } from "./use-filters";
import { useTemplates } from "./use-templates";

export function useTemplateFilterState(): TemplateUrlState & {
  filters: TemplateFilter[];
  templates: Template[];
} {
  const filters = useFilters();
  const templates = useTemplates();
  const state = useTemplateUrlState();

  return {
    ...state,
    filters,
    templates: useMemo(
      () => filterTemplates({ ...state, templates }),
      [state, templates],
    ),
  };
}
