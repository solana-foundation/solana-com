"use client";

import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import { cn } from "@/app/components/utils";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
  RUNBOOK_HIGHLIGHTS,
  RUNBOOK_SECTIONS,
} from "@/data/developers/evm-to-svm/cosmos-app-chain";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./developers-chain-migration-cosmos-app-chain.module.css";

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

function renderRunbookSegment(segment: RunbookSegment, key: number) {
  if (segment.type === "html") {
    if (!segment.html.trim()) return null;
    return (
      <div
        key={key}
        className={cn("tw-html_parser", styles.articleHtml)}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: segment.html }}
      />
    );
  }
  return (
    <DocsCodeSnippet
      key={key}
      code={segment.code}
      language={
        (SUPPORTED_CODE_LANGUAGES.has(
          segment.language as DocsCodeSnippetProps["language"],
        )
          ? (segment.language as DocsCodeSnippetProps["language"])
          : "bash") as DocsCodeSnippetProps["language"]
      }
    />
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
            <Link
              href="/developers/migrate-to-solana/cosmos/cosmwasm"
              className={cn(styles.sidebarLink, styles.sidebarLinkIndented)}
            >
              CosmWasm
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
              App Chain
            </span>
          </li>
        </ul>
      </div>

      <div className={styles.sidebarCategory}>
        <span className={styles.sidebarCategoryLabel}>On this page</span>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {RUNBOOK_SECTIONS.map((section) => (
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
        {RUNBOOK_SECTIONS.map((section) => (
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

export function DevelopersChainMigrationCosmosAppChainPage() {
  const t = useTranslations("developers-chain-migration-cosmos-app-chain");

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
            <span style={{ color: "rgb(255 255 255 / 0.8)" }}>App Chain</span>
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
                {RUNBOOK_HIGHLIGHTS.banner.eyebrow}
              </p>
              <h2 className={styles.highlightBannerTitle}>
                {RUNBOOK_HIGHLIGHTS.banner.title}
              </h2>
              <p className={styles.highlightBannerBody}>
                {RUNBOOK_HIGHLIGHTS.banner.body}
              </p>
            </div>
            {RUNBOOK_HIGHLIGHTS.cards.map((card) => (
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
              {RUNBOOK_SECTIONS.map((section) => (
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
            {RUNBOOK_SECTIONS.map((section) => {
              const segments = parseRunbookSegments(section.html);
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
                    {segments.map((segment, i) =>
                      renderRunbookSegment(segment, i),
                    )}
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
