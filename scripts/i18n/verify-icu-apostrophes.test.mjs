import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  checkCatalogs,
  findApostrophesBeforeTags,
  fixApostrophesBeforeTags,
} from "./verify-icu-apostrophes.mjs";

// Strings that shipped on main with the ASCII apostrophe (PR #2388 follow-up).
const broken = {
  "ai.build.title": "Construisez des Agents d'<colored>IA</colored> sur Solana",
  "possible.stats.adoption.energy.description":
    "Le réseau de preuve d'enjeu de Solana minimise son impact sur l'<envLink>environnement</envLink>.",
  "defi.projects.title":
    "<light>Explorez l'<br></br>écosystème et</light> l'impact",
  "ai-solution.features.title": "<light>Cosa aggiunge Solana all'</light> AI",
  "enterpriseFaq.items.q3.a": "tramite un'<t1>allowlist</t1> (es. solo conti)",
};
const enPath = "packages/i18n/messages/web/en/common.json";
const frPath = "packages/i18n/messages/web/fr/common.json";
const itPath = "packages/i18n/messages/web/it/common.json";
const itBroken = "Crea Agenti d'<colored>IA</colored> su Solana";
const catalogText = (title) =>
  `{\n  "ai": {\n    "build": {\n      "title": ${JSON.stringify(title)}\n    }\n  }\n}\n`;
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

test("finds ASCII apostrophes directly before opening and closing ICU tags", () => {
  const catalog = {
    ai: { build: { title: broken["ai.build.title"] } },
    "ai-solution": {
      features: { title: broken["ai-solution.features.title"] },
    },
    fine: {
      typographic: "Agents d\u2019<colored>IA</colored>",
      plainApostrophe: "l'impact de <colored>Solana</colored>",
      notATag: "x' < y",
      number: 3,
      empty: null,
    },
  };

  assert.deepEqual(findApostrophesBeforeTags(catalog), [
    { key: "ai.build.title", value: broken["ai.build.title"] },
    {
      key: "ai-solution.features.title",
      value: broken["ai-solution.features.title"],
    },
  ]);
});

test("replaces only the apostrophe before the tag with the typographic one", () => {
  assert.equal(
    fixApostrophesBeforeTags(broken["ai.build.title"]),
    "Construisez des Agents d\u2019<colored>IA</colored> sur Solana",
  );
  assert.equal(
    fixApostrophesBeforeTags(broken["defi.projects.title"]),
    "<light>Explorez l\u2019<br></br>écosystème et</light> l'impact",
  );
  assert.equal(
    fixApostrophesBeforeTags(broken["ai-solution.features.title"]),
    "<light>Cosa aggiunge Solana all\u2019</light> AI",
  );
  assert.equal(
    fixApostrophesBeforeTags(broken["enterpriseFaq.items.q3.a"]),
    "tramite un\u2019<t1>allowlist</t1> (es. solo conti)",
  );
  for (const value of Object.values(broken)) {
    assert.deepEqual(
      findApostrophesBeforeTags(fixApostrophesBeforeTags(value), "k"),
      [],
    );
  }
});

// en and fr are untouched Lingo output; it was edited after Lingo wrote it
// unless `itLocked` says otherwise.
function fixture(t, { itLocked }) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "icu-apostrophes-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  const files = {
    [enPath]: catalogText("Build <colored>AI</colored> Agents on Solana"),
    [frPath]: catalogText(broken["ai.build.title"]),
    [itPath]: catalogText(itBroken),
  };
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(rootDir, file)), { recursive: true });
    fs.writeFileSync(path.join(rootDir, file), text);
  }
  fs.mkdirSync(path.join(rootDir, ".lingo"));
  fs.writeFileSync(
    path.join(rootDir, ".lingo/lock.json"),
    JSON.stringify({
      version: 1,
      files: Object.fromEntries(
        Object.entries(files).map(([file, text]) => [
          file,
          {
            sha256:
              file === itPath && !itLocked
                ? sha256("lingo output before a human edit")
                : sha256(text),
          },
        ]),
      ),
    }),
  );
  return { rootDir, files };
}

test("reports every catalog finding without touching files", (t) => {
  const { rootDir, files } = fixture(t, { itLocked: true });

  assert.deepEqual(checkCatalogs(rootDir), {
    findings: [
      {
        catalogPath: frPath,
        key: "ai.build.title",
        value: broken["ai.build.title"],
      },
      { catalogPath: itPath, key: "ai.build.title", value: itBroken },
    ],
    fixedFiles: 0,
    refreshedLockEntries: 0,
  });
  for (const [file, text] of Object.entries(files)) {
    assert.equal(fs.readFileSync(path.join(rootDir, file), "utf8"), text);
  }
});

test("--fix rewrites catalogs and follows the lock only for untouched Lingo output", (t) => {
  const { rootDir, files } = fixture(t, { itLocked: false });
  const lockPath = path.join(rootDir, ".lingo/lock.json");
  const lockBefore = JSON.parse(fs.readFileSync(lockPath, "utf8"));

  assert.deepEqual(checkCatalogs(rootDir, { fix: true }), {
    findings: [],
    fixedFiles: 2,
    refreshedLockEntries: 1,
  });

  const frText = fs.readFileSync(path.join(rootDir, frPath), "utf8");
  const itText = fs.readFileSync(path.join(rootDir, itPath), "utf8");
  assert.equal(frText, files[frPath].replace("d'<", "d\u2019<"));
  assert.equal(itText, files[itPath].replace("d'<", "d\u2019<"));
  assert.equal(
    fs.readFileSync(path.join(rootDir, enPath), "utf8"),
    files[enPath],
  );

  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  assert.equal(lock.files[frPath].sha256, sha256(frText));
  assert.equal(lock.files[itPath].sha256, lockBefore.files[itPath].sha256);
  assert.equal(lock.files[enPath].sha256, lockBefore.files[enPath].sha256);
  assert.deepEqual(checkCatalogs(rootDir).findings, []);
});
