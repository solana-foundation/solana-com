import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  ADDITIONAL_CARD_DECK,
  ENERGY_CARD_DECK,
  CONVERSION_PANEL,
  HERO_SWITCHBACK,
  PERFORMANCE_CARD_DECK,
  VALIDATOR_CARD_DECK,
} from "@/data/research";
import {
  COMMUNITY_LINKS,
  HERO_BUTTONS,
  LANDING_STEPS,
  NETWORK_PROPERTIES,
  PRIMITIVES,
  READING,
  SECURITY_CHECKLIST_LINK,
  SECURITY_ITEMS,
  STACK_STEPS,
  STATS,
  STATS_LIVE_LINK,
  TEMPLATES,
  TEMPLATES_LINK,
} from "@/data/developers/defi";
import {
  requiredCardContent,
  requiredTranslatedLabel,
} from "@/lib/required-card-content";

const messagesDir = resolve(
  __dirname,
  "../../../../../packages/i18n/messages/web",
);

const cardGroups = [
  {
    path: "research.cardDecks.validator.cards",
    ids: VALIDATOR_CARD_DECK.cards.map(({ id }) => id),
    fields: ["eyebrow", "heading", "body", "ctaLabel"],
  },
  {
    path: "research.cardDecks.energy.cards",
    ids: ENERGY_CARD_DECK.cards.map(({ id }) => id),
    fields: ["eyebrow", "heading", "body", "ctaLabel"],
  },
  {
    path: "research.cardDecks.performance.cards",
    ids: PERFORMANCE_CARD_DECK.cards.map(({ id }) => id),
    fields: ["eyebrow", "heading", "body", "ctaLabel"],
  },
  {
    path: "research.cardDecks.additional.cards",
    ids: ADDITIONAL_CARD_DECK.cards.map(({ id }) => id),
    fields: ["eyebrow", "heading", "ctaLabel"],
  },
] as const;

const labelGroups = [
  {
    path: "research.hero.buttons",
    ids: HERO_SWITCHBACK.buttons.map(({ id }) => id),
  },
  {
    path: "research.conversionPanel.buttons",
    ids: CONVERSION_PANEL.buttons.map(({ id }) => id),
  },
] as const;

function atPath(value: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, value);
}

describe("translated card content", () => {
  for (const locale of readdirSync(messagesDir)) {
    it(`${locale} has every required research card`, () => {
      const messages = JSON.parse(
        readFileSync(resolve(messagesDir, locale, "common.json"), "utf8"),
      ) as Record<string, unknown>;

      for (const { path, ids, fields } of cardGroups) {
        const cards = atPath(messages, path) as Record<string, unknown>;
        expect(Object.keys(cards).sort(), path).toEqual([...ids].sort());
        for (const id of ids) {
          expect(() =>
            requiredCardContent(cards, id, fields, path),
          ).not.toThrow();
        }
      }
      for (const { path, ids } of labelGroups) {
        const labels = atPath(messages, path) as Record<string, unknown>;
        expect(Object.keys(labels).sort(), path).toEqual([...ids].sort());
        for (const id of ids) {
          expect(() => requiredTranslatedLabel(labels, id, path)).not.toThrow();
        }
      }
    });
  }

  it("has English copy for every DeFi developer page entry", () => {
    const messages = JSON.parse(
      readFileSync(resolve(messagesDir, "en", "common.json"), "utf8"),
    ) as Record<string, unknown>;
    const withLinks = (
      base: string,
      items: readonly { id: string; links: readonly { id: string }[] }[],
      fields: string[],
    ) =>
      items.flatMap(({ id, links }) => [
        ...fields.map((field) => `${base}.${id}.${field}`),
        ...links.map((link) => `${base}.${id}.links.${link.id}`),
      ]);
    const paths = [
      ...HERO_BUTTONS.map(({ id }) => `hero.buttons.${id}`),
      ...STATS.flatMap(({ id }) => [
        `stats.items.${id}.value`,
        `stats.items.${id}.label`,
      ]),
      `stats.links.${STATS_LIVE_LINK.id}`,
      ...withLinks("properties.items", NETWORK_PROPERTIES, ["title", "body"]),
      ...withLinks("stack.steps", STACK_STEPS, ["label", "title", "body"]),
      ...TEMPLATES.flatMap(({ id }) => [
        `stack.templates.items.${id}.title`,
        `stack.templates.items.${id}.body`,
      ]),
      `stack.templates.links.${TEMPLATES_LINK.id}`,
      ...withLinks("primitives.categories", PRIMITIVES, ["title", "body"]),
      ...withLinks("landing.steps", LANDING_STEPS, ["title", "body"]),
      ...withLinks("security.items", SECURITY_ITEMS, ["title", "body"]),
      `security.links.${SECURITY_CHECKLIST_LINK.id}`,
      ...READING.map(({ id }) => `reading.items.${id}`),
      ...COMMUNITY_LINKS.flatMap(({ id }) => [
        `community.items.${id}.title`,
        `community.items.${id}.body`,
      ]),
    ];
    for (const path of paths) {
      const value = atPath(messages, `developers-defi.${path}`);
      expect(typeof value === "string" && value.trim(), path).toBeTruthy();
    }
  });

  it("throws for a missing card or required field", () => {
    const cards = { firedancer: { heading: "Firedancer" } };
    expect(() =>
      requiredCardContent(cards, "jitoLabs", ["heading"], "research.cards"),
    ).toThrow("research.cards.jitoLabs");
    expect(() =>
      requiredCardContent(cards, "firedancer", ["ctaLabel"], "research.cards"),
    ).toThrow("research.cards.firedancer.ctaLabel");
    expect(() =>
      requiredTranslatedLabel({}, "readDocs", "developers-defi.hero.buttons"),
    ).toThrow("developers-defi.hero.buttons.readDocs");
  });

  it.each(["", "  ", 42, null])(
    "rejects an invalid required card field: %s",
    (value) => {
      expect(() =>
        requiredCardContent(
          { firedancer: { heading: value } },
          "firedancer",
          ["heading"],
          "research.cards",
        ),
      ).toThrow("research.cards.firedancer.heading");
      expect(() =>
        requiredTranslatedLabel(
          { readDocs: value },
          "readDocs",
          "developers-defi.hero.buttons",
        ),
      ).toThrow("developers-defi.hero.buttons.readDocs");
    },
  );

  it("rejects arrays in place of keyed card records", () => {
    expect(() =>
      requiredCardContent(
        [{ heading: "Firedancer" }],
        "firedancer",
        ["heading"],
        "research.cards",
      ),
    ).toThrow("research.cards.firedancer");
    expect(() =>
      requiredCardContent(
        { firedancer: ["Firedancer"] },
        "firedancer",
        ["heading"],
        "research.cards",
      ),
    ).toThrow("research.cards.firedancer");
    expect(() =>
      requiredTranslatedLabel(
        ["Read docs"],
        "readDocs",
        "developers-defi.hero.buttons",
      ),
    ).toThrow("developers-defi.hero.buttons.readDocs");
  });
});
