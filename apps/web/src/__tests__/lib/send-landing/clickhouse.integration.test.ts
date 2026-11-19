import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  getSendLandingData,
  getSendLandingFilters,
  type SendLandingConfig,
} from "@/lib/send-landing/server";

// Opt-in: runs the dashboard queries against a real ClickHouse with the send
// benchmark's migration applied. Needs SEND_LANDING_CLICKHOUSE_TEST_URL (an HTTP
// endpoint the test user can create databases on), _USER, _PASSWORD and
// SEND_LANDING_MIGRATION_SQL (path to send-latency-monitor's 00001_send_benchmark.sql).
const url = process.env.SEND_LANDING_CLICKHOUSE_TEST_URL;
const migrationPath = process.env.SEND_LANDING_MIGRATION_SQL;
const database = "send_landing_it";
const config: SendLandingConfig = {
  url: url ?? "http://localhost:8123",
  database,
  user: process.env.SEND_LANDING_CLICKHOUSE_TEST_USER ?? "default",
  password: process.env.SEND_LANDING_CLICKHOUSE_TEST_PASSWORD ?? "",
};
const now = Date.parse("2026-11-09T12:00:00Z");

async function execute(statement: string, targetDatabase?: string) {
  const endpoint = new URL(config.url);
  if (targetDatabase) endpoint.searchParams.set("database", targetDatabase);
  const response = await fetch(endpoint, {
    method: "POST",
    body: statement,
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.user}:${config.password}`).toString("base64")}`,
    },
  });
  if (!response.ok)
    throw new Error(`${response.status}: ${await response.text()}`);
}

