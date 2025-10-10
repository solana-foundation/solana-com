import { RepokitTemplate } from "@/lib/generated/repokit";

type Tech = "next" | "vite" | "react" | "node" | "expo" | "other";

export function inferTechFromKeywords(keywords: string[]): Tech {
  if (keywords.includes("nextjs")) return "next";
  if (keywords.includes("vite")) return "vite";
  if (keywords.includes("react")) return "react";
  if (keywords.includes("node") || keywords.includes("express")) return "node";
  if (keywords.includes("expo")) return "expo";
  return "other";
}

export function sanitizeSearchInput(input: string): string {
  return input
    .slice(0, 100) // Prevent long inputs
    .replace(/[<>]/g, "") // Remove potential XSS chars
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export function createFeaturedTemplates(
  templates: RepokitTemplate[],
): RepokitTemplate[] {
  const techGroups: Record<Tech, RepokitTemplate[]> = {
    next: [],
    vite: [],
    react: [],
    node: [],
    expo: [],
    other: [],
  };

  templates.forEach((template) => {
    const tech = inferTechFromKeywords(template.keywords);
    techGroups[tech].push(template);
  });

  const featured: RepokitTemplate[] = [];

  Object.values(techGroups).forEach((group) => {
    if (group.length === 0) return;
    const selectedItem = group[0];
    featured.push(selectedItem);
  });

  return featured.slice(0, 3); // Max 3 items
}

export function filterTemplates(
  templates: RepokitTemplate[],
  query: string,
): RepokitTemplate[] {
  if (!query || query.length < 2) return [];

  const searchTerm = query.toLowerCase();

  return templates.filter((template) => {
    const tech = inferTechFromKeywords(template.keywords);
    const searchableText = [
      template.name,
      template.description,
      tech,
      // Tech aliases
      tech === "next" ? "next.js nextjs" : "",
      tech === "vite" ? "vite" : "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
}
