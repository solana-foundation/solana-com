import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateClaims,
  validateFinancialProjectStats,
  validateLinks,
  validatePageStats,
  validateSource,
  validateUrl,
} from "./validate-content.mjs";

test("rejects blank actionable URLs but permits cards without a link", () => {
  assert.deepEqual(validateLinks({ heading: "Display only" }, "card"), []);
  assert.match(
    validateLinks({ button: { url: "" } }, "card").join("\n"),
    /URL is empty/,
  );
  assert.match(
    validateLinks({ callToAction: {} }, "card").join("\n"),
    /requires a URL/,
  );
  assert.match(
    validateLinks({ hierarchy: "primary" }, "heroButton").join("\n"),
    /requires a URL/,
  );
  assert.match(
    validateLinks({ statSource: "" }, "project").join("\n"),
    /URL is empty/,
  );
});

test("financial project cards display their audited figures and sources", () => {
  const path = "financial-institutions-solution.projects.morganStanley.stat";
  const projects = [
    {
      key: "morganStanley",
      statValue: "$1.9T",
      statSource: "https://example.com/report",
    },
  ];
  const claims = [
    { path, claim: "$1.9T", sourceUrl: "https://example.com/report" },
  ];
  const messages = {
    "financial-institutions-solution": {
      projects: { morganStanley: { stat: "$1.9T" } },
    },
  };
  assert.deepEqual(
    validateFinancialProjectStats(projects, claims, messages),
    [],
  );
  assert.match(
    validateFinancialProjectStats(
      [{ ...projects[0], statValue: "$2T" }],
      claims,
      messages,
    ).join("\n"),
    /displayed stat must match/,
  );
  assert.match(
    validateFinancialProjectStats(
      [{ ...projects[0], statSource: "https://example.com/other" }],
      claims,
      messages,
    ).join("\n"),
    /displayed source must match/,
  );
});

test("rejects impossible local destinations and accepts known cross-app content", () => {
  assert.match(
    validateUrl("/docs/does-not-exist", "card.url").join("\n"),
    /no local destination/,
  );
  assert.deepEqual(validateUrl("/docs/intro/quick-start", "card.url"), []);
  assert.deepEqual(validateUrl("/solutions/commerce-tooling", "card.url"), []);
  assert.deepEqual(validateUrl("/install", "card.url"), []);
  assert.deepEqual(
    validateUrl("/developers/cookbook/transactions/retry", "card.url"),
    [],
  );
  assert.match(
    validateUrl("/developers/cookbook/does-not-exist", "card.url").join("\n"),
    /no local destination/,
  );
  assert.deepEqual(validateUrl("/developers/bootcamp/", "card.url"), []);
  assert.deepEqual(
    validateUrl("/developers/bootcamp/foundations", "card.url"),
    [],
  );
  assert.deepEqual(
    validateUrl("/developers/bootcamp/foundations/", "card.url"),
    [],
  );
  assert.deepEqual(
    validateUrl("/developers/bootcamp/foundations/bootcamp-intro", "card.url"),
    [],
  );
  assert.deepEqual(
    validateUrl("/developers/bootcamp/foundations/bootcamp-intro/", "card.url"),
    [],
  );
  assert.match(
    validateUrl("/developers/bootcamp/does-not-exist", "card.url").join("\n"),
    /no local destination/,
  );
  assert.match(
    validateUrl(
      "/developers/bootcamp/foundations/does-not-exist",
      "card.url",
    ).join("\n"),
    /no local destination/,
  );
  // Rewrite patterns such as /developers/templates/:path* resolve, but a
  // catch-all docs rewrite must not hide a missing docs page.
  assert.deepEqual(
    validateUrl("/developers/templates/nextjs-anchor", "card.url"),
    [],
  );
  assert.deepEqual(
    validateUrl("https://solana.com/upgrades/x", "card.url"),
    [],
  );
  assert.match(
    validateUrl("/not-a-route", "card.url").join("\n"),
    /no local destination/,
  );
});

test("page stats display their audited figures and sources", () => {
  const path = "developers-defi.stats.items.dexVolume.value";
  const stats = [{ id: "dexVolume", statSource: "https://example.com/dex" }];
  const claims = [
    { path, claim: "$76B", sourceUrl: "https://example.com/dex" },
  ];
  const messages = {
    "developers-defi": { stats: { items: { dexVolume: { value: "$76B" } } } },
  };
  assert.deepEqual(
    validatePageStats("developers-defi", stats, claims, messages),
    [],
  );
  assert.match(
    validatePageStats("developers-defi", stats, claims, {
      "developers-defi": {
        stats: { items: { dexVolume: { value: "$80B" } } },
      },
    }).join("\n"),
    /displayed stat must match/,
  );
  assert.match(
    validatePageStats(
      "developers-defi",
      [{ ...stats[0], statSource: "https://example.com/other" }],
      claims,
      messages,
    ).join("\n"),
    /displayed source must match/,
  );
});

