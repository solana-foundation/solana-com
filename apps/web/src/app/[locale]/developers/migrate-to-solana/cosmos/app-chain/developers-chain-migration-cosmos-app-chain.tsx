"use client";

import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import {
  ResponsiveBox,
  ResponsiveStyles,
} from "@/component-library/responsive-box";
import {
  CardDeck,
  Heading,
  Hero,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
  RUNBOOK_SECTIONS,
} from "@/data/developers/evm-to-svm/cosmos-app-chain";

const SUPPORTED_CODE_LANGUAGES = new Set([
  "bash",
  "json",
  "rust",
  "typescript",
  "python",
  "toml",
  "text",
  "tsx",
  "jsx",
  "solidity",
  "latex",
]);

type RunbookSegment =
  | { type: "html"; html: string }
  | { type: "code"; code: string; language: string };

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function normalizeLanguage(language: string) {
  if (language === "sh" || language === "shell") return "bash";
  if (language === "ts") return "typescript";
  return language;
}

function parseRunbookSegments(html: string): RunbookSegment[] {
  const pattern =
    /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g;
  const segments: RunbookSegment[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(pattern)) {
    const [fullMatch, rawLanguage, rawCode] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "html", html: html.slice(lastIndex, index) });
    }

    segments.push({
      type: "code",
      language: normalizeLanguage(rawLanguage),
      code: decodeHtmlEntities(rawCode),
    });

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", html: html.slice(lastIndex) });
  }

  return segments;
}

function GuideTableOfContents({ headline }: { headline: string }) {
  return (
    <aside className="lg:tw-sticky lg:tw-top-28 lg:tw-self-start">
      <div className="tw-mb-8 tw-border-b tw-border-gray-500 tw-pb-7">
        <div className="tw-mb-4 tw-text-display-xs tw-font-bold">
          {headline}
        </div>
        <ul className="!tw-pl-0">
          {RUNBOOK_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="tw-block tw-py-3 tw-font-mono !tw-text-md tw-font-light tw-uppercase tw-text-gray-300 no-underline transition-colors hover:tw-text-common-white"
              >
                {section.navLabel}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function DevelopersChainMigrationCosmosAppChainPage() {
  const t = useTranslations("developers-chain-migration-cosmos-app-chain");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card) => ({
    ...card,
    callToAction: card.callToAction,
  }));

  return (
    <>
      <Section>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t("hero.body")}
        />

        <Section as="div" className="tw-grid lg:tw-grid-cols-12 lg:tw-gap-9">
          <div className="lg:tw-col-span-3">
            <GuideTableOfContents headline={t("contentEditor.tocHeadline")} />
          </div>
          <div className="lg:tw-col-span-9">
            {RUNBOOK_SECTIONS.map((section, index) => {
              const segments = parseRunbookSegments(section.html);
              const isLast = index === RUNBOOK_SECTIONS.length - 1;
              const styleKey =
                index === 0
                  ? "spacingWithMargins"
                  : isLast
                    ? "spacingLastBlock"
                    : "spacing";

              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="tw-scroll-mt-28"
                >
                  <ResponsiveBox
                    responsiveStyles={
                      BLOCK_STYLES[styleKey] as ResponsiveStyles
                    }
                  >
                    <div className="tw-space-y-5">
                      {segments.map((segment, i) => {
                        if (segment.type === "html") {
                          if (!segment.html.trim()) return null;
                          return (
                            <div
                              key={i}
                              className="tw-html_parser"
                              suppressHydrationWarning
                              dangerouslySetInnerHTML={{ __html: segment.html }}
                            />
                          );
                        }
                        return (
                          <DocsCodeSnippet
                            key={i}
                            code={segment.code}
                            language={
                              (SUPPORTED_CODE_LANGUAGES.has(segment.language)
                                ? segment.language
                                : "bash") as DocsCodeSnippetProps["language"]
                            }
                          />
                        );
                      })}
                    </div>
                  </ResponsiveBox>
                </div>
              );
            })}
          </div>
        </Section>

        <Heading
          variant="centered"
          eyebrow={t("navHeading.eyebrow")}
          headline=""
          body=""
          buttons={
            navButtons as React.ComponentProps<typeof Heading>["buttons"]
          }
        />

        <Heading
          eyebrow={t("resourceHeading.eyebrow")}
          headline={t("resourceHeading.headline")}
          body={t("resourceHeading.body")}
        />

        <ResponsiveBox
          responsiveStyles={BLOCK_STYLES.cardDeckWrapper as ResponsiveStyles}
        >
          <CardDeck
            cards={
              resourceCards as React.ComponentProps<typeof CardDeck>["cards"]
            }
            numCols={
              RESOURCE_CARD_DECK.numCols as React.ComponentProps<
                typeof CardDeck
              >["numCols"]
            }
            featured={RESOURCE_CARD_DECK.featured}
          />
        </ResponsiveBox>
      </Section>
    </>
  );
}
