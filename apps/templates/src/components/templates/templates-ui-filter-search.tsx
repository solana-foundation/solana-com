"use client";

import { Input } from "@workspace/ui";
import { useTemplateFilterState } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import { useEffect, useState } from "react";

export function TemplatesUiFilterSearch() {
  const { filter, setFilter } = useTemplateFilterState();
  const [localValue, setLocalValue] = useState(filter);
  const t = useTemplatesTranslations();

  // Sync local value with URL state
  useEffect(() => {
    setLocalValue(filter);
  }, [filter]);

  // Update URL state when local value changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== filter) {
        setFilter(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, filter, setFilter]);

  return (
    <Input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      aria-label={t("actions.search_label")}
      placeholder={t("filter.search_placeholder")}
      className="h-11 rounded-none border-white/[0.16] !bg-white/[0.03] px-3 text-sm text-nd-high-em-text placeholder:text-nd-mid-em-text/60 focus-visible:border-white/30 focus-visible:ring-1 focus-visible:ring-white/20"
    />
  );
}
