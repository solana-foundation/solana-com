import type { ReactNode } from "react";
import { getTranslations } from "@workspace/i18n/server";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Link } from "@/utils/Link";
import { Divider } from "@/components/solutions/divider.v2";
import {
  COMMUNITY_LINKS,
  HERO_BUTTONS,
  HERO_COMMAND,
  LANDING_STEPS,
  NETWORK_PROPERTIES,
  PRIMITIVES,
  READING,
  SECURITY_CHECKLIST_LINK,
  SECURITY_ITEMS,
  STACK_STEPS,
  STATS,
  STATS_LIVE_LINK,
  TEMPLATES,
  TEMPLATES_LINK,
} from "@/data/developers/defi";
import { CopyCommand, HeroScene, PageSelectionColor } from "./interactions";

const container = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const sectionSpacing = "py-16 md:py-24 xl:py-32";
const eyebrow =
  "m-0 font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-highlight-green";
const muted = "text-nd-mid-em-text";
const card = "rounded-2xl border border-nd-border-light bg-white/[0.03]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green";
const buttonBase = `inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium tracking-[-0.16px] no-underline transition-colors md:text-lg ${focusRing}`;
const buttonVariants = {
  primary: `${buttonBase} bg-white text-black hover:bg-white/90 hover:text-black`,
  secondary: `${buttonBase} border border-nd-border-prominent text-white hover:border-nd-border-hovered hover:text-white`,
} as const;

const isExternal = (href: string) => /^https?:\/\//.test(href);

