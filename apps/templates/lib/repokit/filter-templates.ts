import { RepokitTemplate } from "../generated/repokit";
import { RepokitUrlState } from "./use-repokit-url-state";

export function filterTemplates({
  filter,
  selectedKeywords,
  selectedSources,
  templates,
}: RepokitUrlState & { templates: RepokitTemplate[] }) {
  return templates
    .filter((l) => {
      if (filter.trim() === "") {
        return true;
      }
      const inName = l.name.toLowerCase().includes(filter.toLowerCase());
      const inDescription = l.description
        .toLowerCase()
        .includes(filter.toLowerCase());
      const inKeywords = l.keywords.some((k) =>
        k.toLowerCase().includes(filter.toLowerCase()),
      );

      return inName || inDescription || inKeywords;
    })
    .filter((l) =>
      selectedSources.length
        ? selectedSources.some((s) => l.source.id === s)
        : true,
    )
    .filter((l) => selectedKeywords.every((k) => l.keywords.includes(k)));
}
