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

it("keeps overrunning sessions visible without inferred live status", () => {
  const now = Date.parse("2026-11-16T10:40:00Z");
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
  expect(agenda.getAllByRole("article")).toHaveLength(8);
  expect(
    agenda.queryByRole("heading", { name: "Session 0" }),
  ).not.toBeInTheDocument();
  expect(
    agenda.getByRole("heading", { name: "Session 1" }),
  ).toBeInTheDocument();
  expect(agenda.getByText("10:00–10:20")).toBeInTheDocument();
  expect(agenda.getAllByText("Scheduled")).toHaveLength(8);
  expect(
    agenda.queryByText(/Live now|Next up|Later today|Finished/),
  ).not.toBeInTheDocument();
  expect(
    agenda.getByText(/Sessions may run ahead or behind schedule/),
  ).toBeInTheDocument();
});
