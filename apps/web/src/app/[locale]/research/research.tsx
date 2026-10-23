import Image from "next/image";
import {
  requiredCardContent,
  requiredTranslatedLabel,
} from "@/lib/required-card-content";
import {
  ADDITIONAL_CARD_DECK,
  CONVERSION_PANEL,
  ENERGY_CARD_DECK,
  HERO_SWITCHBACK,
  PERFORMANCE_CARD_DECK,
  VALIDATOR_CARD_DECK,
} from "@/data/research";
import { RESEARCH_METRICS, RESEARCH_SOURCES } from "@/data/research-evidence";

type EvidenceText = {
  eyebrow: string;
  latestAnalysis: string;
  source: string;
  readReport: string;
  liveDashboard: string;
  relatedReading: string;
  archiveDescription: string;
  snapshotNote: string;
  metrics: Record<
    (typeof RESEARCH_METRICS)[keyof typeof RESEARCH_METRICS][number]["label"],
    string
  >;
};

interface ResearchPageProps {
  translations: {
    heroHeadline: string;
    heroBody: string;
    heroButtons: unknown;
    validatorHeadline: string;
    validatorBody: string;
    validatorCards: unknown;
    energyHeadline: string;
    energyBody: string;
    energyCards: unknown;
    performanceHeadline: string;
    performanceBody: string;
    performanceCards: unknown;
    additionalCards: unknown;
    conversionPanelHeading: string;
    conversionPanelBody: string;
    conversionPanelButtons: unknown;
    evidence: EvidenceText;
  };
}

type ResearchCard = {
  id: string;
  eyebrow: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  href: string;
};

function translatedCards(
  cards: readonly {
    readonly id: string;
    readonly callToAction: { readonly url: string };
  }[],
  raw: unknown,
  path: string,
  withBody = true,
): ResearchCard[] {
  return cards.map((card) => {
    const content = requiredCardContent(
      raw,
      card.id,
      ["eyebrow", "heading", "ctaLabel"],
      path,
    );
    return {
      id: card.id,
      href: card.callToAction.url,
      ...content,
      body: withBody
        ? requiredCardContent(raw, card.id, ["body"], path).body
        : undefined,
    };
  });
}

function SourceLink({
  href,
  label,
  source,
}: {
  href: string;
  label: string;
  source: string;
}) {
  return (
    <a
      href={href}
      aria-label={`${label}: ${source}`}
      className="group inline-flex items-center gap-2 text-xs font-medium text-nd-mid-em-text transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none"
    >
      <span className="border-b border-white/25 pb-0.5 group-hover:border-white/70">
        {label}
      </span>
      <span aria-hidden="true" className="text-nd-highlight-green">
        ↗
      </span>
    </a>
  );
}

