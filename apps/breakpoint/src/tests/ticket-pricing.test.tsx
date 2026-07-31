import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GeneralAdmissionPrice,
  TicketPriceChangeCountdown,
} from "@/components/TicketPriceChange";
import {
  GENERAL_ADMISSION_PRICE_INCREASE_AT,
  getTicketPriceCountdownParts,
  hasGeneralAdmissionPriceIncreased,
} from "@/content/ticket-pricing";

describe("Breakpoint general admission price change", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("switches at 2:00 AM Pacific on August 1, 2026", () => {
    expect(GENERAL_ADMISSION_PRICE_INCREASE_AT).toBe(
      Date.parse("2026-08-01T09:00:00Z"),
    );
    expect(
      hasGeneralAdmissionPriceIncreased(
        GENERAL_ADMISSION_PRICE_INCREASE_AT - 1,
      ),
    ).toBe(false);
    expect(
      hasGeneralAdmissionPriceIncreased(GENERAL_ADMISSION_PRICE_INCREASE_AT),
    ).toBe(true);
  });

  it("returns countdown parts without reaching zero early", () => {
    expect(
      getTicketPriceCountdownParts(
        GENERAL_ADMISSION_PRICE_INCREASE_AT -
          (24 * 60 * 60 + 2 * 60 * 60 + 3 * 60 + 4) * 1000,
      ),
    ).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });

    expect(
      getTicketPriceCountdownParts(GENERAL_ADMISSION_PRICE_INCREASE_AT - 1),
    ).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
  });

  it("updates the displayed price and removes the timer at the cutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01T08:59:58Z"));

    render(
      <>
        <GeneralAdmissionPrice currentPrice="$450" increasedPrice="$550" />
        <TicketPriceChangeCountdown label="Prices increase in" />
      </>,
    );

    expect(screen.getByText("$450")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveAccessibleName(
      "Prices increase in 0H 0M 2S",
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("$550")).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });
});
