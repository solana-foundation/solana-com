import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowLeftRight } from "@boxicons/react/ArrowLeftRight";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { BookOpen } from "@boxicons/react/BookOpen";
import { CodeAlt } from "@boxicons/react/CodeAlt";
import { CreditCard } from "@boxicons/react/CreditCard";
import { Layers } from "@boxicons/react/Layers";
import { Package } from "@boxicons/react/Package";
import { School } from "@boxicons/react/School";
import { Server } from "@boxicons/react/Server";
import { type ComponentType, type ReactNode } from "react";
import { getTranslations } from "@workspace/i18n/server";
import {
  COST_MODEL,
  DEVELOPER_NEWSLETTER_FORM_ID,
  HERO_LINKS,
  HUB_STATS,
  JOB_PATHS,
  LEARN_ROUTES,
  MORE_USE_CASES,
  PAYMENT_SNIPPET,
  PRODUCTION_USERS,
  WHY_REASONS,
  computeCosts,
  formatDate,
  formatInteger,
  formatStatValue,
  formatUsd,
  localizedHref,
  type JobPathId,
  type LearnRouteId,
} from "@/data/developers/hub";
import type { DeveloperUpdate } from "@/lib/developer-media";
import { CostCalculator } from "./cost-calculator.client";
import { AgentPrompt } from "./agent-prompt.client";
import { ExternalArrowIcon } from "./docs-icons";
import { NewsletterForm } from "./newsletter-form.client";

/** Links open in the same tab; only off-site ones open a new tab, with the arrow. */
const HACKATHONS_URL = "https://hackathons.solana.com";
const PAYMENTS_ORG_URL = "https://payments.org";

type Translate = (key: string, values?: Record<string, string>) => string;

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

const container = "mx-auto w-full max-w-[1200px] px-5 md:px-8";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dl-accent)]";
const h2 =
  "m-0 mb-2.5 font-brand text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--dl-text)] md:text-[30px]";
const lead = "m-0 text-base leading-[1.6] text-[var(--dl-muted)]";
/** Docs link style (content/styles/theme.css section 8). */
const inlineLink = `text-[var(--dl-link)] underline decoration-[var(--dl-link-underline)] decoration-1 underline-offset-[3px] hover:text-[var(--dl-link-hover)] hover:decoration-current ${focus}`;
/** Docs card (styles/stepper.css .sol-dpick > a): hairline, purple lift. */
const card =
  "rounded-2xl border border-[var(--dl-line)] bg-[var(--dl-surface)] shadow-[shadow:var(--dl-shadow)]";
const UPDATES_ALL_HREF = "/news";

const cardLink = `${card} text-[var(--dl-text)] no-underline transition-[border-color,box-shadow,transform] duration-150 hover:border-[var(--dl-purple-line)] hover:text-[var(--dl-text)] hover:shadow-[shadow:var(--dl-lift)] motion-safe:hover:-translate-y-px ${focus}`;
/** Docs buttons (--solui-cta; .sol-term-btn[data-variant=secondary]). */
const buttonBase = `inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold no-underline transition-colors ${focus}`;
const primaryButton = `${buttonBase} bg-[var(--dl-accent)] text-[var(--dl-on-accent)] hover:bg-[var(--dl-accent-hover)] hover:text-[var(--dl-on-accent)]`;
const secondaryButton = `${buttonBase} border border-[var(--dl-line-strong)] bg-transparent text-[var(--dl-text)] hover:border-[var(--dl-dim)] hover:bg-[var(--dl-soft)] hover:text-[var(--dl-text)]`;
const iconTile =
  "grid size-9 place-items-center rounded-[10px] border border-[var(--dl-icon-line)] bg-[var(--dl-icon-tile)] text-[var(--dl-icon-glyph)]";
const arrowDir = "rtl:-scale-x-100";

const JOB_ICONS: Record<JobPathId, IconComponent> = {
  payments: CreditCard,
  payPerCall: Server,
  asset: Layers,
  trade: ArrowLeftRight,
};

