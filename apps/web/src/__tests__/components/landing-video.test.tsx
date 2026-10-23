import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { YoutubeVideo } from "@workspace/ui/landing";

describe("YoutubeVideo", () => {
  it("embeds a video from YouTube", () => {
    render(<YoutubeVideo url="https://www.youtube.com/watch?v=CEuKahqOYbs" />);

    expect(screen.getByTitle("YouTube video")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/CEuKahqOYbs",
    );
  });

  it("rejects a lookalike host", () => {
    render(<YoutubeVideo url="https://evil-youtube.com/watch?v=CEuKahqOYbs" />);

    expect(screen.queryByTitle("YouTube video")).not.toBeInTheDocument();
  });
});
