import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CommunitySocial from "@/components/community/CommunitySocial";

vi.mock("@workspace/i18n/use-router", () => ({
  useRouter: () => ({ locale: "en" }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "community.socials.github") return "GitHub";
    if (key === "community.socials.gt-stars") return "stars";
    return key;
  },
}));

describe("CommunitySocial GitHub stars", () => {
  it("displays an em dash when the count is unavailable", () => {
    render(<CommunitySocial data={{}} />);

    const githubCard = screen.getByRole("link", { name: /GitHub/i });

    expect(githubCard).toHaveTextContent("—");
    expect(githubCard).not.toHaveTextContent("0 stars");
  });

  it("displays a genuine zero-star count", () => {
    render(<CommunitySocial data={{ github: 0 }} />);

    const githubCard = screen.getByRole("link", { name: /GitHub/i });

    expect(githubCard).toHaveTextContent("0 stars");
  });

  it("displays a valid GitHub star count", () => {
    render(<CommunitySocial data={{ github: 540 }} />);

    const githubCard = screen.getByRole("link", { name: /GitHub/i });

    expect(githubCard).toHaveTextContent("540 stars");
  });
});
