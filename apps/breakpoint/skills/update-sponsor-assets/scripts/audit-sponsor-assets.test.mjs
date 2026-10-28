import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scriptDir, "../../../../..");

// Run the real CLI in an isolated minimal workspace. A missing asset must fail
// even though TypeScript wildcard asset declarations would accept the import.
function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sponsor-asset-audit-"));
  const packageRoot = path.join(root, "packages/ecosystem-data");
  const assets = path.join(packageRoot, "assets/companies/example");
  const records = path.join(packageRoot, "src/companies/records");
  const scripts = path.join(
    root,
    "apps/breakpoint/skills/update-sponsor-assets/scripts",
  );
  fs.mkdirSync(assets, { recursive: true });
  fs.mkdirSync(records, { recursive: true });
  fs.mkdirSync(scripts, { recursive: true });
  fs.symlinkSync(
    path.join(repo, "packages/ecosystem-data/node_modules"),
    path.join(packageRoot, "node_modules"),
    "dir",
  );
  fs.symlinkSync(
    path.join(repo, "apps/breakpoint/node_modules"),
    path.join(root, "apps/breakpoint/node_modules"),
    "dir",
  );
  const cli = path.join(scripts, "audit-sponsor-assets.mjs");
  fs.copyFileSync(path.join(scriptDir, "audit-sponsor-assets.mjs"), cli);
  const recordPath = path.join(records, "example.ts");
  fs.writeFileSync(
    path.join(assets, "logo-white.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><path fill="white" fill-rule="evenodd" d="M10 5H90V45H10Z M30 15H70V35H30Z"/></svg>',
  );
  const record = `import white from "../../../assets/companies/example/logo-white.svg";
export const example = {
  id: "example", slug: "example", name: "Example",
  profile: { links: { website: "https://example.com/" } },
  defaultLogoId: "logo-white",
  logos: [
    { id: "logo-white", fileName: "logo-white.svg", format: "svg", source: white },
    { id: "breakpoint-2026-white", fileName: "logo-white.svg", format: "svg", source: white,
      theme: "dark", background: "transparent", treatment: "monotone", width: 100, height: 50 },
  ],
} satisfies CompanyRecord;`;
  fs.writeFileSync(recordPath, record);
  const audit = () => {
    const result = spawnSync(process.execPath, [cli, "example"], {
      encoding: "utf8",
    });
    assert.equal(result.signal, null);
    assert.equal(result.stderr, "");
    return { code: result.status, ...JSON.parse(result.stdout) };
  };
  try {
    run({ root, assets, recordPath, record, audit });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("accepts canonical white artwork shared by general and Breakpoint selectors", () => {
  fixture(({ audit }) => {
    const result = audit();
    assert.equal(result.code, 0);
    assert.deepEqual(result.errors, []);
    assert.equal(result.linksToVerify[0].url, "https://example.com/");
  });
});

test("rejects a missing non-Breakpoint imported logo", () => {
  fixture(({ recordPath, record, audit }) => {
    fs.writeFileSync(
      recordPath,
      `import missing from "../../../assets/companies/example/absent.svg";\n${record.replace("logos: [", 'logos: [{ id: "extra", fileName: "absent.svg", format: "svg", source: missing },')}`,
    );
    const result = audit();
    assert.equal(result.code, 1);
    assert.ok(
      result.errors.some(
        (e) => e.includes("missing imported asset") && e.includes("absent.svg"),
      ),
    );
  });
});

test("rejects an unused static import pointing to a missing asset", () => {
  fixture(({ recordPath, record, audit }) => {
    fs.writeFileSync(
      recordPath,
      `import unused from "../../../assets/companies/example/missing.svg";
${record}`,
    );
    const result = audit();
    assert.equal(result.code, 1);
    assert.ok(
      result.errors.some(
        (e) =>
          e.includes("missing imported asset") && e.includes("missing.svg"),
      ),
    );
  });
});

test("rejects duplicate physical files even if only one is referenced", () => {
  fixture(({ assets, audit }) => {
    fs.copyFileSync(
      path.join(assets, "logo-white.svg"),
      path.join(assets, "copy.svg"),
    );
    const result = audit();
    assert.equal(result.code, 1);
    assert.ok(result.errors.some((e) => e.includes("Duplicate files:")));
  });
});

test("rejects opaque black background behind white artwork", () => {
  fixture(({ assets, audit }) => {
    fs.writeFileSync(
      path.join(assets, "logo-white.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="black"/><rect x="10" y="5" width="80" height="40" fill="white"/></svg>',
    );
    const result = audit();
    assert.equal(result.code, 1);
    assert.ok(
      result.errors.some((e) =>
        e.includes("pure white with real transparency"),
      ),
    );
  });
});
