import { normalizeProviderName, type MetricRow } from "./data-config";

export type GrpcUptimeStatus = "observed" | "outage" | "unknown";
export type GrpcUptimeSegment = {
  start: number;
  end: number;
  status: GrpcUptimeStatus;
  downtime: number;
};
export type GrpcUptimeRow = {
  provider: string;
  segments: GrpcUptimeSegment[];
  reconnects: { time: number; count: number }[];
};

export function getGrpcUptimeRows(
  rows: readonly MetricRow[],
  selectedProviders: ReadonlySet<string>,
  start: number,
  end: number,
  stepSeconds: number,
): GrpcUptimeRow[] {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start >= end ||
    !Number.isFinite(stepSeconds) ||
    stepSeconds <= 0
  )
    return [];
  const providers = new Map(
    [...selectedProviders].map(normalizeProviderName).map((provider) => [
      provider,
      {
        buckets: new Map<number, number>(),
        reconnects: new Map<number, number>(),
      },
    ]),
  );
  for (const row of rows) {
    const provider = providers.get(normalizeProviderName(row.providerName));
    const time = Date.parse(row.date);
    if (
      !provider ||
      !Number.isFinite(time) ||
      !Number.isFinite(row.value) ||
      row.value < 0
    )
      continue;
    if (
      row.metricName === "gRPC Downtime Trend" &&
      time < end &&
      time + stepSeconds * 1000 > start
    ) {
      provider.buckets.set(time, row.value);
    } else if (
      row.metricName === "gRPC Reconnect Event" &&
      time >= start &&
      time < end &&
      Number.isInteger(row.value) &&
      row.value > 0
    ) {
      provider.reconnects.set(
        time,
        (provider.reconnects.get(time) ?? 0) + row.value,
      );
    }
  }
  return [...providers.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, data]) => {
      const segments: GrpcUptimeSegment[] = [];
      function append(segment: GrpcUptimeSegment) {
        const previous = segments.at(-1);
        if (
          previous &&
          previous.end === segment.start &&
          previous.status === segment.status
        ) {
          previous.end = segment.end;
          previous.downtime += segment.downtime;
        } else segments.push(segment);
      }
      let cursor = start;
      for (const [time, downtime] of [...data.buckets].sort(
        ([a], [b]) => a - b,
      )) {
        const from = Math.max(start, time, cursor);
        const to = Math.min(end, time + stepSeconds * 1000);
        if (from >= to) continue;
        if (from > cursor)
          append({ start: cursor, end: from, status: "unknown", downtime: 0 });
        append({
          start: from,
          end: to,
          status: downtime > 0 ? "outage" : "observed",
          downtime,
        });
        cursor = to;
      }
      if (cursor < end)
        append({ start: cursor, end, status: "unknown", downtime: 0 });
      return {
        provider,
        segments,
        reconnects: [...data.reconnects]
          .sort(([a], [b]) => a - b)
          .map(([time, count]) => ({ time, count })),
      };
    });
}