const ROUTE_ICONS: Record<LearnRouteId, IconComponent> = {
  docs: BookOpen,
  bootcamp: School,
  templates: Package,
  playground: CodeAlt,
};

function SectionHead({
  id,
  title,
  body,
  children,
}: {
  id: string;
  title: string;
  body: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[720px]">
        <h2 id={id} className={h2}>
          {title}
        </h2>
        <p className={lead}>{body}</p>
      </div>
      {children}
    </div>
  );
}

function PaymentVisual({ t }: { t: Translate }) {
  const node =
    "rounded-full border border-[var(--dl-line)] bg-[var(--dl-raised)] px-3 py-[7px] text-[12.5px] leading-none text-[var(--dl-text)]";
  return (
    <div className="grid w-[86%] grid-cols-[auto_1fr_auto] items-center gap-2.5">
      <span className={node}>{t("picker.visuals.payFrom")}</span>
      <span className="relative h-0.5 bg-[repeating-linear-gradient(90deg,var(--dl-line-strong)_0_6px,transparent_6px_12px)]">
        <i className="absolute left-0 top-1/2 -mt-3 h-6 rounded-[7px] border border-[var(--dl-accent-line)] bg-[var(--dl-surface-2)] px-2 font-[family-name:var(--dl-mono)] text-[11.5px] font-semibold not-italic leading-[22px] text-[var(--dl-accent-text)] motion-safe:animate-[dl-coin_2.8s_cubic-bezier(.6,0,.3,1)_infinite]">
          $1.00
        </i>
      </span>
      <span className={`${node} border-[var(--dl-accent-line)]`}>
        {t("picker.visuals.payTo")}
      </span>
      <span className="col-span-3 mt-4 justify-self-center font-[family-name:var(--dl-mono)] text-xs text-[var(--dl-accent-text)] motion-safe:animate-[dl-tag_2.8s_infinite]">
        {t("picker.visuals.payTag")}
      </span>
    </div>
  );
}

function ApiVisual() {
  const line =
    "rounded-lg border border-[var(--dl-line)] bg-[var(--dl-surface-2)] px-2.5 py-1.5 motion-safe:animate-[dl-step_4.8s_infinite]";
  return (
    <div
      dir="ltr"
      className="flex w-[84%] flex-col gap-1.5 font-[family-name:var(--dl-mono)] text-[12.5px] leading-normal text-[var(--dl-muted)]"
    >
      <div className={line}>
        <b className="font-semibold text-[var(--dl-code-fn)]">GET</b> /forecast
      </div>
      <div className={`${line} ![animation-delay:1.6s]`}>
        <span className="text-[var(--dl-code-num)]">402</span> pay $0.001
      </div>
      <div className={`${line} ![animation-delay:3.2s]`}>
        <span className="text-[var(--dl-good)]">200</span> OK
      </div>
    </div>
  );
}

