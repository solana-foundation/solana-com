import { cleanup, render, within } from "@testing-library/react";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { afterEach, expect, it, vi } from "vitest";
import LiveEventSections from "@/components/sections/live/LiveEventSections";
import { useRequiredLiveSchedule } from "@/components/sections/live/LiveScheduleProvider";
import { MAIN_STAGE_STREAM } from "@/content/live/streams";
import { calculateLiveSchedule } from "@/lib/live-sessions";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

vi.mock("@/components/sections/live/LiveScheduleProvider", () => ({
  useRequiredLiveSchedule: vi.fn(),
}));
vi.mock("@/components/ImageTreatment", () => ({ default: () => null }));

afterEach(cleanup);

it("keeps the full day's scheduled sessions visible without inferred live status", () => {
  const now = Date.parse("2026-11-16T10:10:00Z");
  const schedule = calculateLiveSchedule(
    Array.from({ length: 12 }, (_, index) => ({
      id: `session-${index}`,
      day: "Day 1",
      location: "Main Stage",
      sortOrder: index,
      speakers: [],
      title: `Session ${index}`,
      time: `${String(9 + index).padStart(2, "0")}:00`,
      duration: "20",
    })),
    now,
  );
  vi.mocked(useRequiredLiveSchedule).mockReturnValue({
    now,
    schedule,
    viewerTimeZone: null,
  });
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LiveEventSections stream={MAIN_STAGE_STREAM} />
    </NextIntlClientProvider>,
  );

  const agenda = within(document.getElementById("today")!);
  expect(agenda.getAllByRole("article")).toHaveLength(12);
  expect(
    agenda.getByRole("heading", { name: "Session 0" }),
  ).toBeInTheDocument();
  expect(agenda.getByText("09:00–09:20")).toBeInTheDocument();
  expect(agenda.getAllByText("Scheduled")).toHaveLength(12);
  expect(
    agenda.queryByText(/Live now|Next up|Later today|Finished/),
  ).not.toBeInTheDocument();
  expect(
    agenda.getByText(/Sessions may run ahead or behind schedule/),
  ).toBeInTheDocument();
});
