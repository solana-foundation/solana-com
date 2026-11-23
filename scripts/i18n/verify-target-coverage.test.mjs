import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "verify-target-coverage.mjs",
);
const sourcePath = "packages/i18n/messages/web/en/common.json";
const targetPath = "packages/i18n/messages/web/fr/common.json";
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");
const catalog = (title) => `${JSON.stringify({ hero: { title } }, null, 2)}\n`;
const lingoSource = catalog("Build on Solana");
const lingoTarget = catalog("Construisez sur Solana");

function fixture(t, { source = lingoSource, target = lingoTarget } = {}) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-coverage-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  for (const [file, text] of [
    [sourcePath, source],
    [targetPath, target],
  ]) {
    fs.mkdirSync(path.dirname(path.join(rootDir, file)), { recursive: true });
    fs.writeFileSync(path.join(rootDir, file), text);
  }
  fs.mkdirSync(path.join(rootDir, ".lingo"));
  fs.writeFileSync(
    path.join(rootDir, ".lingo/config.json"),
    JSON.stringify({
      sourceLocale: "en",
      targetLocales: ["fr"],
      files: [{ pattern: "packages/i18n/messages/web/en/*.json" }],
    }),
  );
  return rootDir;
}

// The lock Lingo wrote: both files as Lingo last saw them.
const lingoLock = {
  version: 1,
  files: {
    [sourcePath]: { sha256: sha256(lingoSource) },
    [targetPath]: { sha256: sha256(lingoTarget) },
  },
};

function writeLock(rootDir, lock) {
  fs.writeFileSync(
    path.join(rootDir, ".lingo/lock.json"),
    JSON.stringify(lock),
  );
}

function writeBaseline(rootDir, lock) {
  const baselinePath = path.join(rootDir, "baseline-lock.json");
  fs.writeFileSync(baselinePath, JSON.stringify(lock));
  return baselinePath;
}

function run(rootDir, args = []) {
  const result = spawnSync(
    process.execPath,
    [script, "all", "--root", rootDir, ...args],
    { encoding: "utf8" },
  );
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

test("passes when every target matches the lock", (t) => {
  const rootDir = fixture(t);
  writeLock(rootDir, lingoLock);

  const result = run(rootDir);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /coverage guard passed/);
  assert.equal(result.stderr, "");
});

test("outside the workflow an edited target only warns", (t) => {
  const rootDir = fixture(t, { target: catalog("Construisez sur Solana !") });
  writeLock(rootDir, lingoLock);

  const result = run(rootDir);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /1 target file\(s\) were edited since the Lingo lock/,
  );
  assert.match(
    result.stderr,
    new RegExp(`edited since Lingo lock: ${targetPath}`),
  );
  assert.doesNotMatch(result.stderr, /stale Lingo output/);
});

test("with a baseline, an edited target of an unchanged source still warns", (t) => {
  const rootDir = fixture(t, { target: catalog("Construisez sur Solana !") });
  writeLock(rootDir, lingoLock);
  const baseline = writeBaseline(rootDir, lingoLock);

  const result = run(rootDir, ["--lock-baseline", baseline]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /edited since Lingo lock/);
  assert.doesNotMatch(result.stderr, /stale Lingo output/);
});

test("with a baseline, a diverged target whose source changed in the run fails", (t) => {
  // The source changed before the run and the target never got Lingo's output.
  const rootDir = fixture(t, {
    source: catalog("Build faster on Solana"),
    target: catalog("Construisez sur Solana !"),
  });
  writeLock(rootDir, lingoLock);
  const baseline = writeBaseline(rootDir, lingoLock);

  const result = run(rootDir, ["--lock-baseline", baseline]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /coverage is incomplete/);
  assert.match(
    result.stderr,
    new RegExp(
      `stale Lingo output \\(source changed, target not relocked\\): ${targetPath}`,
    ),
  );
  assert.doesNotMatch(result.stderr, /edited since Lingo lock/);
});

test("with a baseline, a target Lingo relocked after a source change passes", (t) => {
  const newSource = catalog("Build faster on Solana");
  const newTarget = catalog("Construisez plus vite sur Solana");
  const rootDir = fixture(t, { source: newSource, target: newTarget });
  writeLock(rootDir, {
    version: 1,
    files: {
      [sourcePath]: { sha256: sha256(newSource) },
      [targetPath]: { sha256: sha256(newTarget) },
    },
  });
  const baseline = writeBaseline(rootDir, lingoLock);

  const result = run(rootDir, ["--lock-baseline", baseline]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
});

test("missing keys still fail regardless of the lock", (t) => {
  const rootDir = fixture(t, {
    source: `${JSON.stringify({ hero: { title: "Build", cta: "Start" } }, null, 2)}\n`,
  });
  writeLock(rootDir, lingoLock);

  const result = run(rootDir);
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /incomplete JSON: .*fr\/common\.json \(1 missing keys\)/,
  );
});