/** Comments, strings, keywords, numbers, and called names, in that order. */
const CODE_TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(const|await|import|from)\b|\b(\d[\d_]*n?)\b|([A-Za-z_$][\w$]*)(?=\()/g;
const CODE_TOKEN_COLOR = [
  "text-[var(--dl-code-comment)]",
  "text-[var(--dl-code-str)]",
  "text-[var(--dl-code-kw)]",
  "text-[var(--dl-code-num)]",
  "text-[var(--dl-code-fn)]",
] as const;

/** One line of TypeScript with the page's code colors; text is unchanged. */
function CodeLine({ line }: { line: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(CODE_TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(line.slice(last, index));
    const group = match.slice(1).findIndex((g) => g !== undefined);
    parts.push(
      <span key={index} className={CODE_TOKEN_COLOR[group]}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return <>{parts}</>;
}

/**
 * The lines that send a USDC payment, from the Quickstart's tested example.
 * No copy button: it is a fragment; the linked page has the runnable file.
 */
function PaymentSnippet({ t, href }: { t: Translate; href: string }) {
  return (
    <figure
      data-testid="pay-snippet"
      className="m-0 flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--dl-line)] bg-[var(--dl-surface)]"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--dl-line)] px-5 pb-2 pt-4 text-[13px]">
        <span className="text-[var(--dl-dim)]">{t("calc.snippetCaption")}</span>
        <a
          href={href}
          className={`inline-flex items-center gap-1 font-medium text-[var(--dl-accent-text)] no-underline hover:text-[var(--dl-accent-text)] hover:underline hover:underline-offset-[3px] ${focus}`}
        >
          {t("calc.snippetLink")}
          <ArrowRight aria-hidden className={`!size-3.5 ${arrowDir}`} />
        </a>
      </figcaption>
      <pre
        dir="ltr"
        tabIndex={0}
        aria-label={PAYMENT_SNIPPET.file}
        className={`m-0 flex-1 overflow-x-auto bg-[var(--dl-surface-2)] px-5 py-4 font-[family-name:var(--dl-mono)] text-[12.5px] leading-[1.7] text-[var(--dl-text)] ${focus}`}
      >
        <code data-testid="pay-snippet-code">
          {PAYMENT_SNIPPET.lines.map((line, i) => (
            <span key={i} className="block">
              <CodeLine line={line} />
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function AssetVisual({ t }: { t: Translate }) {
  const row =
    "flex min-w-0 items-center justify-between gap-1.5 rounded-[10px] border border-[var(--dl-line)] bg-[var(--dl-raised)] px-2 py-[7px] text-[12.5px] leading-tight text-[var(--dl-text)] motion-safe:animate-[dl-row_4s_infinite]";
  return (
    <div className="grid w-full max-w-[20rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-3 px-3">
      <div className="rounded-2xl border border-[var(--dl-gold-line)] bg-[var(--dl-gold-soft)] px-3 py-2.5 text-[13px] font-semibold leading-tight text-[var(--dl-gold)] motion-safe:animate-[dl-bob_4s_ease-in-out_infinite]">
        {t("picker.visuals.assetToken")}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div className={row}>
          <span className="truncate">
            → {t("picker.visuals.assetApproved")}
          </span>
          <b className="shrink-0 text-[var(--dl-good)]">✓</b>
        </div>
        <div className={`${row} ![animation-delay:2s]`}>
          <span className="truncate">→ {t("picker.visuals.assetUnknown")}</span>
          <b className="shrink-0 text-[var(--dl-danger)]">✕</b>
        </div>
      </div>
    </div>
  );
}

function TradeVisual({ t }: { t: Translate }) {
  const leg =
    "rounded-[10px] border border-[var(--dl-line)] bg-[var(--dl-raised)] px-3 py-[7px] font-[family-name:var(--dl-mono)] text-[12.5px] text-[var(--dl-text)] motion-safe:animate-[dl-row_4s_infinite]";
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div dir="ltr" className="flex items-center gap-2.5">
        <span className={leg}>2 NVDAx →</span>
        <span className={leg}>← USDC</span>
      </div>
      <span className="font-[family-name:var(--dl-mono)] text-xs text-[var(--dl-accent-text)] motion-safe:animate-[dl-tag_4s_infinite]">
        {t("picker.visuals.tradeTag")}
      </span>
    </div>
  );
}

/** Visually hidden "(opens in a new tab)" plus the decorative arrow. */
function NewTabHint({ text }: { text: string }) {
  return (
    <>
      <ExternalArrowIcon size={14} />
      <span className="sr-only"> {text}</span>
    </>
  );
}

/** The agent setup line: a heading, then the line to paste, with a copy button. */
function AgentCard({ t }: { t: Translate }) {
  return (
    <section
      aria-labelledby="dl-agent-title"
      data-testid="agent-card"
      className="min-w-0 lg:self-center"
    >
      <h2
        id="dl-agent-title"
        className="m-0 mb-3 font-brand text-[15px] font-medium leading-snug text-[var(--dl-text)]"
      >
        {t("agent.title")}
      </h2>
      <AgentPrompt
        label={t("agent.copyPrompt")}
        copyText={t("agent.copy")}
        copiedText={t("agent.copied")}
      />
    </section>
  );
}

export async function DevelopersHub({
  locale,
  updates,
}: {
  locale: string;
  updates: DeveloperUpdate[];
}) {
  const t = await getTranslations({
    locale,
    namespace: "developers.landing",
  });
  const href = (path: string) => localizedHref(locale, path);
  const newTabText = t("newTab");

  const defaults = COST_MODEL.defaults;
  const defaultCosts = computeCosts(
    defaults.paymentsPerMonth,
    defaults.averagePaymentUsd,
  );
  const visuals: Record<JobPathId, ReactNode> = {
    payments: <PaymentVisual t={t} />,
    payPerCall: <ApiVisual />,
    asset: <AssetVisual t={t} />,
    trade: <TradeVisual t={t} />,
  };

  return (
    <main
      id="dl-main"
      tabIndex={-1}
      className="overflow-hidden bg-[var(--dl-bg)] font-brand text-base text-[var(--dl-text)] [outline-style:none]"
    >
      {/* Hero: headline, lede and buttons on the left; the agent setup line
          on the right, centred. Stacked below lg. */}
      <section
        aria-labelledby="dl-hero-title"
        className="border-b border-[var(--dl-line)] pb-14 pt-12 md:pb-16 md:pt-16"
      >
        <div
          className={`${container} grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16`}
        >
          <div className="lg:pt-2">
            <h1
              id="dl-hero-title"
              className="m-0 mb-5 font-brand text-[clamp(2.375rem,6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-[var(--dl-text)] [text-wrap:balance]"
            >
              {t("hero.title")}
            </h1>
            <p className="m-0 mb-7 max-w-[600px] text-lg leading-[1.6] text-[var(--dl-muted)] [text-wrap:pretty]">
              {t("hero.lede")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a href={HERO_LINKS.picker} className={primaryButton}>
                {t("hero.primaryCta")}
                <ArrowDown aria-hidden className="!size-4" />
              </a>
              <a href={href(HERO_LINKS.docs)} className={secondaryButton}>
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
          <AgentCard t={t} />
        </div>
      </section>

      {/* Job picker */}
      <section
        id="picker"
        aria-labelledby="dl-picker-title"
        className="scroll-mt-32 py-16 md:py-20"
      >
        <div className={container}>
          <SectionHead
            id="dl-picker-title"
            title={t("picker.title")}
            body={t("picker.body")}
          />
          <ul
            className="m-0 grid list-none gap-3.5 p-0 md:grid-cols-2 xl:grid-cols-4"
            data-testid="job-cards"
          >
            {JOB_PATHS.map((job) => {
              const Icon = JOB_ICONS[job.id];
              return (
                <li key={job.id} className="flex">
                  <a
                    href={href(job.href)}
                    data-testid={`job-card-${job.id}`}
                    className={`group flex w-full flex-col overflow-hidden ${cardLink}`}
                  >
                    {/* Headline first; a fixed-height row keeps the visuals
                        lined up across cards. */}
                    <div className="flex h-[5.25rem] items-center gap-3 px-5 pt-5">
                      <span className={`${iconTile} shrink-0`}>
                        <Icon aria-hidden className="!size-[18px]" />
                      </span>
                      <h3 className="m-0 font-brand text-lg font-medium leading-[1.25] tracking-[-0.015em] text-[var(--dl-text)] [text-wrap:pretty]">
                        {t(`picker.cards.${job.id}.title`)}
                      </h3>
                    </div>
                    <div
                      aria-hidden
                      className="relative mx-2 mt-4 grid h-[160px] place-items-center overflow-hidden rounded-xl border border-[var(--dl-line)] [background:var(--dl-vis)]"
                    >
                      {visuals[job.id]}
                    </div>
                    <div className="px-5 pt-4">
                      <p className="m-0 text-sm leading-[1.5] text-[var(--dl-muted)]">
                        {t(`picker.cards.${job.id}.body`)}
                      </p>
                    </div>
                    <div className="mt-auto flex flex-col items-start gap-1.5 px-5 pb-5 pt-[18px] text-xs text-[var(--dl-dim)]">
                      <span>
                        {t.rich("picker.firstResult", {
                          time: job.firstResult,
                          b: (chunks) => (
                            <b className="font-medium text-[var(--dl-muted)]">
                              {chunks}
                            </b>
                          ),
                        })}
                        {" · "}
                        {t("picker.totalTime", { time: job.total })}
                      </span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[var(--dl-accent-text)] group-hover:underline group-hover:underline-offset-[3px]">
                        {t(`picker.cards.${job.id}.cta`)}
                        <ArrowRight
                          aria-hidden
                          className={`!size-4 transition-transform motion-safe:group-hover:translate-x-0.5 ${arrowDir}`}
                        />
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
          <nav
            aria-label={t("picker.moreLabel")}
            className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[var(--dl-dim)]"
          >
            <span>{t("picker.moreLabel")}</span>
            {MORE_USE_CASES.map((item) => (
              <a
                key={item.id}
                href={href(item.href)}
                className={`rounded-lg border border-[var(--dl-line)] bg-[var(--dl-surface)] px-3 py-1.5 text-[var(--dl-muted)] no-underline transition-colors hover:border-[var(--dl-purple-line)] hover:bg-[var(--dl-purple-soft)] hover:text-[var(--dl-accent-text)] ${focus}`}
              >
                {t(`picker.more.${item.id}`)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Why Solana */}
      <section
        id="why-solana"
        aria-labelledby="dl-why-title"
        className="scroll-mt-32 border-t border-[var(--dl-line)] py-16 md:py-20"
      >
        <div className={container}>
          <SectionHead
            id="dl-why-title"
            title={t("why.title")}
            body={t("why.body")}
          />
          <ul
            className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4"
            data-testid="stats"
          >
            {HUB_STATS.map((stat) => (
              <li
                key={stat.id}
                data-testid={`stat-${stat.id}`}
                className={`${card} flex flex-col gap-1.5 px-5 py-5`}
              >
                <b className="text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--dl-text)]">
                  {formatStatValue(stat, locale)}
                </b>
                <span className="text-sm leading-[1.45] text-[var(--dl-muted)]">
                  {t(`why.stats.${stat.id}.label`)}
                </span>
              </li>
            ))}
          </ul>
          <ul className="m-0 mt-3 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_REASONS.map((id) => (
              <li
                key={id}
                className="rounded-2xl border border-[var(--dl-box-line)] bg-[var(--dl-purple-soft)] p-5"
              >
                <h3 className="m-0 mb-1.5 font-brand text-base font-medium leading-snug tracking-[-0.01em] text-[var(--dl-text)]">
                  {t(`why.reasons.${id}.title`)}
                </h3>
                <p className="m-0 text-sm leading-[1.55] text-[var(--dl-muted)]">
                  {t(`why.reasons.${id}.body`)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t border-[var(--dl-line)] pt-5">
            <span className="text-[13px] text-[var(--dl-dim)]">
              {t("why.productionLabel")}
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2.5 p-0">
              {PRODUCTION_USERS.map((name) => (
                <li
                  key={name}
                  className="text-[17px] font-semibold tracking-[-0.015em] text-[var(--dl-muted)]"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cost calculator */}
      <section
        id="cost"
        aria-labelledby="dl-calc-title"
        className="scroll-mt-32 border-t border-[var(--dl-line)] py-16 md:py-20"
      >
        <div className={container}>
          <SectionHead
            id="dl-calc-title"
            title={t("calc.title")}
            body={t("calc.body")}
          />
          <CostCalculator
            locale={locale}
            initial={{
              payments: formatInteger(defaults.paymentsPerMonth, locale),
              average: formatUsd(defaults.averagePaymentUsd, locale),
              card: formatUsd(defaultCosts.card, locale),
              solana: formatUsd(defaultCosts.solana, locale),
              savings: formatUsd(defaultCosts.savings, locale),
            }}
            note={t.rich("calc.note", {
              cardSource: (chunks) => (
                <a
                  href={COST_MODEL.card.source.url}
                  rel="noopener noreferrer"
                  className={inlineLink}
                >
                  {chunks}
                </a>
              ),
              feeSource: (chunks) => (
                <a
                  href={href(COST_MODEL.solana.source.url)}
                  className={inlineLink}
                >
                  {chunks}
                </a>
              ),
            })}
          />
          <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2">
            <div className="min-w-0 overflow-x-auto rounded-xl border border-[var(--dl-line)] bg-[var(--dl-surface)] lg:flex lg:flex-col">
              <table
                className="w-full border-collapse text-start text-sm lg:flex-1"
                data-testid="calc-table"
              >
                <caption className="px-5 pb-2 pt-4 text-start text-[13px] text-[var(--dl-dim)]">
                  {t("calc.tableCaption", {
                    average: formatUsd(defaults.averagePaymentUsd, locale),
                  })}
                </caption>
                <thead>
                  <tr className="bg-[var(--dl-surface-2)] text-[var(--dl-muted)]">
                    {(["tableVolume", "tableCard", "tableSolana"] as const).map(
                      (key) => (
                        <th
                          key={key}
                          scope="col"
                          className="border-y border-[var(--dl-line)] px-5 py-2.5 text-start font-medium"
                        >
                          {t(`calc.${key}`)}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {COST_MODEL.tableVolumes.map((volume) => {
                    const costs = computeCosts(
                      volume,
                      defaults.averagePaymentUsd,
                    );
                    return (
                      <tr
                        key={volume}
                        className="border-b border-[var(--dl-line)] last:border-0"
                      >
                        <th
                          scope="row"
                          className="px-5 py-3 text-start font-normal text-[var(--dl-text)]"
                        >
                          {formatInteger(volume, locale)}
                        </th>
                        <td className="px-5 py-3 text-[var(--dl-text)]">
                          {formatUsd(costs.card, locale)}
                        </td>
                        <td className="px-5 py-3 font-medium text-[var(--dl-good)]">
                          {formatUsd(costs.solana, locale)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaymentSnippet t={t} href={href(PAYMENT_SNIPPET.href)} />
          </div>
          <p className="m-0 mt-3.5 text-sm text-[var(--dl-muted)]">
            {t("calc.liveBody")}{" "}
            <a
              href={PAYMENTS_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="calc-live"
              className={inlineLink}
            >
              {t("calc.liveLink")}
              <NewTabHint text={newTabText} />
            </a>
          </p>
        </div>
      </section>

      {/* Other ways to learn */}
      <section
        id="learn"
        aria-labelledby="dl-routes-title"
        className="scroll-mt-32 border-t border-[var(--dl-line)] py-16 md:py-20"
      >
        <div className={container}>
          <SectionHead
            id="dl-routes-title"
            title={t("routes.title")}
            body={t("routes.body")}
          />
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {LEARN_ROUTES.map((route) => {
              const Icon = ROUTE_ICONS[route.id];
              const body = (
                <>
                  <span className="grid size-9 place-items-center rounded-[10px] border border-[var(--dl-purple-line)] bg-[var(--dl-purple-soft)] text-[var(--dl-purple-text)]">
                    <Icon aria-hidden className="!size-[18px]" />
                  </span>
                  <h3 className="mb-1 mt-5 font-brand text-base font-medium tracking-[-0.01em] text-[var(--dl-text)]">
                    {t(`routes.items.${route.id}.title`)}
                  </h3>
                  <p className="m-0 text-sm leading-normal text-[var(--dl-muted)]">
                    {t(`routes.items.${route.id}.body`)}
                  </p>
                </>
              );
              // No href yet: greyed out, not a link, marked "Coming soon".
              if (!route.href)
                return (
                  <li key={route.id} className="flex">
                    <div
                      aria-disabled="true"
                      data-testid={`route-${route.id}`}
                      className="relative block w-full cursor-default select-none rounded-2xl border border-[var(--dl-line)] bg-[var(--dl-surface)] px-5 pb-6 pt-5 opacity-55 grayscale"
                    >
                      <span className="absolute end-5 top-6 rounded-full border border-[var(--dl-line-strong)] px-2 py-0.5 text-xs text-[var(--dl-dim)]">
                        {t("routes.comingSoon")}
                      </span>
                      {body}
                    </div>
                  </li>
                );
              return (
                <li key={route.id} className="flex">
                  <a
                    href={href(route.href)}
                    className={`group relative block w-full px-5 pb-6 pt-5 ${cardLink}`}
                  >
                    <ArrowRight
                      aria-hidden
                      className={`absolute end-5 top-6 !size-4 text-[var(--dl-dim)] transition-transform group-hover:text-[var(--dl-accent-text)] motion-safe:group-hover:translate-x-0.5 ${arrowDir}`}
                    />
                    {body}
                  </a>
                </li>
              );
            })}
          </ul>
          <div
            className="mt-3 flex flex-col gap-3 rounded-2xl border border-[var(--dl-box-line)] bg-[var(--dl-purple-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            data-testid="hackathons"
          >
            <div>
              <h3 className="m-0 font-brand text-base font-medium tracking-[-0.01em] text-[var(--dl-text)]">
                {t("routes.hackathons.title")}
              </h3>
              <p className="m-0 mt-0.5 text-sm text-[var(--dl-muted)]">
                {t("routes.hackathons.body")}
              </p>
            </div>
            <a
              href={HACKATHONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${secondaryButton} shrink-0 self-start sm:self-auto`}
            >
              {t("routes.hackathons.cta")}
              <NewTabHint text={newTabText} />
            </a>
          </div>
        </div>
      </section>

      {/* Developer updates: the email sign-up first, so it's seen, then the
          latest posts from the Media feed (hidden when it's empty), then a
          link to all news. */}
      <section
        id="updates"
        aria-labelledby="dl-updates-title"
        className="scroll-mt-32 border-t border-[var(--dl-line)] pb-20 pt-16 md:pt-20"
      >
        <div className={container}>
          <SectionHead
            id="dl-updates-title"
            title={t("updates.title")}
            body={t("updates.body")}
          />
          <div
            id="newsletter"
            className="mb-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--dl-box-line)] bg-[var(--dl-purple-soft)] px-6 py-6 md:flex-row md:items-center md:px-8"
          >
            <div>
              <h3 className="m-0 mb-1 font-brand text-lg font-medium tracking-[-0.015em] text-[var(--dl-text)]">
                {t("newsletter.title")}
              </h3>
              <p className="m-0 text-[15px] text-[var(--dl-muted)]">
                {t("newsletter.body")}
              </p>
            </div>
            <NewsletterForm formId={DEVELOPER_NEWSLETTER_FORM_ID} />
          </div>
          {updates.length > 0 && (
            <>
              <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 lg:grid-cols-4">
                {updates.slice(0, 4).map((update) => (
                  <li key={update.href} className="flex">
                    <a
                      href={update.href}
                      className={`group flex w-full flex-col gap-2 p-5 ${cardLink}`}
                    >
                      <span className="text-xs text-[var(--dl-dim)]">
                        {t(`updates.kinds.${update.kind}`)}
                        {update.publishedAt
                          ? ` · ${formatDate(update.publishedAt.slice(0, 10), locale)}`
                          : ""}
                      </span>
                      <h3 className="m-0 font-brand text-base font-medium leading-snug text-[var(--dl-text)]">
                        {update.title}
                      </h3>
                      <p className="m-0 line-clamp-3 text-sm text-[var(--dl-muted)]">
                        {update.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-[var(--dl-accent-text)]">
                        {t("updates.read")}
                        <ArrowRight
                          aria-hidden
                          className={`!size-4 ${arrowDir}`}
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center">
                <a
                  href={UPDATES_ALL_HREF}
                  className={secondaryButton}
                  data-testid="updates-all"
                >
                  {t("updates.all")}
                  <ArrowRight aria-hidden className={`!size-4 ${arrowDir}`} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
