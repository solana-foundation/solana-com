"use client";

import dynamic from "next/dynamic";
import { Container } from "@/component-library/container";
import { useTranslations } from "next-intl";
import { SECONDARY_CARD_DECK } from "@/data/developers/evm-to-svm";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { CheckShield } from "@boxicons/react/CheckShield";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { Code } from "@boxicons/react/Code";
import { Coins } from "@boxicons/react/Coins";
import { FileDetail as FileText } from "@boxicons/react/FileDetail";
import { Lock } from "@boxicons/react/Lock";
import { Plus } from "@boxicons/react/Plus";
import { Server } from "@boxicons/react/Server";
import { Wallet } from "@boxicons/react/Wallet";
import { X } from "@boxicons/react/X";
import { Youtube } from "@boxicons/react/Youtube";
import { Spanner as Tools } from "@boxicons/react/Spanner";
import {
  AnimatedHeroSection,
  SectionDivider,
  type HeroButton,
} from "./cosmos/cosmos-page-shared";
import { MIGRATION_NAV } from "./components/migration-docs-layout";
import {
  GRANTS_URL,
  INTAKE_FORM_URL,
  OFFICE_HOURS_URL,
  PARTNER_APPLICATION_URL,
  SUPPORTED_THRESHOLD,
  getPartnerLogoSrc,
  getVisiblePartnerCategories,
  type MigrationPartner,
  type PartnerCategory,
} from "./migration-program";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

const EarthAnimation = dynamic(
  () =>
    import("@/components/index/earth-animation").then(
      (mod) => mod.EarthAnimation,
    ),
  { ssr: false },
);

// Local development shows pending partners and placeholder CTAs so the full
// layout can be reviewed before partners and the HubSpot form are confirmed.
const IS_DEV = process.env.NODE_ENV === "development";
const INTAKE_HREF = INTAKE_FORM_URL || (IS_DEV ? "#intake-form-todo" : "");

const THRESHOLD_VALUES = {
  tvl: SUPPORTED_THRESHOLD.tvlUsd,
  users: SUPPORTED_THRESHOLD.monthlyActiveUsers,
};

const CATEGORY_ICONS: Record<
  PartnerCategory["key"],
  React.ComponentType<{ className?: string }>
> = {
  rpc: Server,
  wallets: Wallet,
  tokens: Coins,
  security: CheckShield,
  multisig: Lock,
};

const RESOURCE_ICONS = [Code, FileText, Youtube, Tools];

const SECTION = "max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10";
const H2 =
  "font-brand text-[32px] md:text-[40px] xl:text-[56px] font-medium leading-[1.05] tracking-[-0.02em] text-white mb-4";
const EYEBROW =
  "text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-4";
const CARD = "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm";

function externalProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

function SectionHeading({
  eyebrow,
  headline,
  body,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className={EYEBROW}>{eyebrow}</p> : null}
      <h2 className={H2}>{headline}</h2>
      {body ? <p className="nd-body-l text-[#ABABBA] mb-0">{body}</p> : null}
    </div>
  );
}

function TextLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      {...externalProps(href)}
      className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-white no-underline"
    >
      {label}
      <ChevronRight
        className="size-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}

