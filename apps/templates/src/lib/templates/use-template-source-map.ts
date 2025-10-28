import { useMemo } from "react";
import { TemplateSource } from "../types/templates";
import { useSources } from "./use-sources";

export function useTemplateSourceMap(): Record<string, TemplateSource> {
  const sources = useSources();
  return useMemo(
    () =>
      sources.reduce(
        (acc, source) => ({
          ...acc,
          [source.name]: source,
        }),
        {} as Record<string, TemplateSource>,
      ),
    [sources],
  );
}
