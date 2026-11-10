"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { HtmlParser } from "@workspace/ui/landing";
import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import {
  DocsCodeSnippet,
  type DocsCodeSnippetProps,
} from "@/app/components/docs-code-snippet";
import { cn } from "@/app/components/utils";
import { useTranslations } from "next-intl";

const MIGRATE = "/developers/migrate-to-solana";

// Labels live in the `developers-evm-to-svm.docsLayout` catalog keys, looked
// up by `key`, so the nav stays the single source of URLs.
export const MIGRATION_NAV = [
  {
    key: "ethereum",
    url: `${MIGRATE}/ethereum`,
    guides: [
      { key: "ethereum", url: `${MIGRATE}/ethereum`, isOverview: true },
      { key: "complete-guide", url: `${MIGRATE}/complete-guide` },
      { key: "erc20", url: `${MIGRATE}/erc20` },
      { key: "erc721", url: `${MIGRATE}/erc721` },
      { key: "erc4337", url: `${MIGRATE}/erc4337` },
      { key: "erc3643", url: `${MIGRATE}/erc3643` },
      { key: "erc4626", url: `${MIGRATE}/erc4626` },
      { key: "eip2612", url: `${MIGRATE}/eip2612` },
      { key: "consensus", url: `${MIGRATE}/consensus` },
      { key: "accounts", url: `${MIGRATE}/accounts` },
      { key: "smart-contracts", url: `${MIGRATE}/smart-contracts` },
      { key: "client-differences", url: `${MIGRATE}/client-differences` },
    ],
  },
  {
    key: "cosmos",
    // No Cosmos overview page: the group lands on its first guide.
    url: `${MIGRATE}/cosmos/cosmwasm`,
    guides: [
      {
        key: "cosmwasm",
        url: `${MIGRATE}/cosmos/cosmwasm`,
        hasDescription: true,
      },
      {
        key: "app-chain",
        url: `${MIGRATE}/cosmos/app-chain`,
        hasDescription: true,
      },
      // Child guides follow their parent and name it in `parent`.
      {
        key: "halt-and-claim",
        url: `${MIGRATE}/cosmos/app-chain/halt-and-claim`,
        parent: "app-chain",
      },
      {
        key: "ibc-bridge",
        url: `${MIGRATE}/cosmos/app-chain/ibc-bridge`,
        parent: "app-chain",
      },
    ],
  },
] as const;

export type MigrationGuideUrl =
  (typeof MIGRATION_NAV)[number]["guides"][number]["url"];

function findGuide(activeUrl: MigrationGuideUrl) {
  for (const group of MIGRATION_NAV) {
    const guide = group.guides.find((candidate) => candidate.url === activeUrl);
    if (guide) return { group, guide };
  }
  throw new Error(`Unknown migration guide: ${activeUrl}`);
}

/** A guide section: prose comes from the i18n catalog, code stays in the data file. */
export type GuideSectionBlock = "prose" | { language: string; code: string };

/** Interleave catalog prose with untranslated code blocks into one HTML string. */
export function assembleGuideHtml(
  // The data files are plain JS, so the "prose" marker arrives typed as string.
  blocks: readonly (GuideSectionBlock | string)[],
  prose: readonly string[],
) {
  let proseIndex = 0;
  return blocks
    .map((block) =>
      typeof block === "string"
        ? (prose[proseIndex++] ?? "")
        : `<pre><code class="language-${block.language}">${block.code}</code></pre>`,
    )
    .join("\n");
}

