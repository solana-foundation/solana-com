import { readdirSync, readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { FAQ_TOPICS, FAQ_TOTAL } from "@/data/enterprise/faq";

type FaqMessages = {
  glossary: Record<string, string>;
  topics: Record<string, string>;
  refTypes: Record<string, string>;
  refLabels: Record<string, string>;
  items: Record<string, Record<string, { q: string; tldr: string; a: string }>>;
};

const messagesDir = path.join(
  __dirname,
  "../../../../../packages/i18n/messages/web",
);

function loadFaqMessages(locale: string): FaqMessages | undefined {
  const file = path.join(messagesDir, locale, "common.json");
  return JSON.parse(readFileSync(file, "utf8")).enterpriseFaq;
}

const localesWithFaq = readdirSync(messagesDir).filter((locale) =>
  Boolean(loadFaqMessages(locale)),
);

describe("enterprise FAQ messages", () => {
  it("ships the English catalog", () => {
    expect(localesWithFaq).toContain("en");
  });

  describe.each(localesWithFaq)("%s", (locale) => {
    const messages = loadFaqMessages(locale) as FaqMessages;

    it("has a question, summary and answer for every item", () => {
      for (const topic of FAQ_TOPICS) {
        expect(messages.topics[topic.key]).toBeTruthy();
        for (const item of topic.items) {
          const message = messages.items[topic.key]?.[item.key];
          expect(message?.q, `${topic.key}.${item.key}.q`).toBeTruthy();
          expect(message?.tldr, `${topic.key}.${item.key}.tldr`).toBeTruthy();
          expect(message?.a, `${topic.key}.${item.key}.a`).toBeTruthy();
        }
      }
    });

    // A tag in the message with no handler in `terms` makes t.rich throw, which
    // renders the answer as an empty panel rather than falling back to English.
    it("declares a glossary handler for every rich-text tag", () => {
      for (const topic of FAQ_TOPICS) {
        for (const item of topic.items) {
          const answer = messages.items[topic.key][item.key].a;
          const tags = new Set(
            [...answer.matchAll(/<(t\d+)>/g)].map((match) => match[1]),
          );
          expect(
            [...tags].sort(),
            `tags in ${locale} ${topic.key}.${item.key}.a`,
          ).toEqual(Object.keys(item.terms ?? {}).sort());

          for (const tag of tags) {
            expect(answer).toContain(`</${tag}>`);
          }
        }
      }
    });

    it("resolves every glossary, reference type and reference label key", () => {
      for (const topic of FAQ_TOPICS) {
        for (const item of topic.items) {
          for (const glossaryKey of Object.values(item.terms ?? {})) {
            expect(messages.glossary[glossaryKey], glossaryKey).toBeTruthy();
          }
          for (const ref of item.refs ?? []) {
            expect(messages.refTypes[ref.typeKey], ref.typeKey).toBeTruthy();
            expect(messages.refLabels[ref.labelKey], ref.labelKey).toBeTruthy();
          }
        }
      }
    });
  });

  it("keeps every glossary entry reachable from an answer", () => {
    const used = new Set(
      FAQ_TOPICS.flatMap((topic) =>
        topic.items.flatMap((item) => Object.values(item.terms ?? {})),
      ),
    );

    expect(
      Object.keys((loadFaqMessages("en") as FaqMessages).glossary)
        .filter((key) => !used.has(key))
        .sort(),
    ).toEqual([]);
  });

  it("counts every question once", () => {
    expect(FAQ_TOTAL).toBe(
      FAQ_TOPICS.reduce((total, topic) => total + topic.items.length, 0),
    );
  });
});
