import assert from "node:assert/strict";
import test from "node:test";
import braces from "braces";

const nestedBraces = (depth) => "{".repeat(depth) + "a,b" + "}".repeat(depth);
const nestedParens = (depth) => "(".repeat(depth) + "a" + ")".repeat(depth);
const nestedMixed = (pairs) => "{(".repeat(pairs) + "a,b" + ")}".repeat(pairs);

const methods = ["compile", "expand"];

test("normal patterns still compile and expand", () => {
  assert.equal(braces.compile("a/{b,c}/d"), "a/(b|c)/d");
  assert.deepEqual(braces.expand("a/{b,c}/d"), ["a/b/d", "a/c/d"]);
});

test("255 nested groups work and the 256th is rejected", () => {
  for (const method of methods) {
    for (const pattern of [nestedBraces(255), nestedParens(255)]) {
      assert.doesNotThrow(() => braces[method](pattern));
    }
    for (const pattern of [
      nestedBraces(256),
      nestedParens(256),
      nestedMixed(128),
    ]) {
      assert.throws(() => braces[method](pattern), {
        name: "SyntaxError",
        message: "Pattern nesting exceeds 256 levels",
      });
    }
  }
});

test("deep brace, parenthesis, and mixed patterns reject before stack exhaustion", () => {
  const patterns = [nestedBraces(4000), nestedParens(4000), nestedMixed(2000)];

  for (const method of methods) {
    for (const pattern of patterns) {
      assert.ok(pattern.length < 10000);
      assert.throws(() => braces[method](pattern), {
        name: "SyntaxError",
        message: "Pattern nesting exceeds 256 levels",
      });
    }
  }
});
