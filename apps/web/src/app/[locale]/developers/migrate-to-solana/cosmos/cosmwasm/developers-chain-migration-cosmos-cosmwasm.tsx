"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import { cn } from "@/app/components/utils";
import {
  GUIDE_SECTIONS,
  NAV_BUTTONS,
  QUICK_REFERENCE_ROWS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos-cosmwasm";
import { useTranslations } from "next-intl";
import { MigrationDocsLayout } from "../../components/migration-docs-layout";

// Each block is its own prose container; drop the outer margins so the
// section's flex gap controls spacing.
const HTML_BLOCK_CLASS = "[&>:first-child]:mt-0 [&>:last-child]:mb-0";

const SUPPORTED_CODE_LANGUAGES = new Set<DocsCodeSnippetProps["language"]>([
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

type GuideToken =
  | { type: "html"; html: string }
  | { type: "code"; code: string; language: string }
  | { type: "heading"; html: string; level: number; text: string };

type ComparisonTab = {
  label: string;
  tokens: Array<Extract<GuideToken, { type: "code" }>>;
};

type ComparisonGroup = {
  insertAtIndex: number;
  codeIndexes: Set<number>;
  tabs: ComparisonTab[];
  nextIndex: number;
};

type ComparisonGroupConfig =
  | {
      kind: "heading";
      markers: Array<{ heading: string; label: string }>;
      ignoredHeadings?: string[];
    }
  | {
      kind: "code-order";
      // Omit to anchor on the section's own h2, so renumbering sections
      // doesn't silently drop the tabs.
      anchorHeading?: string;
      labels: string[];
    };

const SECTION_COMPARISON_GROUPS: Partial<
  Record<string, ComparisonGroupConfig[]>
> = {
  "project-structure": [
    {
      kind: "heading",
      markers: [
        { heading: "CosmWasm toolchain", label: "CosmWasm" },
        { heading: "Anchor toolchain", label: "Anchor" },
        { heading: "Pinocchio toolchain", label: "Pinocchio" },
      ],
      ignoredHeadings: ["Solana toolchain options"],
    },
    {
      kind: "code-order",
      anchorHeading: "Directory layout comparison",
      labels: ["CosmWasm", "Anchor / Pinocchio"],
    },
  ],
  "entry-points": [
    {
      kind: "code-order",
      anchorHeading: "Compare the entry points:",
      labels: ["CosmWasm", "Pinocchio", "Anchor"],
    },
  ],
  "state-management": [
    {
      kind: "code-order",
      anchorHeading: "Compare state management:",
      labels: ["CosmWasm", "Anchor", "Pinocchio"],
    },
  ],
  "token-handling": [
    {
      kind: "code-order",
      anchorHeading: "Compare token handling:",
      labels: [
        "CosmWasm",
        "Anchor SOL",
        "Anchor SPL",
        "Anchor Vault",
        "Native SOL",
        "Native SPL",
        "Native Vault",
      ],
    },
  ],
  "cross-program": [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  serialization: [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  "error-handling": [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Anchor", "Anchor"],
    },
  ],
  "time-block": [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  testing: [
    {
      kind: "code-order",
      labels: ["CosmWasm", "LiteSVM", "LiteSVM", "Surfpool"],
    },
  ],
  "deployment-upgrades": [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Anchor", "Pinocchio"],
    },
  ],
  "counter-example": [
    {
      kind: "code-order",
      labels: ["CosmWasm", "Anchor", "Anchor", "Pinocchio"],
    },
  ],
};

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

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function parseGuideTokens(html: string): GuideToken[] {
  const pattern =
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>|<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g;
  const tokens: GuideToken[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(pattern)) {
    const [fullMatch, rawLevel, rawHeading, rawLanguage, rawCode] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      tokens.push({ type: "html", html: html.slice(lastIndex, index) });
    }

    if (rawLevel && rawHeading) {
      tokens.push({
        type: "heading",
        html: fullMatch,
        level: Number(rawLevel),
        text: decodeHtmlEntities(stripTags(rawHeading)),
      });
    } else if (rawLanguage && rawCode) {
      tokens.push({
        type: "code",
        language: normalizeLanguage(rawLanguage),
        code: decodeHtmlEntities(rawCode),
      });
    }

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < html.length) {
    tokens.push({ type: "html", html: html.slice(lastIndex) });
  }

  return tokens;
}

function renderGuideToken(token: GuideToken, key: string) {
  if (token.type === "code") {
    return (
      <DocsCodeSnippet
        key={key}
        code={token.code}
        language={
          (SUPPORTED_CODE_LANGUAGES.has(
            token.language as DocsCodeSnippetProps["language"],
          )
            ? (token.language as DocsCodeSnippetProps["language"])
            : "bash") as DocsCodeSnippetProps["language"]
        }
      />
    );
  }

  if (token.type === "heading") {
    return (
      <div
        key={key}
        className={HTML_BLOCK_CLASS}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: token.html }}
      />
    );
  }

  if (!token.html.trim()) return null;

  return (
    <div
      key={key}
      className={HTML_BLOCK_CLASS}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: token.html }}
    />
  );
}

