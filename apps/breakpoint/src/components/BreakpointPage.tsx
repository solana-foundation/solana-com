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
    <main className="bp-atmosphere bp-grain bp-scanlines relative overflow-x-hidden">
      <section
        id="hero"
        className="relative overflow-hidden border-b border-stroke-primary"
      >
        <div className="relative min-h-screen overflow-hidden">
          <WaterHeroBackground />
          <Container>
            <div className="relative z-10 flex min-h-screen flex-col pb-xl pt-s md:pb-3xl">
              <ScrollReveal>
                <div className="flex min-h-[3.5rem] items-center justify-between border-b border-stroke-primary py-xs">
                  <a
                    href="#hero"
                    className="font-macan-mono text-sm uppercase tracking-button text-primary"
                  >
                    Breakpoint
                  </a>
                  <p className="hidden font-macan-mono text-2xs uppercase tracking-button text-secondary md:block">
                    {content.hero.dates}
                  </p>
                </div>
              </ScrollReveal>
              <div className="grid flex-1 items-end gap-l py-xl md:grid-cols-12 md:py-3xl">
                <div className="md:col-span-8">
                  <ScrollReveal delay={80}>
                    <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-lime">
                      {content.hero.eyebrow}
                    </p>
                  </ScrollReveal>
                  <ScrollReveal delay={140}>
                    <h1 className="mt-m max-w-5xl font-fh-lecturis text-xl leading-[0.95] text-primary">
                      {content.hero.title}
                    </h1>
                  </ScrollReveal>
                  <ScrollReveal delay={160}>
                    <p className="text-p1 mt-s max-w-2xl text-secondary">
                      {content.hero.blurb}
                    </p>
                  </ScrollReveal>
                  <ScrollReveal delay={240}>
                    <div className="mt-l flex flex-wrap gap-3">
                      <ButtonLink href={content.cta.placeholderHref}>
                        {content.hero.ctaPrimary}
                      </ButtonLink>
                      <ButtonLink href="#video" variant="secondary">
                        {content.hero.ctaSecondary}
                      </ButtonLink>
                    </div>
                  </ScrollReveal>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 md:col-span-4 md:min-w-[18rem] md:self-end md:justify-self-end md:grid-cols-1">
                  <ScrollReveal delay={200}>
                    <div className="bp-panel rounded-bp p-s">
                      <p className="text-caption text-secondary">
                        {content.hero.dates}
                      </p>
                      <p className="mt-3 text-h4 text-primary">
                        {content.hero.venue}
                      </p>
                    </div>
                  </ScrollReveal>
                  {content.hero.stats.map((stat, i) => (
                    <ScrollReveal key={stat.label} delay={260 + i * 60}>
                      <div className="bp-panel rounded-bp p-s">
                        <p className="text-caption text-secondary">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-h5 text-primary">
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

      <Section id="overview">
        <div className="grid gap-l md:grid-cols-12">
          <ScrollReveal>
            <div className="md:col-span-5">
              <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-azure">
                Overview
              </p>
              <h2 className="mt-s font-abc-diatype text-h2 text-primary">
                {content.overview.title}
              </h2>
            </div>
          </ScrollReveal>
          <div className="md:col-span-7">
            <ScrollReveal delay={100}>
              <p className="text-p1 max-w-3xl text-secondary">
                {content.overview.body}
              </p>
            </ScrollReveal>
            <div className="mt-l grid gap-3">
              {content.overview.highlights.map((highlight, i) => (
                <ScrollReveal key={highlight} delay={180 + i * 60}>
                  <div className="bp-panel rounded-bp px-s py-m text-p1 text-primary">
                    {highlight}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="audience">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6 border-b border-stroke-primary pb-s">
            <h2 className="font-abc-diatype text-h2 text-primary">
              {content.audience.title}
            </h2>
            <p className="hidden font-macan-mono text-2xs uppercase tracking-button text-secondary md:block">
              Program value
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-l grid gap-3 md:grid-cols-3">
          {content.audience.cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={80 + i * 80}>
              <article className="bp-panel rounded-bp p-s md:min-h-[19rem]">
                <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-lime">
                  0{i + 1}
                </p>
                <h3 className="mt-m text-h3 text-primary">{card.title}</h3>
                <p className="text-p1 mt-s text-secondary">{card.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section id="video">
        <div className="grid gap-l md:grid-cols-12 md:items-start">
          <ScrollReveal>
            <div className="md:col-span-4">
              <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-azure">
                Featured video
              </p>
              <h2 className="mt-s font-abc-diatype text-h2 text-primary">
                {content.video.title}
              </h2>
              <p className="text-p1 mt-s max-w-xl text-secondary">
                {content.video.body}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="bp-panel overflow-hidden rounded-bp-lg p-3 md:col-span-8">
              <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-stroke-primary">
                <iframe
                  title={content.video.caption}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${content.video.youtubeId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-caption px-2 pb-1 pt-s text-secondary">
                {content.video.caption}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Section id="logistics">
        <ScrollReveal>
          <div className="bp-panel rounded-bp-lg p-s md:p-xl">
            <div className="grid gap-l md:grid-cols-12">
              <h2 className="font-abc-diatype text-h2 text-primary md:col-span-4">
                {content.logistics.title}
              </h2>
              <dl className="grid gap-3 sm:grid-cols-3 md:col-span-8">
                <div className="rounded-bp border border-stroke-primary bg-transparent-wisp-10 p-s">
                  <dt className="text-caption text-secondary">
                    {content.logistics.dateLabel}
                  </dt>
                  <dd className="mt-s text-h4 text-primary">
                    {content.logistics.dateValue}
                  </dd>
                </div>
                <div className="rounded-bp border border-stroke-primary bg-transparent-wisp-10 p-s">
                  <dt className="text-caption text-secondary">
                    {content.logistics.venueLabel}
                  </dt>
                  <dd className="mt-s text-h4 text-primary">
                    {content.logistics.venueValue}
                  </dd>
                </div>
                <div className="rounded-bp border border-stroke-primary bg-transparent-wisp-10 p-s">
                  <dt className="text-caption text-secondary">
                    {content.logistics.formatLabel}
                  </dt>
                  <dd className="mt-s text-h4 text-primary">
                    {content.logistics.formatValue}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      <Section id="london">
        <div className="grid gap-l md:grid-cols-12">
          <ScrollReveal>
            <div className="md:col-span-5">
              <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-mint">
                Why London
              </p>
              <h2 className="mt-s font-abc-diatype text-h2 text-primary">
                {content.london.title}
              </h2>
            </div>
          </ScrollReveal>
          <div className="md:col-span-7">
            <ScrollReveal delay={80}>
              <p className="text-p1 text-secondary">{content.london.body}</p>
            </ScrollReveal>
            <div className="mt-l grid gap-3">
              {content.london.reasons.map((reason, i) => (
                <ScrollReveal key={reason} delay={160 + i * 60}>
                  <div className="bp-panel rounded-bp px-s py-m">
                    <p className="text-p1 text-primary">{reason}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="cta">
        <ScrollReveal>
          <div className="bp-panel relative overflow-hidden rounded-bp-lg p-s md:p-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_0%,rgba(171,102,253,0.22),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(89,184,254,0.08),transparent_52%)]" />
            <div className="relative grid gap-l md:grid-cols-12 md:items-end">
              <div>
                <p className="font-macan-mono text-2xs uppercase tracking-button text-secondary-lime">
                  Primary CTA
                </p>
                <h2 className="mt-s font-abc-diatype text-h2 text-primary">
                  {content.cta.title}
                </h2>
                <p className="text-p1 mt-s max-w-2xl text-secondary">
                  {content.cta.body}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
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

      <footer className="border-t border-stroke-primary pb-xl pt-l md:pb-3xl">
        <Container className="flex flex-col gap-m md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-fh-lecturis text-h2 leading-none text-primary">
              Breakpoint
            </p>
            <p className="text-p1 mt-xs max-w-xl text-secondary">
              November 15-17, 2026. Olympia London.
            </p>
          </div>
          <div className="flex flex-col gap-xs font-macan-mono text-2xs uppercase tracking-button text-secondary md:items-end">
            <a
              href={content.cta.placeholderHref}
              className="cta-transition hover:text-byte"
            >
              {content.cta.primary}
            </a>
            <a href="#hero" className="cta-transition hover:text-byte">
              {content.cta.secondary}
            </a>
          </div>
        </Container>
      </footer>
    </main>
  );
}
