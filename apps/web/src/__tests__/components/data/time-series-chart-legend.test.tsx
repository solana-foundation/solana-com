import { fireEvent, render, screen } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import {
  TimeSeriesChart,
  type ChartSeries,
} from "@/app/[locale]/data/time-series-chart";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);

let messages: AbstractIntlMessages;

beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

function makeSeries(id: string): ChartSeries {
  return {
    id,
    label: id,
    color: "#FFFFFF",
    points: [1, 2, 3].map((value, index) => ({
      date: new Date(Date.UTC(2026, 0, index + 1)),
      value,
    })),
  };
}

function renderChart(series: ChartSeries[]) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <TimeSeriesChart series={series} valueLabel="USD" />
    </NextIntlClientProvider>,
  );
}

describe("TimeSeriesChart legend", () => {
  it("shows the deselect all toggle when all series are selected", () => {
    renderChart([makeSeries("a"), makeSeries("b"), makeSeries("c")]);

    expect(
      screen.getByRole("button", { name: "Deselect all" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Select all" }),
    ).not.toBeInTheDocument();
  });

  it("does not show the toggle for a single series", () => {
    renderChart([makeSeries("a")]);

    expect(
      screen.queryByRole("button", { name: "Deselect all" }),
    ).not.toBeInTheDocument();
  });

  it("switches to select all once any series is toggled off", () => {
    renderChart([makeSeries("a"), makeSeries("b"), makeSeries("c")]);

    fireEvent.click(screen.getByRole("button", { name: "a" }));

    expect(screen.getByRole("button", { name: "a" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
  });

  it("deselects every series and shows the empty state", () => {
    renderChart([makeSeries("a"), makeSeries("b"), makeSeries("c")]);

    fireEvent.click(screen.getByRole("button", { name: "Deselect all" }));

    for (const id of ["a", "b", "c"]) {
      expect(screen.getByRole("button", { name: id })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
    expect(screen.getByText("Select at least one series")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select all" }),
    ).toBeInTheDocument();
  });

  it("reselects every series via select all", () => {
    renderChart([makeSeries("a"), makeSeries("b"), makeSeries("c")]);

    fireEvent.click(screen.getByRole("button", { name: "a" }));
    fireEvent.click(screen.getByRole("button", { name: "b" }));
    fireEvent.click(screen.getByRole("button", { name: "Select all" }));

    for (const id of ["a", "b", "c"]) {
      expect(screen.getByRole("button", { name: id })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    expect(
      screen.getByRole("button", { name: "Deselect all" }),
    ).toBeInTheDocument();
  });

  it("allows toggling off the last remaining series", () => {
    renderChart([makeSeries("a"), makeSeries("b")]);

    fireEvent.click(screen.getByRole("button", { name: "a" }));
    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(screen.getByRole("button", { name: "b" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText("Select at least one series")).toBeInTheDocument();
  });
});
