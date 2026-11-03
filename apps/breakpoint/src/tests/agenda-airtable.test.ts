import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAirtableAgenda,
  normalizeAgendaRecord,
  readPublishingFlags,
} from "@/content/agenda/airtable";

const STATUS_TABLE_ID = "tblHvCpfpI5CTlPDx";

const STATUS_RECORDS = [
  { id: "recTime", fields: { "Web Status": "Time" } },
  { id: "recTitle", fields: { "Web Status": "Title" } },
  { id: "recSpeaker", fields: { "Web Status": "Speaker" } },
  { id: "recDescription", fields: { "Web Status": "Description" } },
  { id: "recNo", fields: { "Web Status": "Do not publish" } },
];

const FULL_STATUS = ["recTime", "recTitle", "recSpeaker"];

function panelRecord() {
  return {
    id: "recPanel",
    fields: {
      "⚙️ Session Name": "Why Should I Use Your Stablecoin?",
      Session: "Why Should I Use Your Stablecoin?",
      Description: "Three stablecoin issuers on distribution.",
      "Start Time": "2026-11-16T11:15:00.000Z",
      "End Time": "2026-11-16T11:30:00.000Z",
      Duration: [15],
      Stage: "Main Stage",
      "Asset Class": ["Money"],
      Format_Cleaned: "Panel",
      "Day - Format": "Day 3 - Panel (15 min)",
      "⚙️ Start Day": "2026-11-16",
      "Onboarded Speakers": ["recRowland00000001", "recAhmed0000000001"],
      Moderator: ["recNemil0000000001"],
      "Speaker Name and Company": [
        "Rowland Berry - Payoneer",
        "Ahmed Zifzaf - Ramp",
      ],
      "Moderator Name and Company": ["Nemil Dalal - Y Combinator"],
      "Role or Title (from Onboarded Speakers)": [
        "VP, Stablecoin",
        "Head of Digital Asset Partnerships",
      ],
      "Role or Title (from Moderator)": ["Visiting Partner"],
      "Confirmed Speakers Full Name": [
        "Rowland Berry - Payoneer",
        "Ahmed Zifzaf - Ramp",
      ],
      "Web Publishing Status": [...FULL_STATUS, "recDescription"],
    },
  };
}

