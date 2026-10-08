import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLinks, validateUrl } from "./validate-content.mjs";

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
});

test("rejects impossible local destinations and accepts known cross-app content", () => {
  assert.match(
    validateUrl("/docs/does-not-exist", "card.url").join("\n"),
    /no local destination/,
  );
  assert.deepEqual(validateUrl("/docs/intro/quick-start", "card.url"), []);
  assert.deepEqual(validateUrl("/solutions/commerce-tooling", "card.url"), []);
});
