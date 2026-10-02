export const SHANGHAI_EVENT_RECORD_ID = "recAV2sRCIpOBYOZB";

export const SHANGHAI_AGENDA_FIELD_IDS = {
  title: "fldU6L4Zb3oQc5jfv",
  description: "fldFrvbJkVfvGRGmG",
  startTime: "fldmCK4LYKbAAujB0",
  order: "fldKqtpMaiDhXj9Is",
  commsReview: "fldFaa7jnWfBRjtyh",
  publishStatus: "fldf7gUUOMbjSEDuf",
  event: "fldNWIRYgj2sZp7YJ",
} as const;

export type ShanghaiAgendaSourceRecord = {
  id: string;
  fields?: Record<string, unknown>;
};

export type ShanghaiAgendaSession = {
  id: string;
  title: string;
  description?: string;
};

export type ShanghaiAgendaMappingOptions = {
  ignorePublicationFlags?: boolean;
};

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function getSelectName(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "name" in value) {
    return asString(value.name);
  }
  return undefined;
}

function hasShanghaiEvent(record: ShanghaiAgendaSourceRecord): boolean {
  const links = record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.event];
  return (
    Array.isArray(links) &&
    links.some((link) => {
      if (typeof link === "string") return link === SHANGHAI_EVENT_RECORD_ID;
      return (
        link !== null &&
        typeof link === "object" &&
        "id" in link &&
        link.id === SHANGHAI_EVENT_RECORD_ID
      );
    })
  );
}

function isPubliclyApproved(record: ShanghaiAgendaSourceRecord): boolean {
  const fields = record.fields;
  return (
    getSelectName(fields?.[SHANGHAI_AGENDA_FIELD_IDS.publishStatus]) ===
      "Live" &&
    getSelectName(fields?.[SHANGHAI_AGENDA_FIELD_IDS.commsReview]) === "Cleared"
  );
}

function getOrder(record: ShanghaiAgendaSourceRecord): number | undefined {
  const value = record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.order];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function getStartTime(record: ShanghaiAgendaSourceRecord): number | undefined {
  const value = asString(record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.startTime]);
  if (!value) return undefined;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}

function compareSchedule(
  left: ShanghaiAgendaSourceRecord,
  right: ShanghaiAgendaSourceRecord,
): number {
  const leftOrder = getOrder(left);
  const rightOrder = getOrder(right);

  if (leftOrder !== undefined && rightOrder !== undefined) {
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  } else if (leftOrder !== undefined) {
    return -1;
  } else if (rightOrder !== undefined) {
    return 1;
  }

  const leftStart = getStartTime(left);
  const rightStart = getStartTime(right);
  if (leftStart !== undefined && rightStart !== undefined) {
    if (leftStart !== rightStart) return leftStart - rightStart;
  } else if (leftStart !== undefined) {
    return -1;
  } else if (rightStart !== undefined) {
    return 1;
  }

  return left.id.localeCompare(right.id);
}

/**
 * Reduce Airtable records to the public Shanghai agenda allowlist.
 * Schedule and approval fields are used only for filtering and ordering.
 */
export function mapShanghaiAgendaRecords(
  records: readonly ShanghaiAgendaSourceRecord[],
  { ignorePublicationFlags = false }: ShanghaiAgendaMappingOptions = {},
): ShanghaiAgendaSession[] {
  return records
    .filter(hasShanghaiEvent)
    .filter((record) => ignorePublicationFlags || isPubliclyApproved(record))
    .sort(compareSchedule)
    .flatMap((record) => {
      const title = asString(record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.title]);
      if (!title) return [];

      const description = asString(
        record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.description],
      );

      return [
        {
          id: record.id,
          title,
          ...(description ? { description } : {}),
        },
      ];
    });
}
