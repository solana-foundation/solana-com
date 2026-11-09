import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

// Strings that shipped on main with an ASCII apostrophe directly before an
// ICU tag. intl-messageformat reads that apostrophe as the start of quoted
// text, so the tag rendered literally or the message failed to parse.
const fixedMessages = [
  { locale: "fr", key: "ai.build.title" },
  { locale: "fr", key: "possible.stats.adoption.energy.description" },
  { locale: "fr", key: "defi.projects.title" },
  { locale: "fr", key: "consumer.projects.title" },
  { locale: "fr", key: "ai-solution.features.title" },
  { locale: "it", key: "ai-solution.features.title" },
  {
    locale: "it",
    key: "enterpriseFaq.items.compliance-regulated-tokens.q3.a",
  },
  {
    locale: "it",
    key: "enterpriseFaq.items.compliance-regulated-tokens.q4.a",
  },
];

const messagesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../messages",
);

function loadWebCatalog(locale: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(path.join(messagesDir, "web", locale, "common.json"), "utf8"),
  );
}

function getMessage(catalog: Record<string, unknown>, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, segment) =>
        (node as Record<string, unknown> | undefined)?.[segment],
      catalog,
    );
  if (typeof value !== "string") throw new Error(`Missing message ${key}`);
  return value;
}

// Tag handlers that re-emit each tag, so a correctly parsed message renders
// back to its own source text.
function identityTags(message: string) {
  const names = new Set(
    [...message.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)>/g)].map((match) => match[1]),
  );
  return Object.fromEntries(
    [...names].map((name) => [
      name,
      (chunks: string) => `<${name}>${chunks}</${name}>`,
    ]),
  );
}

describe("ICU apostrophes before tags", () => {
  it.each(fixedMessages)(
    "renders $locale $key with its apostrophe and tags intact",
    ({ locale, key }) => {
      const message = getMessage(loadWebCatalog(locale), key);
      const t = createTranslator({ locale, messages: { message } });

      expect(message).not.toMatch(/'<\/?[a-zA-Z]/);
      expect(t.markup("message", identityTags(message))).toBe(message);
    },
  );

  it("would fail on the ASCII apostrophe these messages shipped with", () => {
    const broken = "Construisez des Agents d'<colored>IA</colored> sur Solana";
    const t = createTranslator({
      locale: "fr",
      messages: { message: broken },
      onError: () => {},
    });

    expect(t.markup("message", identityTags(broken))).not.toBe(broken);
  });
});
