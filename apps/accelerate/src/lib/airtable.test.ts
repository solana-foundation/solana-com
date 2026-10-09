import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchAirtableJson } from "./airtable";

test("Airtable 429 cooldown protects already queued requests", async () => {
  const originalFetch = globalThis.fetch;
  const requestStartedAt: number[] = [];
  let call = 0;

  globalThis.fetch = (async () => {
    requestStartedAt.push(Date.now());
    call += 1;

    return call === 1
      ? new Response("", {
          status: 429,
          headers: { "retry-after-ms": "500" },
        })
      : new Response("{}", { status: 200 });
  }) as typeof fetch;

  try {
    await Promise.all([
      fetchAirtableJson("https://airtable.test/one", "token", {}, "test one"),
      fetchAirtableJson("https://airtable.test/two", "token", {}, "test two"),
    ]);

    assert.equal(call, 3);
    assert.ok(
      requestStartedAt[1]! - requestStartedAt[0]! >= 450,
      "queued Airtable calls should wait for the shared 429 cooldown",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("A second 429 keeps the shared cooldown active for later requests", async () => {
  const originalFetch = globalThis.fetch;
  const requestStartedAt: number[] = [];
  let call = 0;

  globalThis.fetch = (async () => {
    requestStartedAt.push(Date.now());
    call += 1;

    return call <= 2
      ? new Response("", {
          status: 429,
          headers: { "retry-after-ms": "300" },
        })
      : new Response("{}", { status: 200 });
  }) as typeof fetch;

  try {
    await assert.rejects(
      fetchAirtableJson("https://airtable.test/one", "token", {}, "test one"),
    );
    await fetchAirtableJson(
      "https://airtable.test/two",
      "token",
      {},
      "test two",
    );

    assert.equal(call, 3);
    assert.ok(
      requestStartedAt[2]! - requestStartedAt[1]! >= 250,
      "a final 429 should delay the next Airtable request",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
