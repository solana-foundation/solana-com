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
const otherSource = "apps/docs/content/docs/en/other.mdx";
const otherTarget = "apps/docs/content/docs/zh/other.mdx";
const jsonTarget = "packages/i18n/messages/web/zh/common.json";
const config = { targetLocales: ["zh"] };
const structuralLine = (sourcePath, targetPath) =>
  `    ${targetPath}: Failed to plan ${sourcePath}: Cannot safely update ${sourcePath} (mdx) because the source and target document structures are not aligned (unit 14 is jsx-children:11 in the source but jsx-children:11.0 in the target). Force a full retranslation of this file to reset it.`;
const failureReport = (lines) =>
  `  ${lines.length} target(s) failed:\n${lines.join("\n")}\n\n  Error: ${lines.length} target(s) failed during run lrg_example`;

function fixture(t) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-recovery-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  for (const file of [source, target, otherSource, otherTarget, jsonTarget]) {
    fs.mkdirSync(path.dirname(path.join(rootDir, file)), { recursive: true });
    fs.writeFileSync(path.join(rootDir, file), "content");
  }
  fs.mkdirSync(path.join(rootDir, ".lingo"));
  fs.writeFileSync(
    path.join(rootDir, ".lingo/lock.json"),
    JSON.stringify({
      version: 1,
      files: {
        [source]: {},
        [target]: {},
        [otherSource]: {},
        [otherTarget]: {},
        [jsonTarget]: {},
      },
    }),
  );
  return rootDir;
}

test("recovers only a reported MDX structure failure", (t) => {
  const rootDir = fixture(t);
  const structuralFailure = failureReport([structuralLine(source, target)]);

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
  assert.equal(fs.existsSync(path.join(rootDir, otherTarget)), true);
  assert.equal(fs.existsSync(path.join(rootDir, jsonTarget)), true);
  const lock = JSON.parse(
    fs.readFileSync(path.join(rootDir, ".lingo/lock.json")),
  );
  assert.equal(target in lock.files, false);
  assert.equal(otherTarget in lock.files, true);
  assert.equal(jsonTarget in lock.files, true);
});

test("recovers multiple structural failures but rejects a mixed report", (t) => {
  const rootDir = fixture(t);
  const structuralLines = [
    structuralLine(source, target),
    structuralLine(otherSource, otherTarget),
  ];

  assert.deepEqual(
    failedStructuralTargets(failureReport(structuralLines), config, rootDir),
    [target, otherTarget],
  );
  assert.deepEqual(
    failedStructuralTargets(
      failureReport([
        ...structuralLines,
        `    ${jsonTarget}: engine unavailable`,
      ]),
      config,
      rootDir,
    ),
    [],
  );
  assert.equal(fs.existsSync(path.join(rootDir, target)), true);
  assert.equal(fs.existsSync(path.join(rootDir, otherTarget)), true);
});