function PillButton({
  href,
  label,
  hierarchy,
}: {
  href: string;
  label: string;
  hierarchy: HeroButton["hierarchy"];
}) {
  return (
    <a
      href={href}
      {...externalProps(href)}
      className={[
        "inline-flex items-center px-6 py-3 rounded-full text-sm font-brand font-semibold no-underline transition-opacity hover:opacity-90",
        hierarchy === "primary"
          ? "bg-nd-cta text-nd-on-cta-high-em-text"
          : "border border-white/30 text-white bg-transparent",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function ChainCard({
  title,
  body,
  url,
  ctaLabel,
  guides,
}: {
  title: string;
  body: string;
  url: string;
  ctaLabel: string;
  guides: readonly { url: string; label: string }[];
}) {
  return (
    <div className={`flex flex-col gap-8 p-8 ${CARD}`}>
      <div>
        <h3 className="font-brand text-[2rem] font-medium leading-[1.2] text-white mb-3">
          {title}
        </h3>
        <p className="nd-body-m text-[#ABABBA] mb-0">{body}</p>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {guides.map((guide) => (
          <li key={guide.url}>
            <a
              href={guide.url}
              className="inline-block rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60 no-underline transition-colors hover:border-white/30 hover:text-white"
            >
              {guide.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <TextLink href={url} label={ctaLabel} />
      </div>
    </div>
  );
}

function ResourceCard({
  heading,
  body,
  url,
  Icon,
}: {
  heading: string;
  body: string;
  url: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={url}
      className="flex flex-col items-start gap-12 px-6 py-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit no-underline"
    >
      <div className="shrink-0 grow-0 brightness-0 invert">
        <Icon className="block w-10 h-10" />
      </div>
      <div>
        <h3 className="font-medium nd-body-xl text-white mb-0">{heading}</h3>
        <p className="nd-body-m text-nd-mid-em-text mt-1 mb-0">{body}</p>
      </div>
    </a>
  );
}

function PartnerTile({ partner }: { partner: MigrationPartner }) {
  const t = useTranslations("developers-migrate-hub.partners");
  const logoSrc = getPartnerLogoSrc(partner);
  const offerKey = `offers.${partner.id}`;

  return (
    <li className="m-0">
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("visit", { name: partner.name })}
        className="group flex h-full flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-4 text-inherit no-underline transition-colors hover:border-white/30"
      >
        <div className="flex items-center justify-between gap-3">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- static SVG asset from ecosystem-data
            <img
              src={logoSrc}
              alt=""
              className="h-6 w-auto max-w-[140px] object-contain object-left brightness-0 invert"
            />
          ) : (
            <span className="font-brand text-lg font-medium text-white">
              {partner.name}
            </span>
          )}
          <ArrowUpRight
            className="size-4 shrink-0 text-white/40 transition-colors group-hover:text-white"
            aria-hidden
          />
        </div>
        {logoSrc ? <span className="sr-only">{partner.name}</span> : null}
        {t.has(offerKey) ? (
          <p className="nd-body-s text-[#ABABBA] mb-0">{t(offerKey)}</p>
        ) : null}
        {partner.status === "pending" ? (
          <span className="self-start rounded-full border border-amber-300/40 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-amber-200">
            {t("pending")}
          </span>
        ) : null}
      </a>
    </li>
  );
}

export function DevelopersChainMigrationPage() {
  const tGuides = useTranslations("developers-evm-to-svm");
  const t = useTranslations("developers-migrate-hub");

  const chainCards = MIGRATION_NAV.map((group, index) => ({
    title: tGuides(`docsLayout.groups.${group.key}.label`),
    body: tGuides(`chainSelector.cards.${index}.body`),
    url: group.url,
    ctaLabel: tGuides(`chainSelector.cards.${index}.button.label`),
    // The Ethereum overview is the hub itself; don't list it as a guide.
    guides: group.guides
      .filter((guide) => !("isOverview" in guide))
      .map((guide) => ({
        url: guide.url,
        label: tGuides(`docsLayout.guides.${guide.key}`),
      })),
  }));

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    heading: tGuides(`secondaryCardDeck.cards.${index}.heading`),
    body: tGuides(`secondaryCardDeck.cards.${index}.body`),
    url: card.callToAction.url,
    Icon: RESOURCE_ICONS[index],
  }));

  const partnerCategories = getVisiblePartnerCategories(IS_DEV);

  const steps = [
    { href: "#choose-your-chain", highlighted: false },
    {
      href: INTAKE_HREF,
      highlighted: false,
      // The partners section only renders when at least one partner is visible.
      secondaryHref: partnerCategories.length > 0 ? "#partners" : "",
    },
    { href: "#grant", highlighted: true },
  ].map((step, index) => ({
    ...step,
    label: t(`howItWorks.steps.${index}.label`, THRESHOLD_VALUES),
    title: t(`howItWorks.steps.${index}.title`),
    body: t(`howItWorks.steps.${index}.body`),
    cta: t(`howItWorks.steps.${index}.cta`),
    secondaryCta: t.has(`howItWorks.steps.${index}.secondaryCta`)
      ? t(`howItWorks.steps.${index}.secondaryCta`)
      : "",
  }));
  const grantCovers = t.raw("grant.covers") as string[];
  const grantExcludes = t.raw("grant.excludes") as string[];
  const launchItems = t.raw("launch.items") as {
    title: string;
    body: string;
  }[];
  const faqItems = (
    t.raw("faq.items") as { question: string; answer: string }[]
  ).map((_, index) => ({
    question: t(`faq.items.${index}.question`),
    answer: t(`faq.items.${index}.answer`, THRESHOLD_VALUES),
  }));

  const heroButtons: HeroButton[] = [
    {
      label: t("hero.readGuides"),
      url: "#choose-your-chain",
      hierarchy: "primary",
    },
    ...(INTAKE_HREF
      ? [
          {
            label: t("hero.getMatched"),
            url: INTAKE_HREF,
            hierarchy: "outline" as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.markup("hero.body", {
          ...THRESHOLD_VALUES,
          p: (chunks) => `<p>${chunks}</p>`,
        })}
        buttons={heroButtons}
      />

      {/* How it works: the self-serve and supported tracks */}
      <section id="how-it-works" className={`${SECTION} scroll-mt-24 py-24`}>
        <SectionHeading
          eyebrow={t("howItWorks.eyebrow")}
          headline={t("howItWorks.headline")}
          body={t("howItWorks.body")}
        />
        <ol className="m-0 mt-12 grid list-none gap-4 p-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={[
                "flex flex-col gap-6 p-8",
                CARD,
                step.highlighted ? "border-sky-300/40 bg-sky-300/[0.06]" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-brand text-sm text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    step.highlighted
                      ? "border-sky-300/40 text-sky-200"
                      : "border-white/10 text-white/60",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              <div>
                <h3 className="font-brand text-2xl font-medium leading-[1.2] text-white mb-3">
                  {step.title}
                </h3>
                <p className="nd-body-m text-[#ABABBA] mb-0">{step.body}</p>
              </div>
              {step.href || step.secondaryHref ? (
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3">
                  {step.href ? (
                    <TextLink href={step.href} label={step.cta} />
                  ) : null}
                  {step.secondaryHref && step.secondaryCta ? (
                    <TextLink
                      href={step.secondaryHref}
                      label={step.secondaryCta}
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="nd-body-s mt-6 mb-0 text-white/50">
          {t("howItWorks.thresholdNote")}
        </p>
      </section>

      <SectionDivider />

      {/* Self-serve: chain selector into the migration guides */}
      <section
        id="choose-your-chain"
        className={`${SECTION} scroll-mt-24 py-24`}
      >
        <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-16">
          <div>
            <h2 className={H2}>{tGuides("chainSelector.headline")}</h2>
            <p className="nd-body-m text-[#ABABBA] mb-0">
              {tGuides("chainSelector.body")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chainCards.map((card) => (
              <ChainCard key={card.url} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Migration partners */}
      {partnerCategories.length > 0 ? (
        <>
          <SectionDivider />
          <section id="partners" className={`${SECTION} scroll-mt-24 py-24`}>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={t("partners.eyebrow")}
                headline={t("partners.headline")}
                body={t("partners.body")}
              />
              {INTAKE_HREF ? (
                <div className="shrink-0">
                  <PillButton
                    href={INTAKE_HREF}
                    label={t("hero.getMatched")}
                    hierarchy="primary"
                  />
                </div>
              ) : null}
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {partnerCategories.map((category) => {
                const Icon = CATEGORY_ICONS[category.key];
                return (
                  <div
                    key={category.key}
                    className={`flex flex-col gap-6 p-6 ${CARD}`}
                  >
                    <div className="flex items-start gap-4">
                      <Icon
                        className="size-6 shrink-0 text-sky-300"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-brand text-xl font-medium text-white mb-2">
                          {t(`partners.categories.${category.key}.title`)}
                        </h3>
                        <p className="nd-body-s text-[#ABABBA] mb-0">
                          {t(`partners.categories.${category.key}.body`)}
                        </p>
                      </div>
                    </div>
                    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                      {category.partners.map((partner) => (
                        <PartnerTile key={partner.id} partner={partner} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            {PARTNER_APPLICATION_URL ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Plus
                  className="hidden size-5 text-white/40 sm:block"
                  aria-hidden
                />
                <p className="nd-body-m text-[#ABABBA] mb-0">
                  {t("partners.becomePartner.body")}
                </p>
                <TextLink
                  href={PARTNER_APPLICATION_URL}
                  label={t("partners.becomePartner.cta")}
                />
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      <SectionDivider />

      {/* Technical migration grant */}
      <section id="grant" className={`${SECTION} scroll-mt-24 py-24`}>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow={t("grant.eyebrow")}
              headline={t("grant.headline")}
              body={t("grant.body")}
            />
            <p className="nd-body-s text-white/50 mb-0">{t("grant.note")}</p>
            <div>
              <PillButton
                href={GRANTS_URL}
                label={t("grant.cta")}
                hierarchy="outline"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`p-8 ${CARD}`}>
              <h3 className="font-brand text-xl font-medium text-white mb-6">
                {t("grant.coversTitle")}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {grantCovers.map((_, index) => (
                  <li key={index} className="flex gap-3">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-emerald-300"
                      aria-hidden
                    />
                    <span className="nd-body-m text-white/80">
                      {t(`grant.covers.${index}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-8 ${CARD}`}>
              <h3 className="font-brand text-xl font-medium text-white mb-6">
                {t("grant.excludesTitle")}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {grantExcludes.map((_, index) => (
                  <li key={index} className="flex gap-3">
                    <X
                      className="mt-0.5 size-5 shrink-0 text-rose-300"
                      aria-hidden
                    />
                    <span className="nd-body-m text-white/80">
                      {t(`grant.excludes.${index}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Launch support */}
      <section id="launch" className={`${SECTION} scroll-mt-24 py-24`}>
        <SectionHeading
          eyebrow={t("launch.eyebrow")}
          headline={t("launch.headline")}
          body={t("launch.body")}
        />
        <ul className="m-0 mt-12 grid list-none gap-4 p-0 md:grid-cols-3">
          {launchItems.map((_, index) => (
            <li key={index} className={`p-8 ${CARD}`}>
              <h3 className="font-brand text-xl font-medium text-white mb-2">
                {t(`launch.items.${index}.title`)}
              </h3>
              <p className="nd-body-m text-[#ABABBA] mb-0">
                {t(`launch.items.${index}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Developer resources */}
      <section
        id="resources"
        className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0 px-2 scroll-mt-24"
      >
        <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative">
          <UnicornScene
            projectId="migration-resources"
            className="!absolute inset-0 z-0"
            jsonFilePath="/src/img/index/community-bg.json"
            width="100%"
            height="101%"
            scale={0.8}
            dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
            fps={30}
            lazyLoad={true}
            production={true}
          />
          <Container className="pt-[120px] pb-[120px] flex flex-col justify-between">
            <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#0B0A10] via-[#0B0A10] via-19% to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="nd-heading-l">
                {tGuides("chainMigrationResources.headline")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-10 relative">
              {secondaryCards.map((card) => (
                <ResourceCard key={card.url} {...card} />
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${SECTION} scroll-mt-24 py-24`}>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-16">
          <h2 className={H2}>{t("faq.headline")}</h2>
          <div className="border-t border-white/10">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group border-b border-white/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-white [&::-webkit-details-marker]:hidden">
                  <span className="nd-body-l font-medium">{item.question}</span>
                  <Plus
                    className="size-5 shrink-0 text-white/50 transition-transform group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="nd-body-m text-[#ABABBA] mt-0 mb-5 max-w-2xl">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className={`${SECTION} pb-24`}>
        <div
          className={`flex flex-col gap-8 p-8 md:p-12 xl:flex-row xl:items-end xl:justify-between ${CARD}`}
        >
          <div className="max-w-2xl">
            <h2 className={H2}>{t("finalCta.headline")}</h2>
            <p className="nd-body-l text-[#ABABBA] mb-0">
              {t("finalCta.body")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PillButton
              href="#choose-your-chain"
              label={t("hero.readGuides")}
              hierarchy="primary"
            />
            {INTAKE_HREF ? (
              <PillButton
                href={INTAKE_HREF}
                label={t("hero.getMatched")}
                hierarchy="outline"
              />
            ) : null}
          </div>
        </div>
        {OFFICE_HOURS_URL ? (
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-white/10 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-brand text-lg font-medium text-white mb-1">
                {t("officeHours.title")}
              </h3>
              <p className="nd-body-m text-[#ABABBA] mb-0">
                {t("officeHours.body")}
              </p>
            </div>
            <TextLink href={OFFICE_HOURS_URL} label={t("officeHours.cta")} />
          </div>
        ) : null}
      </section>
    </>
  );
}