export const DOCS_PROSE = cn(
  "text-base leading-[1.85] text-white/[0.72]",
  "[&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:scroll-mt-32 [&_h2]:text-[1.6rem] [&_h2]:font-bold [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.02em] [&_h2]:text-white",
  "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-32 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-[1.45] [&_h3]:text-white",
  "[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-semibold [&_h4]:text-white",
  "[&_p]:my-4 [&_p]:text-white/65",
  // Tailwind preflight strips list markers; restore them for lists written
  // directly in JSX as well as those parsed from HTML.
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-[1.375rem] [&_ol]:text-white/65 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-[1.375rem] [&_ul]:text-white/65",
  "[&_li]:my-[0.45rem] [&_ol_li]:marker:text-white/35 [&_ul_li]:marker:text-[#14f195]",
  "[&_:not(pre)>code]:rounded-[0.3rem] [&_:not(pre)>code]:border [&_:not(pre)>code]:border-white/10 [&_:not(pre)>code]:bg-white/5 [&_:not(pre)>code]:px-[0.35rem] [&_:not(pre)>code]:py-[0.1rem] [&_:not(pre)>code]:text-[0.88em] [&_:not(pre)>code]:text-[#f0f6fc]",
  "[&_a]:text-[#00ffbd] [&_a]:no-underline hover:[&_a]:text-white",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.9375rem]",
  "[&_thead_tr]:bg-white/[0.04]",
  "[&_th]:border [&_th]:border-white/[0.09] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:align-top [&_th]:text-[0.8rem] [&_th]:font-semibold [&_th]:tracking-[0.02em] [&_th]:text-white/75",
  "[&_td]:border [&_td]:border-white/[0.09] [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-white/60",
);

// Layout variants carried over from the old CMS block styles. Spacing-only
// variants are intentionally absent: the docs prose handles vertical rhythm.
export const BLOCK_CLASSES: Partial<Record<string, string>> = {
  smallOnly: "md:hidden",
  columnImage: "hidden md:block",
  imageMax400: "mx-auto w-full max-w-[400px]",
  imageMax500: "mx-auto w-full max-w-[500px]",
  imageMax700: "mx-auto w-full max-w-[700px]",
};

export function DocsHtml({
  rawHtml,
  className,
}: {
  rawHtml?: string;
  className?: string;
}) {
  // Legacy CMS blocks ship inline <style> tags that fight the docs theme.
  const html = rawHtml?.replace(/<style[\s\S]*?<\/style>/g, "");
  return <HtmlParser rawHtml={html} classes={cn(DOCS_PROSE, className)} />;
}

const SUPPORTED_CODE_LANGUAGES = new Set<string>([
  "bash",
  "javascript",
  "json",
  "jsx",
  "latex",
  "python",
  "rust",
  "solidity",
  "text",
  "toml",
  "tsx",
  "typescript",
]);

export function DocsCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <DocsCodeSnippet
      code={code}
      language={
        (SUPPORTED_CODE_LANGUAGES.has(language)
          ? language
          : "text") as DocsCodeSnippetProps["language"]
      }
    />
  );
}

type TocHeading = { id: string; title: string; level: number };

function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

function useArticleHeadings(
  articleRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);

  useEffect(() => {
    const article = articleRef.current;
    if (!enabled || !article) return;

    setHeadings(
      [...article.querySelectorAll<HTMLHeadingElement>("h2, h3")].map(
        (element) => {
          if (!element.id) {
            const base = slugify(element.textContent || "");
            let id = base;
            let suffix = 2;
            while (document.getElementById(id)) id = `${base}-${suffix++}`;
            element.id = id;
          }
          return {
            id: element.id,
            title: element.textContent || "",
            level: element.tagName === "H3" ? 3 : 2,
          };
        },
      ),
    );
  }, [articleRef, enabled]);

  return headings;
}

