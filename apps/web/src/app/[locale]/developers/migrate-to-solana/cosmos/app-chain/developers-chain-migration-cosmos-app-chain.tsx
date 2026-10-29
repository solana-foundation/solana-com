"use client";

import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
  RUNBOOK_HIGHLIGHTS,
  RUNBOOK_SECTIONS,
} from "@/data/developers/evm-to-svm/cosmos-app-chain";
import { useTranslations } from "next-intl";
import { MigrationDocsLayout } from "../../components/migration-docs-layout";

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
        className="[&>:first-child]:mt-0 [&>:last-child]:mb-0"
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

function Highlights() {
  return (
    <div className="mb-12 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 md:col-span-3">
        <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#14f195]">
          {RUNBOOK_HIGHLIGHTS.banner.eyebrow}
        </div>
        <div className="mb-2 text-lg font-semibold leading-[1.4] text-white">
          {RUNBOOK_HIGHLIGHTS.banner.title}
        </div>
        <div className="text-[0.9375rem] leading-[1.7] text-white/60">
          {RUNBOOK_HIGHLIGHTS.banner.body}
        </div>
      </div>
      {RUNBOOK_HIGHLIGHTS.cards.map((card) => (
        <div
          key={card.number}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
        >
          <div className="mb-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            {card.number}
          </div>
          <div className="mb-2 text-[0.9375rem] font-semibold leading-[1.45] text-white">
            {card.title}
          </div>
          <div className="text-sm leading-[1.7] text-white/55">{card.body}</div>
        </div>
      ))}
    </div>
  );
}

export function DevelopersChainMigrationCosmosAppChainPage() {
  const t = useTranslations("developers-chain-migration-cosmos-app-chain");

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/cosmos/app-chain"
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
      toc={RUNBOOK_SECTIONS.map((section) => ({
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
      <Highlights />
      {RUNBOOK_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-10 scroll-mt-20 border-b border-white/[0.07] pb-10 last:mb-0 last:border-b-0"
        >
          <div className="flex flex-col gap-5">
            {parseRunbookSegments(section.html).map((segment, i) =>
              renderRunbookSegment(segment, i),
            )}
          </div>
        </section>
      ))}
    </MigrationDocsLayout>
  );
}