function mergeComparisonTabs(tabs: ComparisonTab[]) {
  const merged: ComparisonTab[] = [];

  for (const tab of tabs) {
    const existing = merged.at(-1);
    if (existing?.label === tab.label) {
      existing.tokens.push(...tab.tokens);
    } else {
      merged.push({ label: tab.label, tokens: [...tab.tokens] });
    }
  }

  return merged.map((tab) => ({
    ...tab,
    tokens: tab.tokens,
  }));
}

function buildHeadingComparisonGroup(
  tokens: GuideToken[],
  startIndex: number,
  config: Extract<ComparisonGroupConfig, { kind: "heading" }>,
): ComparisonGroup | null {
  const firstMarker = config.markers[0];
  const startToken = tokens[startIndex];
  if (
    startToken?.type !== "heading" ||
    startToken.text !== firstMarker.heading
  ) {
    return null;
  }

  const tabs: ComparisonTab[] = [];
  const codeIndexes = new Set<number>();
  // Headings at the first marker's level (or higher) that aren't markers or
  // ignored end the group, so trailing sections keep their own code blocks.
  const boundaryLevel = startToken.level;
  let insertAtIndex: number | null = null;
  let cursor = startIndex;

  for (
    let markerIndex = 0;
    markerIndex < config.markers.length;
    markerIndex++
  ) {
    const marker = config.markers[markerIndex];
    const currentToken = tokens[cursor];

    if (
      currentToken?.type !== "heading" ||
      currentToken.text !== marker.heading
    ) {
      return null;
    }

    cursor += 1;
    const tabTokens: Array<Extract<GuideToken, { type: "code" }>> = [];
    const nextMarker = config.markers[markerIndex + 1];

    while (cursor < tokens.length) {
      const token = tokens[cursor];

      if (token.type === "heading") {
        if (nextMarker && token.text === nextMarker.heading) {
          break;
        }

        if (config.ignoredHeadings?.includes(token.text)) {
          cursor += 1;
          continue;
        }

        if (token.level <= boundaryLevel) {
          break;
        }
      }

      if (token.type === "code") {
        tabTokens.push(token);
        codeIndexes.add(cursor);
        insertAtIndex ??= cursor;
      }

      cursor += 1;
    }

    tabs.push({ label: marker.label, tokens: tabTokens });
  }

  const mergedTabs = mergeComparisonTabs(tabs).filter(
    (tab) => tab.tokens.length > 0,
  );

  if (mergedTabs.length < 2 || insertAtIndex === null) return null;

  return {
    tabs: mergedTabs,
    codeIndexes,
    insertAtIndex,
    nextIndex: cursor,
  };
}

function buildCodeOrderComparisonGroup(
  tokens: GuideToken[],
  startIndex: number,
  config: Extract<ComparisonGroupConfig, { kind: "code-order" }>,
): ComparisonGroup | null {
  const startToken = tokens[startIndex];
  if (
    startToken?.type !== "heading" ||
    (config.anchorHeading
      ? startToken.text !== config.anchorHeading
      : startToken.level !== 2)
  ) {
    return null;
  }

  let cursor = startIndex + 1;
  const codeIndexes: number[] = [];

  while (cursor < tokens.length) {
    const token = tokens[cursor];

    if (token.type === "heading" && token.level <= 2) {
      break;
    }

    if (token.type === "code") {
      codeIndexes.push(cursor);
      if (codeIndexes.length === config.labels.length) break;
    }

    cursor += 1;
  }

  if (codeIndexes.length !== config.labels.length) return null;

  const tabs = config.labels.map<ComparisonTab>((label) => ({
    label,
    tokens: [],
  }));
  const codeIndexLookup = new Map(
    codeIndexes.map((codeIndex, index) => [codeIndex, config.labels[index]]),
  );

  cursor = startIndex + 1;
  while (cursor < tokens.length) {
    const token = tokens[cursor];

    if (token.type === "heading" && token.level <= 2) {
      break;
    }

    const assignedLabel = codeIndexLookup.get(cursor);
    if (assignedLabel) {
      const tab = tabs.find((candidate) => candidate.label === assignedLabel);
      if (tab && token.type === "code") {
        tab.tokens.push(token);
      }

      if (cursor === codeIndexes.at(-1)) {
        cursor += 1;
        break;
      }
    }

    cursor += 1;
  }

  const mergedTabs = mergeComparisonTabs(tabs).filter(
    (tab) => tab.tokens.length > 0,
  );

  if (mergedTabs.length < 2) return null;

  return {
    tabs: mergedTabs,
    codeIndexes: new Set(codeIndexes),
    insertAtIndex: codeIndexes[0],
    nextIndex: cursor,
  };
}

function buildComparisonGroupAtIndex(
  tokens: GuideToken[],
  startIndex: number,
  sectionId: string,
): ComparisonGroup | null {
  const configs = SECTION_COMPARISON_GROUPS[sectionId];
  if (!configs?.length) return null;

  for (const config of configs) {
    const result =
      config.kind === "heading"
        ? buildHeadingComparisonGroup(tokens, startIndex, config)
        : buildCodeOrderComparisonGroup(tokens, startIndex, config);

    if (result) return result;
  }

  return null;
}

