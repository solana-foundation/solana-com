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
    <main className="pb-20">
      <section
        id="hero"
        className="bp-noise relative overflow-hidden px-3 pt-3 md:px-6 md:pt-6"
      >
        <Container>
          <div className="bp-card bp-grid relative overflow-hidden rounded-[2rem] border p-6 md:p-10 lg:p-14">
            <WaterHeroBackground />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div className="max-w-4xl">
                <p className="mb-5 font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.32em] text-[var(--bp-lime)]">
                  {content.hero.eyebrow}
                </p>
                <h1 className="max-w-4xl font-[var(--font-breakpoint-display)] text-[clamp(3.4rem,10vw,8.4rem)] leading-[0.9] text-white">
                  {content.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[rgba(231,210,249,0.84)] md:text-lg">
                  {content.hero.blurb}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={content.cta.placeholderHref}>
                    {content.hero.ctaPrimary}
                  </ButtonLink>
                  <ButtonLink href="#video" variant="secondary">
                    {content.hero.ctaSecondary}
                  </ButtonLink>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="bp-card rounded-[1.5rem] p-5">
                  <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.26em] text-[var(--bp-sky)]">
                    {content.hero.dates}
                  </p>
                  <p className="mt-3 text-xl font-medium text-white">
                    {content.hero.venue}
                  </p>
                </div>
                {content.hero.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bp-card rounded-[1.5rem] p-5"
                  >
                    <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.26em] text-[var(--bp-mint)]">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-medium text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionNav items={content.nav} />

      <Section id="overview">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.3em] text-[var(--bp-mint)]">
              Overview
            </p>
            <h2 className="mt-4 text-4xl font-medium text-white md:text-5xl">
              {content.overview.title}
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[rgba(231,210,249,0.84)]">
            <p>{content.overview.body}</p>
            <ul className="grid gap-3">
              {content.overview.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="bp-card rounded-[1.25rem] px-4 py-4 text-sm md:text-base"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="audience">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl font-medium text-white md:text-5xl">
            {content.audience.title}
          </h2>
          <p className="hidden font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.28em] text-[var(--bp-violet)] md:block">
            Program value
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.audience.cards.map((card) => (
            <article
              key={card.title}
              className="bp-card rounded-[1.5rem] p-6 md:min-h-64"
            >
              <h3 className="text-xl font-medium text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[rgba(231,210,249,0.8)] md:text-base">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="video">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.28em] text-[var(--bp-lime)]">
              Featured video
            </p>
            <h2 className="mt-4 text-4xl font-medium text-white md:text-5xl">
              {content.video.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[rgba(231,210,249,0.84)]">
              {content.video.body}
            </p>
          </div>
          <div className="bp-card overflow-hidden rounded-[1.75rem] p-3">
            <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-white/10">
              <iframe
                title={content.video.caption}
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${content.video.youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="px-2 pb-2 pt-4 text-sm text-[rgba(231,210,249,0.72)]">
              {content.video.caption}
            </p>
          </div>
        </div>
      </Section>

      <Section id="logistics">
        <div className="bp-card rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="text-4xl font-medium text-white md:text-5xl">
              {content.logistics.title}
            </h2>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-[var(--bp-border)] bg-black/10 p-5">
                <dt className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.26em] text-[var(--bp-sky)]">
                  {content.logistics.dateLabel}
                </dt>
                <dd className="mt-3 text-lg text-white">
                  {content.logistics.dateValue}
                </dd>
              </div>
              <div className="rounded-[1.25rem] border border-[var(--bp-border)] bg-black/10 p-5">
                <dt className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.26em] text-[var(--bp-mint)]">
                  {content.logistics.venueLabel}
                </dt>
                <dd className="mt-3 text-lg text-white">
                  {content.logistics.venueValue}
                </dd>
              </div>
              <div className="rounded-[1.25rem] border border-[var(--bp-border)] bg-black/10 p-5">
                <dt className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.26em] text-[var(--bp-lime)]">
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

      <Section id="london">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.28em] text-[var(--bp-violet)]">
              Why London
            </p>
            <h2 className="mt-4 text-4xl font-medium text-white md:text-5xl">
              {content.london.title}
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-base leading-7 text-[rgba(231,210,249,0.84)]">
              {content.london.body}
            </p>
            <div className="grid gap-3">
              {content.london.reasons.map((reason) => (
                <div key={reason} className="bp-card rounded-[1.25rem] p-4">
                  <p className="text-sm leading-7 text-white md:text-base">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="cta">
        <div className="bp-card relative overflow-hidden rounded-[2rem] p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,255,124,0.18),transparent_32%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-[var(--font-breakpoint-mono)] text-xs uppercase tracking-[0.28em] text-[var(--bp-lime)]">
                Primary CTA
              </p>
              <h2 className="mt-4 text-4xl font-medium text-white md:text-5xl">
                {content.cta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[rgba(231,210,249,0.84)]">
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
