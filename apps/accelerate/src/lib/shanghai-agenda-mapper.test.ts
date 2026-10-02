import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mapShanghaiAgendaRecords,
  SHANGHAI_AGENDA_FIELD_IDS as FIELD,
  SHANGHAI_EVENT_RECORD_ID,
  type ShanghaiAgendaSourceRecord,
} from "./shanghai-agenda-mapper";

function record(
  id: string,
  overrides: Record<string, unknown> = {},
): ShanghaiAgendaSourceRecord {
  return {
    id,
    fields: {
      [FIELD.title]: `Session ${id}`,
      [FIELD.description]: `Description ${id}`,
      [FIELD.order]: 1,
      [FIELD.publishStatus]: "Live",
      [FIELD.commsReview]: "Cleared",
      [FIELD.event]: [SHANGHAI_EVENT_RECORD_ID],
      ...overrides,
    },
  };
}

test("publishes only live, cleared Shanghai titles and descriptions", () => {
  const approved = record("rec-approved");
  const draft = record("rec-draft", {
    [FIELD.publishStatus]: "Ready to publish",
  });
  const wrongEvent = record("rec-wrong-event", {
    [FIELD.event]: ["rec-other-event"],
  });
  const missingDescription = record("rec-no-description", {
    [FIELD.description]: "   ",
    [FIELD.order]: 2,
  });
  const uncleared = record("rec-uncleared", {
    [FIELD.commsReview]: "In review",
  });

  const result = mapShanghaiAgendaRecords([
    missingDescription,
    wrongEvent,
    draft,
    uncleared,
    approved,
  ]);

  assert.deepEqual(result, [
    {
      id: "rec-approved",
      title: "Session rec-approved",
      description: "Description rec-approved",
    },
    {
      id: "rec-no-description",
      title: "Session rec-no-description",
    },
  ]);
});

test("preview mode ignores publication flags but keeps event and field filters", () => {
  const unpublished = record("rec-preview", {
    [FIELD.publishStatus]: "Internal only",
    [FIELD.commsReview]: "Not reviewed",
    Speakers: ["PRIVATE SPEAKER"],
    Email: "private@example.com",
    "BD Notes": "PRIVATE NOTES",
  });
  const wrongEvent = record("rec-wrong-event-preview", {
    [FIELD.event]: ["rec-other-event"],
  });

  assert.deepEqual(
    mapShanghaiAgendaRecords([unpublished, wrongEvent], {
      ignorePublicationFlags: true,
    }),
    [
      {
        id: "rec-preview",
        title: "Session rec-preview",
        description: "Description rec-preview",
      },
    ],
  );
});

test("maps Shanghai time, track, and linked format labels for display", () => {
  const scheduled = record("rec-display-details", {
    [FIELD.startTime]: "2026-10-16T02:00:00.000Z",
    [FIELD.endTime]: "2026-10-16T02:05:00.000Z",
    [FIELD.track]: "AI × blockchain",
    [FIELD.format]: ["rec-format-keynote"],
  });

  assert.deepEqual(
    mapShanghaiAgendaRecords([scheduled], {
      formatNames: { "rec-format-keynote": "Keynote" },
    }),
    [
      {
        id: "rec-display-details",
        title: "Session rec-display-details",
        description: "Description rec-display-details",
        time: {
          start: "2026-10-16T02:00:00.000Z",
          end: "2026-10-16T02:05:00.000Z",
          label: "10:00–10:05",
        },
        track: "AI × blockchain",
        formats: ["Keynote"],
      },
    ],
  );
});

test("sorts approved sessions by schedule without returning schedule fields", () => {
  const later = record("rec-later", {
    [FIELD.order]: 2,
    [FIELD.startTime]: "2026-10-16T02:30:00.000Z",
  });
  const earlier = record("rec-earlier", {
    [FIELD.order]: 1,
    [FIELD.startTime]: "2026-10-16T02:00:00.000Z",
  });

  const result = mapShanghaiAgendaRecords([later, earlier]);

  assert.deepEqual(
    result.map(({ id }) => id),
    ["rec-earlier", "rec-later"],
  );
  for (const session of result) {
    assert.deepEqual(Object.keys(session).sort(), [
      "description",
      "id",
      "time",
      "title",
    ]);
    assert.equal("order" in session, false);
  }
});

test("excludes blank titles and records with missing approval state", () => {
  const blankTitle = record("rec-blank-title", {
    [FIELD.title]: "  ",
  });
  const noPublicationState = record("rec-no-status", {
    [FIELD.publishStatus]: undefined,
  });

  assert.deepEqual(
    mapShanghaiAgendaRecords([blankTitle, noPublicationState]),
    [],
  );
});

test("drops all non-whitelisted private Airtable fields", () => {
  const source = record("rec-private", {
    Speakers: ["PRIVATE SPEAKER"],
    Email: "private@example.com",
    Phone: "+1 555 0100",
    WeChat: "private-wechat",
    "BD Notes": "PRIVATE NOTES",
    Slides: ["https://private.example/slides"],
  });

  assert.deepEqual(mapShanghaiAgendaRecords([source]), [
    {
      id: "rec-private",
      title: "Session rec-private",
      description: "Description rec-private",
    },
  ]);
});
