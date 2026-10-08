import type { ReactNode } from "react";
import { getTranslations } from "@workspace/i18n/server";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Link } from "@/utils/Link";
import { Divider } from "@/components/solutions/divider.v2";
import {
  BUILD_STEPS,
  HERO_BUTTONS,
  MINT_CODE,
  MINT_DETAILS,
  MINT_EXPLORER_LINK,
  MINT_EXTENSIONS,
  MINT_LINKS,
  MINTS,
  RELATED_LINKS,
  RESOURCES,
  STATS,
  STATS_LIVE_LINK,
  TRUST_ITEMS,
} from "@/data/pyusd";
import { CopyButton, PageSelectionColor } from "./interactions";

const container = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const sectionSpacing = "py-16 md:py-24 xl:py-32";
const eyebrow =
  "m-0 font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-highlight-green";
const muted = "text-nd-mid-em-text";
const card = "rounded-2xl border border-nd-border-light bg-white/[0.03]";
const monoLabel =
  "font-brand-mono text-[11px] uppercase tracking-[0.12em] text-nd-mid-em-text md:text-xs";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green";
const buttonBase = `inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium tracking-[-0.16px] no-underline transition-colors md:text-lg ${focusRing}`;
const buttonVariants = {
  primary: `${buttonBase} bg-white text-black hover:bg-white/90 hover:text-black`,
  secondary: `${buttonBase} border border-nd-border-prominent text-white hover:border-nd-border-hovered hover:text-white`,
} as const;

const isExternal = (href: string) => /^https?:\/\//.test(href);

