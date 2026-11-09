import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Video } from "@/component-library/video";

vi.mock("next/image", () => ({
  default: ({
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    <img {...props} />
  ),
}));

describe("Video", () => {
  it("starts a local video after one click while preserving wrapper styling", () => {
    const { container } = render(
      <Video
        platform="local"
        id="/walkthrough.mp4"
        title="Walkthrough"
        thumbnail="/poster.webp"
        autoplay={false}
        loop={false}
        aspectRatio="1:1"
        sizes="50vw"
        className="rounded-2xl"
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute("sizes", "50vw");
    expect(container.firstElementChild).toHaveClass(
      "rounded-2xl",
      "aspect-square",
    );
    fireEvent.click(screen.getByRole("button", { name: "Walkthrough" }));
    const player = screen.getByTitle("Walkthrough");
    expect(player).toHaveAttribute("autoplay");
    expect(player).not.toHaveAttribute("muted");
    expect(player).not.toHaveAttribute("loop");
    expect(container.firstElementChild).toHaveClass(
      "rounded-2xl",
      "aspect-square",
    );
  });
});
