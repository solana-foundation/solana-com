import { describe, expect, it } from "vitest";
import {
  FEATURED_RECAP_SESSION_IDS,
  selectRecapSessions,
} from "@/content/post-conference";
import type { AgendaItem } from "@/content/agenda/types";

const session = (
  id: string,
  overrides: Partial<AgendaItem> = {},
): AgendaItem => ({
  id,
  title: id,
  day: "Day 1",
  location: "Main Stage",
  format: "Keynote",
  time: "10:00",
  sortOrder: 1,
  speakers: [],
  ...overrides,
});

describe("recap sessions", () => {
  it("features different days, stages and formats before repeating a group", () => {
    const items = [
      session("opening"),
      session("second-keynote"),
      session("panel", { format: "Panel" }),
      session("royal", { location: "Royal Exchange" }),
      session("day-two", { day: "Day 2" }),
    ];
    expect(selectRecapSessions(items).map((item) => item.id)).toEqual([
      "opening",
      "panel",
      "royal",
      "day-two",
      "second-keynote",
    ]);
  });
  it("excludes breaks and never fabricates content for an empty program", () => {
    expect(
      selectRecapSessions([
        session("break", { variant: "static" }),
        session("lunch", { format: undefined }),
      ]),
    ).toEqual([]);
    expect(selectRecapSessions([])).toEqual([]);
  });
  it("leads with the featured sessions and fills the rest from the program", () => {
    const [first, second] = FEATURED_RECAP_SESSION_IDS;
    const picked = selectRecapSessions([
      session("opening"),
      session(second!),
      session("panel", { format: "Panel" }),
      session(first!),
    ]).map((item) => item.id);
    expect(picked).toEqual([first, second, "opening", "panel"]);
  });
  it("caps the selection at six sessions", () => {
    expect(
      selectRecapSessions(
        Array.from({ length: 20 }, (_, i) => session(String(i))),
      ),
    ).toHaveLength(6);
  });
});