test("audited source files cannot hide empty URLs behind satisfies or spreads", () => {
  const source = `const base = { callToAction: { url: "" } };
    export const cards = [{ ...base }] satisfies Array<object>;`;
  assert.match(validateSource(source, "fixture.ts").join("\n"), /URL is empty/);
  assert.match(
    validateSource(
      "export const cards = [{ ...unknownCard }];",
      "fixture.ts",
    ).join("\n"),
    /Cannot resolve object spread/,
  );
  assert.match(
    validateSource(
      "export const cards = [{ callToAction: importedCta }];",
      "fixture.ts",
    ).join("\n"),
    /Cannot resolve callToAction property/,
  );
});

test("claim deadlines include their review day and reject stale or missing sources", () => {
  const statValues = {
    morganStanley: "$1.9T",
    jpmorgan: "$50M",
    citi: "~24/7",
    societeGenerale: "1:1",
    stateStreet: "$50T+",
  };
  const defiStatValues = {
    dexVolume: "$76B",
    stablecoins: "$16B",
    computeUnits: "100M",
    txSize: "4,096 bytes",
  };
  const pyusdClaims = {
    "stats.items.solanaSupply.value": "$702M",
    "stats.items.reserves.value": "$2.89B",
    "stats.items.solanaShare.value": "25.8%",
    "stats.items.backing.value": "1:1",
    "trust.items.issuer.body": "December 2025",
    "mint.extensions.transferFee.body": "0 basis points",
  };
  const claims = [
    ...Object.entries(statValues).map(([project, claim]) => ({
      path: `financial-institutions-solution.projects.${project}.stat`,
      claim,
      owner: "Ecosystem Engineering",
      sourceUrl: "https://example.com/report",
      asOf: "2025-12-31",
      reviewBy: "2026-12-31",
    })),
    {
      path: "financial-institutions-solution.projects.stateStreet.description",
      claim: "$50 trillion",
      owner: "Ecosystem Engineering",
      sourceUrl: "https://example.com/report",
      asOf: "2025-12-31",
      reviewBy: "2026-12-31",
    },
    {
      path: "pyusd.hero.body",
      claim: "backed 1:1",
      owner: "Ecosystem Engineering",
      sourceUrl: "https://example.com/report",
      asOf: "2026-10-08",
      reviewBy: "2026-12-31",
    },
    ...Object.entries(defiStatValues).map(([id, claim]) => ({
      path: `developers-defi.stats.items.${id}.value`,
      claim,
      owner: "Ecosystem Engineering",
      sourceUrl: "https://example.com/report",
      asOf: "2026-10-08",
      reviewBy: "2026-12-31",
    })),
    ...Object.entries(pyusdClaims).map(([key, claim]) => ({
      path: `pyusd.${key}`,
      claim,
      owner: "Ecosystem Engineering",
      sourceUrl: "https://example.com/report",
      asOf: "2026-10-08",
      reviewBy: "2026-12-31",
    })),
  ];
  const messages = {
    "financial-institutions-solution": {
      projects: {
        ...Object.fromEntries(
          Object.entries(statValues).map(([project, stat]) => [
            project,
            { stat },
          ]),
        ),
        stateStreet: {
          stat: statValues.stateStreet,
          description: "With $50 trillion in assets",
        },
      },
    },
    pyusd: {
      hero: { body: "PYUSD is backed 1:1" },
      stats: {
        items: {
          solanaSupply: { value: "$702M" },
          reserves: { value: "$2.89B" },
          solanaShare: { value: "25.8%" },
          backing: { value: "1:1" },
        },
      },
      trust: { items: { issuer: { body: "Chartered in December 2025" } } },
      mint: {
        extensions: { transferFee: { body: "The fee is 0 basis points" } },
      },
    },
    "developers-defi": {
      stats: {
        items: Object.fromEntries(
          Object.entries(defiStatValues).map(([id, value]) => [id, { value }]),
        ),
      },
    },
  };
  assert.deepEqual(validateClaims(claims, messages, "2026-12-31"), []);
  assert.match(
    validateClaims(claims, messages, "2027-01-01").join("\n"),
    /deadline has passed/,
  );
  assert.match(
    validateClaims(claims.slice(1), messages, "2026-12-31").join("\n"),
    /missing required claim/,
  );
  assert.match(
    validateClaims(
      [{ ...claims[0], sourceUrl: "https://" }, claims[1]],
      messages,
      "2026-12-31",
    ).join("\n"),
    /valid HTTPS source/,
  );
  assert.match(
    validateClaims(
      claims,
      { ...messages, pyusd: { hero: { body: "No figure" } } },
      "2026-12-31",
    ).join("\n"),
    /claim text is absent/,
  );
});
