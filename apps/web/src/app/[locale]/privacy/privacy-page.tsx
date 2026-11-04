"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { Link as LocaleLink } from "@workspace/i18n/routing";
import { Link as ChromeLink } from "@solana-com/ui-chrome/link";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import { SelectionColor } from "@/component-library/selection-color";
import {
  BUILDING_ON_SOLANA,
  COMPLIANCE_ITEMS,
  CONFIDENTIAL_BALANCES_STATS,
  CONFIDENTIAL_BALANCES_TAGS,
  CONFIDENTIAL_LEDGER_ROWS,
  ECOSYSTEM_PROJECTS,
  FEATURED_SOLUTIONS,
  GLANCE_STATS,
  PRIVACY_LINKS,
  PRIVATE_CHANNELS_STEPS,
  PRIVATE_CHANNELS_TAGS,
  RESOURCE_LINKS,
  RING_RULES,
  RINGS_TAGS,
  isExternalHref,
  type PrivacyMode,
  type PrivacyStatus,
} from "@/data/solutions/privacy";
import Marquee from "@/component-library/marquee";
import { PrivacyContactButton } from "./privacy-contact";
import { ViewAsLedger } from "./privacy-ledger";
import { EcosystemShowcase } from "./privacy-ecosystem";
import type { DiagramLabels } from "./privacy-diagrams";
import { Reveal, SettlementTrack, SolutionIcon } from "./privacy-motion";
import { PrivacyHeroArt } from "./privacy-hero-art";

/* ──────────────────────────────────────────────────────────
   Shared styles
   ────────────────────────────────────────────────────────── */

const eyebrowClass =
  "font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text";

const monoLabelClass =
  "font-brand-mono text-[10px] uppercase tracking-[0.14em] text-nd-mid-em-text";

const textLinkClass =
  "inline-flex items-center gap-2 font-brand-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:text-nd-highlight-lavendar focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const primaryButtonClass =
  "h-12 rounded-full bg-nd-cta px-5 text-nd-inverse hover:bg-nd-primary/90";

const sectionClass = "border-b border-nd-border-light py-16 md:py-24 xl:py-32";

const accentTextClass = "font-light text-nd-mid-em-text";

/** Solid accent colors cycled across list items. No gradients. */
const PALETTE = [
  { text: "text-nd-highlight-lavendar", bg: "bg-nd-highlight-green" },
  { text: "text-nd-highlight-blue", bg: "bg-nd-highlight-blue" },
  { text: "text-nd-highlight-lavendar", bg: "bg-nd-highlight-lavendar" },
  { text: "text-nd-highlight-gold", bg: "bg-nd-highlight-gold" },
] as const;

const SOLUTION_TONES = {
  "privacy.confidentialBalances": {
    text: "text-nd-highlight-lavendar",
    border: "border-nd-highlight-green/30",
    dot: "bg-nd-highlight-green",
  },
  "privacy.privateChannels": {
    text: "text-nd-highlight-blue",
    border: "border-nd-highlight-blue/30",
    dot: "bg-nd-highlight-blue",
  },
  "privacy.rings": {
    text: "text-nd-highlight-lavendar",
    border: "border-nd-highlight-lavendar/30",
    dot: "bg-nd-highlight-lavendar",
  },
} as const;

const calloutClass =
  "rounded-2xl border border-nd-border-prominent bg-white/[0.03]";

const strong = (chunks: ReactNode) => (
  <strong className="font-medium text-white">{chunks}</strong>
);

/* ──────────────────────────────────────────────────────────
   Small building blocks
   ────────────────────────────────────────────────────────── */

