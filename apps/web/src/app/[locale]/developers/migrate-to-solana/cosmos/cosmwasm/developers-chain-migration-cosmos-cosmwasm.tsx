"use client";

import {
  ResponsiveBox,
  ResponsiveStyles,
} from "@/component-library/responsive-box";
import {
  CodeBlock,
  Heading,
  Hero,
  Section,
} from "@solana-foundation/solana-lib";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function ClientOnlyCodeBlock({
  code,
  language,
}: {
  code: string;
  language: React.ComponentProps<typeof CodeBlock>["language"];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <CodeBlock code={code} language={language} />;
}
import {
  BLOCK_STYLES,
  GUIDE_SECTIONS,
  NAV_BUTTONS,
  QUICK_REFERENCE_ROWS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos-cosmwasm";

const SUPPORTED_CODE_LANGUAGES = new Set([
  "bash",
  "json",
  "rust",
  "typescript",
  "tsx",
  "jsx",
  "solidity",
  "latex",
]);

type GuideSegment =
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

function parseGuideSegments(html: string): GuideSegment[] {
  const pattern =
    /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g;
  const segments: GuideSegment[] = [];
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
          {GUIDE_SECTIONS.map((section) => (
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

export function DevelopersChainMigrationCosmosCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmos-cosmwasm");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
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
            {GUIDE_SECTIONS.map((section, index) => {
              const isLast = index === GUIDE_SECTIONS.length - 1;
              const styleKey =
                index === 0
                  ? "spacingWithMargins"
                  : isLast
                    ? "spacingLastBlock"
                    : "spacing";

              if (section.id === "quick-reference") {
                const segments = parseGuideSegments(section.html);
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
                                dangerouslySetInnerHTML={{
                                  __html: segment.html,
                                }}
                              />
                            );
                          }
                          return (
                            <ClientOnlyCodeBlock
                              key={i}
                              code={segment.code}
                              language={
                                (SUPPORTED_CODE_LANGUAGES.has(segment.language)
                                  ? segment.language
                                  : "bash") as React.ComponentProps<
                                  typeof CodeBlock
                                >["language"]
                              }
                            />
                          );
                        })}

                        <div className="tw-hidden tw-overflow-x-auto md:tw-block">
                          <table className="tw-w-full">
                            <thead>
                              <tr>
                                <th className="tw-whitespace-nowrap">
                                  CosmWasm
                                </th>
                                <th>Anchor / Solana</th>
                              </tr>
                            </thead>
                            <tbody>
                              {QUICK_REFERENCE_ROWS.map(
                                ([source, destination]: [string, string]) => (
                                  <tr key={source}>
                                    <td>{source}</td>
                                    <td>{destination}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="tw-grid tw-gap-3 md:tw-hidden">
                          {QUICK_REFERENCE_ROWS.map(
                            ([source, destination]: [string, string]) => (
                              <div
                                key={source}
                                className="tw-rounded-[22px] tw-border tw-border-white/10 tw-bg-black/30 tw-p-4"
                              >
                                <p className="tw-mb-1 tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-sky-200/80">
                                  CosmWasm
                                </p>
                                <p className="tw-mb-3 tw-break-words tw-font-mono tw-text-sm tw-text-white/95">
                                  {source}
                                </p>
                                <p className="tw-mb-1 tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-emerald-200/80">
                                  Anchor / Solana
                                </p>
                                <p className="tw-mb-0 tw-text-sm tw-leading-6 tw-text-white/72">
                                  {destination}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </ResponsiveBox>
                  </div>
                );
              }

              const segments = parseGuideSegments(section.html);

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
                          <ClientOnlyCodeBlock
                            key={i}
                            code={segment.code}
                            language={
                              (SUPPORTED_CODE_LANGUAGES.has(segment.language)
                                ? segment.language
                                : "bash") as React.ComponentProps<
                                typeof CodeBlock
                              >["language"]
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

        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-pb-12">
          {RESOURCE_CARD_DECK.cards.map((card) => (
            <div
              key={card.heading}
              className="tw-relative tw-overflow-hidden tw-rounded-[24px] tw-flex tw-flex-col tw-items-center tw-justify-between tw-p-6 tw-min-h-[280px] tw-bg-cover tw-bg-center"
              style={{
                backgroundImage: `url(${card.backgroundImage.src})`,
              }}
            >
              <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-b tw-from-black/30 tw-to-black/60" />
              <h3 className="tw-relative tw-z-10 tw-text-white tw-text-xl tw-font-brand tw-font-semibold tw-text-center tw-leading-snug tw-mt-1 tw-mb-0">
                {card.heading}
              </h3>
              <a
                href={card.callToAction.url}
                className="tw-relative tw-z-10 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-white/30 tw-bg-black/20 tw-px-5 tw-py-2.5 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.15em] tw-text-white tw-no-underline tw-backdrop-blur-sm tw-transition-colors hover:tw-bg-white/10"
              >
                {card.callToAction.label}
                <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
