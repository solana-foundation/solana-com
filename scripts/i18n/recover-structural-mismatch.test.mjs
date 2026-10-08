import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  failedStructuralTargets,
  removeFailedTargets,
} from "./recover-structural-mismatch.mjs";

const source = "apps/docs/content/docs/en/example.mdx";
const target = "apps/docs/content/docs/zh/example.mdx";
const config = { targetLocales: ["zh"] };
const structuralFailure = `  1 target(s) failed:
    ${target}: Failed to plan ${source}: Cannot safely update ${source} (mdx) because the source and target document structures are not aligned (unit 14 is jsx-children:11 in the source but jsx-children:11.0 in the target). Force a full retranslation of this file to reset it.

  Error: 1 target(s) failed during run lrg_example`;

test("recovers only a reported MDX structure failure", (t) => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-recovery-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  for (const file of [source, target]) {
    fs.mkdirSync(path.dirname(path.join(rootDir, file)), { recursive: true });
    fs.writeFileSync(path.join(rootDir, file), "content");
  }
  fs.mkdirSync(path.join(rootDir, ".lingo"));
  fs.writeFileSync(
    path.join(rootDir, ".lingo/lock.json"),
    JSON.stringify({ version: 1, files: { [source]: {}, [target]: {} } }),
  );

  assert.deepEqual(
    failedStructuralTargets(structuralFailure, config, rootDir),
    [target],
  );
  assert.deepEqual(
    failedStructuralTargets(
      structuralFailure.replace("1 target(s) failed:", "2 target(s) failed:"),
      config,
      rootDir,
    ),
    [],
  );
  assert.deepEqual(
    failedStructuralTargets(
      structuralFailure.replace(
        "source and target document structures are not aligned",
        "engine is unavailable",
      ),
      config,
      rootDir,
    ),
    [],
  );

  removeFailedTargets([target], rootDir);
  assert.equal(fs.existsSync(path.join(rootDir, target)), false);
  const lock = JSON.parse(
    fs.readFileSync(path.join(rootDir, ".lingo/lock.json")),
  );
  assert.deepEqual(Object.keys(lock.files), [source]);
});
