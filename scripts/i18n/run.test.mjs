import assert from "node:assert/strict";
import test from "node:test";

import { getScopePatterns, recoverFailedPush, runLingoPush } from "./run.mjs";

function failedPushOutput(...targetPaths) {
  return [
    `${targetPaths.length} target(s) failed:`,
    ...targetPaths.map((targetPath) => `  ${targetPath}: translation failed`),
    "Error: push failed",
  ].join("\n");
}

test("a scoped retry forces only failed sources inside the requested scope", async () => {
  const calls = [];
  const results = [
    {
      status: 1,
      output: failedPushOutput(
        "packages/i18n/messages/web/fr/common.json",
        "apps/docs/content/docs/fr/intro.mdx",
      ),
    },
    { status: 0, output: "" },
  ];

  const result = await runLingoPush([], "web", {
    runCommand: async (args) => {
      calls.push(args);
      return results.shift();
    },
    recover: async () => assert.fail("successful retry must not recover"),
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [
    ["push", "--wait"],
    [
      "push",
      "packages/i18n/messages/web/en/common.json",
      "--force",
      "--yes",
      "--wait",
    ],
  ]);
});

test("a scoped run does not retry or recover failures outside its scope", async () => {
  const calls = [];
  let recovered = false;

  const result = await runLingoPush([], "web", {
    runCommand: async (args) => {
      calls.push(args);
      return {
        status: 1,
        output: failedPushOutput("apps/docs/content/docs/fr/intro.mdx"),
      };
    },
    recover: async () => {
      recovered = true;
      return { status: 0, output: "" };
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [["push", "--wait"]]);
  assert.equal(recovered, false);
});

test("a failed scoped retry marks only that retry as recoverable", async () => {
  const failedResult = {
    status: 1,
    output: failedPushOutput(
      "packages/i18n/messages/web/fr/common.json",
      "apps/docs/content/docs/fr/intro.mdx",
    ),
  };
  const forceResult = {
    status: 1,
    output: failedPushOutput("packages/i18n/messages/web/fr/common.json"),
  };
  const results = [failedResult, forceResult];
  let recoveryArguments;

  await runLingoPush([], "web", {
    runCommand: async () => results.shift(),
    recover: async (...args) => {
      recoveryArguments = args;
      return forceResult;
    },
  });

  assert.deepEqual(recoveryArguments, [
    forceResult,
    "web",
    { scopedRun: true },
  ]);
});

test("a failed scoped retry without target output cannot recover", async () => {
  const results = [
    {
      status: 1,
      output: failedPushOutput("packages/i18n/messages/web/fr/common.json"),
    },
    { status: 124, output: "timed out" },
  ];
  let recovered = false;

  const result = await runLingoPush([], "web", {
    runCommand: async () => results.shift(),
    recover: async () => {
      recovered = true;
      return { status: 0, output: "" };
    },
  });

  assert.equal(result.status, 124);
  assert.equal(recovered, false);
});

test("a scoped run refuses recovery after an unscoped failure without paths", async () => {
  let recovered = false;

  const result = await runLingoPush([], "docs", {
    runCommand: async () => ({ status: 124, output: "timed out" }),
    recover: async () => {
      recovered = true;
      return { status: 0, output: "" };
    },
  });

  assert.equal(result.status, 124);
  assert.equal(recovered, false);
});

test("a scoped backfill without target output cannot recover a prior run", async () => {
  const scopePatterns = getScopePatterns("web");
  let recovered = false;

  const result = await runLingoPush(
    [...scopePatterns, "--backfill-missing"],
    "web",
    {
      runCommand: async () => ({ status: 124, output: "timed out" }),
      recover: async () => {
        recovered = true;
        return { status: 0, output: "" };
      },
    },
  );

  assert.equal(result.status, 124);
  assert.equal(recovered, false);
});

test("recovery rejects a failed run containing out-of-scope sources", async () => {
  const failedResult = {
    status: 1,
    output: failedPushOutput("apps/docs/content/docs/fr/intro.mdx"),
  };

  const result = await recoverFailedPush(failedResult, "web", {
    scopedRun: true,
  });

  assert.strictEqual(result, failedResult);
});

test("recovery requires proof that the latest run was scoped", async () => {
  const failedResult = { status: 124, output: "timed out" };

  const result = await recoverFailedPush(failedResult, "web");

  assert.strictEqual(result, failedResult);
});