function CardGrid({ cards }: { cards: ResearchCard[] }) {
  return (
    <div
      className={`grid gap-3 ${cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
    >
      {cards.map((card) => (
        <a
          key={card.id}
          href={card.href}
          className="group flex min-h-64 flex-col rounded-2xl border border-nd-border-light bg-[#101013] p-6 transition-colors hover:border-nd-border-hovered hover:bg-[#18141D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none md:p-7"
        >
          <span className="font-brand-mono text-[11px] uppercase tracking-[0.16em] text-nd-highlight-lavendar">
            {card.eyebrow}
          </span>
          <h3 className="mb-0 mt-7 max-w-xs font-brand text-2xl font-medium leading-tight tracking-[-0.04em] text-white md:text-[28px]">
            {card.heading}
          </h3>
          {card.body && (
            <p className="mb-7 mt-3 max-w-sm text-sm leading-relaxed text-nd-mid-em-text">
              {card.body}
            </p>
          )}
          <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-white">
            {card.ctaLabel}
            <span
              aria-hidden="true"
              className="text-nd-highlight-green transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
            >
              ↗
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

function plainText(body: string) {
  return body.replace(/<\/?p>/g, "");
}

export function ResearchPage({ translations: t }: ResearchPageProps) {
  const nav = HERO_SWITCHBACK.buttons.map(({ id, url }) => ({
    id,
    href: url,
    label: requiredTranslatedLabel(t.heroButtons, id, "research.hero.buttons"),
  }));
  // Keep historical translation keys for locale parity, but omit expired or outdated cards.
  const sections = [
    {
      id: "validator",
      title: t.validatorHeadline,
      body: t.validatorBody,
      report: RESEARCH_SOURCES.networkHealth,
      metrics: RESEARCH_METRICS.validator,
      cards: translatedCards(
        VALIDATOR_CARD_DECK.cards.filter((card) => card.id !== "blockZero"),
        t.validatorCards,
        "research.cardDecks.validator.cards",
      ),
      accent: "text-nd-highlight-lavendar",
    },
    {
      id: "energy",
      title: t.energyHeadline,
      body: t.energyBody,
      report: RESEARCH_SOURCES.energyImpact,
      metrics: RESEARCH_METRICS.energy,
      cards: translatedCards(
        ENERGY_CARD_DECK.cards,
        t.energyCards,
        "research.cardDecks.energy.cards",
      ),
      accent: "text-nd-highlight-green",
    },
    {
      id: "performance",
      title: t.performanceHeadline,
      body: t.performanceBody,
      report: RESEARCH_SOURCES.slotTime,
      metrics: RESEARCH_METRICS.performance,
      cards: translatedCards(
        PERFORMANCE_CARD_DECK.cards.filter(
          (card) => card.id !== "outageReport",
        ),
        t.performanceCards,
        "research.cardDecks.performance.cards",
      ),
      accent: "text-nd-highlight-blue",
    },
  ] as const;
  const additionalCards = translatedCards(
    ADDITIONAL_CARD_DECK.cards,
    t.additionalCards,
    "research.cardDecks.additional.cards",
    false,
  );
  const conversionButtons = CONVERSION_PANEL.buttons.map(({ id, url }) => ({
    id,
    href: url,
    label: requiredTranslatedLabel(
      t.conversionPanelButtons,
      id,
      "research.conversionPanel.buttons",
    ),
  }));

  return (
    <main className="overflow-hidden bg-nd-bg font-brand text-white">
      <section className="relative isolate overflow-hidden border-b border-nd-border-light">
        <Image
          src="/src/img/index/hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none -z-20 object-cover object-center opacity-65"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/40" />
        <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-end gap-16 px-5 pb-14 pt-24 md:px-8 md:pb-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:gap-24 lg:px-10 lg:pb-24 lg:pt-36">
          <div>
            <p className="mb-7 font-brand-mono text-xs uppercase tracking-[0.2em] text-nd-highlight-green">
              {t.evidence.eyebrow}
            </p>
            <h1 className="m-0 max-w-[850px] text-[clamp(3.25rem,7.8vw,7.5rem)] font-medium leading-[0.96] tracking-[-0.075em]">
              {t.heroHeadline}
            </h1>
            <p className="mb-0 mt-8 max-w-xl text-lg leading-relaxed text-nd-mid-em-text md:text-xl">
              {plainText(t.heroBody)}
            </p>
            <nav
              aria-label={t.evidence.eyebrow}
              className="mt-10 flex flex-wrap gap-2"
            >
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="rounded-full border border-white/25 px-4 py-2.5 text-sm text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none"
                >
                  {item.label} <span aria-hidden="true">↘</span>
                </a>
              ))}
            </nav>
          </div>
          <a
            href={RESEARCH_SOURCES.slotTime.href}
            className="group relative block overflow-hidden rounded-3xl border border-white/20 bg-[#121017]/90 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.3)] transition-colors hover:border-nd-highlight-lavendar/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none md:p-9"
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-nd-highlight-lavendar/20 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4 font-brand-mono text-[11px] uppercase tracking-[0.14em] text-nd-mid-em-text">
              <span>{t.evidence.latestAnalysis}</span>
              <span>{RESEARCH_SOURCES.slotTime.date}</span>
            </div>
            <div className="relative mt-20 border-b border-white/15 pb-9">
              <span className="block text-[clamp(5rem,10vw,9rem)] font-medium leading-none tracking-[-0.09em] text-white">
                250
                <span className="ml-2 text-[0.3em] tracking-tight text-nd-highlight-lavendar">
                  ms
                </span>
              </span>
              <span className="mt-3 block text-base text-nd-mid-em-text">
                {t.evidence.metrics.slotTarget}
              </span>
            </div>
            <span className="relative mt-6 flex items-center justify-between gap-5 text-sm font-medium">
              <span className="max-w-[18rem] text-white">
                {RESEARCH_SOURCES.slotTime.title}
              </span>
              <span
                aria-hidden="true"
                className="text-xl text-nd-highlight-green transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
              >
                ↗
              </span>
            </span>
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-20 border-b border-nd-border-light py-20 md:py-28"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
              <div>
                <p
                  className={`mb-5 font-brand-mono text-xs uppercase tracking-[0.18em] ${section.accent}`}
                >
                  {section.report.date}
                </p>
                <h2
                  id={`${section.id}-title`}
                  className="m-0 max-w-lg text-[clamp(2.5rem,4.3vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.06em]"
                >
                  {section.title}
                </h2>
                <p className="mb-0 mt-6 max-w-md text-lg leading-relaxed text-nd-mid-em-text">
                  {plainText(section.body)}
                </p>
                <div className="mt-8 flex flex-col items-start gap-4">
                  <a
                    href={section.report.href}
                    className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none"
                  >
                    {t.evidence.readReport}
                    <span aria-hidden="true">↗</span>
                  </a>
                  {section.id === "energy" && (
                    <SourceLink
                      href={RESEARCH_SOURCES.climateDashboard.href}
                      label={t.evidence.liveDashboard}
                      source={RESEARCH_SOURCES.climateDashboard.title}
                    />
                  )}
                </div>
              </div>
              <div className="self-end">
                <div className="grid gap-px overflow-hidden rounded-2xl border border-nd-border-light bg-nd-border-light sm:grid-cols-2">
                  {section.metrics.map((metric) => {
                    const source = RESEARCH_SOURCES[metric.source];
                    return (
                      <div
                        key={metric.label}
                        className="flex min-h-48 flex-col bg-[#111115] p-6 md:p-8"
                      >
                        <span className="text-[clamp(2.5rem,4vw,4.5rem)] font-medium leading-none tracking-[-0.07em] text-white">
                          {metric.value}
                        </span>
                        <span className="mt-3 max-w-xs text-sm leading-snug text-nd-mid-em-text">
                          {t.evidence.metrics[metric.label]}
                        </span>
                        <div className="mt-auto pt-7">
                          <SourceLink
                            href={source.href}
                            label={`${t.evidence.source} · ${source.date}`}
                            source={source.title}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mb-0 mt-4 text-xs text-nd-mid-em-text/70">
                  {t.evidence.snapshotNote}
                </p>
              </div>
            </div>
            <details className="group/archive mt-14 border-t border-nd-border-light pt-7 md:mt-20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm text-nd-mid-em-text transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green [&::-webkit-details-marker]:hidden">
                {t.evidence.relatedReading}
                <span
                  aria-hidden="true"
                  className="text-nd-highlight-green transition-transform group-open/archive:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="pt-6">
                <CardGrid cards={section.cards} />
              </div>
            </details>
          </section>
        ))}

        <section className="border-b border-nd-border-light py-20 md:py-28">
          <h2 className="m-0 text-[clamp(2.5rem,4.3vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.06em]">
            {t.evidence.relatedReading}
          </h2>
          <p className="mb-0 mt-5 max-w-2xl text-lg leading-relaxed text-nd-mid-em-text">
            {t.evidence.archiveDescription}
          </p>
          <div className="mt-10">
            <CardGrid cards={additionalCards} />
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="relative overflow-hidden rounded-3xl border border-nd-border-light bg-[#121017] px-6 py-14 md:px-12 md:py-20">
            <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-nd-highlight-lavendar/15 blur-3xl" />
            <div className="relative max-w-3xl">
              <h2 className="m-0 text-[clamp(2.5rem,4vw,4rem)] font-medium leading-tight tracking-[-0.06em]">
                {t.conversionPanelHeading}
              </h2>
              <p className="mb-0 mt-5 max-w-xl text-lg leading-relaxed text-nd-mid-em-text">
                {t.conversionPanelBody}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {conversionButtons.map((button, index) => (
                  <a
                    key={button.id}
                    href={button.href}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green motion-reduce:transition-none ${index === 0 ? "bg-white text-black hover:bg-white/85" : "border border-white/30 text-white hover:bg-white/10"}`}
                  >
                    {button.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
