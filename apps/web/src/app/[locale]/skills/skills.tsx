import matter from "gray-matter";
import { getTranslations } from "next-intl/server";
import { SkillItem } from "@/components/skills/SkillCard";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { SkillsInstallCommand } from "@/components/skills/SkillsInstallCommand";

function parseSkillMarkdown(filename: string, content: string): SkillItem {
  const slug = filename.replace(/\.md$/, "");
  const { data } = matter(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    githubUrl: `https://github.com/solana-foundation/solana-dev-skill/blob/main/skill/references/${filename}`,
  };
}

export async function SkillsPage() {
  const t = await getTranslations("skills");
  let skills: SkillItem[] = [];

  try {
    const res = await fetch(
      "https://api.github.com/repos/solana-foundation/solana-dev-skill/contents/skill/references",
      { next: { revalidate: 3600 } },
    );

    if (res.ok) {
      const files = await res.json();
      const mdFiles = Array.isArray(files)
        ? files.filter(
            (f: { name: string }) =>
              f.name.endsWith(".md") && f.name !== "SKILL.md",
          )
        : [];

      const results = await Promise.allSettled(
        mdFiles.map(async (file: { name: string; download_url: string }) => {
          const raw = await fetch(file.download_url, {
            next: { revalidate: 3600 },
          });
          const content = await raw.text();
          return parseSkillMarkdown(file.name, content);
        }),
      );

      skills = results
        .filter(
          (r): r is PromiseFulfilledResult<SkillItem> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);
    }
  } catch {
    // Render gracefully with empty skills on error
  }

  const translations = {
    tagline: t("tagline"),
    title: t("title"),
    description: t("description"),
    errorLoading: t("errorLoading"),
    viewOnGitHub: t("viewOnGitHub"),
    filterAll: t("filterAll"),
    copyInstallCommand: t("copyInstallCommand"),
    categories: {
      skill: t("categories.skill"),
      programs: t("categories.programs"),
      testing: t("categories.testing"),
      tooling: t("categories.tooling"),
      frontend: t("categories.frontend"),
      security: t("categories.security"),
      tokens: t("categories.tokens"),
      payments: t("categories.payments"),
      reference: t("categories.reference"),
    },
  };

  return (
    <div className="overflow-hidden">
      <div className="relative w-full overflow-hidden bg-[#070b14] text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] px-6 py-16 md:px-12 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-widest text-sky-300/80">
            {translations.tagline}
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            {translations.title}
          </h1>
          <p className="text-white/70 max-w-2xl text-lg">
            {translations.description}
          </p>
          <SkillsInstallCommand copyLabel={translations.copyInstallCommand} />
        </div>
      </div>

      <div className="bg-[#070b14] px-6 py-16 md:px-12">
        {skills.length > 0 ? (
          <SkillsGrid
            skills={skills}
            translations={{
              filterAll: translations.filterAll,
              viewOnGitHub: translations.viewOnGitHub,
              categories: translations.categories,
            }}
          />
        ) : (
          <p className="text-white/40 text-center max-w-6xl mx-auto">
            {translations.errorLoading}
          </p>
        )}
      </div>
    </div>
  );
}
