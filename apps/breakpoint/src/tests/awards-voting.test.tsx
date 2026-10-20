import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import AwardsVoting from "@/components/pages/awards/AwardsVoting";
import { awardCategories } from "@/content/awards";
import { approvedFinalists } from "@/content/awards-finalists";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("awards voting", () => {
  const renderBallot = () =>
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AwardsVoting finalists={approvedFinalists} initialStatus="open" />
      </NextIntlClientProvider>,
    );

  it("allows finalist selection when the vote session cannot load", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

    renderBallot();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load your votes",
    );
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    const finalist = screen.getByRole("radio", { name: /Sirius Crocodile/ });
    expect(finalist).toBeEnabled();
    expect(finalist.closest("label")?.querySelector("img")).toHaveAttribute(
      "src",
      "/breakpoint-assets/assets/awards/finalists/siriuscrocodile.webp",
    );
    fireEvent.click(finalist);
    expect(finalist).toBeChecked();
    expect(screen.getByRole("button", { name: "Submit vote" })).toBeDisabled();
  });

  it("keeps a pending vote in its original category after navigation", async () => {
    const savedVote = {
      category: awardCategories[0]!.id,
      twitterHandle: "@solanapoet",
      submittedAt: "2026-10-20T00:00:00Z",
    };
    let resolvePost!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch");
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ votes: [], votingStatus: "open" }),
    } as Response);
    fetch.mockImplementationOnce(
      () => new Promise<Response>((resolve) => (resolvePost = resolve)),
    );

    renderBallot();
    fireEvent.click(screen.getByRole("radio", { name: /degen poet/ }));
    const submit = screen.getByRole("button", { name: "Submit vote" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);
    expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await act(async () => {
      resolvePost({
        ok: true,
        json: async () => ({ vote: savedVote }),
      } as Response);
    });

    expect(screen.getByText("1 of 12 categories voted")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Vote submitted")).toBeInTheDocument();
    expect(screen.getByText("degen poet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Submit vote" })).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[1]![1]!.body as string)).toEqual({
      categoryId: awardCategories[0]!.id,
      twitterHandle: "@solanapoet",
    });
  });

  it("restores the persisted vote after a duplicate submission", async () => {
    const savedVote = {
      category: awardCategories[0]!.id,
      twitterHandle: "@grizzle_art",
      submittedAt: "2026-10-20T00:00:00Z",
    };
    const fetch = vi.spyOn(globalThis, "fetch");
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ votes: [], votingStatus: "open" }),
    } as Response);
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ vote: savedVote }),
    } as Response);

    renderBallot();
    fireEvent.click(screen.getByRole("radio", { name: /degen poet/ }));
    const submit = screen.getByRole("button", { name: "Submit vote" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    expect(await screen.findByText("Vote submitted")).toBeInTheDocument();
    expect(screen.getByText("Grizz")).toBeInTheDocument();
    expect(
      screen.getByText(/Your previous vote was restored/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Submit vote" })).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
