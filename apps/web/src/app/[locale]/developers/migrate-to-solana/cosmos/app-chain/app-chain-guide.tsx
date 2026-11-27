"use client";
import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import { useTranslations } from "next-intl";
import {
  assembleGuideHtml,
  MigrationDocsLayout,
  type GuideSectionBlock,
  type MigrationGuideUrl,
} from "../../components/migration-docs-layout";

const HIGHLIGHT_NUMBERS = ["01", "02", "03"] as const;

const SUPPORTED_CODE_LANGUAGES = new Set<string>([
  "bash",
  "go",
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
        (SUPPORTED_CODE_LANGUAGES.has(segment.language)
          ? segment.language
          : "bash") as DocsCodeSnippetProps["language"]
      }
    />
  );
}

function Highlights({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  return (
    <div className="mb-12 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 md:col-span-3">
        <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#14f195]">
          {t("highlights.banner.eyebrow")}
        </div>
        <div className="mb-2 text-lg font-semibold leading-[1.4] text-white">
          {t("highlights.banner.title")}
        </div>
        <div className="text-[0.9375rem] leading-[1.7] text-white/60">
          {t("highlights.banner.body")}
        </div>
      </div>
      {HIGHLIGHT_NUMBERS.map((number, index) => (
        <div
          key={number}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
        >
          <div className="mb-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            {number}
          </div>
          <div className="mb-2 text-[0.9375rem] font-semibold leading-[1.45] text-white">
            {t(`highlights.cards.${index}.title`)}
          </div>
          <div className="text-sm leading-[1.7] text-white/55">
            {t(`highlights.cards.${index}.body`)}
          </div>
        </div>
      ))}
    </div>
  );
}

export type AppChainGuideSection = {
  id: string;
  blocks: readonly (GuideSectionBlock | string)[];
};

export type AppChainGuideProps = {
  /** i18n catalog namespace that holds this guide's prose. */
  namespace: string;
  activeUrl: MigrationGuideUrl;
  /** Header buttons; labels come from `navHeading.buttons.<index>.label`. */
  navButtonUrls: readonly string[];
  sections: readonly AppChainGuideSection[];
  /** Card copy comes from `resourceCards.<index>`, index-aligned. */
  resourceCardUrls: readonly string[];
};

/**
 * Shared renderer for the Cosmos app-chain guides: catalog prose interleaved
 * with untranslated code blocks from the guide's data file.
 */
export function AppChainGuide({
  namespace,
  activeUrl,
  navButtonUrls,
  sections,
  resourceCardUrls,
}: AppChainGuideProps) {
  const t = useTranslations(namespace);

  return (
    <MigrationDocsLayout
      activeUrl={activeUrl}
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      bodyHtml={t.raw("hero.body") as string}
      buttons={navButtonUrls.map((url, index) => ({
        url,
        label: t(`navHeading.buttons.${index}.label`),
      }))}
      tocHeadline={t("contentEditor.tocHeadline")}
      toc={sections.map((section) => ({
        id: section.id,
        title: t(`sections.${section.id}.navLabel`),
      }))}
      resourceEyebrow={t("resourceHeading.eyebrow")}
      resourceHeadline={t("resourceHeading.headline")}
      resourceBody={t("resourceHeading.body")}
      resourceCards={resourceCardUrls.map((url, index) => ({
        heading: t(`resourceCards.${index}.heading`),
        body: t(`resourceCards.${index}.body`),
        url,
        ctaLabel: t(`resourceCards.${index}.label`),
      }))}
    >
      <Highlights namespace={namespace} />
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-10 scroll-mt-20 border-b border-white/[0.07] pb-10 last:mb-0 last:border-b-0"
        >
          <div className="flex flex-col gap-5">
            {parseRunbookSegments(
              assembleGuideHtml(
                section.blocks,
                t.raw(`sections.${section.id}.prose`) as string[],
              ),
            ).map((segment, i) => renderRunbookSegment(segment, i))}
          </div>
        </section>
      ))}
    </MigrationDocsLayout>
  );
}
