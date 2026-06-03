import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { SolutionHero } from "@/components/solutions/hero.v2";

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => <img {...props} />,
}));

vi.mock("unicornstudio-react", () => ({
  default: () => null,
}));

vi.mock("@/hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({
    ref: vi.fn(),
    isIntersecting: true,
  }),
}));

describe("SolutionHero", () => {
  it("renders the email CTA without stats", () => {
    const onEmailClick = vi.fn();

    render(
      <SolutionHero
        title="Financial institutions"
        subtitle="Build on Solana"
        emailCta="Download report"
        onEmailClick={onEmailClick}
      />,
    );

    expect(screen.getByText("Financial institutions")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Download report" }),
    ).toHaveLength(2);
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });

  it("can hide the lower download card while keeping the top CTA", () => {
    const { container } = render(
      <SolutionHero
        title="Financial institutions"
        subtitle="Build on Solana"
        emailCta="Connect"
        onEmailClick={vi.fn()}
        showDownloadCard={false}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Connect" })).toHaveLength(1);
    expect(container.firstChild?.firstChild).not.toHaveClass("min-h-[844px]");
  });
});
