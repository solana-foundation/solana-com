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
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos-app-chain";

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

const CONTENT_BLOCK_KEYS = [
  "overview",
  "preparation",
  "phase1",
  "phase2",
  "phase3",
  "phase4",
  "phase5",
  "addressLinking",
  "tokenClaimProgram",
  "governanceMigration",
  "complexStateMigration",
  "architectureDifferences",
  "solanaConstraints",
];

export function DevelopersChainMigrationCosmosAppChainPage() {
  const t = useTranslations("developers-chain-migration-cosmos-app-chain");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceItems = RESOURCE_CARD_DECK.cards.map((card) => ({
    title: card.heading,
    description: card.body,
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
        {CONTENT_BLOCK_KEYS.map((key, index) => {
          const rawHtml = t.raw(`contentEditor.blocks.${key}`);
          const segments = parseRunbookSegments(rawHtml);
          const isLast = index === CONTENT_BLOCK_KEYS.length - 1;
          const styleKey =
            index === 0
              ? "spacingWithMargins"
              : isLast
                ? "spacingLastBlock"
                : "spacing";

          return (
            <ResponsiveBox
              key={`block-${key}`}
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
