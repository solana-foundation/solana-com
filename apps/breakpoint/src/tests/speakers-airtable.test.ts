import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAirtableSpeakers } from "@/content/speakers/airtable";

beforeEach(() => {
  vi.stubEnv("AIRTABLE_BASE_ID_SPEAKERS", "appSpeakers");
  vi.stubEnv("AIRTABLE_TABLE_ID_SPEAKERS", "tblSpeakers");
  vi.stubEnv("AIRTABLE_VIEW_ID_SPEAKERS", "viwSpeakers");
  vi.stubEnv("AIRTABLE_PAT", "test-token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Breakpoint Airtable speakers", () => {
  it("uses first and last names and the Role or Title field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        records: [
          {
            id: "both",
            fields: {
              "Publish To Web": true,
              "First Name": "  Ada  ",
              "Last Name": "  Lovelace  ",
              Name: "⏰ Ada Lovelace - Example Co",
              Role: "Wrong role",
              "Role or Title": "Engineer",
            },
          },
          {
            id: "first-only",
            fields: {
              "Publish To Web": true,
              "First Name": "Grace",
              "Last Name": "   ",
            },
          },
          {
            id: "last-only",
            fields: {
              "Publish To Web": true,
              "First Name": "  ",
              "Last Name": "Hopper",
            },
          },
          {
            id: "no-name",
            fields: {
              "Publish To Web": true,
              "First Name": "  ",
              "Last Name": "  ",
              Name: "⏰ Decorated fallback",
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const speakers = await getAirtableSpeakers();

    expect(speakers?.map(({ name }) => name)).toEqual([
      "Ada Lovelace",
      "Grace",
      "Hopper",
    ]);
    expect(speakers?.[0]?.role).toBe("Engineer");
    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] ?? "");
    expect(requestUrl.searchParams.getAll("fields[]")).toEqual(
      expect.arrayContaining(["First Name", "Last Name", "Role or Title"]),
    );
    expect(requestUrl.searchParams.getAll("fields[]")).not.toContain("Name");
  });
});
