import { NextResponse } from "next/server";
import matter from "gray-matter";
import {
  CATEGORY_MAP,
  DEFAULT_CATEGORY,
} from "@/components/skills/skillCategories";
import {
  SOLANA_DEV_SKILLS_GITHUB_API_URL,
  SOLANA_DEV_SKILLS_REPO_URL,
} from "@/components/skills/skills";

// Category labelKey → display name
const CATEGORY_LABELS: Record<string, string> = {
  skill: "Skill",
  programs: "Programs",
  testing: "Testing",
  tooling: "Tooling",
  frontend: "Frontend",
  security: "Security",
  tokens: "Tokens",
  payments: "Payments",
  reference: "Reference",
  defi: "DeFi",
  infrastructure: "Infrastructure",
};

type GitHubFile = {
  name: string;
  download_url: string;
  html_url: string;
};

export async function GET() {
  let skillEntries: string[] = [];

  try {
    const res = await fetch(SOLANA_DEV_SKILLS_GITHUB_API_URL, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const files = await res.json();
      const mdFiles = Array.isArray(files)
        ? files.filter(
            (f: GitHubFile) => f.name.endsWith(".md") && f.name !== "SKILL.md",
          )
        : [];

      const results = await Promise.allSettled(
        mdFiles.map(async (file: GitHubFile) => {
          const raw = await fetch(file.download_url, {
            next: { revalidate: 3600 },
          });
          const content = await raw.text();
          const { data } = matter(content);
          const slug = file.name.replace(/\.md$/, "");
          const category = CATEGORY_MAP[slug] ?? DEFAULT_CATEGORY;
          const categoryLabel =
            CATEGORY_LABELS[category.labelKey] ?? category.labelKey;

          const title = data.title ?? slug;
          const description = data.description ?? "";

          return [
            `### ${title}`,
            description,
            `- **Category**: ${categoryLabel}`,
          ].join("\n");
        }),
      );

      skillEntries = results
        .filter(
          (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled",
        )
        .map((r) => r.value);
    }
  } catch (error) {
    console.error("Error loading skills for markdown route:", error);
  }

  const lines = [
    "# Solana Agent Skills",
    "",
    "> Foundation-maintained skills for AI agents building on Solana.",
    "> Install any skill: `npx skills add <url>`",
    "",
    "## Install All Skills",
    "",
    "```",
    `npx skills add ${SOLANA_DEV_SKILLS_REPO_URL}`,
    "```",
    "",
    "## Skills",
    "",
    ...(skillEntries.length > 0
      ? skillEntries.flatMap((entry) => [entry, ""])
      : [`See ${SOLANA_DEV_SKILLS_REPO_URL} for more information.`, ""]),
  ];

  const markdown = lines.join("\n");

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
