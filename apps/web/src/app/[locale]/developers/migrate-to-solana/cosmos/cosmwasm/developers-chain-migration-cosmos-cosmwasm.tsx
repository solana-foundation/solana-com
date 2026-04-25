"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import { cn } from "@/app/components/utils";
import {
  GUIDE_HIGHLIGHTS,
  GUIDE_SECTIONS,
  NAV_BUTTONS,
  QUICK_REFERENCE_ROWS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmos-cosmwasm";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./developers-chain-migration-cosmos-cosmwasm.module.css";

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
      maxCodesPerTab?: number;
    }
  | {
      kind: "code-order";
      anchorHeading: string;
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
      maxCodesPerTab: 1,
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
        "Anchor",
        "Anchor",
        "Anchor",
        "Pinocchio",
        "Pinocchio",
        "Pinocchio",
      ],
    },
  ],
  "cross-program": [
    {
      kind: "code-order",
      anchorHeading: "7. Cross-Contract Communication: Sub-Messages vs CPIs",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  serialization: [
    {
      kind: "code-order",
      anchorHeading: "8. Serialization: JSON / serde vs wincode",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  "error-handling": [
    {
      kind: "code-order",
      anchorHeading: "9. Error Handling",
      labels: ["CosmWasm", "Anchor", "Anchor"],
    },
  ],
  "time-block": [
    {
      kind: "code-order",
      anchorHeading: "10. Time & Block Information",
      labels: ["CosmWasm", "Solana"],
    },
  ],
  testing: [
    {
      kind: "code-order",
      anchorHeading: "11. Testing",
      labels: ["CosmWasm", "LiteSVM", "LiteSVM", "Surfpool"],
    },
  ],
  "deployment-upgrades": [
    {
      kind: "code-order",
      anchorHeading: "12. Deployment & Upgrades",
      labels: ["CosmWasm", "Anchor", "Pinocchio"],
    },
  ],
  "counter-example": [
    {
      kind: "code-order",
      anchorHeading: "13. Full Side-by-Side Example: Counter Contract",
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
        className={cn("tw-html_parser", styles.articleHtml)}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: token.html }}
      />
    );
  }

  if (!token.html.trim()) return null;

  return (
    <div
      key={key}
      className={cn("tw-html_parser", styles.articleHtml)}
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

      if (token.type === "heading" && token.level <= 2) {
        break;
      }

      if (
        nextMarker &&
        token.type === "heading" &&
        token.text === nextMarker.heading
      ) {
        break;
      }

      if (
        token.type === "heading" &&
        config.ignoredHeadings?.includes(token.text)
      ) {
        cursor += 1;
        continue;
      }

      if (token.type === "code") {
        tabTokens.push(token);
        codeIndexes.add(cursor);
        insertAtIndex ??= cursor;

        if (
          config.maxCodesPerTab &&
          tabTokens.length >= config.maxCodesPerTab
        ) {
          cursor += 1;
          break;
        }
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
    startToken.text !== config.anchorHeading
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

  for (let index = 0; index < tokens.length; ) {
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
    <div className={styles.comparisonTabs}>
      <div
        className={styles.comparisonTabList}
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
                styles.comparisonTabButton,
                isSelected && styles.comparisonTabButtonActive,
              )}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.comparisonTabPanel} role="tabpanel">
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
      <div className={styles.quickRefTableWrapper}>
        <table className={styles.quickRefTable}>
          <thead>
            <tr>
              <th>CosmWasm</th>
              <th>Anchor / Solana</th>
            </tr>
          </thead>
          <tbody>
            {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
              <tr key={source}>
                <td className={styles.quickRefSourceCell}>{source}</td>
                <td>{destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.quickRefMobileCards}>
        {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
          <div key={source} className={styles.quickRefMobileCard}>
            <p className={styles.quickRefMobileLabel}>CosmWasm</p>
            <p className={styles.quickRefMobileSource}>{source}</p>
            <p className={styles.quickRefMobileLabel}>Anchor / Solana</p>
            <p className={styles.quickRefMobileDestination}>{destination}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function LeftSidebar() {
  return (
    <nav className={styles.leftSidebar} aria-label="Guide navigation">
      <div className={styles.sidebarCategory}>
        <span className={styles.sidebarCategoryLabel}>Migration Guides</span>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <li>
            <Link
              href="/developers/migrate-to-solana"
              className={styles.sidebarLink}
            >
              ← Migrate to Solana
            </Link>
          </li>
          <li>
            <Link
              href="/developers/migrate-to-solana/cosmos"
              className={styles.sidebarLink}
            >
              Cosmos
            </Link>
          </li>
          <li>
            <span
              className={cn(
                styles.sidebarLink,
                styles.sidebarLinkIndented,
                styles.sidebarLinkActive,
              )}
            >
              CosmWasm
            </span>
          </li>
          <li>
            <Link
              href="/developers/migrate-to-solana/cosmos/app-chain"
              className={cn(styles.sidebarLink, styles.sidebarLinkIndented)}
            >
              App Chain
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.sidebarCategory}>
        <span className={styles.sidebarCategoryLabel}>On this page</span>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {GUIDE_SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className={styles.sidebarLink}>
                {section.navLabel}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function RightTOC({ headline }: { headline: string }) {
  return (
    <nav className={styles.rightToc} aria-label="Table of contents">
      <span className={styles.tocLabel}>{headline}</span>
      <ul className={styles.tocList}>
        {GUIDE_SECTIONS.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={styles.tocLink}>
              {section.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DevelopersChainMigrationCosmosCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmos-cosmwasm");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left sidebar */}
        <LeftSidebar />

        {/* Main article */}
        <main className={styles.main}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/developers" className={styles.breadcrumbLink}>
              Developers
            </Link>
            <ChevronRight className={styles.breadcrumbSep} aria-hidden />
            <Link
              href="/developers/migrate-to-solana"
              className={styles.breadcrumbLink}
            >
              Migrate to Solana
            </Link>
            <ChevronRight className={styles.breadcrumbSep} aria-hidden />
            <Link
              href="/developers/migrate-to-solana/cosmos"
              className={styles.breadcrumbLink}
            >
              Cosmos
            </Link>
            <ChevronRight className={styles.breadcrumbSep} aria-hidden />
            <span style={{ color: "rgb(255 255 255 / 0.8)" }}>CosmWasm</span>
          </nav>

          {/* Hero */}
          <header className={styles.hero}>
            <p className={styles.heroEyebrow}>{t("hero.eyebrow")}</p>
            <h1 className={styles.heroHeadline}>{t("hero.headline")}</h1>
            <div
              className={styles.heroBody}
              dangerouslySetInnerHTML={{ __html: t("hero.body") }}
            />
            <div className={styles.heroButtons}>
              {navButtons.map((button) => (
                <a
                  key={button.url}
                  href={button.url}
                  className={styles.heroButton}
                >
                  {button.label}
                  <ChevronRight
                    style={{ width: "0.875rem", height: "0.875rem" }}
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </header>

          {/* Highlights */}
          <div className={styles.highlights}>
            <div className={styles.highlightBanner}>
              <p className={styles.highlightBannerEyebrow}>
                {GUIDE_HIGHLIGHTS.banner.eyebrow}
              </p>
              <h2 className={styles.highlightBannerTitle}>
                {GUIDE_HIGHLIGHTS.banner.title}
              </h2>
              <p className={styles.highlightBannerBody}>
                {GUIDE_HIGHLIGHTS.banner.body}
              </p>
            </div>
            {GUIDE_HIGHLIGHTS.cards.map((card) => (
              <div key={card.number} className={styles.highlightCard}>
                <p className={styles.highlightCardNumber}>{card.number}</p>
                <h3 className={styles.highlightCardTitle}>{card.title}</h3>
                <p className={styles.highlightCardBody}>{card.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile TOC */}
          <div className={styles.mobileToc}>
            <p className={styles.mobileTocLabel}>
              {t("contentEditor.tocHeadline")}
            </p>
            <ul className={styles.mobileTocList}>
              {GUIDE_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={styles.mobileTocLink}>
                    {section.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Article sections */}
          <article>
            {GUIDE_SECTIONS.map((section) => {
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={cn(styles.articleSection, "tw-scroll-mt-20")}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    {renderSectionTokens(section.id, section.html)}
                    {section.id === "quick-reference" ? (
                      <QuickReferenceTable />
                    ) : null}
                  </div>
                </section>
              );
            })}
          </article>

          {/* Resources */}
          <div className={styles.resources}>
            <p className={styles.resourcesEyebrow}>
              {t("resourceHeading.eyebrow")}
            </p>
            <h2 className={styles.resourcesHeadline}>
              {t("resourceHeading.headline")}
            </h2>
            <p className={styles.resourcesBody}>{t("resourceHeading.body")}</p>
            <div className={styles.resourceGrid}>
              {RESOURCE_CARD_DECK.cards.map((card) => {
                const isExternal = card.callToAction.url.startsWith("http");
                return (
                  <a
                    key={card.heading}
                    href={card.callToAction.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    className={styles.resourceCard}
                  >
                    <div>
                      <h3 className={styles.resourceCardTitle}>
                        {card.heading}
                      </h3>
                      <p className={styles.resourceCardBody}>{card.body}</p>
                    </div>
                    <span className={styles.resourceCardCta}>
                      {card.callToAction.label}
                      {isExternal ? (
                        <ExternalLink
                          style={{ width: "0.875rem", height: "0.875rem" }}
                          aria-hidden
                        />
                      ) : (
                        <ChevronRight
                          style={{ width: "0.875rem", height: "0.875rem" }}
                          aria-hidden
                        />
                      )}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right TOC */}
        <RightTOC headline={t("contentEditor.tocHeadline")} />
      </div>
    </div>
  );
}
