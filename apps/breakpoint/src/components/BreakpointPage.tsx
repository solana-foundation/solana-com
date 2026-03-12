import type { BreakpointPageContent } from "@/content/page";
import { WaterHeroBackground } from "@/components/WaterHeroBackground";
import { SectionNav } from "@/components/SectionNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function BreakpointPage({
  content,
}: {
  content: BreakpointPageContent;
}) {
  return (
    <main className="bp-atmosphere bp-grain bp-scanlines relative z-10 pb-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden">
        <div className="relative min-h-[90vh] overflow-hidden border-b border-[var(--bp-border)]">
          <WaterHeroBackground />
          <Container>
            <div className="relative z-10 flex min-h-[90vh] flex-col justify-end gap-12 pb-14 pt-28 lg:pb-20">
              {/* Eyebrow */}
              <ScrollReveal>
                <p className="font-bp-mono text-[10px] uppercase tracking-[0.4em] text-bp-purple-light">
                  {content.hero.eyebrow}
                </p>
              </ScrollReveal>

              <div className="grid gap-10 lg:grid-cols-[1.5fr_0.5fr] lg:items-end">
                <div>
                  {/* Main title — heavy visual weight */}
                  <ScrollReveal delay={80}>
                    <h1 className="font-bp-display text-[clamp(3.2rem,10vw,8rem)] leading-[0.86] tracking-[-0.02em] text-white">
                      {content.hero.title}
                    </h1>
                  </ScrollReveal>

                  {/* Subtitle — thin contrast */}
                  <ScrollReveal delay={160}>
                    <p className="mt-6 max-w-xl text-base font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)] md:text-lg">
                      {content.hero.blurb}
                    </p>
                  </ScrollReveal>

                  {/* CTAs */}
                  <ScrollReveal delay={240}>
                    <div className="mt-10 flex flex-wrap gap-3">
                      <ButtonLink href={content.cta.placeholderHref}>
                        {content.hero.ctaPrimary}
                      </ButtonLink>
                      <ButtonLink href="#video" variant="secondary">
                        {content.hero.ctaSecondary}
                      </ButtonLink>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Stats column */}
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  <ScrollReveal delay={200}>
                    <div className="bp-card-static p-5">
                      <p className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                        {content.hero.dates}
                      </p>
                      <p className="mt-3 text-lg font-medium text-white">
                        {content.hero.venue}
                      </p>
                    </div>
                  </ScrollReveal>
                  {content.hero.stats.map((stat, i) => (
                    <ScrollReveal key={stat.label} delay={260 + i * 60}>
                      <div className="bp-card-static p-5">
                        <p className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-gray">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-xl font-medium text-white">
                          {stat.value}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <SectionNav items={content.nav} />

      {/* ── Overview ─────────────────────────────────────────── */}
      <Section id="overview">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div>
              <p className="font-bp-mono text-[10px] uppercase tracking-[0.4em] text-bp-purple-light">
                Overview
              </p>
              <h2 className="mt-4 font-bp-display text-4xl tracking-tight text-white md:text-5xl">
                {content.overview.title}
              </h2>
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={100}>
              <p className="text-base font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)]">
                {content.overview.body}
              </p>
            </ScrollReveal>
            <div className="mt-6 grid gap-1">
              {content.overview.highlights.map((highlight, i) => (
                <ScrollReveal key={highlight} delay={180 + i * 60}>
                  <div className="bp-card border-[var(--bp-border)] bg-bp-surface px-5 py-4 text-sm text-bp-text md:text-base">
                    {highlight}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Audience ─────────────────────────────────────────── */}
      <Section id="audience">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-bp-display text-4xl tracking-tight text-white md:text-5xl">
              {content.audience.title}
            </h2>
            <p className="hidden font-bp-mono text-[10px] uppercase tracking-[0.28em] text-bp-gray md:block">
              Program value
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-8 grid gap-2 md:grid-cols-3">
          {content.audience.cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={80 + i * 80}>
              <article className="bp-card p-6 md:min-h-64">
                <h3 className="text-lg font-medium text-white">{card.title}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)] md:text-base">
                  {card.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── Video ────────────────────────────────────────────── */}
      <Section id="video">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ScrollReveal>
            <div>
              <p className="font-bp-mono text-[10px] uppercase tracking-[0.4em] text-bp-purple-light">
                Featured video
              </p>
              <h2 className="mt-4 font-bp-display text-4xl tracking-tight text-white md:text-5xl">
                {content.video.title}
              </h2>
              <p className="mt-5 max-w-xl text-base font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)]">
                {content.video.body}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="bp-card-static overflow-hidden p-2">
              <div className="aspect-video overflow-hidden">
                <iframe
                  title={content.video.caption}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${content.video.youtubeId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="px-2 pb-1 pt-3 font-bp-mono text-[10px] uppercase tracking-[0.14em] text-bp-gray">
                {content.video.caption}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ── Logistics ────────────────────────────────────────── */}
      <Section id="logistics">
        <ScrollReveal>
          <div className="bp-card-static p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <h2 className="font-bp-display text-4xl tracking-tight text-white md:text-5xl">
                {content.logistics.title}
              </h2>
              <dl className="grid gap-2 sm:grid-cols-3">
                <div className="border border-[var(--bp-border)] bg-bp-ink p-5">
                  <dt className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                    {content.logistics.dateLabel}
                  </dt>
                  <dd className="mt-3 text-lg text-white">
                    {content.logistics.dateValue}
                  </dd>
                </div>
                <div className="border border-[var(--bp-border)] bg-bp-ink p-5">
                  <dt className="font-bp-mono text-[10px] uppercase tracking-[0.26em] text-bp-purple-light">
                    {content.logistics.venueLabel}
                  </dt>
                  <dd className="mt-3 text-lg text-white">
                    {content.logistics.venueValue}
                  </dd>
                </div>
                <div className="border border-[var(--bp-border)] bg-bp-ink p-5">
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
        </ScrollReveal>
      </Section>

      {/* ── Why London ───────────────────────────────────────── */}
      <Section id="london">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal>
            <div>
              <p className="font-bp-mono text-[10px] uppercase tracking-[0.4em] text-bp-purple-light">
                Why London
              </p>
              <h2 className="mt-4 font-bp-display text-4xl tracking-tight text-white md:text-5xl">
                {content.london.title}
              </h2>
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={80}>
              <p className="text-base font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)]">
                {content.london.body}
              </p>
            </ScrollReveal>
            <div className="mt-5 grid gap-1">
              {content.london.reasons.map((reason, i) => (
                <ScrollReveal key={reason} delay={160 + i * 60}>
                  <div className="bp-card border-[var(--bp-border)] bg-bp-surface px-5 py-4">
                    <p className="text-sm font-light leading-relaxed text-white md:text-base">
                      {reason}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="cta">
        <ScrollReveal>
          <div className="relative overflow-hidden border border-[var(--bp-border-strong)] bg-bp-surface p-8 md:p-12">
            {/* Purple radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_0%,rgba(98,58,196,0.18),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(98,58,196,0.06),transparent_50%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-bp-mono text-[10px] uppercase tracking-[0.4em] text-bp-purple-light">
                  Primary CTA
                </p>
                <h2 className="mt-4 font-bp-display text-4xl tracking-tight text-white md:text-5xl">
                  {content.cta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-light leading-relaxed tracking-wide text-[var(--bp-text-muted)]">
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
        </ScrollReveal>
      </Section>
    </main>
  );
}