function LeftSidebar({ activeUrl }: { activeUrl: MigrationGuideUrl }) {
  const t = useTranslations("developers-evm-to-svm.docsLayout");
  const linkClass =
    "flex items-center gap-1.5 rounded-md px-2 py-[0.3rem] text-sm text-white/50 no-underline transition-colors hover:bg-white/5 hover:text-white/90";
  const activeClass =
    "rounded-none border-l-2 border-[#14f195] pl-[calc(0.5rem-2px)] font-medium text-white hover:bg-transparent hover:text-white";
  const labelClass =
    "mb-2 block px-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/35";

  return (
    <nav
      className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/[0.07] py-8 pl-6 pr-4 xl:block"
      aria-label={t("guideNavigation")}
    >
      <Link href={MIGRATE} className={cn(linkClass, "mb-6")}>
        {t("backToHub")}
      </Link>
      {MIGRATION_NAV.map((group) => (
        <div key={group.key} className="mb-6">
          <span className={labelClass}>{t(`groups.${group.key}.label`)}</span>
          <ul className="m-0 list-none p-0">
            {group.guides.map((guide) => {
              const content = (
                <>
                  {t(`guides.${guide.key}`)}
                  {"hasDescription" in guide ? (
                    <span className="block text-xs font-normal text-white/35">
                      {t(`guideDescriptions.${guide.key}`)}
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={guide.url} className={"parent" in guide ? "pl-3" : ""}>
                  {guide.url === activeUrl ? (
                    <span
                      className={cn(linkClass, "block", activeClass)}
                      aria-current="page"
                    >
                      {content}
                    </span>
                  ) : (
                    <Link href={guide.url} className={cn(linkClass, "block")}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Breadcrumbs({ activeUrl }: { activeUrl: MigrationGuideUrl }) {
  const t = useTranslations("developers-evm-to-svm.docsLayout");
  const { group, guide } = findGuide(activeUrl);
  const parentGuide =
    "parent" in guide
      ? group.guides.find((candidate) => candidate.key === guide.parent)
      : undefined;
  const linkClass =
    "text-white/40 no-underline transition-colors hover:text-[#14f195]";
  const separator = (
    <ChevronRight
      className="size-[0.9rem] shrink-0 text-white/20"
      aria-hidden
    />
  );

  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/40"
      aria-label={t("breadcrumb")}
    >
      <Link href="/developers" className={linkClass}>
        {t("breadcrumbDevelopers")}
      </Link>
      {separator}
      <Link href={MIGRATE} className={linkClass}>
        {t("breadcrumbHub")}
      </Link>
      {separator}
      {group.url === activeUrl ? (
        <span>{t(`groups.${group.key}.label`)}</span>
      ) : (
        <Link href={group.url} className={linkClass}>
          {t(`groups.${group.key}.label`)}
        </Link>
      )}
      {separator}
      {parentGuide ? (
        <>
          <Link href={parentGuide.url} className={linkClass}>
            {t(`guides.${parentGuide.key}`)}
          </Link>
          {separator}
        </>
      ) : null}
      <span className="text-white/80">{t(`guides.${guide.key}`)}</span>
    </nav>
  );
}

type NavButton = { label: string; url: string };

type ResourceCard = {
  heading: string;
  body?: string;
  url: string;
  ctaLabel: string;
};

type CallToAction = {
  eyebrow?: string;
  headline?: string;
  description?: string;
  button?: NavButton;
};

type TocItem = { id: string; title: string; level?: number };

export type MigrationDocsLayoutProps = {
  activeUrl: MigrationGuideUrl;
  eyebrow?: string;
  headline: string;
  bodyHtml?: string;
  buttons?: NavButton[];
  tocHeadline: string;
  /** Explicit TOC entries; when omitted, the article's h2/h3s are used. */
  toc?: TocItem[];
  callToAction?: CallToAction;
  resourceEyebrow?: string;
  resourceHeadline?: string;
  resourceBody?: string;
  resourceCards?: ResourceCard[];
  children: ReactNode;
};

export function MigrationDocsLayout({
  activeUrl,
  eyebrow,
  headline,
  bodyHtml,
  buttons = [],
  tocHeadline,
  toc,
  callToAction,
  resourceEyebrow,
  resourceHeadline,
  resourceBody,
  resourceCards = [],
  children,
}: MigrationDocsLayoutProps) {
  const t = useTranslations("developers-evm-to-svm.docsLayout");
  const articleRef = useRef<HTMLElement>(null);
  const articleHeadings = useArticleHeadings(articleRef, !toc);
  const headings = toc ?? articleHeadings;
  const { group } = findGuide(activeUrl);

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-4 xl:grid-cols-[240px_minmax(0,1fr)_220px] xl:px-0">
        <LeftSidebar activeUrl={activeUrl} />

        <main className="min-w-0 px-0 py-10 md:px-8 xl:px-12">
          <Breadcrumbs activeUrl={activeUrl} />

          <header className="mb-12 border-b border-white/[0.08] pb-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#14f195]">
              {eyebrow || t(`groups.${group.key}.eyebrow`)}
            </p>
            <h1 className="mb-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              {headline}
            </h1>
            {bodyHtml?.replace(/<[^>]+>/g, "").trim() ? (
              <div
                className="mb-6 max-w-[52rem] text-[1.0625rem] leading-[1.75] text-white/60 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : null}
            {buttons.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {buttons.map((button) => (
                  <a
                    key={button.url}
                    href={button.url}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 no-underline transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    {button.label}
                    <ChevronRight className="size-3.5" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
          </header>

          {headings.length > 0 ? (
            <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 xl:hidden">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/35">
                {tocHeadline}
              </p>
              <ul className="m-0 list-none p-0">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={cn(
                        "block py-1 text-sm text-white/50 no-underline transition-colors hover:text-[#14f195]",
                        (heading.level ?? 2) === 3 &&
                          "pl-4 text-[0.8125rem] text-white/40",
                      )}
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <article
            ref={articleRef}
            className={cn(
              DOCS_PROSE,
              "min-w-0 pb-10 [&>:first-child>:first-child]:mt-0",
            )}
          >
            {children}
          </article>

          {callToAction?.headline ? (
            <div className="mb-10 grid gap-2 rounded-[0.875rem] border border-white/[0.08] bg-white/[0.02] px-6 py-5">
              {callToAction.eyebrow ? (
                <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#14f195]">
                  {callToAction.eyebrow}
                </p>
              ) : null}
              <h2 className="m-0 text-xl font-bold text-white">
                {callToAction.headline}
              </h2>
              {callToAction.description ? (
                <p className="m-0 text-[0.9375rem] leading-[1.7] text-white/55">
                  {callToAction.description}
                </p>
              ) : null}
              {callToAction.button ? (
                <a
                  href={callToAction.button.url}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#00ffbd] no-underline transition-colors hover:text-white"
                >
                  {callToAction.button.label}
                  <ChevronRight className="size-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}

          {resourceCards.length > 0 ? (
            <div className="mt-4 border-t border-white/[0.08] pt-10">
              <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#14f195]">
                {resourceEyebrow || t("resources")}
              </p>
              {resourceHeadline ? (
                <h2 className="mb-2.5 text-[1.75rem] font-bold leading-[1.2] text-white">
                  {resourceHeadline}
                </h2>
              ) : null}
              {resourceBody ? (
                <p className="mb-6 max-w-[44rem] text-[0.9375rem] leading-[1.7] text-white/55">
                  {resourceBody}
                </p>
              ) : (
                <div className="mb-6" />
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {resourceCards.map((card) => {
                  const isExternal = card.url.startsWith("http");
                  return (
                    <a
                      key={`${card.heading}-${card.url}`}
                      href={card.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className="group flex flex-col justify-between rounded-[0.875rem] border border-white/[0.08] bg-white/[0.02] px-5 py-[1.125rem] text-inherit no-underline transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                    >
                      <div>
                        <h3 className="mb-1.5 text-[0.9375rem] font-semibold leading-[1.45] text-white">
                          {card.heading}
                        </h3>
                        {card.body ? (
                          <p className="mb-4 text-sm leading-[1.6] text-white/50">
                            {card.body}
                          </p>
                        ) : null}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#00ffbd] transition-colors group-hover:text-white">
                        {card.ctaLabel}
                        {isExternal ? (
                          <ExternalLink className="size-3.5" aria-hidden />
                        ) : (
                          <ChevronRight className="size-3.5" aria-hidden />
                        )}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </main>

        <nav
          className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-l border-white/[0.07] pb-8 pl-4 pr-6 pt-10 xl:block"
          aria-label={t("tableOfContents")}
        >
          <span className="mb-3 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/30">
            {tocHeadline}
          </span>
          <ul className="m-0 list-none p-0">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block rounded px-2 py-[0.275rem] text-[0.8125rem] leading-normal text-white/45 no-underline transition-colors hover:bg-white/[0.04] hover:text-[#14f195]",
                    (heading.level ?? 2) === 3 && "pl-5 text-xs text-white/35",
                  )}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
