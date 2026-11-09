import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, expect, test, vi } from "vitest";
import { createAirtableClient } from "../client";

const directories: string[] = [];
async function directory() {
  const path = await mkdtemp(join(tmpdir(), "airtable-test-"));
  directories.push(path);
  return path;
}

afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(
    directories
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});

test("separate Node workers share request pacing", async () => {
  const path = await directory();
  const moduleUrl = new URL("../client.ts", import.meta.url).href;
  const script = `
    import { createAirtableClient } from ${JSON.stringify(moduleUrl)};
    globalThis.fetch = async () => {
      console.log(Date.now());
      return new Response('{}');
    };
    await createAirtableClient({ directory: process.argv[1] })('https://api.airtable.com/v0/base/table', 'token', {}, 'test');
  `;
  const workers = await Promise.all(
    Array.from({ length: 4 }, () =>
      promisify(execFile)(process.execPath, [
        "--input-type=module",
        "-e",
        script,
        path,
      ]),
    ),
  );
  const times = workers
    .map(({ stdout }) => Number(stdout.trim()))
    .sort((a, b) => a - b);
  for (let index = 1; index < times.length; index++) {
    expect(times[index]! - times[index - 1]!).toBeGreaterThanOrEqual(280);
  }
});

test.each([
  [{}, 30_000],
  [{ "retry-after-ms": "5" }, 30_000],
  [{ "retry-after": "45" }, 45_000],
  [{ "retry-after-ms": "50000" }, 50_000],
  [{ "retry-after": new Date(1_700_000_050_000).toUTCString() }, 50_000],
  [{ "retry-after": "invalid" }, 30_000],
])(
  "429 respects Airtable's minimum and Retry-After %j",
  async (headers, minimum) => {
    let time = 1_700_000_000_000;
    const times: number[] = [];
    const fetchMock = vi.fn<typeof fetch>(async () => {
      times.push(time);
      return times.length === 1
        ? new Response("", { status: 429, headers })
        : new Response('{"ok":true}');
    });
    vi.stubGlobal("fetch", fetchMock);
    const client = createAirtableClient({
      directory: await directory(),
      now: () => time,
      sleep: async (ms) => {
        time += ms;
      },
      random: () => 0.5,
    });
    const options = { next: { revalidate: 1800, tags: ["speakers"] } };
    expect(
      await client(
        "https://api.airtable.com/v0/base/table",
        "secret",
        options,
        "test",
      ),
    ).toEqual({ ok: true });
    expect(times[1]! - times[0]!).toBe(minimum + 500);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.airtable.com/v0/base/table",
      {
        ...options,
        headers: { Authorization: "Bearer secret" },
      },
    );
  },
);

test("exponential backoff is bounded and the final 429 delays other clients", async () => {
  let time = 1_700_000_000_000;
  const times: number[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      times.push(time);
      return times.length <= 3
        ? new Response("", { status: 429 })
        : new Response("{}");
    }),
  );
  const config = {
    directory: await directory(),
    now: () => time,
    sleep: async (ms: number) => {
      time += ms;
    },
    random: () => 0,
  };
  await expect(
    createAirtableClient(config)(
      "https://api.airtable.com/v0/base/table",
      "token",
      {},
      "speakers",
    ),
  ).rejects.toThrow("speakers failed (429) after 3 attempts");
  await createAirtableClient(config)(
    "https://api.airtable.com/v0/base/other",
    "token",
    {},
    "agenda",
  );
  expect(times.slice(1).map((time, index) => time - times[index]!)).toEqual([
    30_000, 60_000, 120_000,
  ]);
});

test("permanent errors are not retried and no-store is preserved", async () => {
  const fetchMock = vi.fn<typeof fetch>(
    async () => new Response("private upstream details", { status: 403 }),
  );
  vi.stubGlobal("fetch", fetchMock);
  await expect(
    createAirtableClient({ directory: await directory() })(
      "https://api.airtable.com/v0/base/table",
      "secret",
      { cache: "no-store" },
      "agenda",
    ),
  ).rejects.toThrow("agenda failed (403)");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ cache: "no-store" });
});
