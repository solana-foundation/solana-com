import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SpeakersList from "@/components/pages/speakers/SpeakersList";
import { getAirtableAgenda } from "@/content/agenda/airtable";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { attachSpeakerSessions } from "@/content/speakers/sessions";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("speaker event filter", () => {
  it("filters published Airtable speakers by all their sessions and preserves sorting", async () => {
    vi.stubEnv("AIRTABLE_PAT", "test-token");
    for (const source of ["SPEAKERS", "AGENDA"]) {
      vi.stubEnv(`AIRTABLE_BASE_ID_${source}`, "appTest");
      vi.stubEnv(`AIRTABLE_TABLE_ID_${source}`, source);
      vi.stubEnv(`AIRTABLE_VIEW_ID_${source}`, "viwTest");
    }
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () => ({
          records: url.includes("/SPEAKERS?")
            ? [
                {
                  id: "ada",
                  fields: {
                    "Publish To Web": true,
                    "First Name": "Ada",
                    "Last Name": "Lovelace",
                    Company: "Example",
                  },
                },
                {
                  id: "grace",
                  fields: {
                    "Publish To Web": true,
                    "First Name": "Grace",
                    "Last Name": "Hopper",
                  },
                },
                {
                  id: "unassigned",
                  fields: {
                    "Publish To Web": true,
                    "First Name": "Unassigned",
                  },
                },
              ]
            : [
                {
                  id: "keynote",
                  fields: {
                    Title: "Opening",
                    Day: "Day 1",
                    Format: "Keynote",
                    "Confirmed Speakers Full Name": [
                      "  ADA   LOVELACE - Example",
                    ],
                  },
                },
                {
                  id: "fireside",
                  fields: {
                    Title: "Conversation",
                    Day: "Day 2",
                    Format: "Fireside Chat",
                    "Confirmed Speakers Full Name": [
                      "Ada Lovelace",
                      "Grace Hopper",
                    ],
                  },
                },
                {
                  id: "hidden",
                  fields: {
                    "Publish To Web": false,
                    Title: "Hidden talk",
                    Format: "Debate",
                    "Confirmed Speakers Full Name": ["Ada Lovelace"],
                  },
                },
                {
                  id: "other-company",
                  fields: {
                    Title: "Other Ada",
                    Format: "Product Demo",
                    "Confirmed Speakers Full Name": [
                      "Ada Lovelace - Other Company",
                    ],
                  },
                },
              ],
        }),
      })),
    );

    const [speakers, agenda] = await Promise.all([
      getAirtableSpeakers(),
      getAirtableAgenda(),
    ]);
    render(
      <SpeakersList
        speakers={attachSpeakerSessions(speakers ?? [], agenda ?? [])}
      />,
    );
    const names = () =>
      screen
        .queryAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent);
    const filter = screen.getByLabelText("Filter");
    expect(names()).toEqual(["Ada Lovelace", "Grace Hopper", "Unassigned"]);
    expect(
      screen.queryByRole("option", { name: "Debate" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Product Demo" }),
    ).not.toBeInTheDocument();

    fireEvent.change(filter, { target: { value: "Keynote" } });
    expect(names()).toEqual(["Ada Lovelace"]);
    fireEvent.click(
      screen.getByRole("button", { name: "Expand Ada Lovelace" }),
    );
    expect(screen.getByText("Opening")).toBeInTheDocument();
    expect(screen.getByText("Conversation")).toBeInTheDocument();

    fireEvent.change(filter, { target: { value: "Fireside Chat" } });
    expect(names()).toEqual(["Ada Lovelace", "Grace Hopper"]);
    fireEvent.change(screen.getByLabelText("Sort"), {
      target: { value: "za" },
    });
    expect(names()).toEqual(["Grace Hopper", "Ada Lovelace"]);
    fireEvent.change(filter, { target: { value: "All Events" } });
    expect(names()).toEqual(["Unassigned", "Grace Hopper", "Ada Lovelace"]);
  });

  it("keeps speakers visible when schedule data is unavailable", () => {
    const speakers = [{ id: "ada", slug: "ada", name: "Ada", sortOrder: 0 }];
    render(<SpeakersList speakers={attachSpeakerSessions(speakers, [])} />);
    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["Alphabetical (A→Z)", "Alphabetical (Z→A)", "All Events"]);
  });
});
