"use client";

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
import { Section } from "@solana-foundation/solana-lib";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./developers-chain-migration-cosmos-cosmwasm.module.css";

const SUPPORTED_CODE_LANGUAGES = new Set<DocsCodeSnippetProps["language"]>([
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

function DocsBreadcrumbs() {
  const links = [
    { label: "Developers", href: "/developers" },
    { label: "Migrate to Solana", href: "/developers/migrate-to-solana" },
    { label: "Cosmos", href: "/developers/migrate-to-solana/cosmos" },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="tw-mb-5 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-sm tw-text-white/45"
    >
      {links.map((link) => (
        <div
          key={link.href}
          className="tw-inline-flex tw-items-center tw-gap-2"
        >
          <Link
            href={link.href}
            className="tw-text-white/45 tw-no-underline transition-colors hover:tw-text-white/80"
          >
            {link.label}
          </Link>
          <ChevronRight className="tw-size-3.5 tw-text-white/25" aria-hidden />
        </div>
      ))}
      <span className="tw-text-white/80">CosmWasm</span>
    </nav>
  );
}

function GuideTableOfContents({ headline }: { headline: string }) {
  return (
    <div className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-5">
      <div className="tw-mb-4 tw-text-sm tw-font-medium tw-text-white/65">
        {headline}
      </div>
      <ul className="tw-m-0 tw-list-none tw-space-y-1 tw-p-0">
        {GUIDE_SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="tw-block tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-leading-6 tw-text-white/55 tw-no-underline transition-colors hover:tw-bg-white/5 hover:tw-text-white"
            >
              {section.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickReferenceTable() {
  return (
    <>
      <div className="tw-hidden tw-overflow-hidden tw-rounded-2xl tw-border tw-border-white/10 md:tw-block">
        <table className="tw-w-full tw-border-collapse">
          <thead className="tw-bg-white/5">
            <tr>
              <th className="tw-border-b tw-border-white/10 tw-px-4 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-white/80">
                CosmWasm
              </th>
              <th className="tw-border-b tw-border-white/10 tw-px-4 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-white/80">
                Anchor / Solana
              </th>
            </tr>
          </thead>
          <tbody>
            {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
              <tr
                key={source}
                className="tw-border-b tw-border-white/10 last:tw-border-b-0"
              >
                <td className="tw-px-4 tw-py-3 tw-font-mono tw-text-sm tw-text-white/88">
                  {source}
                </td>
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-leading-6 tw-text-white/68">
                  {destination}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tw-grid tw-gap-3 md:tw-hidden">
        {QUICK_REFERENCE_ROWS.map(([source, destination]) => (
          <div
            key={source}
            className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-4"
          >
            <p className="tw-mb-1 tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-white/45">
              CosmWasm
            </p>
            <p className="tw-mb-3 tw-break-words tw-font-mono tw-text-sm tw-text-white/90">
              {source}
            </p>
            <p className="tw-mb-1 tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-white/45">
              Anchor / Solana
            </p>
            <p className="tw-mb-0 tw-text-sm tw-leading-6 tw-text-white/68">
              {destination}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function renderGuideSegment(segment: GuideSegment, key: number) {
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

export function DevelopersChainMigrationCosmosCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmos-cosmwasm");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  return (
    <Section>
      <div className="tw-mx-auto tw-w-full tw-max-w-[1280px] tw-px-4 tw-py-8 sm:tw-px-6 lg:tw-px-8 lg:tw-py-10">
        <DocsBreadcrumbs />

        <header className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-6 md:tw-p-8">
          <p className="tw-mb-3 tw-text-xs tw-font-medium tw-uppercase tw-tracking-[0.18em] tw-text-white/45">
            {t("hero.eyebrow")}
          </p>
          <h1 className="tw-mb-4 tw-max-w-4xl tw-text-balance tw-text-4xl tw-font-semibold tw-leading-tight tw-text-white md:tw-text-5xl">
            {t("hero.headline")}
          </h1>
          <div
            className={styles.headerBody}
            dangerouslySetInnerHTML={{ __html: t("hero.body") }}
          />
          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-gap-3">
            {navButtons.map((button) => (
              <a
                key={button.url}
                href={button.url}
                className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.03] tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-text-white/75 tw-no-underline transition-colors hover:tw-bg-white/5 hover:tw-text-white"
              >
                {button.label}
                <ChevronRight className="tw-size-4" aria-hidden />
              </a>
            ))}
          </div>
        </header>

        <section className="tw-mt-6 tw-grid tw-gap-4 lg:tw-grid-cols-3">
          <div className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-5 lg:tw-col-span-3">
            <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-white/40">
              {GUIDE_HIGHLIGHTS.banner.eyebrow}
            </p>
            <h2 className="tw-mb-2 tw-text-2xl tw-font-semibold tw-leading-tight tw-text-white">
              {GUIDE_HIGHLIGHTS.banner.title}
            </h2>
            <p className="tw-mb-0 tw-max-w-4xl tw-text-base tw-leading-7 tw-text-white/68">
              {GUIDE_HIGHLIGHTS.banner.body}
            </p>
          </div>

          {GUIDE_HIGHLIGHTS.cards.map((card) => (
            <div
              key={card.number}
              className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-5"
            >
              <p className="tw-mb-3 tw-font-mono tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.18em] tw-text-white/40">
                {card.number}
              </p>
              <h3 className="tw-mb-2 tw-text-lg tw-font-semibold tw-leading-7 tw-text-white">
                {card.title}
              </h3>
              <p className="tw-mb-0 tw-text-sm tw-leading-7 tw-text-white/65">
                {card.body}
              </p>
            </div>
          ))}
        </section>

        <div className="tw-mt-8 xl:tw-hidden">
          <GuideTableOfContents headline={t("contentEditor.tocHeadline")} />
        </div>

        <div className="tw-mt-8 tw-grid tw-gap-12 xl:tw-grid-cols-[minmax(0,1fr)_240px]">
          <article className="tw-min-w-0">
            {GUIDE_SECTIONS.map((section, index) => {
              const isLast = index === GUIDE_SECTIONS.length - 1;
              const segments = parseGuideSegments(section.html);

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={cn(
                    "tw-scroll-mt-24",
                    !isLast &&
                      "tw-mb-10 tw-border-b tw-border-white/10 tw-pb-10",
                  )}
                >
                  <div className="tw-space-y-6">
                    {segments.map((segment, i) =>
                      renderGuideSegment(segment, i),
                    )}
                    {section.id === "quick-reference" ? (
                      <QuickReferenceTable />
                    ) : null}
                  </div>
                </section>
              );
            })}

            <section className="tw-mt-12 tw-border-t tw-border-white/10 tw-pt-8">
              <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.16em] tw-text-white/40">
                {t("resourceHeading.eyebrow")}
              </p>
              <h2 className="tw-mb-3 tw-text-3xl tw-font-semibold tw-leading-tight tw-text-white">
                {t("resourceHeading.headline")}
              </h2>
              <p className="tw-mb-6 tw-max-w-3xl tw-text-base tw-leading-7 tw-text-white/65">
                {t("resourceHeading.body")}
              </p>

              <div className="tw-grid tw-gap-4 md:tw-grid-cols-2 xl:tw-grid-cols-3">
                {RESOURCE_CARD_DECK.cards.map((card) => {
                  const isExternal = card.callToAction.url.startsWith("http");

                  return (
                    <a
                      key={card.heading}
                      href={card.callToAction.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className="tw-group tw-flex tw-h-full tw-flex-col tw-justify-between tw-rounded-2xl tw-border tw-border-white/10 tw-bg-[#111317] tw-p-5 tw-text-white tw-no-underline transition-colors hover:tw-border-white/20 hover:tw-bg-white/[0.03]"
                    >
                      <div>
                        <h3 className="tw-mb-2 tw-text-lg tw-font-semibold tw-leading-7 tw-text-white">
                          {card.heading}
                        </h3>
                        <p className="tw-mb-0 tw-text-sm tw-leading-7 tw-text-white/55">
                          {card.callToAction.label}
                        </p>
                      </div>

                      <span className="tw-mt-6 tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-white/75 transition-colors group-hover:tw-text-white">
                        Open resource
                        {isExternal ? (
                          <ExternalLink className="tw-size-4" aria-hidden />
                        ) : (
                          <ChevronRight className="tw-size-4" aria-hidden />
                        )}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          </article>

          <aside className="tw-hidden xl:tw-block">
            <div className="tw-sticky tw-top-28">
              <GuideTableOfContents headline={t("contentEditor.tocHeadline")} />
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
