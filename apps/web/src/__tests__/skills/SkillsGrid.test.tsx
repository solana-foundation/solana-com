import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { DEFI, TESTING } from "@/components/skills/skillCategories";

const { useIntersectionObserverMock } = vi.hoisted(() => ({
  useIntersectionObserverMock: vi.fn(),
}));

vi.mock("@/hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: useIntersectionObserverMock,
}));

describe("SkillsGrid", () => {
  beforeEach(() => {
    useIntersectionObserverMock.mockReset();
    useIntersectionObserverMock.mockReturnValue({
      ref: { current: null },
      isIntersecting: true,
    });
  });

  it("uses a zero-threshold observer so tall mobile grids can reveal", () => {
    render(
      <SkillsGrid
        endorsedSkills={[
          {
            slug: "anchor-testing",
            title: "Anchor Testing",
            description: "Official skill",
            githubUrl: "https://example.com/official",
            sourceType: "official",
          },
        ]}
        communitySkills={[
          {
            slug: "community-anchor",
            title: "Community Anchor",
            description: "Community skill",
            url: "https://example.com/community",
            category: DEFI,
          },
          {
            slug: "community-testing",
            title: "Community Testing",
            description: "Another community skill",
            url: "https://example.com/community-2",
            category: TESTING,
          },
        ]}
        translations={{
          filterAll: "All",
          searchPlaceholder: "Search",
          viewOnGitHub: "View on GitHub",
          viewSkill: "View skill",
          endorsedTitle: "Endorsed Skills",
          endorsedDescription: "Foundation-maintained skills.",
          communityTitle: "Community Skills",
          communityDescription: "Community-maintained skills.",
          categories: {
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
          },
        }}
      />,
    );

    expect(useIntersectionObserverMock).toHaveBeenCalledTimes(2);
    expect(useIntersectionObserverMock).toHaveBeenNthCalledWith(1, {
      threshold: 0,
      triggerOnce: true,
    });
    expect(useIntersectionObserverMock).toHaveBeenNthCalledWith(2, {
      threshold: 0,
      triggerOnce: true,
    });
  });
});
