import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
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

test("SQLite releases a crashed writer and concurrent workers recover safely", async () => {
  const path = await directory();
  const crashed = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { DatabaseSync } from 'node:sqlite';
    const db = new DatabaseSync(process.argv[1] + '/pacing.sqlite');
    db.exec('CREATE TABLE pacing (id INTEGER PRIMARY KEY, nextRequestAt INTEGER, cooldownUntil INTEGER); INSERT INTO pacing VALUES (1, 0, 0); BEGIN IMMEDIATE; UPDATE pacing SET cooldownUntil = 9999999999999;');
    process.send('locked');
  `,
      path,
    ],
    { stdio: ["ignore", "ignore", "pipe", "ipc"] },
  );
  try {
    await once(crashed, "message");
    const exited = once(crashed, "exit");
    crashed.kill("SIGKILL");
    await exited;
    const moduleUrl = new URL("../client.ts", import.meta.url).href;
    const script = `
      import { createAirtableClient } from ${JSON.stringify(moduleUrl)};
      globalThis.fetch = async () => new Response('{}');
      await createAirtableClient({ directory: process.argv[1] })('https://api.airtable.com/v0/base/table', 'token', {}, 'test');
    `;
    await Promise.all(
      Array.from({ length: 4 }, () =>
        promisify(execFile)(process.execPath, [
          "--input-type=module",
          "-e",
          script,
          path,
        ]),
      ),
    );
  } finally {
    crashed.kill();
  }
});

test("a request already queued in another worker rechecks a new 429 cooldown", async () => {
  const path = await directory();
  const initialTime = 1_700_000_000_000;
  const moduleUrl = new URL("../client.ts", import.meta.url).href;
  const script = `
    import { once } from 'node:events';
    import { createAirtableClient } from ${JSON.stringify(moduleUrl)};
    let time = ${initialTime};
    let calls = 0;
    async function wake() {
      const [message] = await once(process, 'message');
      time = message.time ?? time;
    }
    globalThis.fetch = async () => {
      process.send({ event: 'fetch', time });
      if (process.argv[2] === 'first' && ++calls === 1) {
        await wake();
        return new Response('', { status: 429 });
      }
      return new Response('{}');
    };
    await createAirtableClient({
      directory: process.argv[1], now: () => time, random: () => 0,
      sleep: async (ms) => { process.send({ event: 'sleep', ms, time }); await wake(); },
    })('https://api.airtable.com/v0/base/table', 'token', {}, 'test');
    process.send({ event: 'done', time });
    process.disconnect();
  `;
  type Message = { event: string; time: number; ms?: number };
  function worker(role: string) {
    const child = spawn(
      process.execPath,
      ["--input-type=module", "-e", script, path, role],
      {
        stdio: ["ignore", "ignore", "pipe", "ipc"],
      },
    );
    const messages: Message[] = [];
    let waiting: ((message: Message) => void) | undefined;
    child.on("message", (message: Message) => {
      if (waiting) {
        const resolve = waiting;
        waiting = undefined;
        resolve(message);
      } else messages.push(message);
    });
    return {
      child,
      next: () =>
        messages.length
          ? Promise.resolve(messages.shift()!)
          : new Promise<Message>((resolve) => {
              waiting = resolve;
            }),
    };
  }
  const first = worker("first");
  let second: ReturnType<typeof worker> | undefined;
  try {
    expect((await first.next()).event).toBe("fetch");
    second = worker("second");
    expect(await second.next()).toMatchObject({ event: "sleep", ms: 300 });
    first.child.send({});
    expect(await first.next()).toMatchObject({ event: "sleep", ms: 30_000 });
    second.child.send({ time: initialTime + 300 });
    // A worker that trusted its original slot would issue fetch here instead.
    expect(await second.next()).toMatchObject({ event: "sleep", ms: 29_700 });
    second.child.send({ time: initialTime + 30_000 });
    expect(await second.next()).toMatchObject({
      event: "fetch",
      time: initialTime + 30_000,
    });
    expect((await second.next()).event).toBe("done");
    first.child.send({ time: initialTime + 30_300 });
    expect(await first.next()).toMatchObject({
      event: "fetch",
      time: initialTime + 30_300,
    });
    expect((await first.next()).event).toBe("done");
  } finally {
    first.child.kill();
    second?.child.kill();
  }
});
