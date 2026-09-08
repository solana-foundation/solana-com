import {
  asNumber,
  asString,
  getAttachmentUrl,
  getAirtableRecords,
  getField,
  isPublished,
  type AirtableRecord,
} from "@/lib/airtable";
import type { BreakpointSpeaker } from "@/content/speakers/types";

const SPEAKER_FIELDS = [
  "Publish To Web",
  "Name",
  "Role or Title",
  "Company",
  "Twitter",
  "Headshot_For Web (PNG)",
  "Headshot_For_Web (webm)",
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatXUrl(value: string | undefined) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  const handle = value.replace(/^@/, "").trim();
  if (!handle || /^(n\/?a|none|null|-)$/i.test(handle)) return undefined;

  return `https://x.com/${handle}`;
}

function normalizeSpeakerRecord(
  record: AirtableRecord,
  index: number,
): BreakpointSpeaker | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields, { requirePublishFlag: true })) return null;

  const name = getField(
    fields,
    ["Name", "Full Name", "Speaker", "Speaker Name"],
    asString,
  );
  if (!name) return null;

  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ?? index;
  const slug = getField(fields, ["Slug", "slug"], asString) ?? slugify(name);

  return {
    company: getField(
      fields,
      ["Company", "Organization", "Organisation", "Org"],
      asString,
    ),
    headshotPng: getField(
      fields,
      [
        "Headshot_For Web (PNG)",
        "Headshot_For_Web (PNG)",
        "Headshot PNG",
        "Headshot (PNG)",
        "Headshot",
      ],
      getAttachmentUrl,
    ),
    headshotWebm: getField(
      fields,
      [
        "Headshot_For_Web (webm)",
        "Headshot_For Web (webm)",
        "Headshot WEBM",
        "Headshot (webm)",
      ],
      getAttachmentUrl,
    ),
    id: record.id,
    name,
    role: getField(
      fields,
      ["Role", "Role or Title", "Title", "Job Title", "Position"],
      asString,
    ),
    slug,
    sortOrder,
    xUrl: formatXUrl(
      getField(
        fields,
        ["X URL", "X", "Twitter URL", "Twitter", "X Handle", "Twitter Handle"],
        asString,
      ),
    ),
  };
}

async function fetchAirtableSpeakers(): Promise<BreakpointSpeaker[] | null> {
  const records = await getAirtableRecords({
    baseId: process.env.AIRTABLE_BASE_ID_SPEAKERS,
    cacheKey: "breakpoint-speakers",
    cacheTag: "breakpoint-speakers",
    fields: [...SPEAKER_FIELDS],
    label: "Breakpoint speakers",
    tableId: process.env.AIRTABLE_TABLE_ID_SPEAKERS,
    token: process.env.AIRTABLE_PAT,
    viewId: process.env.AIRTABLE_VIEW_ID_SPEAKERS,
  });

  if (!records) return null;

  const speakers = records
    .map((record, index) => normalizeSpeakerRecord(record, index))
    .filter((speaker): speaker is BreakpointSpeaker => speaker !== null);

  const deduped = new Map<string, BreakpointSpeaker>();
  for (const speaker of speakers) {
    if (!deduped.has(speaker.slug)) deduped.set(speaker.slug, speaker);
  }

  return [...deduped.values()].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name);
  });
}

export const getAirtableSpeakers = fetchAirtableSpeakers;
