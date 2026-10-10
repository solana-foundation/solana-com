import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@workspace/ui/landing";

describe("landing links", () => {
  it("keeps absolute solana.com URLs for navigation across apps", () => {
    render(
      <Button
        url="https://solana.com/docs/tokens/extensions"
        label="Read docs"
      />,
    );

    expect(screen.getByRole("link", { name: "Read docs" })).toHaveAttribute(
      "href",
      "https://solana.com/docs/tokens/extensions",
    );
  });
});