function migrationStatements(sql: string) {
  const up = sql.split("-- +goose Down")[0];
  return up
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

const uuid = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

type Attempt = {
  round: number;
  provider: string;
  outcome: "landed" | "failed" | "dropped";
  slot?: number;
  index?: number;
  rank?: number;
  behind?: number;
  delta?: number;
  responseNs?: number;
  sendStatus?: string;
  fee?: number;
  tip?: number;
};

function attemptRow(attempt: Attempt, region: string, started: string): string {
  const v = (value: number | undefined) =>
    value === undefined ? "NULL" : String(value);
  const included = attempt.outcome !== "dropped";
  return `('${uuid(attempt.round)}', '${region}', 'tsw', '${attempt.provider}', 'sendTransaction',
    'sig-${attempt.round}-${attempt.provider}', '${started}', '${started}', ${v(attempt.responseNs)},
    '${attempt.sendStatus ?? "accepted"}', '', '${attempt.outcome}', ${v(attempt.slot)}, ${v(attempt.index)},
    ${included ? 1200 : "NULL"}, ${v(attempt.delta)}, ${v(attempt.rank)}, ${v(attempt.behind)},
    ${included ? (attempt.fee ?? 7000) : 0}, ${attempt.outcome === "landed" ? (attempt.tip ?? 0) : 0},
    '${attempt.outcome === "failed" ? "InstructionError" : ""}')`;
}

const attemptColumns = `(round_id, region, cloud_provider, provider, method, signature, started_utc,
  sent_utc, response_ns, send_status, send_error, outcome, landed_slot, tx_index, block_tx_count,
  slot_delta, \`rank\`, slots_behind_first, fee_lamports, tip_lamports, chain_error)`;
const roundColumns = `(round_id, region, cloud_provider, started_utc, status, reason, sent_slot,
  paths, cu_limit, cu_price_micro_lamports, lock_account, sender_version)`;

function roundRow(
  round: number,
  region: string,
  started: string,
  status: string,
) {
  return `('${uuid(round)}', '${region}', 'tsw', '${started}', '${status}', '', 99, 3, 1000, 2000000, '', 'test')`;
}

describe.skipIf(!url || !migrationPath)(
  "send landing SQL on ClickHouse",
  () => {
    beforeAll(async () => {
      await execute(`DROP DATABASE IF EXISTS ${database}`);
      await execute(`CREATE DATABASE ${database}`);
      for (const statement of migrationStatements(
        readFileSync(migrationPath!, "utf8"),
      ))
        await execute(statement, database);

      const r1: Attempt[] = [
        {
          round: 1,
          provider: "alpha",
          outcome: "landed",
          slot: 100,
          index: 10,
          rank: 1,
          behind: 0,
          delta: 1,
          responseNs: 2_000_000,
          tip: 5000,
        },
        {
          round: 1,
          provider: "bravo",
          outcome: "landed",
          slot: 100,
          index: 15,
          rank: 2,
          behind: 0,
          delta: 1,
          responseNs: 4_000_000,
        },
        {
          round: 1,
          provider: "charlie",
          outcome: "dropped",
          responseNs: 6_000_000,
        },
      ];
      const r2: Attempt[] = [
        {
          round: 2,
          provider: "bravo",
          outcome: "landed",
          slot: 200,
          index: 3,
          rank: 1,
          behind: 0,
          delta: 0,
          responseNs: 4_000_000,
        },
        {
          round: 2,
          provider: "alpha",
          outcome: "failed",
          slot: 201,
          index: 1,
          rank: 2,
          behind: 1,
          delta: 1,
          responseNs: 2_000_000,
          tip: 5000,
        },
        {
          round: 2,
          provider: "charlie",
          outcome: "landed",
          slot: 201,
          index: 50,
          rank: 3,
          behind: 1,
          delta: 1,
          responseNs: 6_000_000,
        },
      ];
      // Round 3: in EWR, nothing included, so it is not scored.
      const r3: Attempt[] = [
        // A fast rejection must not count as a fast response.
        {
          round: 3,
          provider: "alpha",
          outcome: "dropped",
          responseNs: 1_000_000,
          sendStatus: "rpc_error",
        },
        { round: 3, provider: "bravo", outcome: "dropped" },
      ];
      // Round 4 never got its round row: interrupted, must be ignored.
      const r4: Attempt[] = [
        {
          round: 4,
          provider: "charlie",
          outcome: "landed",
          slot: 300,
          index: 0,
          rank: 1,
          behind: 0,
          delta: 0,
        },
      ];
      // Round 6: complete but older than the 7-day window.
      const r6: Attempt[] = [
        {
          round: 6,
          provider: "charlie",
          outcome: "landed",
          slot: 50,
          index: 0,
          rank: 1,
          behind: 0,
          delta: 0,
        },
      ];
      const insertAttempts = (rows: string[]) =>
        execute(
          `INSERT INTO benchmark_send_attempts ${attemptColumns} VALUES ${rows.join(",")}`,
          database,
        );
      const insertRounds = (rows: string[]) =>
        execute(
          `INSERT INTO benchmark_send_rounds ${roundColumns} VALUES ${rows.join(",")}`,
          database,
        );
      const fra1 = "2026-11-08 10:00:00.000000000";
      const fra2 = "2026-11-08 11:30:00.000000000";
      const ewr3 = "2026-11-08 12:00:00.000000000";
      const fra4 = "2026-11-08 13:00:00.000000000";
      const fra5 = "2026-11-08 14:00:00.000000000";
      const old6 = "2026-10-20 10:00:00.000000000";
      await insertAttempts([
        ...r1.map((a) => attemptRow(a, "fra", fra1)),
        ...r2.map((a) => attemptRow(a, "fra", fra2)),
        ...r3.map((a) => attemptRow(a, "ewr", ewr3)),
        ...r4.map((a) => attemptRow(a, "fra", fra4)),
        ...r6.map((a) => attemptRow(a, "fra", old6)),
      ]);
      // A retried insert repeats round 1's rows in a separate part.
      await insertAttempts(r1.map((a) => attemptRow(a, "fra", fra1)));
      await insertRounds([
        roundRow(1, "fra", fra1, "complete"),
        roundRow(2, "fra", fra2, "complete"),
        roundRow(3, "ewr", ewr3, "complete"),
        roundRow(5, "fra", fra5, "skipped_budget"),
        roundRow(6, "fra", old6, "complete"),
      ]);
      await insertRounds([roundRow(1, "fra", fra1, "complete")]);
    });

    it("counts only complete rounds, once, inside the window", async () => {
      const data = await getSendLandingData(
        config,
        { region: "all", timeframe: "7d" },
        now,
      );
      expect(data.rounds).toEqual({ complete: 3, skipped: 1 });
      const byProvider = Object.fromEntries(
        data.providers.map((item) => [item.provider, item]),
      );
      expect(byProvider.alpha).toEqual({
        provider: "alpha",
        rounds: 3,
        landed: 1,
        failed: 1,
        dropped: 1,
        scoredRounds: 2,
        firstOnChain: 1,
        indexP50: 10,
        indexP90: 10,
        laterSlot: 1,
        slotsToLandP50: 1,
        responseP50Ms: 2,
        costLamports: 7000 + 5000 + 7000,
      });
      expect(byProvider.bravo).toMatchObject({
        rounds: 3,
        landed: 2,
        failed: 0,
        dropped: 1,
        scoredRounds: 2,
        firstOnChain: 1,
        laterSlot: 0,
        costLamports: 14000,
      });
      expect(byProvider.charlie).toMatchObject({
        rounds: 2,
        landed: 1,
        dropped: 1,
        scoredRounds: 2,
        firstOnChain: 0,
        laterSlot: 1,
        indexP50: 50,
        responseP50Ms: 6,
      });
      expect(data.headToHead).toEqual([
        { provider: "alpha", otherProvider: "bravo", ahead: 1, rounds: 2 },
        { provider: "alpha", otherProvider: "charlie", ahead: 1, rounds: 1 },
        { provider: "bravo", otherProvider: "alpha", ahead: 1, rounds: 2 },
        { provider: "bravo", otherProvider: "charlie", ahead: 1, rounds: 1 },
        { provider: "charlie", otherProvider: "alpha", ahead: 0, rounds: 1 },
        { provider: "charlie", otherProvider: "bravo", ahead: 0, rounds: 1 },
      ]);
      // 1-hour buckets for 7d: rounds 1 and 2 fall in different hours.
      const alphaBuckets = data.buckets.filter(
        (bucket) => bucket.provider === "alpha",
      );
      expect(alphaBuckets).toEqual([
        {
          provider: "alpha",
          timestamp: Date.parse("2026-11-08T10:00:00Z") / 1000,
          rounds: 1,
          landed: 1,
          scoredRounds: 1,
          firstOnChain: 1,
        },
        {
          provider: "alpha",
          timestamp: Date.parse("2026-11-08T11:00:00Z") / 1000,
          rounds: 1,
          landed: 0,
          scoredRounds: 1,
          firstOnChain: 0,
        },
        {
          provider: "alpha",
          timestamp: Date.parse("2026-11-08T12:00:00Z") / 1000,
          rounds: 1,
          landed: 0,
          scoredRounds: 0,
          firstOnChain: 0,
        },
      ]);
    });

    it("filters by region and keeps percentiles null without inclusions", async () => {
      const data = await getSendLandingData(
        config,
        { region: "ewr", timeframe: "7d" },
        now,
      );
      expect(data.rounds).toEqual({ complete: 1, skipped: 0 });
      expect(data.headToHead).toEqual([]);
      expect(data.providers).toEqual([
        expect.objectContaining({
          provider: "alpha",
          rounds: 1,
          dropped: 1,
          scoredRounds: 0,
          indexP50: null,
          slotsToLandP50: null,
          responseP50Ms: null,
          costLamports: 0,
        }),
        expect.objectContaining({ provider: "bravo", rounds: 1, dropped: 1 }),
      ]);
    });

    it("includes older rounds only in longer windows", async () => {
      const data = await getSendLandingData(
        config,
        { region: "fra", timeframe: "30d" },
        now,
      );
      expect(data.rounds).toEqual({ complete: 3, skipped: 1 });
      expect(
        data.providers.find((item) => item.provider === "charlie"),
      ).toMatchObject({ rounds: 3, firstOnChain: 1 });
    });

    it("lists regions with complete rounds and every provider", async () => {
      const filters = await getSendLandingFilters(config);
      expect(filters.regions).toEqual(["ewr", "fra"]);
      expect(filters.providers).toEqual(["alpha", "bravo", "charlie"]);
    });
  },
);
