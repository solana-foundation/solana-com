"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ResponsiveBox,
  ResponsiveStyles,
} from "@/component-library/responsive-box";
import {
  CodeBlock,
  ContentEditor,
  Heading,
} from "@solana-foundation/solana-lib";
import { ChainMigrationHero } from "@/components/developers/chain-migration-hero";
import { ResourceList } from "@/components/solutions/resource-list";
import {
  BLOCK_STYLES,
  GUIDE_SECTIONS,
  NAV_BUTTONS,
  QUICK_REFERENCE_ROWS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos-cosmwasm";

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

export function DevelopersChainMigrationCosmosCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmos-cosmwasm");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceItems = RESOURCE_CARD_DECK.cards.map((card) => ({
    title: card.heading,
    href: card.callToAction.url,
  }));

  return (
    <>
      <ChainMigrationHero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body") as string}
      />

      <ContentEditor tocHeadline={t("contentEditor.tocHeadline")}>
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
              <ResponsiveBox
                key={section.id}
                responsiveStyles={BLOCK_STYLES[styleKey] as ResponsiveStyles}
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

                  <div className="tw-hidden tw-overflow-x-auto md:tw-block">
                    <table className="tw-w-full">
                      <thead>
                        <tr>
                          <th className="tw-whitespace-nowrap">CosmWasm</th>
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
            );
          }

          const segments = parseGuideSegments(section.html);

          return (
            <ResponsiveBox
              key={section.id}
              responsiveStyles={BLOCK_STYLES[styleKey] as ResponsiveStyles}
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
          );
        })}
      </ContentEditor>

      <Heading
        variant="centered"
        eyebrow={t("navHeading.eyebrow")}
        headline=""
        body=""
        buttons={navButtons as React.ComponentProps<typeof Heading>["buttons"]}
      />

      <ResourceList
        title={t("resourceHeading.headline")}
        description={t("resourceHeading.body")}
        items={resourceItems}
      />
    </>
  );
}