function LinkIcon({ href, className }: { href: string; className: string }) {
  const Icon = isExternal(href) ? ArrowUpRight : ArrowRight;
  return <Icon aria-hidden className={className} />;
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1 rounded-sm text-sm text-white no-underline transition-colors hover:text-nd-highlight-green md:text-base ${focusRing}`}
    >
      {children}
      <LinkIcon
        href={href}
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

export async function PyusdPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "pyusd" });

  const linksFor = (
    base: string,
    links: readonly { id: string; href: string }[],
  ) => links.map(({ id, href }) => ({ href, label: t(`${base}.links.${id}`) }));

  return (
    <main className="bg-nd-bg font-brand text-white">
      <PageSelectionColor />

      {/* Hero */}
      <section
        aria-labelledby="pyusd-hero"
        className="relative isolate overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_85%_10%,rgba(85,233,171,0.16),transparent_60%),radial-gradient(ellipse_50%_70%_at_100%_100%,rgba(0,112,224,0.18),transparent_65%)]"
        />
        <div
          className={`${container} grid gap-12 pb-16 pt-20 md:pb-24 md:pt-28 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-end xl:gap-16 xl:pb-32 xl:pt-40`}
        >
          <div>
            <p className={`${eyebrow} mb-6`}>{t("hero.eyebrow")}</p>
            <h1
              id="pyusd-hero"
              className="m-0 max-w-4xl font-brand text-5xl font-medium leading-[1.05] tracking-[-0.05em] text-white md:text-7xl xl:text-[80px]"
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
                  <LinkIcon href={href} className="!size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mint reference */}
          <div className="overflow-hidden rounded-2xl border border-nd-border-light bg-black/70 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-nd-border-light px-4 py-3 md:px-5">
              <span className={monoLabel}>{t("hero.mint.label")}</span>
              <CopyButton
                value={MINTS.mainnet}
                copyLabel={t("hero.mint.copy")}
                copiedLabel={t("hero.mint.copied")}
              />
            </div>
            <p className="m-0 break-all px-4 py-5 font-mono text-[15px] leading-7 text-white md:px-5 md:text-lg">
              {MINTS.mainnet}
            </p>
            <dl className="m-0 border-t border-nd-border-light">
              {MINT_DETAILS.map(({ id, value }) => (
                <div
                  key={id}
                  className="flex flex-col gap-1 border-b border-nd-border-light px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:px-5"
                >
                  <dt className={monoLabel}>{t(`hero.mint.details.${id}`)}</dt>
                  <dd className="m-0 break-all font-mono text-sm text-white sm:text-right">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-nd-border-light px-4 py-4 md:px-5">
              <TextLink href={MINT_EXPLORER_LINK.href}>
                {t(`hero.mint.links.${MINT_EXPLORER_LINK.id}`)}
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Dated, sourced stats */}
      <Divider />
      <section
        aria-labelledby="pyusd-stats"
        className={`${container} py-12 md:py-16`}
      >
        <h2 id="pyusd-stats" className={`${eyebrow} mb-8 text-nd-mid-em-text`}>
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

      {/* Issuer and reserves */}
      <Section id="pyusd-trust">
        <SectionHeader
          id="pyusd-trust"
          eyebrowText={t("trust.eyebrow")}
          headline={t("trust.headline")}
          body={t("trust.body")}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map(({ id, links }) => (
            <article
              key={id}
              className={`${card} flex flex-col gap-4 p-6 md:p-8`}
            >
              <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                {t(`trust.items.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`trust.items.${id}.body`)}
              </p>
              <LinkList links={linksFor(`trust.items.${id}`, links)} />
            </article>
          ))}
        </div>
      </Section>

      {/* Mint extensions */}
      <Section id="pyusd-mint">
        <SectionHeader
          id="pyusd-mint"
          eyebrowText={t("mint.eyebrow")}
          headline={t("mint.headline")}
          body={t("mint.body")}
        />
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-16">
          <div className="min-w-0">
            <ul className="m-0 list-none divide-y divide-nd-border-light border-y border-nd-border-light p-0">
              {MINT_EXTENSIONS.map(({ id, status, href }) => (
                <li key={id} className="flex flex-col gap-2 py-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="m-0">
                      <Link
                        href={href}
                        className={`group inline-flex items-center gap-1.5 rounded-sm font-brand text-xl font-medium tracking-[-0.02em] text-white no-underline transition-colors hover:text-nd-highlight-green md:text-2xl ${focusRing}`}
                      >
                        {t(`mint.extensions.${id}.title`)}
                        <ArrowRight
                          aria-hidden
                          className="!size-5 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </h3>
                    <span
                      className={`rounded-full border px-3 py-1 font-brand-mono text-[11px] uppercase tracking-[0.12em] ${
                        status === "active"
                          ? "border-nd-highlight-green/40 text-nd-highlight-green"
                          : "border-nd-border-prominent text-nd-mid-em-text"
                      }`}
                    >
                      {t(`mint.status.${status}`)}
                    </span>
                  </div>
                  <p className={`m-0 text-base leading-relaxed ${muted}`}>
                    {t(`mint.extensions.${id}.body`)}
                  </p>
                </li>
              ))}
            </ul>
            <p className={`mb-0 mt-4 text-sm ${muted}`}>
              {t("mint.checked")}{" "}
              <Link
                href={MINT_EXPLORER_LINK.href}
                className={`rounded-sm text-white underline decoration-nd-border-prominent underline-offset-4 hover:text-nd-highlight-green ${focusRing}`}
              >
                {t(`hero.mint.links.${MINT_EXPLORER_LINK.id}`)}
              </Link>
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-28 xl:self-start">
            <figure className="m-0 overflow-hidden rounded-2xl border border-nd-border-light bg-black">
              <figcaption className="flex items-center justify-between gap-4 border-b border-nd-border-light px-4 py-3 md:px-5">
                <span className={`min-w-0 ${monoLabel}`}>
                  {t("mint.code.label")}
                </span>
                <CopyButton
                  value={MINT_CODE}
                  copyLabel={t("mint.code.copy")}
                  copiedLabel={t("mint.code.copied")}
                />
              </figcaption>
              <pre className="m-0 overflow-x-auto p-4 font-mono text-[13px] leading-6 text-white md:p-5 md:text-sm">
                <code>{MINT_CODE}</code>
              </pre>
            </figure>
            <LinkList links={linksFor("mint", MINT_LINKS)} />
          </div>
        </div>
      </Section>

      {/* Build steps */}
      <Section id="pyusd-build">
        <SectionHeader
          id="pyusd-build"
          eyebrowText={t("build.eyebrow")}
          headline={t("build.headline")}
          body={t("build.body")}
        />
        <ol className="m-0 grid list-none gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light p-0 md:grid-cols-2 xl:grid-cols-4">
          {BUILD_STEPS.map(({ id, links }, index) => (
            <li key={id} className="flex flex-col gap-4 bg-nd-bg p-6 md:p-8">
              <p className="m-0 flex items-center gap-3 font-brand-mono text-xs uppercase tracking-[0.12em] text-nd-mid-em-text">
                <span className="text-nd-highlight-green">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {t(`build.steps.${id}.label`)}
              </p>
              <h3 className="m-0 font-brand text-2xl font-medium tracking-[-0.03em] text-white">
                {t(`build.steps.${id}.title`)}
              </h3>
              <p className={`m-0 grow text-base leading-relaxed ${muted}`}>
                {t(`build.steps.${id}.body`)}
              </p>
              <LinkList links={linksFor(`build.steps.${id}`, links)} />
            </li>
          ))}
        </ol>
      </Section>

      {/* Reference */}
      <Section id="pyusd-resources">
        <SectionHeader
          id="pyusd-resources"
          headline={t("resources.headline")}
        />
        <ul className="m-0 grid list-none gap-x-10 p-0 md:grid-cols-2">
          {RESOURCES.map(({ id, href }) => (
            <li key={id} className="border-t border-nd-border-light">
              <Link
                href={href}
                className={`group flex items-start justify-between gap-6 py-6 text-white no-underline hover:text-white ${focusRing}`}
              >
                <span className="flex flex-col gap-1">
                  <span className="font-brand text-xl font-medium tracking-[-0.02em] transition-colors group-hover:text-nd-highlight-green md:text-2xl">
                    {t(`resources.items.${id}.title`)}
                  </span>
                  <span
                    className={`text-sm leading-relaxed md:text-base ${muted}`}
                  >
                    {t(`resources.items.${id}.body`)}
                  </span>
                </span>
                <LinkIcon
                  href={href}
                  className="mt-1 !size-6 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Related */}
      <Section id="pyusd-related">
        <div className="rounded-3xl border border-nd-border-light bg-[radial-gradient(ellipse_80%_120%_at_100%_0%,rgba(85,233,171,0.14),transparent_60%)] p-6 md:p-10 xl:p-16">
          <SectionHeader id="pyusd-related" headline={t("related.headline")} />
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_LINKS.map(({ id, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={`group flex h-full items-start justify-between gap-4 rounded-2xl border border-nd-border-light bg-black/40 p-6 font-brand text-lg font-medium tracking-[-0.02em] text-white no-underline transition-colors hover:border-nd-border-hovered hover:text-white md:text-xl ${focusRing}`}
                >
                  {t(`related.items.${id}`)}
                  <ArrowRight
                    aria-hidden
                    className="!size-5 shrink-0 text-nd-highlight-green transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className={`mb-0 mt-8 max-w-3xl text-sm leading-relaxed ${muted}`}>
            {t("related.disclaimer")}
          </p>
        </div>
      </Section>
    </main>
  );
}
