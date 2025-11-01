import { Template } from "../types/templates";
import { TemplateUrlState } from "./use-template-url-state";

// Default templates to show when no filters are applied
const DEFAULT_TEMPLATE_NAMES = [
  "gill-next-tailwind-basic", // Fullstack boilerplate (Next.js)
  "gill-react-vite-tailwind-basic", // Fullstack boilerplate (Vite)
  "web3js-expo", // Mobile
  "gill-jito-airdrop", // Airdrop
  "x402-solana-protocol", // Payments
  "gill-node-express", // Backend
];

export function filterTemplates({
  filter,
  selectedKeywords,
  selectedSources,
  templates,
}: TemplateUrlState & { templates: Template[] }) {
  const hasFilters =
    filter.trim() !== "" ||
    selectedKeywords.length > 0 ||
    selectedSources.length > 0;

  // If no filters applied, return only the default templates
  if (!hasFilters) {
    return templates.filter((t) => DEFAULT_TEMPLATE_NAMES.includes(t.name));
  }

  // When filters are applied, search through ALL templates
  return templates.filter((l) => {
    // If there's a text filter, check if it matches
    if (filter.trim() !== "") {
      const inName = l.name.toLowerCase().includes(filter.toLowerCase());
      const inDisplayName = l.displayName
        ?.toLowerCase()
        .includes(filter.toLowerCase());
      const inDescription = l.description
        .toLowerCase()
        .includes(filter.toLowerCase());
      const inKeywords = l.keywords.some((k) =>
        k.toLowerCase().includes(filter.toLowerCase()),
      );
      const inUsecase = l.usecase?.toLowerCase().includes(filter.toLowerCase());

      // Must match the text filter to continue
      if (
        !(inName || inDisplayName || inDescription || inKeywords || inUsecase)
      ) {
        return false;
      }
    }

    // Apply source filter if any
    if (
      selectedSources.length > 0 &&
      !selectedSources.some((s) => l.source.id === s)
    ) {
      return false;
    }

    // Apply keyword filter if any
    if (selectedKeywords.length > 0) {
      const matchesKeyword = selectedKeywords.some(
        (k) =>
          l.keywords.includes(k) ||
          // Support case-insensitive usecase matching
          (l.usecase && l.usecase.toLowerCase() === k.toLowerCase()),
      );
      if (!matchesKeyword) {
        return false;
      }
    }

    return true;
  });
}