function SectionHeading({
  title,
  titleAccent,
  description,
  id,
  className,
}: {
  title: string;
  titleAccent?: string;
  description?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col gap-6 ${className ?? ""}`}>
      <h2 id={id} className="nd-heading-l max-w-[860px]">
        {title}
        {titleAccent && (
          <>
            {" "}
            <span className={accentTextClass}>{titleAccent}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="nd-body-l max-w-[720px] text-nd-mid-em-text">
          {description}
        </p>
      )}
    </Reveal>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: PrivacyStatus;
  label: string;
}) {
  const dotClass =
    status === "devnetBeta" ? "bg-nd-highlight-blue" : "bg-nd-highlight-green";
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-nd-border-prominent px-3 py-1.5 font-brand-mono text-[10px] uppercase tracking-[0.14em] text-nd-mid-em-text">
      <span
        className={`size-1.5 shrink-0 rounded-full ${dotClass}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function Tag({
  children,
  borderClass,
}: {
  children: ReactNode;
  borderClass?: string;
}) {
  return (
    <span
      className={`rounded-full border bg-white/[0.04] px-3 py-1.5 text-xs text-white ${borderClass ?? "border-transparent"}`}
    >
      {children}
    </span>
  );
}

/** Routes links to the right component: same-app, sibling app, or external. */
function SmartLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  if (href.startsWith("/developers/docs")) {
    return (
      <ChromeLink href={href} hrefLang="en" className={className} {...rest}>
        {children}
      </ChromeLink>
    );
  }
  return (
    <LocaleLink href={href} className={className} {...rest}>
      {children}
    </LocaleLink>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <SmartLink href={href} className={textLinkClass}>
      {children}
      <ArrowUpRight className="!size-4" aria-hidden="true" />
    </SmartLink>
  );
}

function PartyLabel({ from, to }: { from: string; to: string }) {
  return (
    <>
      <span>{from}</span>
      <ArrowRight
        className="!size-3.5 text-nd-mid-em-text"
        aria-hidden="true"
      />
      <span>{to}</span>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Sections
   ────────────────────────────────────────────────────────── */

function Hero() {
  const t = useTranslations("privacy.hero");
  return (
    <section className="relative overflow-hidden border-b border-nd-border-light bg-nd-inverse">
      <Container className="relative z-10 grid min-h-[640px] items-center gap-12 py-20 md:min-h-[720px] md:py-28 xl:grid-cols-[1.1fr_0.9fr] xl:gap-16">
        <div>
          <h1 className="nd-heading-2xl max-w-[900px]">
            {t("headline")}
            <br />
            <span className="font-light text-nd-highlight-lavendar">
              {t("headlineAccent")}
            </span>
          </h1>
          <p className="nd-body-xl mt-6 max-w-[620px] font-medium text-nd-mid-em-text md:mt-8">
            {t("description")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 md:mt-[52px]">
            <Button asChild className={primaryButtonClass} size="lg">
              <a href="#solutions">
                {t("primaryCta")}
                <span className="-mr-3 inline-flex size-8 items-center justify-center rounded-full bg-nd-inverse text-nd-cta">
                  <ArrowDown className="!size-4" aria-hidden="true" />
                </span>
              </a>
            </Button>
            <PrivacyContactButton
              label={t("secondaryCta")}
              variant="secondary"
            />
          </div>
        </div>
        <PrivacyHeroArt className="w-full max-w-[760px] justify-self-center xl:justify-self-end" />
      </Container>
    </section>
  );
}

function ModeCell({ mode, caption }: { mode: PrivacyMode; caption: string }) {
  const t = useTranslations("privacy.matrix");
  return (
    <div className="group relative flex h-full flex-col gap-3 p-6 transition-[background-color,transform] duration-300 ease-out hover:z-10 hover:scale-[1.02] hover:bg-solana-purple/[0.08] motion-reduce:transition-colors motion-reduce:hover:scale-100 md:p-8">
      <p className={`${monoLabelClass} md:hidden`}>{caption}</p>
      <h3 className="nd-heading-s text-white transition-colors duration-300 group-hover:text-nd-highlight-lavendar">
        {t(`${mode}.title`)}
      </h3>
      <p className="nd-body-m text-nd-mid-em-text transition-colors duration-300 group-hover:text-white/80">
        {t(`${mode}.description`)}
      </p>
      <p className="mt-auto pt-2 font-brand-mono text-[11px] uppercase tracking-[0.12em] text-nd-mid-em-text transition-colors duration-300 group-hover:text-nd-highlight-lavendar">
        {t(`${mode}.tools`)}
      </p>
    </div>
  );
}

function Modes() {
  const t = useTranslations("privacy.matrix");
  const axisHeaderClass = `${monoLabelClass} px-6 py-4 md:px-8`;
  const rowLabelClass = `${monoLabelClass} flex items-center px-4 py-6 md:px-5`;
  return (
    <section className={sectionClass}>
      <Container>
        <SectionHeading title={t("title")} description={t("description")} />

        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-nd-border-prominent md:mt-16">
          <div className="hidden border-b border-nd-border-light md:grid md:grid-cols-[140px_1fr_1fr]">
            <div aria-hidden="true" />
            <div
              className={`${axisHeaderClass} border-l border-nd-border-light`}
            >
              {t("axis.partiesVisible")}
            </div>
            <div
              className={`${axisHeaderClass} border-l border-nd-border-light`}
            >
              {t("axis.partiesHidden")}
            </div>
          </div>

          <div className="grid md:grid-cols-[140px_1fr_1fr]">
            <div
              className={`${rowLabelClass} hidden border-b border-nd-border-light md:flex`}
            >
              {t("axis.amountsVisible")}
            </div>
            <div className="border-b border-nd-border-light md:border-l">
              <ModeCell
                mode="public"
                caption={`${t("axis.amountsVisible")} · ${t("axis.partiesVisible")}`}
              />
            </div>
            <div className="border-b border-nd-border-light md:border-l">
              <ModeCell
                mode="anonymous"
                caption={`${t("axis.amountsVisible")} · ${t("axis.partiesHidden")}`}
              />
            </div>

            <div className={`${rowLabelClass} hidden md:flex`}>
              {t("axis.amountsHidden")}
            </div>
            <div className="border-b border-nd-border-light md:border-b-0 md:border-l">
              <ModeCell
                mode="confidential"
                caption={`${t("axis.amountsHidden")} · ${t("axis.partiesVisible")}`}
              />
            </div>
            <div className="md:border-l md:border-nd-border-light">
              <ModeCell
                mode="fullyPrivate"
                caption={`${t("axis.amountsHidden")} · ${t("axis.partiesHidden")}`}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Solutions() {
  const t = useTranslations("privacy.solutions");
  return (
    <section id="solutions" className={`${sectionClass} scroll-mt-20`}>
      <Container>
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {FEATURED_SOLUTIONS.map((solution, index) => {
            return (
              <Reveal key={solution.key} delay={index * 0.1} className="flex">
                <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-nd-border-prominent bg-white/[0.03] p-6 transition-colors duration-500 hover:border-nd-border-hovered md:p-8">
                  <div className="relative flex flex-wrap items-center gap-3">
                    <StatusBadge
                      status={solution.status}
                      label={t(`status.${solution.status}`)}
                    />
                  </div>
                  <div className="relative mt-8">
                    <SolutionIcon solution={solution.key} />
                  </div>
                  <div className="relative mt-8 flex flex-col gap-3">
                    <h3 className="nd-heading-m">
                      {t(`items.${solution.key}.name`)}
                    </h3>
                    <p className="m-0 text-sm text-white">
                      {t(`items.${solution.key}.audience`)}
                    </p>
                    <p className="nd-body-m mt-2 text-nd-mid-em-text">
                      {t(`items.${solution.key}.description`)}
                    </p>
                  </div>
                  <a
                    href={`#${solution.sectionId}`}
                    className={`${textLinkClass} relative mt-auto pt-8`}
                  >
                    {t("detailsCta")}
                    <ArrowDown className="!size-4" aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div
          className={`${calloutClass} mt-6 grid gap-8 p-6 md:grid-cols-[1.4fr_0.6fr] md:items-center md:p-10`}
        >
          <div>
            <h3 className="nd-heading-m">{t("talk.title")}</h3>
            <p className="nd-body-m mt-4 max-w-[680px] text-nd-mid-em-text">
              {t("talk.description")}
            </p>
          </div>
          <div className="md:justify-self-end">
            <PrivacyContactButton label={t("talk.cta")} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function SolutionIntro({
  namespace,
  sectionId,
  status,
  statusLabel,
  tags,
  children,
}: {
  namespace:
    | "privacy.confidentialBalances"
    | "privacy.privateChannels"
    | "privacy.rings";
  sectionId: string;
  status: PrivacyStatus;
  statusLabel: string;
  tags: readonly string[];
  children?: ReactNode;
}) {
  const t = useTranslations(namespace);
  const tone = SOLUTION_TONES[namespace];
  return (
    <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
      <Reveal>
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={status} label={statusLabel} />
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <h2 id={sectionId} className="nd-heading-l max-w-[760px]">
            {t("name")}
            {t.has("byline") && (
              <span className="ml-3 align-middle text-[0.45em] font-light text-nd-mid-em-text">
                {t("byline")}
              </span>
            )}
          </h2>
          <p className="nd-heading-s max-w-[760px] font-light text-white">
            {t("title")} <span className={tone.text}>{t("titleAccent")}</span>
          </p>
          <p className="nd-body-l max-w-[620px] text-nd-mid-em-text">
            {t.rich("description", { strong })}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} borderClass={tone.border}>
              {t(`tags.${tag}`)}
            </Tag>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.15}>{children}</Reveal>
    </div>
  );
}

function ConfidentialBalances() {
  const t = useTranslations("privacy.confidentialBalances");
  const tStatus = useTranslations("privacy.solutions.status");
  const format = useFormatter();

  const rowLabel = (key: (typeof CONFIDENTIAL_LEDGER_ROWS)[number]["key"]) =>
    key === "treasury" ? (
      t("rows.treasury")
    ) : (
      <PartyLabel from={t("parties.company")} to={t(`parties.${key}`)} />
    );

  return (
    <section
      id="confidential-balances"
      className={`${sectionClass} relative scroll-mt-20 overflow-hidden`}
    >
      <Container className="relative">
        <SolutionIntro
          namespace="privacy.confidentialBalances"
          sectionId="confidential-balances-title"
          status="mainnet"
          statusLabel={tStatus("mainnet")}
          tags={CONFIDENTIAL_BALANCES_TAGS}
        >
          <ViewAsLedger
            rows={CONFIDENTIAL_LEDGER_ROWS.map((row) => ({
              key: row.key,
              label: rowLabel(row.key),
              amount: format.number(row.amount, {
                style: "currency",
                currency: "USD",
              }),
            }))}
            labels={{
              viewAs: t("viewAs"),
              views: {
                public: t("views.public"),
                auditor: t("views.auditor"),
              },
              notes: {
                public: t("notes.public"),
                auditor: t("notes.auditor"),
              },
              encrypted: t("encrypted"),
            }}
          />
        </SolutionIntro>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light md:mt-20 md:grid-cols-3">
          {CONFIDENTIAL_BALANCES_STATS.map((stat, index) => (
            <div key={stat} className="bg-nd-bg p-6 md:p-8">
              <p
                className={`font-brand text-[40px] font-medium leading-none tracking-[-0.04em] md:text-[48px] ${index === 0 ? "text-nd-highlight-lavendar" : "text-white"}`}
              >
                {t(`stats.${stat}.value`)}
              </p>
              <p className="nd-body-s mt-3 text-nd-mid-em-text">
                {t(`stats.${stat}.label`)}
              </p>
            </div>
          ))}
        </div>

        <div className={`${calloutClass} mt-6 p-6 md:p-8`}>
          <p className="nd-body-m text-nd-mid-em-text">
            {t.rich("note", { strong })}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <TextLink href={PRIVACY_LINKS.confidentialBalancesDocs}>
            {t("links.docs")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.confidentialBalancesIntegration}>
            {t("links.integration")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.confidentialBalancesIssuer}>
            {t("links.issuer")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.securityAudits}>
            {t("links.audits")}
          </TextLink>
        </div>
      </Container>
    </section>
  );
}

function PrivateChannels() {
  const t = useTranslations("privacy.privateChannels");
  const tStatus = useTranslations("privacy.solutions.status");

  return (
    <section
      id="private-channels"
      className={`${sectionClass} relative scroll-mt-20 overflow-hidden`}
    >
      <Container className="relative">
        <SolutionIntro
          namespace="privacy.privateChannels"
          sectionId="private-channels-title"
          status="mainnetBeta"
          statusLabel={tStatus("mainnetBeta")}
          tags={PRIVATE_CHANNELS_TAGS}
        >
          <SettlementTrack color="#55E9AB" />
          <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3">
            {PRIVATE_CHANNELS_STEPS.map((step) => (
              <li
                key={step}
                className="flex flex-col rounded-2xl border border-nd-border-prominent bg-white/[0.03] p-6 transition-colors duration-500 hover:border-nd-highlight-blue/50"
              >
                <h3 className="nd-heading-s">{t(`steps.${step}.title`)}</h3>
                <p className="nd-body-s mt-3 text-nd-mid-em-text">
                  {t(`steps.${step}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </SolutionIntro>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <TextLink href={PRIVACY_LINKS.privateChannelsDocs}>
            {t("links.docs")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.privateChannelsGithub}>
            {t("links.github")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.privateChannelsProduct}>
            {t("links.product")}
          </TextLink>
          <TextLink href={PRIVACY_LINKS.privateChannelsAudits}>
            {t("links.audits")}
          </TextLink>
        </div>
      </Container>
    </section>
  );
}

function Rings() {
  const t = useTranslations("privacy.rings");
  const tStatus = useTranslations("privacy.solutions.status");

  return (
    <section
      id="solana-rings"
      className={`${sectionClass} relative scroll-mt-20 overflow-hidden`}
    >
      <Container className="relative">
        <SolutionIntro
          namespace="privacy.rings"
          sectionId="solana-rings-title"
          status="devnetBeta"
          statusLabel={tStatus("devnetBeta")}
          tags={RINGS_TAGS}
        >
          <div className="rounded-2xl border border-nd-border-prominent bg-white/[0.03] p-6 md:p-8">
            <h3 className="nd-heading-s">{t("rulesTitle")}</h3>
            <ul className="m-0 list-none p-0 mt-6 grid gap-x-8 sm:grid-cols-2">
              {RING_RULES.map((rule) => (
                <li
                  key={rule}
                  className="group border-t border-nd-border-light py-3 transition-colors duration-300 hover:border-nd-highlight-lavendar/60"
                >
                  <span className="flex items-center gap-2 text-base font-medium text-white transition-colors group-hover:text-nd-highlight-lavendar">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-nd-highlight-lavendar"
                    />
                    {t(`rules.${rule}.title`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SolutionIntro>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <TextLink href={PRIVACY_LINKS.rings}>{t("links.site")}</TextLink>
          <TextLink href={PRIVACY_LINKS.ringsDemo}>{t("links.demo")}</TextLink>
          <TextLink href={PRIVACY_LINKS.ringsDocs}>{t("links.docs")}</TextLink>
        </div>
      </Container>
    </section>
  );
}

function Compliance() {
  const t = useTranslations("privacy.compliance");
  return (
    <section id="compliance" className={`${sectionClass} scroll-mt-20`}>
      <Container>
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="mt-12 divide-y divide-nd-border-light border-y border-nd-border-light md:mt-16">
          {COMPLIANCE_ITEMS.map((item, index) => (
            <div
              key={item}
              className="grid gap-2 py-6 md:grid-cols-[0.35fr_0.65fr] md:items-baseline md:gap-8"
            >
              <h3 className="nd-heading-s flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-sm ${PALETTE[index % PALETTE.length].bg}`}
                />
                {t(`items.${item}.title`)}
              </h3>
              <p className="nd-body-m max-w-[720px] text-nd-mid-em-text">
                {t.rich(`items.${item}.description`, {
                  link: (chunks) => (
                    <a
                      href={PRIVACY_LINKS.attestationService}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline decoration-nd-border-hovered underline-offset-4 transition-colors hover:decoration-nd-highlight-green"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
          ))}
        </div>

        <Reveal className="mt-16 md:mt-24">
          <figure className="relative m-0 max-w-[900px] pl-12 md:pl-20">
            <span
              aria-hidden="true"
              className="absolute -top-4 left-0 font-serif text-[96px] leading-none text-nd-highlight-lavendar md:-top-6 md:text-[140px]"
            >
              &ldquo;
            </span>
            <blockquote className="nd-heading-m m-0 font-light italic text-white">
              {t("quote.text")}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 text-sm text-nd-mid-em-text">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-nd-highlight-green"
              />
              {t("quote.attribution")}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-10">
          <TextLink href={PRIVACY_LINKS.enterpriseFaq}>{t("faqCta")}</TextLink>
        </div>
      </Container>
    </section>
  );
}

function Glance() {
  const t = useTranslations("privacy.glance");
  const reduceMotion = useReducedMotion();
  return (
    <section className={sectionClass}>
      <Container>
        <SectionHeading title={t("title")} />

        <Reveal className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light sm:grid-cols-2 xl:grid-cols-5 md:mt-16">
          {GLANCE_STATS.map((stat, index) => (
            <div
              key={stat.key}
              className="relative bg-nd-bg p-6 transition-colors duration-500 hover:bg-[#0b0d10]"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-6 top-0 h-0.5 ${PALETTE[index % PALETTE.length].bg}`}
              />
              <p
                className={`font-brand text-[36px] font-medium leading-none tracking-[-0.04em] md:text-[40px] ${stat.highlight ? "text-nd-highlight-lavendar" : "text-white"}`}
              >
                {t(`stats.${stat.key}.value`)}
              </p>
              <p className="nd-body-xs mt-3 text-nd-mid-em-text">
                {t(`stats.${stat.key}.label`)}
              </p>
            </div>
          ))}
        </Reveal>

        <div className="mt-12 md:mt-16">
          <p className={eyebrowClass}>{t("buildingLabel")}</p>
          {reduceMotion ? (
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-x-10 gap-y-3 p-0">
              {BUILDING_ON_SOLANA.map((name) => (
                <li
                  key={name}
                  className="font-brand text-xl font-medium tracking-[-0.02em] text-white/80"
                >
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul className="sr-only">
                {BUILDING_ON_SOLANA.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <div
                aria-hidden="true"
                className="mt-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
              >
                <Marquee speed={40}>
                  {BUILDING_ON_SOLANA.map((name) => (
                    <span
                      key={name}
                      className="mr-12 font-brand text-xl font-medium tracking-[-0.02em] text-white/80 md:text-2xl"
                    >
                      {name}
                    </span>
                  ))}
                </Marquee>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

function displayHost(href: string) {
  if (!isExternalHref(href))
    return `solana.com${href.split("/").slice(0, 2).join("/")}`;
  return new URL(href).hostname.replace(/^www\./, "");
}

function Ecosystem() {
  const t = useTranslations("privacy.projects");

  // Every project gets the same card treatment; no project is singled out.
  const cards = [
    ...FEATURED_SOLUTIONS.map(({ key, href }) => ({ key, href })),
    ...ECOSYSTEM_PROJECTS.map(({ key, href }) => ({ key, href })),
  ];

  return (
    <section id="ecosystem" className={`${sectionClass} scroll-mt-20`}>
      <Container>
        <SectionHeading title={t("title")} description={t("description")} />

        <EcosystemShowcase
          listLabel={t("title")}
          diagramLabels={t.raw("diagram") as DiagramLabels}
          visitLabel={(name) => t("visit", { name })}
          items={cards.map((card) => ({
            key: card.key,
            title: t(`items.${card.key}.title`),
            category: t(`items.${card.key}.category`),
            description: t(`items.${card.key}.description`),
            href: card.href,
            host: displayHost(card.href),
          }))}
        />
      </Container>
    </section>
  );
}

function Resources() {
  const t = useTranslations("privacy.resources");
  return (
    <section id="resources" className="py-16 md:py-24 xl:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <SectionHeading title={t("title")} />
          <SmartLink
            href={PRIVACY_LINKS.developerPlatform}
            className={`${calloutClass} group block p-6 text-white transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-nd-border-hovered hover:bg-nd-highlight-lavendar/[0.05] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-lavendar motion-reduce:transition-colors motion-reduce:hover:translate-y-0 md:p-8`}
          >
            <h3 className="nd-heading-m">{t("platform.title")}</h3>
            <p className="nd-body-m mt-4 text-nd-mid-em-text">
              {t.rich("platform.description", { strong })}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-brand-mono text-xs uppercase tracking-[0.1em] text-white transition-colors duration-300 group-hover:text-nd-highlight-lavendar">
              {t("platform.cta")}
              <ArrowUpRight
                className="!size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </span>
          </SmartLink>
        </div>

        <ul className="m-0 mt-12 grid list-none gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light p-0 sm:grid-cols-2 xl:grid-cols-4 md:mt-16">
          {RESOURCE_LINKS.map((link) => (
            <li key={link.key} className="flex bg-nd-bg">
              <SmartLink
                href={link.href}
                className="group flex w-full flex-col justify-between gap-6 p-6 text-white transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-nd-highlight-green"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-base font-medium leading-snug">
                    {t(`links.${link.key}`)}
                  </span>
                  <ArrowUpRight
                    className="!size-4 shrink-0 text-nd-mid-em-text transition-colors group-hover:text-nd-highlight-lavendar"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-brand-mono text-[11px] text-nd-mid-em-text [overflow-wrap:anywhere]">
                  {link.display}
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-6 border-t border-nd-border-light pt-10 md:mt-20 md:flex-row md:items-center md:justify-between">
          <h3 className="nd-heading-m max-w-[640px]">{t("talk.title")}</h3>
          <PrivacyContactButton label={t("talk.cta")} />
        </div>
      </Container>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────── */

export function PrivacyPage() {
  return (
    <>
      <SelectionColor selectionColor="#55E9AB" selectionTextColor="#000000" />
      <main className="overflow-hidden bg-nd-bg text-nd-high-em-text">
        <Hero />
        <Modes />
        <Solutions />
        <ConfidentialBalances />
        <PrivateChannels />
        <Rings />
        <Compliance />
        <Glance />
        <Ecosystem />
        <Resources />
      </main>
    </>
  );
}
