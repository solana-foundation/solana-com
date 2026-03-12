import type { BreakpointPageContent } from "@/content/page";
import { WaterHeroBackground } from "@/components/WaterHeroBackground";
import { SectionNav } from "@/components/SectionNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function BreakpointPage({
  content,
}: {
  content: BreakpointPageContent;
}) {
  return (
    <main className="relative z-10 pb-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="hero" className="bp-noise relative overflow-hidden">
        <div className="relative min-h-[85vh] overflow-hidden border-b border-[var(--bp-border)]">
          <WaterHeroBackground />
          <Container>
            <div className="relative z-10 grid min-h-[85vh] items-end gap-10 pb-12 pt-24 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:pb-16">
              <div className="max-w-4xl">
                <p className="mb-6 font-bp-mono text-xs uppercase tracking-[0.32em] text-bp-purple-light">
                  {content.hero.eyebrow}
                </p>
                <h1 className="font-bp-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] tracking-tight text-white">
                  {content.hero.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--bp-text-muted)] md:text-lg">
                  {content.hero.blurb}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink href={content.cta.placeholderHref}>
                    {content.hero.ctaPrimary}
                  </ButtonLink>
                  <ButtonLink href="#video" variant="secondary">
                    {content.hero.ctaSecondary}
                  </ButtonLink>
                </div>
              </div>

              {/* Stats column */}
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border border-[var(--bp-border)] bg-bp-surface/80 p-5">
                  <p className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                    {content.hero.dates}
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">
                    {content.hero.venue}
                  </p>
                </div>
                {content.hero.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--bp-border)] bg-bp-surface/80 p-5"
                  >
                    <p className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-gray">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-xl font-medium text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      <SectionNav items={content.nav} />

      {/* ── Overview ─────────────────────────────────────────── */}
      <Section id="overview">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-bp-mono text-[10px] uppercase tracking-[0.32em] text-bp-purple-light">
              Overview
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight text-white md:text-5xl">
              {content.overview.title}
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-[var(--bp-text-muted)]">
            <p>{content.overview.body}</p>
            <ul className="grid gap-2">
              {content.overview.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-lg border border-[var(--bp-border)] bg-bp-surface px-5 py-4 text-sm text-bp-text md:text-base"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Audience ─────────────────────────────────────────── */}
      <Section id="audience">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl font-medium tracking-tight text-white md:text-5xl">
            {content.audience.title}
          </h2>
          <p className="hidden font-bp-mono text-[10px] uppercase tracking-[0.28em] text-bp-gray md:block">
            Program value
          </p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {content.audience.cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-xl border border-[var(--bp-border)] bg-bp-surface p-6 transition-colors duration-300 hover:border-[var(--bp-border-strong)] md:min-h-64"
            >
              <h3 className="text-lg font-medium text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--bp-text-muted)] md:text-base">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Video ────────────────────────────────────────────── */}
      <Section id="video">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-bp-mono text-[10px] uppercase tracking-[0.32em] text-bp-purple-light">
              Featured video
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight text-white md:text-5xl">
              {content.video.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--bp-text-muted)]">
              {content.video.body}
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--bp-border)] bg-bp-surface p-2">
            <div className="aspect-video overflow-hidden rounded-lg">
              <iframe
                title={content.video.caption}
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${content.video.youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="px-2 pb-1 pt-3 font-bp-mono text-xs text-bp-gray">
              {content.video.caption}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Logistics ────────────────────────────────────────── */}
      <Section id="logistics">
        <div className="rounded-xl border border-[var(--bp-border)] bg-bp-surface p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="text-4xl font-medium tracking-tight text-white md:text-5xl">
              {content.logistics.title}
            </h2>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--bp-border)] bg-bp-ink p-5">
                <dt className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                  {content.logistics.dateLabel}
                </dt>
                <dd className="mt-3 text-lg text-white">
                  {content.logistics.dateValue}
                </dd>
              </div>
              <div className="rounded-lg border border-[var(--bp-border)] bg-bp-ink p-5">
                <dt className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                  {content.logistics.venueLabel}
                </dt>
                <dd className="mt-3 text-lg text-white">
                  {content.logistics.venueValue}
                </dd>
              </div>
              <div className="rounded-lg border border-[var(--bp-border)] bg-bp-ink p-5">
                <dt className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                  {content.logistics.formatLabel}
                </dt>
                <dd className="mt-3 text-lg text-white">
                  {content.logistics.formatValue}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* ── Why London ───────────────────────────────────────── */}
      <Section id="london">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-bp-mono text-[10px] uppercase tracking-[0.32em] text-bp-purple-light">
              Why London
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight text-white md:text-5xl">
              {content.london.title}
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-base leading-relaxed text-[var(--bp-text-muted)]">
              {content.london.body}
            </p>
            <div className="grid gap-2">
              {content.london.reasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-lg border border-[var(--bp-border)] bg-bp-surface px-5 py-4"
                >
                  <p className="text-sm leading-relaxed text-white md:text-base">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="cta">
        <div className="relative overflow-hidden rounded-xl border border-[var(--bp-border-strong)] bg-bp-surface p-8 md:p-12">
          {/* Purple radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_0%,rgba(98,58,196,0.2),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(98,58,196,0.08),transparent_50%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-bp-mono text-[10px] uppercase tracking-[0.32em] text-bp-purple-light">
                Primary CTA
              </p>
              <h2 className="mt-4 text-4xl font-medium tracking-tight text-white md:text-5xl">
                {content.cta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--bp-text-muted)]">
                {content.cta.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={content.cta.placeholderHref}>
                {content.cta.primary}
              </ButtonLink>
              <ButtonLink href="#hero" variant="secondary">
                {content.cta.secondary}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
