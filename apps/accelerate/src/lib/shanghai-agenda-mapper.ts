export const SHANGHAI_EVENT_RECORD_ID = "recAV2sRCIpOBYOZB";

export const SHANGHAI_AGENDA_FIELD_IDS = {
  title: "fldU6L4Zb3oQc5jfv",
  description: "fldFrvbJkVfvGRGmG",
  startTime: "fldmCK4LYKbAAujB0",
  endTime: "fldEDU8fKeEKMNnZv",
  order: "fldKqtpMaiDhXj9Is",
  track: "fldVqBaGdE7rvTneU",
  format: "fldvp5xe84kpERPJW",
  commsReview: "fldFaa7jnWfBRjtyh",
  publishStatus: "fldf7gUUOMbjSEDuf",
  event: "fldNWIRYgj2sZp7YJ",
} as const;

export const SHANGHAI_FORMAT_TABLE_ID = "tbl8VddfxPnw3cEFm";
export const SHANGHAI_FORMAT_NAME_FIELD_ID = "fld9bRywY7R1yaE2n";

export type ShanghaiAgendaSourceRecord = {
  id: string;
  fields?: Record<string, unknown>;
};

export type ShanghaiAgendaSession = {
  id: string;
  title: string;
  description?: string;
  time?: {
    start: string;
    end?: string;
    label: string;
  };
  track?: string;
  formats?: string[];
};

export type ShanghaiAgendaMappingOptions = {
  ignorePublicationFlags?: boolean;
  formatNames?: Readonly<Record<string, string>>;
};

const SHANGHAI_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Shanghai",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

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

function getTimeRange(
  record: ShanghaiAgendaSourceRecord,
): ShanghaiAgendaSession["time"] {
  const start = asString(record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.startTime]);
  if (!start) return undefined;

  const startDate = new Date(start);
  if (!Number.isFinite(startDate.valueOf())) return undefined;

  const end = asString(record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.endTime]);
  const endDate = end ? new Date(end) : undefined;
  const validEnd =
    endDate && Number.isFinite(endDate.valueOf()) ? end : undefined;
  const label = `${SHANGHAI_TIME_FORMATTER.format(startDate)}${validEnd ? `–${SHANGHAI_TIME_FORMATTER.format(endDate!)}` : ""}`;

  return {
    start,
    ...(validEnd ? { end: validEnd } : {}),
    label,
  };
}

function getFormatRecordIds(record: ShanghaiAgendaSourceRecord): string[] {
  const linkedFormats = record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.format];
  if (!Array.isArray(linkedFormats)) return [];

  return linkedFormats.flatMap((format) => {
    if (typeof format === "string") return [format];
    if (
      format !== null &&
      typeof format === "object" &&
      "id" in format &&
      typeof format.id === "string"
    ) {
      return [format.id];
    }
    return [];
  });
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

/** Reduce Airtable rows to the displayed Shanghai agenda fields. */
export function mapShanghaiAgendaRecords(
  records: readonly ShanghaiAgendaSourceRecord[],
  {
    ignorePublicationFlags = false,
    formatNames = {},
  }: ShanghaiAgendaMappingOptions = {},
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
      const track = getSelectName(
        record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.track],
      );
      const formats = [...new Set(getFormatRecordIds(record))]
        .map((formatId) => formatNames[formatId])
        .filter((name): name is string => Boolean(name));
      const time = getTimeRange(record);

      return [
        {
          id: record.id,
          title,
          ...(description ? { description } : {}),
          ...(time ? { time } : {}),
          ...(track ? { track } : {}),
          ...(formats.length ? { formats } : {}),
        },
      ];
    });
}
