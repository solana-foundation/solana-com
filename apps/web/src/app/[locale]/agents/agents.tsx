import type { ReactNode } from "react";
import { getTranslations } from "@workspace/i18n/server";
import { Accordion as LandingAccordion } from "@workspace/ui/landing";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Divider } from "@/components/solutions/divider.v2";
import type { NewsItem } from "@/components/solutions/latest-news.v2";
import {
  CLOSING_LINKS,
  MORE_LINKS,
  PATHS,
  TRUST_ITEMS,
  type AgentPath,
  type Offering,
  type PathId,
} from "@/data/agents";
import type { FaqEntry } from "./structured-data";
import {
  AgentsStateProvider,
  ConnectorPicker,
  FlowVisual,
  LatestNews,
  PageSelectionColor,
  PathTabs,
  PromptCards,
  TrackedCopyCommand,
  TrackedLink,
} from "./interactions";

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

function LinkIcon({ href, className }: { href: string; className: string }) {
  const Icon = isExternal(href) ? ArrowUpRight : ArrowRight;
  return <Icon aria-hidden className={className} />;
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
    <header className="mb-10 max-w-3xl md:mb-14">
      {eyebrowText && <p className={`${eyebrow} mb-4`}>{eyebrowText}</p>}
      <h2
        id={id}
        className="m-0 font-brand text-[32px] font-medium leading-[1.15] tracking-[-0.04em] text-white md:text-5xl"
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

type T = Awaited<ReturnType<typeof getTranslations>>;

function OfferingAction({ offering, t }: { offering: Offering; t: T }) {
  const label = t(`offerings.${offering.id}.action`);
  switch (offering.action.type) {
    case "connectors":
      return <ConnectorPicker />;
    case "command":
      return (
        <TrackedCopyCommand
          command={offering.action.command}
          label={label}
          contentId={offering.id}
        />
      );
    case "link": {
      const { href } = offering.action;
      return (
        <div>
          <TrackedLink
            href={href}
            contentId={offering.id}
            className={buttonVariants.secondary}
          >
            {label}
            <LinkIcon href={href} className="!size-5" />
          </TrackedLink>
        </div>
      );
    }
  }
}

function PathPanel({ path, t }: { path: AgentPath; t: T }) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <p className="m-0 max-w-2xl text-lg leading-relaxed text-white md:text-xl">
        {t(`paths.${path.id}.summary`)}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {path.offerings.map((offering, index) => (
          <article
            key={offering.id}
            id={`agents-${offering.id}`}
            aria-labelledby={`agents-${offering.id}-title`}
            className={`${card} flex min-w-0 scroll-mt-28 flex-col gap-4 p-5 md:p-6 ${index === 0 ? "md:col-span-2" : ""}`}
          >
            <h3
              id={`agents-${offering.id}-title`}
              className="m-0 font-brand text-2xl font-medium tracking-[-0.03em] text-white"
            >
              {t(`offerings.${offering.id}.title`)}
            </h3>
            <p className={`m-0 text-base leading-relaxed ${muted}`}>
              {t(`offerings.${offering.id}.body`)}
            </p>
            <OfferingAction offering={offering} t={t} />
            <p className="m-0 mt-auto border-t border-nd-border-light pt-4 text-sm leading-relaxed text-white md:text-base">
              <span className="mb-1 block font-brand-mono text-[11px] uppercase tracking-[0.12em] text-nd-highlight-green md:text-xs">
                {t("offering.result")}
              </span>
              {t(`offerings.${offering.id}.result`)}
            </p>
            {offering.links && (
              <ul
                aria-label={t("offering.links")}
                className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0"
              >
                {offering.links.map(({ id, href }) => (
                  <li key={id}>
                    <TrackedLink
                      href={href}
                      contentId={`${offering.id}_${id}`}
                      className={`group inline-flex items-center gap-1 rounded-sm text-sm text-white no-underline transition-colors hover:text-nd-highlight-green ${focusRing}`}
                    >
                      {t(`offerings.${offering.id}.links.${id}`)}
                      <LinkIcon
                        href={href}
                        className="!size-4 shrink-0 text-nd-highlight-green"
                      />
                    </TrackedLink>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export async function AgentsPage({
  locale,
  news,
  faq,
}: {
  locale: string;
  news: NewsItem[];
  faq: FaqEntry[];
}) {
  const t = await getTranslations({ locale, namespace: "agents" });

  const panels = Object.fromEntries(
    PATHS.map((path) => [
      path.id,
      <PathPanel key={path.id} path={path} t={t} />,
    ]),
  ) as Record<PathId, ReactNode>;

  return (
    <main className="overflow-x-clip bg-nd-bg font-brand text-white">
      <PageSelectionColor />
      <AgentsStateProvider>
        {/* Hero, paths, and prompts share one sticky scene on desktop. */}
        <section
          aria-labelledby="agents-hero"
          className={`${container} grid gap-10 pb-16 pt-16 md:pb-24 md:pt-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] xl:gap-x-16 xl:gap-y-12 xl:pb-32 xl:pt-32`}
        >
          <header className="order-1 min-w-0 xl:order-none xl:col-start-1 xl:row-start-1">
            <p className={`${eyebrow} mb-6`}>{t("hero.eyebrow")}</p>
            <h1
              id="agents-hero"
              className="m-0 max-w-4xl font-brand text-5xl font-medium leading-[1.05] tracking-[-0.05em] text-white md:text-7xl"
            >
              {t("hero.headline")}
            </h1>
            <p
              className={`mb-0 mt-6 max-w-2xl text-lg leading-relaxed md:mt-8 md:text-xl ${muted}`}
            >
              {t("hero.body")}
            </p>
          </header>

          <div className="order-3 min-w-0 xl:order-none xl:col-start-2 xl:row-span-3 xl:row-start-1">
            <div className="xl:sticky xl:top-28 xl:h-[min(720px,calc(100vh-9rem))]">
              <FlowVisual />
            </div>
          </div>

          <div className="order-2 min-w-0 xl:order-none xl:col-start-1 xl:row-start-2">
            <PathTabs panels={panels} />
          </div>

          <div
            className="order-4 min-w-0 pt-6 xl:order-none xl:col-start-1 xl:row-start-3 xl:pt-10"
            aria-labelledby="agents-prompts"
            role="region"
          >
            <p className={`${eyebrow} mb-4`}>{t("prompts.eyebrow")}</p>
            <h2
              id="agents-prompts"
              className="m-0 font-brand text-[32px] font-medium leading-[1.15] tracking-[-0.04em] text-white md:text-5xl"
            >
              {t("prompts.headline")}
            </h2>
            <p
              className={`mb-8 mt-5 max-w-2xl text-base leading-relaxed md:text-xl ${muted}`}
            >
              {t("prompts.body")}
            </p>
            <PromptCards />
          </div>
        </section>

        <Section id="agents-trust">
          <SectionHeader
            id="agents-trust"
            eyebrowText={t("trust.eyebrow")}
            headline={t("trust.headline")}
            body={t("trust.body")}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TRUST_ITEMS.map((id) => (
              <article
                key={id}
                className={`${card} flex flex-col gap-4 p-6 md:p-8`}
              >
                <h3 className="m-0 font-brand text-xl font-medium tracking-[-0.02em] text-white md:text-2xl">
                  {t(`trust.items.${id}.title`)}
                </h3>
                <p className={`m-0 text-base leading-relaxed ${muted}`}>
                  {t(`trust.items.${id}.body`)}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Divider />
        <LandingAccordion
          headline={t("faq.headline")}
          accordions={faq.map(({ question, answer }) => ({
            title: question,
            body: answer,
          }))}
        />

        {news.length > 0 && <Divider />}
        <LatestNews title={t("news.title")} items={news} layout="compact" />

        <Section id="agents-closing">
          <div className="rounded-3xl border border-nd-border-light bg-[radial-gradient(ellipse_80%_120%_at_100%_0%,rgba(85,233,171,0.14),transparent_60%)] p-6 md:p-10 xl:p-16">
            <SectionHeader
              id="agents-closing"
              headline={t("closing.headline")}
              body={t("closing.body")}
            />
            <div className="flex flex-wrap gap-3">
              {CLOSING_LINKS.map(({ id, href, variant }) => (
                <TrackedLink
                  key={id}
                  href={href}
                  contentId={`closing_${id}`}
                  className={buttonVariants[variant]}
                >
                  {t(`closing.links.${id}`)}
                  <LinkIcon href={href} className="!size-5" />
                </TrackedLink>
              ))}
            </div>
            <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
              {MORE_LINKS.map(({ id, href }) => (
                <li key={id}>
                  <TrackedLink
                    href={href}
                    contentId={`more_${id}`}
                    className={`group inline-flex items-center gap-1 rounded-sm text-sm text-white no-underline transition-colors hover:text-nd-highlight-green md:text-base ${focusRing}`}
                  >
                    {t(`closing.more.${id}`)}
                    <LinkIcon
                      href={href}
                      className="!size-4 shrink-0 text-nd-highlight-green"
                    />
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </AgentsStateProvider>
    </main>
  );
}