beforeEach(() => {
  vi.stubEnv("AIRTABLE_BASE_ID_AGENDA", "appAgenda");
  vi.stubEnv("AIRTABLE_TABLE_ID_AGENDA", "tblAgenda");
  vi.stubEnv("AIRTABLE_VIEW_ID_AGENDA", "viwAgenda");
  vi.stubEnv("AIRTABLE_PAT", "test-token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function stubAirtable(
  agendaRecords: unknown[],
  statusRecords = STATUS_RECORDS,
) {
  const fetchMock = vi.fn(async (url: string) => ({
    ok: true,
    json: async () => ({
      records: url.includes(`/${STATUS_TABLE_ID}?`)
        ? statusRecords
        : agendaRecords,
    }),
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("Breakpoint agenda publishing flags", () => {
  it("reads linked status records and plain status names", () => {
    expect(
      readPublishingFlags(
        { "Web Publishing Status": ["recTime", "recTitle"] },
        { recTime: "Time", recTitle: "Title" },
      ),
    ).toEqual({
      description: false,
      doNotPublish: false,
      speakers: false,
      time: true,
      title: true,
    });
    expect(
      readPublishingFlags({
        "Web Publishing Status": ["Do not publish"],
      })?.doNotPublish,
    ).toBe(true);
    expect(readPublishingFlags({})).toBeNull();
  });

  it("hides sessions that are unpublished or not yet reviewed", () => {
    const names = { recNo: "Do not publish", recTitle: "Title" };
    expect(
      normalizeAgendaRecord(
        {
          id: "unpublished",
          fields: {
            Session: "Fireside: Barclays",
            "Web Publishing Status": ["recNo", "recTitle"],
          },
        },
        0,
        names,
      ),
    ).toBeNull();
    expect(
      normalizeAgendaRecord(
        { id: "unreviewed", fields: { Session: "Plume + Fidelity" } },
        0,
        names,
      ),
    ).toBeNull();
  });

  it("withholds time, speakers and description until each is approved", () => {
    const record = panelRecord();
    record.fields["Web Publishing Status"] = ["Title"];

    const item = normalizeAgendaRecord(record, 0);
    expect(item).not.toBeNull();
    expect(item?.title).toBe("Why Should I Use Your Stablecoin?");
    expect(item?.time).toBe("TBC");
    expect(item?.speakers).toEqual([]);
    expect(item?.speakerIds).toEqual([]);
    expect(item?.description).toBeUndefined();
    // Still sorts into its real slot so the day order holds once time is published.
    expect(item?.sortOrder).toBe(11 * 60 + 15);
  });
});

describe("Breakpoint agenda records", () => {
  it("maps a published panel with aligned speaker roles and a moderator", () => {
    const names = Object.fromEntries(
      STATUS_RECORDS.map((record) => [record.id, record.fields["Web Status"]]),
    );
    const item = normalizeAgendaRecord(panelRecord(), 0, names);

    expect(item).toMatchObject({
      assetClasses: ["Money"],
      day: "Day 1",
      description: "Three stablecoin issuers on distribution.",
      duration: "15 min.",
      format: "Panel",
      location: "Main Stage",
      time: "11:15",
      variant: "session",
    });
    expect(item?.speakers).toEqual([
      {
        company: "Payoneer",
        id: "recRowland00000001",
        name: "Rowland Berry",
        title: "VP, Stablecoin",
      },
      {
        company: "Ramp",
        id: "recAhmed0000000001",
        name: "Ahmed Zifzaf",
        title: "Head of Digital Asset Partnerships",
      },
      {
        company: "Y Combinator",
        id: "recNemil0000000001",
        isModerator: true,
        name: "Nemil Dalal",
        title: "Visiting Partner",
      },
    ]);
    expect(item?.speakerIds).toEqual([
      "recRowland00000001",
      "recAhmed0000000001",
      "recNemil0000000001",
    ]);
  });

  it("derives the day from the start date, not the Day - Format formula", () => {
    const base = {
      Session: "Keynote: Standard Life",
      "Day - Format": "Day 3 - Keynote (10 min)",
      "Web Publishing Status": ["Time", "Title"],
    };

    expect(
      normalizeAgendaRecord(
        {
          id: "day2",
          fields: { ...base, "Start Time": "2026-11-17T14:22:00.000Z" },
        },
        0,
      )?.day,
    ).toBe("Day 2");
    expect(
      normalizeAgendaRecord(
        {
          id: "day1",
          fields: { ...base, "⚙️ Start Day": "2026-11-16" },
        },
        0,
      )?.day,
    ).toBe("Day 1");
    expect(
      normalizeAgendaRecord(
        { id: "explicit", fields: { ...base, Day: "Day 2" } },
        0,
      )?.day,
    ).toBe("Day 2");
  });

  it("renders clock times in London time, not UTC or the server zone", () => {
    // 1 July is British Summer Time, so London is an hour ahead of UTC.
    const item = normalizeAgendaRecord(
      {
        id: "bst",
        fields: {
          Session: "Summer side session",
          "Start Time": "2026-07-01T11:15:00.000Z",
          "End Time": "2026-07-01T11:30:00.000Z",
          "Web Publishing Status": ["Time", "Title"],
        },
      },
      0,
    );

    expect(item?.time).toBe("12:15");
    expect(item?.duration).toBe("15 min.");
  });

  it("keeps breaks as static rows and drops internal asset tags", () => {
    const lunch = normalizeAgendaRecord(
      {
        id: "lunch",
        fields: {
          Session: "Lunch",
          "Start Time": "2026-11-16T13:00:00.000Z",
          Duration: [60],
          Stage: "Main Stage",
          "Asset Class": ["Break"],
          Format_Cleaned: "Break",
          "Web Publishing Status": ["Time", "Title"],
        },
      },
      0,
    );
    expect(lunch).toMatchObject({
      assetClasses: [],
      duration: "1hr",
      variant: "static",
    });

    const welcome = normalizeAgendaRecord(
      {
        id: "welcome",
        fields: {
          Session: "Welcome to Breakpoint 2026",
          "Asset Class": ["Open"],
          Format_Cleaned: "Royal Exchange Keynote",
          Stage: "Royal Exchange",
          "Web Publishing Status": ["Time", "Title"],
        },
      },
      0,
    );
    expect(welcome?.assetClasses).toEqual([]);
    expect(welcome?.format).toBe("Keynote");
    expect(
      normalizeAgendaRecord(
        {
          id: "open",
          fields: {
            Session: "Welcome to Breakpoint 2026",
            Format_Cleaned: "Day 1 Open",
            "Web Publishing Status": ["Title"],
          },
        },
        0,
      )?.format,
    ).toBe("Welcome");
    expect(welcome?.variant).toBe("session");

    for (const title of [
      "Breakpoint 2027 Announcement",
      "Closing Fireside: Michael Lewis",
      "See You at Breakpoint 2027!",
    ]) {
      expect(
        normalizeAgendaRecord(
          {
            id: title,
            fields: {
              Session: title,
              Format_Cleaned: "Fireside",
              "Web Publishing Status": ["Title"],
            },
          },
          0,
        )?.variant,
      ).toBe("session");
    }
  });

  it("fetches the agenda and the status table, then sorts by day and time", async () => {
    const fetchMock = stubAirtable([
      {
        id: "late",
        fields: {
          Session: "Closing Fireside",
          "Start Time": "2026-11-17T16:56:00.000Z",
          "Web Publishing Status": FULL_STATUS,
        },
      },
      panelRecord(),
      {
        id: "hidden",
        fields: {
          Session: "Stage Reset",
          "Start Time": "2026-11-16T14:17:00.000Z",
          "Web Publishing Status": ["recNo"],
        },
      },
      {
        id: "early",
        fields: {
          Session: "Welcome to Breakpoint 2026",
          "Start Time": "2026-11-16T10:00:00.000Z",
          "Web Publishing Status": FULL_STATUS,
        },
      },
    ]);

    const agenda = await getAirtableAgenda();

    expect(agenda?.map((item) => item.id)).toEqual([
      "early",
      "recPanel",
      "late",
    ]);
    expect(agenda?.[2]?.day).toBe("Day 2");

    const urls = fetchMock.mock.calls.map(([url]) => url as string);
    expect(urls.some((url) => url.includes(`/${STATUS_TABLE_ID}?`))).toBe(true);
    const agendaUrl = urls.find((url) => url.includes("/tblAgenda?"));
    expect(agendaUrl).toContain("fields%5B%5D=Web+Publishing+Status");
  });

  it("hides a session whose status link cannot be resolved", () => {
    expect(
      readPublishingFlags(
        { "Web Publishing Status": ["recTitle", "recMystery0000001"] },
        { recTitle: "Title" },
      )?.doNotPublish,
    ).toBe(true);
  });

  it("keeps the built-in Do not publish id when the status view omits it", async () => {
    stubAirtable(
      [
        {
          id: "blocked",
          fields: {
            Session: "Fireside: Barclays",
            "Web Publishing Status": ["recOn6L12BmGHDOno", "recqpel3kBGWP6Xkx"],
          },
        },
        {
          id: "shown",
          fields: {
            Session: "Keynote: Zelle",
            "Web Publishing Status": ["recOn6L12BmGHDOno"],
          },
        },
      ],
      [{ id: "recOn6L12BmGHDOno", fields: { "Web Status": "Title" } }],
    );

    const agenda = await getAirtableAgenda();
    expect(agenda?.map((item) => item.id)).toEqual(["shown"]);
  });

  it("falls back to the built-in status ids when the status table is empty", async () => {
    stubAirtable(
      [
        {
          id: "known-ids",
          fields: {
            Session: "Keynote: Bullish",
            "Web Publishing Status": ["recwtiuTWTluBFNAE", "recOn6L12BmGHDOno"],
          },
        },
      ],
      [],
    );

    const agenda = await getAirtableAgenda();
    expect(agenda?.map((item) => item.title)).toEqual(["Keynote: Bullish"]);
  });
});
