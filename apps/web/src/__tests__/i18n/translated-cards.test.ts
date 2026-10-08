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
  CARD_DECK_CARDS,
  COMMUNITY_GALLERY_CARDS,
  CONVERSION_PANEL_COMMUNITY,
  CONVERSION_PANEL_PRIMARY,
  HERO_BUTTONS,
  SWITCHBACK_BUTTONS,
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
  {
    path: "developers-defi.cardDeck.cards",
    ids: CARD_DECK_CARDS.map(({ id }) => id),
    fields: ["eyebrow", "heading", "ctaLabel"],
  },
  {
    path: "developers-defi.communityGallery.cards",
    ids: COMMUNITY_GALLERY_CARDS.map(({ id }) => id),
    fields: ["buttonLabel"],
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
  {
    path: "developers-defi.hero.buttons",
    ids: HERO_BUTTONS.map(({ id }) => id),
  },
  {
    path: "developers-defi.switchback.buttons",
    ids: SWITCHBACK_BUTTONS.map(({ id }) => id),
  },
  {
    path: "developers-defi.conversionPanel.buttons",
    ids: CONVERSION_PANEL_PRIMARY.buttons.map(({ id }) => id),
  },
  {
    path: "developers-defi.communityPanel.listItems",
    ids: CONVERSION_PANEL_COMMUNITY.listItems.map(({ id }) => id),
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
    it(`${locale} has every required research and DeFi card`, () => {
      const messages = JSON.parse(
        readFileSync(resolve(messagesDir, locale, "common.json"), "utf8"),
      ) as Record<string, unknown>;

      for (const { path, ids, fields } of cardGroups) {
        const cards = atPath(messages, path) as Record<string, unknown>;
        expect(Object.keys(cards).sort(), path).toEqual([...ids].sort());
        for (const id of ids) {
          const required =
            path === "developers-defi.communityGallery.cards"
              ? id === "projectCount"
                ? ["eyebrow", "stat", "buttonLabel"]
                : ["heading", "body", "buttonLabel"]
              : fields;
          expect(() =>
            requiredCardContent(cards, id, required, path),
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
});