function buildComparisonGroups(tokens: GuideToken[], sectionId: string) {
  const groups: ComparisonGroup[] = [];

  for (let index = 0; index < tokens.length;) {
    const group = buildComparisonGroupAtIndex(tokens, index, sectionId);
    if (!group) {
      index += 1;
      continue;
    }

    groups.push(group);
    index = group.nextIndex;
  }

  return groups;
}

function ComparisonCodeTabs({ tabs }: { tabs: ComparisonTab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label ?? "");

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div
        className="flex flex-wrap gap-2 border-b border-white/[0.08] bg-white/[0.025] px-3.5 pt-3.5"
        role="tablist"
        aria-label="Code comparison"
      >
        {tabs.map((tab) => {
          const isSelected = tab.label === activeTab;
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={cn(
                "cursor-pointer rounded-t-xl border border-b-0 border-white/[0.08] bg-transparent px-4 py-3 text-[0.8125rem] font-semibold leading-none text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white/85",
                isSelected &&
                  "border-[#14f195]/30 bg-[#14f195]/[0.12] text-white hover:bg-[#14f195]/[0.12] hover:text-white",
              )}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="px-3.5 pb-3.5 pt-1 [&>.my-4:first-child]:mt-0 [&>.my-4:last-child]:mb-0"
        role="tabpanel"
      >
        {tabs
          .find((tab) => tab.label === activeTab)
          ?.tokens.map((token, index) => (
            <DocsCodeSnippet
              key={`${activeTab}-${index}`}
              code={token.code}
              language={
                (SUPPORTED_CODE_LANGUAGES.has(
                  token.language as DocsCodeSnippetProps["language"],
                )
                  ? (token.language as DocsCodeSnippetProps["language"])
                  : "bash") as DocsCodeSnippetProps["language"]
              }
            />
          ))}
      </div>
    </div>
  );
}

function renderSectionTokens(sectionId: string, html: string) {
  const tokens = parseGuideTokens(html);
  const comparisonGroups = buildComparisonGroups(tokens, sectionId);
  const comparisonGroupByInsertIndex = new Map(
    comparisonGroups.map((group) => [group.insertAtIndex, group]),
  );
  const comparisonCodeIndexes = new Set(
    comparisonGroups.flatMap((group) => [...group.codeIndexes]),
  );
  const rendered: ReactNode[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const comparisonGroup = comparisonGroupByInsertIndex.get(index);
    if (comparisonGroup) {
      rendered.push(
        <ComparisonCodeTabs
          key={`${sectionId}-comparison-${index}`}
          tabs={comparisonGroup.tabs}
        />,
      );
    }

    if (tokens[index]?.type === "code" && comparisonCodeIndexes.has(index)) {
      continue;
    }

    rendered.push(renderGuideToken(tokens[index], `${sectionId}-${index}`));
  }

  return rendered;
}

function QuickReferenceTable() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl md:block">
        <table className="!my-0">
          <thead>
            <tr>
              <th>CosmWasm</th>
              <th>Anchor / Solana</th>
            </tr>
          </thead>
          <tbody>
            {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
              <tr key={source}>
                <td className="font-mono text-sm !text-white/85">{source}</td>
                <td>{destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
          <div
            key={source}
            className="rounded-xl border border-white/[0.09] bg-white/[0.02] p-4"
          >
            <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/35">
              CosmWasm
            </div>
            <div className="mb-3 break-all font-mono text-sm text-white/85">
              {source}
            </div>
            <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/35">
              Anchor / Solana
            </div>
            <div className="text-sm leading-[1.6] text-white/60">
              {destination}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function DevelopersChainMigrationCosmosCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmos-cosmwasm");

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/cosmos/cosmwasm"
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      bodyHtml={t.raw("hero.body") as string}
      // The Cosmos hub now redirects here; the sidebar covers "back to hub".
      buttons={NAV_BUTTONS.map((button, index) => ({
        url: button.url,
        label: t(`navHeading.buttons.${index}.label`),
      })).filter(
        (button) => button.url !== "/developers/migrate-to-solana/cosmos",
      )}
      tocHeadline={t("contentEditor.tocHeadline")}
      toc={GUIDE_SECTIONS.map((section) => ({
        id: section.id,
        title: section.navLabel,
      }))}
      resourceEyebrow={t("resourceHeading.eyebrow")}
      resourceHeadline={t("resourceHeading.headline")}
      resourceBody={t("resourceHeading.body")}
      resourceCards={RESOURCE_CARD_DECK.cards.map((card) => ({
        heading: card.heading,
        body: card.body,
        url: card.callToAction.url,
        ctaLabel: card.callToAction.label,
      }))}
    >
      {GUIDE_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-10 scroll-mt-20 border-b border-white/[0.07] pb-10 last:mb-0 last:border-b-0"
        >
          <div className="flex flex-col gap-5">
            {renderSectionTokens(section.id, section.html)}
            {section.id === "quick-reference" ? <QuickReferenceTable /> : null}
          </div>
        </section>
      ))}
    </MigrationDocsLayout>
  );
}
