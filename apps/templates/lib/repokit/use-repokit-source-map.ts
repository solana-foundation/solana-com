import { useMemo } from "react";
import { RepokitSource } from "@/lib/generated/repokit";
import { useRepokitSources } from "./use-repokit-source";

export function useRepokitSourceMap(): Record<string, RepokitSource> {
  const sources = useRepokitSources();
  return useMemo(
    () =>
      sources.reduce(
        (acc, source) => ({
          ...acc,
          [source.name]: source,
        }),
        {} as Record<string, RepokitSource>,
      ),
    [sources],
  );
}
