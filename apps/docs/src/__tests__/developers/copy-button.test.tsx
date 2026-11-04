import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/app/(docs)/[locale]/developers/copy-button.client";

const COMMAND =
  "claude mcp add --transport http solana-mcp https://mcp.solana.com/mcp";

function button() {
  return (
    <CopyButton
      text={COMMAND}
      label="Copy the Claude Code command"
      copyText="Copy"
      copiedText="Copied"
    />
  );
}

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("is hidden and disabled in the server render (no JS)", () => {
    const html = renderToString(button());
    expect(html).toMatch(/disabled=""/);
    expect(html).toMatch(/aria-hidden="true"/);
    expect(html).toMatch(/\binvisible\b/);
  });

  it("copies the exact string and shows a copied state", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(button());
    const copy = screen.getByRole("button", {
      name: "Copy the Claude Code command",
    });
    expect(copy).toBeEnabled();
    expect(copy).toHaveTextContent("Copy");

    await act(async () => {
      fireEvent.click(copy);
    });
    expect(writeText).toHaveBeenCalledWith(COMMAND);
    expect(copy).toHaveTextContent("Copied");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(copy).toHaveTextContent("Copy");
  });
});
