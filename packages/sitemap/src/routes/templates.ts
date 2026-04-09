import type { SitemapEntry, RouteGenerator } from "../types";
import { createEntry } from "../utils";

type Template = {
  name: string;
};

type TemplateGroup = {
  templates?: Template[];
};

type TemplatesFetcher = () => Promise<Template[]>;

const templatesUrl =
  "https://raw.githubusercontent.com/solana-foundation/templates/main/templates.json";

async function fetchTemplatesFromGithub() {
  const response = await fetch(templatesUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Templates request failed with ${response.status}`);
  }

  const groups = (await response.json()) as TemplateGroup[];

  return groups.flatMap((group) => group.templates || []);
}

export async function templatesRoutes(
  fetchTemplates = fetchTemplatesFromGithub,
): Promise<SitemapEntry[]> {
  try {
    const templates = await fetchTemplates();

    return [
      createEntry("/developers/templates", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
      ...templates.map((template) =>
        createEntry(
          `/developers/templates/${encodeURIComponent(template.name)}`,
          {
            changeFrequency: "weekly",
            priority: 0.7,
          },
        ),
      ),
    ];
  } catch (error) {
    console.error("Failed to build templates sitemap routes", error);
    return [];
  }
}

const _templatesRoutesTypecheck: RouteGenerator = templatesRoutes;
void _templatesRoutesTypecheck;
