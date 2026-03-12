import matter from "gray-matter";
import { getTranslations } from "next-intl/server";
import { SkillItem } from "@/components/skills/SkillCard";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { SkillsAudienceToggle } from "@/components/skills/SkillsAudienceToggle";
import { SkillsInstallCommand } from "@/components/skills/SkillsInstallCommand";
import { SkillsHeroBackground } from "@/components/skills/SkillsHeroBackground";
import { Divider } from "@/components/solutions/divider.v2";
import { COMMUNITY_SKILLS } from "@/data/skills/communitySkills";
import { SOLANA_DEV_SKILLS_GITHUB_API_URL } from "@/components/skills/skills";

function parseSkillMarkdown(
  filename: string,
  content: string,
  htmlUrl: string,
): SkillItem {
  const slug = filename.replace(/\.md$/, "");
  const { data } = matter(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    githubUrl: htmlUrl,
  };
}

export async function SkillsPage() {
  const t = await getTranslations("skills");
  let skills: SkillItem[] = [];

  try {
    const res = await fetch(SOLANA_DEV_SKILLS_GITHUB_API_URL, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const files = await res.json();
      const mdFiles = Array.isArray(files)
        ? files.filter(
            (f: { name: string }) =>
              f.name.endsWith(".md") && f.name !== "SKILL.md",
          )
        : [];

      const results = await Promise.allSettled(
        mdFiles.map(
          async (file: {
            name: string;
            download_url: string;
            html_url: string;
          }) => {
            const raw = await fetch(file.download_url, {
              next: { revalidate: 3600 },
            });
            const content = await raw.text();
            console.log("Markdown and url", file.name, file.html_url);
            return parseSkillMarkdown(file.name, content, file.html_url);
          },
        ),
      );

      skills = results
        .filter(
          (r): r is PromiseFulfilledResult<SkillItem> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);
    }
  } catch (error) {
    // Render gracefully with empty skills on error
    console.error("Error loading skills:", error);
  }

  const translations = {
    tagline: t("tagline"),
    title: t("title"),
    description: t("description"),
    errorLoading: t("errorLoading"),
    viewOnGitHub: t("viewOnGitHub"),
    viewSkill: t("viewSkill"),
    filterAll: t("filterAll"),
    searchPlaceholder: t("searchPlaceholder"),
    copyInstallCommand: t("copyInstallCommand"),
    endorsedTitle: t("endorsed.title"),
    endorsedDescription: t("endorsed.description"),
    communityTitle: t("community.title"),
    communityDescription: t("community.description"),
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
      defi: t("categories.defi"),
      infrastructure: t("categories.infrastructure"),
    },
  };

  return (
    <div className="bg-black text-white overflow-hidden">
      <section className="relative overflow-hidden">
        <SkillsHeroBackground />
        <div className="relative z-10 max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="py-[64px] md:py-[112px] xl:py-[160px] flex flex-col gap-6">
            <span className="text-xs font-medium uppercase tracking-widest text-sky-300/80">
              {translations.tagline}
            </span>
            <h1 className="font-brand font-medium text-[40px] md:text-[56px] xl:text-[88px] leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
              {translations.title}
            </h1>
            <p className="text-[#ABABBA] max-w-2xl text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              {translations.description}
            </p>
            <SkillsAudienceToggle />
            <SkillsInstallCommand copyLabel={translations.copyInstallCommand} />
          </div>
        </div>
      </section>

      <Divider />

      {skills.length > 0 || COMMUNITY_SKILLS.length > 0 ? (
        <SkillsGrid
          endorsedSkills={skills}
          communitySkills={COMMUNITY_SKILLS}
          translations={{
            filterAll: translations.filterAll,
            searchPlaceholder: translations.searchPlaceholder,
            viewOnGitHub: translations.viewOnGitHub,
            viewSkill: translations.viewSkill,
            endorsedTitle: translations.endorsedTitle,
            endorsedDescription: translations.endorsedDescription,
            communityTitle: translations.communityTitle,
            communityDescription: translations.communityDescription,
            categories: translations.categories,
          }}
        />
      ) : (
        <p className="text-[#ABABBA] text-center max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
          {translations.errorLoading}
        </p>
      )}
    </div>
  );
}
