import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AlpenglowDashboardStats } from "@/components/alpenglow/AlpenglowDashboardStats";

vi.mock("@workspace/i18n/client", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

afterEach(() => vi.unstubAllGlobals());

describe("AlpenglowDashboardStats", () => {
  it("shows mainnet dashboard metrics, including valid zero values", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        network: "mainnet",
        generatedAt: new Date().toISOString(),
        latestFinalityLatencySeconds: 0.15,
        transactionsPerSecond: 0,
        nonVoteTransactionsPerBlock: 125,
        voteTransactionsPerBlock: 25,
        totalTransactionsPerBlock: 150,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<AlpenglowDashboardStats />);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/upgrades/alpenglow/metrics/live?network=mainnet",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    await waitFor(() => expect(screen.getByText("150 ms")).toBeInTheDocument());
    expect(screen.getByText("0 tx/s")).toBeInTheDocument();
    expect(screen.getByText("16.7%")).toBeInTheDocument();
  });

  it("does not display metrics from another network", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          network: "testnet",
          generatedAt: new Date().toISOString(),
          latestFinalityLatencySeconds: 0.15,
          transactionsPerSecond: 500,
          nonVoteTransactionsPerBlock: 125,
          voteTransactionsPerBlock: 25,
          totalTransactionsPerBlock: 150,
        }),
      }),
    );

    render(<AlpenglowDashboardStats />);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("unavailable"),
    );
    expect(screen.queryByText("500 tx/s")).not.toBeInTheDocument();
  });
});
