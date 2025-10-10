import { filters, RepokitFilter } from "@/lib/generated/repokit";

export function useRepokitFilters(): RepokitFilter[] {
  return filters;
}
