import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import AgendaList from "@/components/pages/agenda/AgendaList";
import {
  parseYouTubeVideoId,
  SESSION_VIDEO_IDS,
} from "@/content/agenda/session-videos";
import type { AgendaItem } from "@/content/agenda/types";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

afterEach(cleanup);

describe("parseYouTubeVideoId", () => {
  it.each([
    ["https://www.youtube.com/watch?v=Hi41dED39O0", "Hi41dED39O0"],
    ["https://youtu.be/Hi41dED39O0?si=abc", "Hi41dED39O0"],
    ["https://www.youtube.com/live/Hi41dED39O0", "Hi41dED39O0"],
    ["https://m.youtube.com/watch?v=-B5EKikET9k&t=30s", "-B5EKikET9k"],
    [" Hi41dED39O0 ", "Hi41dED39O0"],
  ])("reads the id from %s", (input, id) => {
    expect(parseYouTubeVideoId(input)).toBe(id);
  });

  it.each([
    "https://example.com/watch?v=Hi41dED39O0",
    "https://www.youtube.com/playlist?list=PL123",
    "javascript:alert(1)",
    "",
    undefined,
    ["https://youtu.be/Hi41dED39O0"],
  ])("rejects %s", (input) => {
    expect(parseYouTubeVideoId(input)).toBeUndefined();
  });
});

describe("SESSION_VIDEO_IDS", () => {
  it("maps Airtable record ids to distinct video ids", () => {
    const entries = Object.entries(SESSION_VIDEO_IDS);
    for (const [recordId, videoId] of entries) {
      expect(recordId).toMatch(/^rec[A-Za-z0-9]{14}$/);
      expect(parseYouTubeVideoId(videoId)).toBe(videoId);
    }
    expect(new Set(Object.values(SESSION_VIDEO_IDS)).size).toBe(entries.length);
  });
});

describe("agenda session recording link", () => {
  const base: AgendaItem = {
    day: "Day 1",
    description: "Opening remarks.",
    id: "recWelcome0000001",
    location: "Main Stage",
    sortOrder: 1,
    speakers: [],
    time: "09:00",
    title: "Welcome to Breakpoint 2026",
  };

  function renderList(items: AgendaItem[]) {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AgendaList items={items} />
      </NextIntlClientProvider>,
    );
  }

  it("links a session to its recording without expanding the card", () => {
    renderList([{ ...base, youtubeVideoId: "Hi41dED39O0" }]);

    const link = screen.getByRole("link", {
      name: "Watch Welcome to Breakpoint 2026 on YouTube (opens in a new tab)",
    });
    expect(link.getAttribute("href")).toBe(
      "https://www.youtube.com/watch?v=Hi41dED39O0",
    );
    expect(link.getAttribute("target")).toBe("_blank");

    fireEvent.click(link);
    expect(screen.queryByText("Opening remarks.")).toBeNull();
  });

  it("shows no recording link for a session without one", () => {
    renderList([base]);
    expect(screen.queryByRole("link", { name: /on YouTube/ })).toBeNull();
  });
});
