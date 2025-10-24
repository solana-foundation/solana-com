import { createFilters, filters, TemplateFilter } from "../types/templates";
import { useTemplatesTranslations } from "../use-translations";

export function useFilters(): TemplateFilter[] {
  const t = useTemplatesTranslations();

  try {
    return createFilters(t);
  } catch {
    // Fallback to static filters if translations fail
    return filters;
  }
}