function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const Icon = isExternal(href) ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1 rounded-sm text-sm text-white no-underline transition-colors hover:text-nd-highlight-green md:text-base ${focusRing} ${className}`}
    >
      {children}
      <Icon
        aria-hidden
        className="!size-4 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function LinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
      {links.map(({ href, label }) => (
        <li key={href}>
          <TextLink href={href}>{label}</TextLink>
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({
  id,
  eyebrowText,
  headline,
  body,
}: {
  id: string;
  eyebrowText?: string;
  headline: string;
  body?: string;
}) {
  return (
    <header className="mb-10 max-w-3xl md:mb-14 xl:mb-16">
      {eyebrowText && <p className={`${eyebrow} mb-4`}>{eyebrowText}</p>}
      <h2
        id={id}
        className="m-0 font-brand text-[32px] font-medium leading-[1.15] tracking-[-0.04em] text-white md:text-5xl xl:text-6xl"
      >
        {headline}
      </h2>
      {body && (
        <p
          className={`mb-0 mt-5 text-base leading-relaxed md:text-xl ${muted}`}
        >
          {body}
        </p>
      )}
    </header>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <>
      <Divider />
      <section
        aria-labelledby={id}
        className={`${container} ${sectionSpacing}`}
      >
        {children}
      </section>
    </>
  );
}

export async function DevelopersDefiPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "developers-defi" });

  const linksFor = (
    base: string,
    links: readonly { id: string; href: string }[],
  ) => links.map(({ id, href }) => ({ href, label: t(`${base}.links.${id}`) }));

  return (
    <main className="bg-nd-bg font-brand text-white">
      <PageSelectionColor />

      {/* Hero */}
      <section
        aria-labelledby="defi-hero"
        className="relative isolate overflow-hidden"
      >
        <HeroScene />
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.85)_45%,rgba(0,0,0,0.35)_100%)]"
        />
        <div
          className={`${container} relative z-10 grid gap-12 pb-16 pt-20 md:pb-24 md:pt-28 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-end xl:gap-16 xl:pb-32 xl:pt-40`}
        >
          <div>
            <p className={`${eyebrow} mb-6`}>{t("hero.eyebrow")}</p>
            <h1
              id="defi-hero"
              className="m-0 max-w-4xl font-brand text-5xl font-medium leading-[1.05] tracking-[-0.05em] text-white md:text-7xl xl:text-[88px]"
            >
              {t("hero.headline")}
            </h1>
            <p
              className={`mb-0 mt-6 max-w-2xl text-lg leading-relaxed md:mt-8 md:text-xl ${muted}`}
            >
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              {HERO_BUTTONS.map(({ id, href, variant }) => (
                <Link key={id} href={href} className={buttonVariants[variant]}>
                  {t(`hero.buttons.${id}`)}
                  <ArrowRight aria-hidden className="!size-5" />
                </Link>
              ))}
            </div>
          </div>
          <CopyCommand
            command={HERO_COMMAND}
            label={t("hero.terminal.label")}
            copyLabel={t("hero.terminal.copy")}
            copiedLabel={t("hero.terminal.copied")}
          />
        </div>
      </section>

      {/* Dated, sourced stats */}
      <Divider />
      <section
        aria-labelledby="defi-stats"
        className={`${container} py-12 md:py-16`}
      >
        <h2 id="defi-stats" className={`${eyebrow} mb-8 text-nd-mid-em-text`}>
          {t("stats.heading")}
        </h2>
        <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map(({ id, statSource }) => (
            <div key={id} className="flex flex-col gap-3 bg-nd-bg p-6 md:p-8">
              <dt
                className={`order-2 text-sm leading-snug md:text-base ${muted}`}
              >
                {t(`stats.items.${id}.label`)}
              </dt>
              <dd className="order-1 m-0 font-brand text-4xl font-medium tracking-[-0.04em] text-white md:text-5xl">
                {t(`stats.items.${id}.value`)}
              </dd>
              <dd className="order-3 m-0 mt-auto pt-2">
                <Link
                  href={statSource}
                  className={`inline-flex items-center gap-1 rounded-sm font-brand-mono text-xs uppercase tracking-[0.12em] text-nd-mid-em-text no-underline hover:text-white ${focusRing}`}
                >
                  {t("stats.sourceLabel")}
                  <ArrowUpRight aria-hidden className="!size-3.5" />
                </Link>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <TextLink href={STATS_LIVE_LINK.href}>
            {t(`stats.links.${STATS_LIVE_LINK.id}`)}
          </TextLink>
        </div>
      </section>

      {/* Network properties */}
      <Section id="defi-properties">
        <SectionHeader
          id="defi-properties"
          eyebrowText={t("properties.eyebrow")}
          headline={t("properties.headline")}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {NETWORK_PROPERTIES.map(({ id, links }) => (
            <article
              key={id}
              className={`${card} flex flex-col gap-4 p-6 md:p-8`}
            >
              <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.03em] text-white">
                {t(`properties.items.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`properties.items.${id}.body`)}
              </p>
              <LinkList links={linksFor(`properties.items.${id}`, links)} />
            </article>
          ))}
        </div>
      </Section>

      {/* Developer stack */}
      <Section id="defi-stack">
        <SectionHeader
          id="defi-stack"
          eyebrowText={t("stack.eyebrow")}
          headline={t("stack.headline")}
          body={t("stack.body")}
        />
        <ol className="m-0 grid list-none gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light p-0 md:grid-cols-2 xl:grid-cols-4">
          {STACK_STEPS.map(({ id, links }, index) => (
            <li key={id} className="flex flex-col gap-4 bg-nd-bg p-6 md:p-8">
              <p className="m-0 flex items-center gap-3 font-brand-mono text-xs uppercase tracking-[0.12em] text-nd-mid-em-text">
                <span className="text-nd-highlight-green">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {t(`stack.steps.${id}.label`)}
              </p>
              <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.03em] text-white">
                {t(`stack.steps.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`stack.steps.${id}.body`)}
              </p>
              <LinkList links={linksFor(`stack.steps.${id}`, links)} />
            </li>
          ))}
        </ol>

        <div className="mt-12 md:mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.03em] text-white md:text-3xl">
              {t("stack.templates.heading")}
            </h3>
            <TextLink href={TEMPLATES_LINK.href}>
              {t(`stack.templates.links.${TEMPLATES_LINK.id}`)}
            </TextLink>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {TEMPLATES.map(({ id, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={`${card} group flex h-full flex-col gap-2 p-6 text-white no-underline transition-colors hover:border-nd-border-hovered hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                >
                  <span className="flex items-start justify-between gap-4 font-brand text-xl font-medium tracking-[-0.02em]">
                    {t(`stack.templates.items.${id}.title`)}
                    <ArrowRight
                      aria-hidden
                      className="!size-5 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                  <span
                    className={`text-sm leading-relaxed md:text-base ${muted}`}
                  >
                    {t(`stack.templates.items.${id}.body`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* DeFi building blocks */}
      <Section id="defi-primitives">
        <SectionHeader
          id="defi-primitives"
          eyebrowText={t("primitives.eyebrow")}
          headline={t("primitives.headline")}
          body={t("primitives.body")}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRIMITIVES.map(({ id, links }) => (
            <article
              key={id}
              className={`${card} flex flex-col gap-4 p-6 md:p-8`}
            >
              <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                {t(`primitives.categories.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`primitives.categories.${id}.body`)}
              </p>
              <LinkList
                links={linksFor(`primitives.categories.${id}`, links)}
              />
            </article>
          ))}
        </div>
        <p className={`mb-0 mt-6 text-sm ${muted}`}>
          {t("primitives.disclaimer")}
        </p>
      </Section>

      {/* Transaction delivery */}
      <Section id="defi-landing">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-16">
          <div className="xl:sticky xl:top-28 xl:self-start">
            <SectionHeader
              id="defi-landing"
              eyebrowText={t("landing.eyebrow")}
              headline={t("landing.headline")}
              body={t("landing.body")}
            />
          </div>
          <ol className="m-0 list-none p-0">
            {LANDING_STEPS.map(({ id, links }, index) => (
              <li
                key={id}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-nd-border-light py-8 first:border-t-0 first:pt-0 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6"
              >
                <span className="grid size-10 place-items-center rounded-full border border-nd-border-prominent font-brand-mono text-sm text-nd-highlight-green md:size-12">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                    {t(`landing.steps.${id}.title`)}
                  </h3>
                  <p className={`m-0 text-base leading-relaxed ${muted}`}>
                    {t(`landing.steps.${id}.body`)}
                  </p>
                  <LinkList links={linksFor(`landing.steps.${id}`, links)} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Security */}
      <Section id="defi-security">
        <SectionHeader
          id="defi-security"
          eyebrowText={t("security.eyebrow")}
          headline={t("security.headline")}
          body={t("security.body")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {SECURITY_ITEMS.map(({ id, links }) => (
            <article
              key={id}
              className={`${card} flex flex-col gap-4 p-6 md:p-8`}
            >
              <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                {t(`security.items.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`security.items.${id}.body`)}
              </p>
              <LinkList links={linksFor(`security.items.${id}`, links)} />
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href={SECURITY_CHECKLIST_LINK.href}
            className={buttonVariants.secondary}
          >
            {t(`security.links.${SECURITY_CHECKLIST_LINK.id}`)}
            <ArrowRight aria-hidden className="!size-5" />
          </Link>
        </div>
      </Section>

      {/* Further reading */}
      <Section id="defi-reading">
        <SectionHeader id="defi-reading" headline={t("reading.headline")} />
        <ul className="m-0 list-none divide-y divide-nd-border-light border-y border-nd-border-light p-0">
          {READING.map(({ id, href }) => (
            <li key={id}>
              <Link
                href={href}
                className={`group flex items-center justify-between gap-6 py-6 font-brand text-xl font-medium tracking-[-0.02em] text-white no-underline transition-colors hover:text-nd-highlight-green md:text-2xl ${focusRing}`}
              >
                {t(`reading.items.${id}`)}
                <ArrowRight
                  aria-hidden
                  className="!size-6 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Community */}
      <Section id="defi-community">
        <div className="rounded-3xl border border-nd-border-light bg-[radial-gradient(ellipse_80%_120%_at_100%_0%,rgba(85,233,171,0.14),transparent_60%)] p-6 md:p-10 xl:p-16">
          <SectionHeader
            id="defi-community"
            headline={t("community.headline")}
            body={t("community.body")}
          />
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {COMMUNITY_LINKS.map(({ id, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={`group flex h-full flex-col gap-2 rounded-2xl border border-nd-border-light bg-black/40 p-6 text-white no-underline transition-colors hover:border-nd-border-hovered hover:text-white ${focusRing}`}
                >
                  <span className="flex items-start justify-between gap-4 font-brand text-lg font-medium tracking-[-0.02em] md:text-xl">
                    {t(`community.items.${id}.title`)}
                    {isExternal(href) ? (
                      <ArrowUpRight
                        aria-hidden
                        className="!size-5 shrink-0 text-nd-highlight-green"
                      />
                    ) : (
                      <ArrowRight
                        aria-hidden
                        className="!size-5 shrink-0 text-nd-highlight-green"
                      />
                    )}
                  </span>
                  <span className={`text-sm leading-relaxed ${muted}`}>
                    {t(`community.items.${id}.body`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
