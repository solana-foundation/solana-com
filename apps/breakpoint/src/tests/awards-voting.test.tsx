import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import AwardsVoting from "@/components/pages/awards/AwardsVoting";
import { mockFinalists } from "@/content/awards-finalists";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("awards voting", () => {
  it("allows finalist selection when the vote session cannot load", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AwardsVoting finalists={mockFinalists} initialStatus="open" />
      </NextIntlClientProvider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load your votes",
    );
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    const finalist = screen.getByRole("radio", { name: /Mock finalist D/ });
    expect(finalist).toBeEnabled();
    fireEvent.click(finalist);
    expect(finalist).toBeChecked();
    expect(screen.getByRole("button", { name: "Submit vote" })).toBeDisabled();
  });
});
