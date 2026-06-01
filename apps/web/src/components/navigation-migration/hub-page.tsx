import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "@solana-com/ui-chrome/link";
import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/app/components/utils";
import { HubHeroBackground } from "@/components/navigation-migration/hub-hero-background";

export interface HubLink {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface HubSection {
  title: string;
  description?: string;
  links: HubLink[];
}

export interface HubFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface HubMetric {
  value: string;
  label: string;
  description: string;
}

export interface HubPoint {
  title: string;
  description: string;
}

export interface HubOverview {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  points: HubPoint[];
}

export interface HubPathway {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  links?: HubLink[];
  featured?: boolean;
}

export interface HubPageConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: HubLink;
  secondaryCta?: HubLink;
  accentColor?: string;
  heroImageSrc?: string;
  bgJsonFilePath?: string;
  metrics?: HubMetric[];
  overview?: HubOverview;
  pathways?: HubPathway[];
  pathwaysEyebrow?: string;
  pathwaysHeading?: string;
  directoryEyebrow?: string;
  resourceHeading?: string;
  resourceDescription?: string;
  feature?: HubFeature;
  sections: HubSection[];
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

const HUB_FRAME = "max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]";
const SECTION_PAD = "py-[64px] md:py-[112px] xl:py-[160px]";

function LinkAnchor({
  link,
  className,
  children,
  ariaLabel,
}: {
  link: HubLink;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const external = link.external ?? isExternalHref(link.href);

  return (
    <Link
      to={link.href}
      className={className}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}

export function NavigationHubPage({ config }: { config: HubPageConfig }) {
  const accentColor = config.accentColor ?? "#14F195";
  const style = { "--hub-accent": accentColor } as React.CSSProperties;

  return (
    <main className="bg-black text-white" style={style}>
      <HubHero config={config} />

      {config.overview && (
        <>
          <HubDivider />
          <HubOverviewSection
            overview={config.overview}
            heroImageSrc={config.heroImageSrc}
          />
        </>
      )}

      {config.pathways && config.pathways.length > 0 && (
        <HubPathways
          pathways={config.pathways}
          eyebrow={config.pathwaysEyebrow}
          heading={config.pathwaysHeading}
        />
      )}

      <HubDecor />

      <HubDirectory
        sections={config.sections}
        eyebrow={config.directoryEyebrow}
        heading={config.resourceHeading}
        description={config.resourceDescription}
        primaryCta={config.primaryCta}
        secondaryCta={config.secondaryCta}
      />
    </main>
  );
}

function HubDivider() {
  return (
    <div className="w-full">
      <hr className="border-white/10 border-t m-0 !opacity-100" />
    </div>
  );
}

function HubHero({ config }: { config: HubPageConfig }) {
  return (
    <section
      className="relative overflow-hidden bg-black text-white text-left"
      aria-labelledby="hub-title"
    >
      <HubHeroBackground
        heroImageSrc={config.heroImageSrc}
        bgJsonFilePath={config.bgJsonFilePath}
      />

      <div className={cn(HUB_FRAME, "relative z-10")}>
        <div className="pt-[88px] md:pt-[112px] xl:pt-[165px] pb-[40px] md:pb-[64px] xl:pb-[80px] max-w-5xl">
          <p className="m-0 mb-5 inline-flex items-center gap-2 font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/80">
            <span
              aria-hidden
              className="block size-1.5 rounded-full"
              style={{ background: "var(--hub-accent)" }}
            />
            {config.eyebrow}
          </p>
          <h1
            id="hub-title"
            className="m-0 font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]"
          >
            {config.title}
          </h1>
          <p className="text-[#ABABBA] text-lg md:text-2xl mt-[16px] xl:mt-[24px] mb-0 max-w-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {config.description}
          </p>
          <div className="mt-[32px] xl:mt-[48px] flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <HubButton link={config.primaryCta} variant="primary" />
            {config.secondaryCta && (
              <HubButton link={config.secondaryCta} variant="secondary" />
            )}
          </div>
        </div>

        {((config.metrics && config.metrics.length > 0) || config.feature) && (
          <div className="w-full flex flex-col xl:flex-row xl:pb-10 pb-[40px] md:pb-[64px] xl:pb-[80px]">
            {config.metrics && config.metrics.length > 0 && (
              <HubMetrics
                metrics={config.metrics}
                hasFeature={Boolean(config.feature)}
              />
            )}
            {config.feature && (
              <HubFeatureCard
                feature={config.feature}
                hasMetrics={Boolean(
                  config.metrics && config.metrics.length > 0,
                )}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function HubMetrics({
  metrics,
  hasFeature,
}: {
  metrics: HubMetric[];
  hasFeature: boolean;
}) {
  const statsCount = metrics.length;
  return (
    <div
      className={cn(
        "grid grid-cols-2 w-full xl:min-h-44",
        hasFeature ? "xl:w-2/3" : "xl:w-full",
        statsCount === 2 && "xl:grid-cols-2",
        statsCount === 3 && "xl:grid-cols-3",
        statsCount >= 4 && "xl:grid-cols-4",
      )}
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={cn(
            "p-5 xl:p-6 flex flex-col justify-between gap-6 max-xl:border-t border-white/15",
            index % 2 ? "border-l" : "",
            index > 0 ? "xl:border-l" : "",
            index >= 2 && "max-xl:border-t",
          )}
        >
          <div className="flex items-center gap-2 max-md:hidden">
            <span
              aria-hidden
              className="block size-1.5 rounded-full"
              style={{ background: "var(--hub-accent)" }}
            />
            <span className="font-brand-mono text-[11px] uppercase tracking-[0.08em] text-white/70">
              {metric.value}
            </span>
          </div>
          <div>
            <div
              className="text-[14px] md:hidden font-brand-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--hub-accent)" }}
            >
              {metric.value}
            </div>
            <div className="md:mt-[8px] text-[18px] md:text-[20px] xl:text-[24px] font-medium leading-[1.25] tracking-[-0.18px] md:tracking-[-0.24px]">
              {metric.label}
            </div>
            <p className="mt-2 text-[13px] md:text-[14px] text-[#ABABBA] leading-[1.42] m-0">
              {metric.description}
            </p>
          </div>
        </div>
      ))}
      {statsCount % 2 !== 0 && (
        <div className="p-[16px] xl:p-[16px_24px] flex flex-col justify-between gap-4 max-xl:border-t border-white/15 xl:hidden border-l" />
      )}
    </div>
  );
}

function HubFeatureCard({
  feature,
  hasMetrics,
}: {
  feature: HubFeature;
  hasMetrics: boolean;
}) {
  const external = isExternalHref(feature.href);
  return (
    <div
      className={cn(
        "overflow-hidden w-full pt-3 md:pt-4 xl:pt-0",
        hasMetrics ? "xl:w-1/3 xl:pl-6" : "xl:px-6",
      )}
    >
      <a
        href={feature.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`${feature.title} — ${feature.cta}`}
        className="group relative flex flex-row items-stretch p-5 md:p-6 bg-black text-white rounded-xl no-underline h-full border border-white/10 overflow-hidden transition-colors hover:border-white/25"
      >
        <div className="relative grow flex flex-col justify-between gap-3 xl:gap-4">
          <div>
            <p
              className="font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em] m-0"
              style={{ color: "var(--hub-accent)" }}
            >
              {feature.eyebrow}
            </p>
            <p className="font-medium text-base md:text-lg mt-2 m-0 tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px] leading-[1.25]">
              {feature.title}
            </p>
            <p className="text-[13px] md:text-[14px] text-[#ABABBA] mt-2 m-0 tracking-[-0.14px] md:tracking-[-0.16px] leading-[1.42] md:leading-[1.44]">
              {feature.description}
            </p>
          </div>
          <div>
            <span className="rounded-full text-base font-light px-4 h-8 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px] inline-flex items-center gap-2">
              {external ? (
                <ArrowUpRight
                  aria-hidden
                  className="-ml-2 p-1 !size-5 bg-black text-white rounded-full"
                  strokeWidth={3}
                />
              ) : (
                <ArrowRight
                  aria-hidden
                  className="-ml-2 p-1 !size-5 bg-black text-white rounded-full transition-transform group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              )}
              {feature.cta}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}

function HubOverviewSection({
  overview,
  heroImageSrc,
}: {
  overview: HubOverview;
  heroImageSrc?: string;
}) {
  const imageSrc = overview.imageSrc;
  const showImage = Boolean(imageSrc && imageSrc !== heroImageSrc);

  return (
    <section className="relative bg-black text-white text-left">
      <div
        className={cn(
          HUB_FRAME,
          "pt-[64px] md:pt-[112px] xl:pt-[160px] pb-5 md:pb-[32px] xl:pb-[40px]",
        )}
      >
        <p className="m-0 mb-5 inline-flex items-center gap-2 font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
          <span
            aria-hidden
            className="block size-1.5 rounded-full"
            style={{ background: "var(--hub-accent)" }}
          />
          {overview.eyebrow}
        </p>
        <h2 className="font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[48px] xl:text-[80px] max-w-3xl mb-[32px] xl:mb-[64px] tracking-[-1.6px] md:tracking-[-1.92px] xl:tracking-[-3.2px] m-0">
          {overview.title}
        </h2>

        <div className="flex flex-col xl:items-start xl:flex-row gap-8 xl:gap-16">
          {showImage && (
            <div className="w-[35%] max-xl:hidden">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  className="w-full h-auto object-cover block"
                  src={imageSrc as string}
                  alt=""
                  width={600}
                  height={420}
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(80% 80% at 100% 0%, color-mix(in srgb, var(--hub-accent) 28%, transparent), transparent 60%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </div>
          )}
          <div
            className={cn("relative w-full max-w-2xl", showImage && "xl:w-3/5")}
          >
            <p className="text-xl md:text-[32px] mb-0 font-medium tracking-[-0.6px] md:tracking-[-0.96px] leading-[1.4] md:leading-[1.25] text-white">
              {overview.description}
            </p>
          </div>
        </div>

        <div className="mt-[48px] xl:mt-[88px] grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border-t border-b border-white/10">
          {overview.points.map((point, idx) => (
            <div
              key={point.title}
              className={cn(
                "bg-black p-6 md:p-8",
                idx === 0 && "md:border-r-0",
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  aria-hidden
                  className="font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "var(--hub-accent)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in srgb, var(--hub-accent) 50%, transparent), transparent)",
                  }}
                />
              </div>
              <h3 className="font-brand font-medium text-lg md:text-2xl m-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                {point.title}
              </h3>
              <p className="mt-3 text-[14px] md:text-base text-[#ABABBA] leading-[1.5] m-0">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HubPathways({
  pathways,
  eyebrow,
  heading,
}: {
  pathways: HubPathway[];
  eyebrow?: string;
  heading?: string;
}) {
  return (
    <section className="relative bg-black text-white text-left overflow-hidden">
      <div className={cn(HUB_FRAME, SECTION_PAD)}>
        <div className="mb-[32px] xl:mb-[48px] max-w-3xl">
          <p className="m-0 mb-5 inline-flex items-center gap-2 font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
            <span
              aria-hidden
              className="block size-1.5 rounded-full"
              style={{ background: "var(--hub-accent)" }}
            />
            {eyebrow ?? "Start here"}
          </p>
          <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] m-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
            {heading ?? "Choose the path that matches your intent."}
          </h2>
        </div>

        <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway, idx) => (
            <PathwayCard key={pathway.title} pathway={pathway} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PathwayCard({
  pathway,
  index,
}: {
  pathway: HubPathway;
  index: number;
}) {
  const numeric = String(index + 1).padStart(2, "0");

  return (
    <LinkAnchor
      link={{ title: pathway.title, href: pathway.href }}
      ariaLabel={`${pathway.title} — ${pathway.cta}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl",
        "border border-white/10 bg-black p-6 md:p-8 text-white no-underline",
        "min-h-[320px] xl:min-h-[380px]",
        "transition-colors duration-200 hover:border-white/25",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">
          {pathway.eyebrow}
        </span>
        <span
          aria-hidden
          className="font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/30"
        >
          {numeric}
        </span>
      </div>

      <div className="mt-8 xl:mt-12 flex flex-col">
        <h3 className="font-brand font-medium m-0 text-[24px] md:text-[28px] xl:text-[32px] leading-[1.15] tracking-[-0.72px] md:tracking-[-0.84px] xl:tracking-[-0.96px]">
          {pathway.title}
        </h3>
        <p className="mt-4 text-[15px] md:text-base text-[#ABABBA] leading-[1.5] m-0">
          {pathway.description}
        </p>
      </div>

      <div className="mt-8">
        {pathway.links && pathway.links.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/50">
            {pathway.links.slice(0, 3).map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-4">
                {i > 0 && (
                  <span aria-hidden className="text-white/20">
                    /
                  </span>
                )}
                {link.title}
              </span>
            ))}
          </div>
        )}
        <span className="inline-flex items-center gap-2 text-[15px] md:text-base font-medium">
          {pathway.cta}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </LinkAnchor>
  );
}

function HubDecor() {
  return (
    <div className="relative pointer-events-none h-0 xl:my-[40px]">
      <div className="relative top-0 left-0 h-[280px] xl:h-[520px] -translate-y-1/2 min-h-[280px] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 90% at 50% 50%, color-mix(in srgb, var(--hub-accent) 22%, transparent) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 60% at 15% 50%, color-mix(in srgb, var(--hub-accent) 18%, transparent) 0%, transparent 65%), radial-gradient(40% 60% at 85% 50%, color-mix(in srgb, var(--hub-accent) 14%, transparent) 0%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
}

function HubDirectory({
  sections,
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
}: {
  sections: HubSection[];
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCta: HubLink;
  secondaryCta?: HubLink;
}) {
  return (
    <section className="relative bg-black text-white text-left overflow-hidden">
      <div className={cn(HUB_FRAME, SECTION_PAD)}>
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 xl:gap-14 mb-[48px] xl:mb-[80px]">
          <div className="grow max-w-3xl">
            <p className="m-0 mb-5 inline-flex items-center gap-2 font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
              <span
                aria-hidden
                className="block size-1.5 rounded-full"
                style={{ background: "var(--hub-accent)" }}
              />
              {eyebrow ?? "Directory"}
            </p>
            <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] m-0 max-w-2xl tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
              {heading ?? "Explore related resources"}
            </h2>
            {description && (
              <p className="text-lg md:text-2xl text-white opacity-[0.64] max-md:mt-2 md:mt-6 mb-0 max-w-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <HubButton link={primaryCta} variant="primary" />
            {secondaryCta && (
              <HubButton link={secondaryCta} variant="secondary" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, idx) => (
              <div
                key={section.title}
                className={cn(
                  "relative flex flex-col p-6 md:p-8 xl:p-10",
                  "border-white/10",
                  idx > 0 && "border-t md:border-t-0",
                  idx % 2 === 1 && "md:border-l",
                  "xl:border-l xl:[&:nth-child(3n+1)]:border-l-0",
                  "md:[&:nth-child(2)]:border-t-0 xl:[&:nth-child(3)]:border-t-0",
                )}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    aria-hidden
                    className="font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                    style={{ color: "var(--hub-accent)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1"
                    style={{
                      background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--hub-accent) 50%, transparent), transparent)",
                    }}
                  />
                </div>
                <h3 className="font-brand font-medium text-xl md:text-2xl xl:text-[28px] m-0 tracking-[-0.4px] md:tracking-[-0.48px] xl:tracking-[-0.56px] leading-[1.2]">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="mt-3 text-[14px] md:text-[15px] text-[#ABABBA] leading-[1.5] m-0">
                    {section.description}
                  </p>
                )}
                <ul className="mt-6 xl:mt-8 flex flex-col p-0 m-0 list-none divide-y-[1px] divide-white/10 -mx-2">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.href}`} className="p-0">
                      <ResourceLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HubButton({
  link,
  variant,
}: {
  link: HubLink;
  variant: "primary" | "secondary";
}) {
  const external = link.external ?? isExternalHref(link.href);

  if (variant === "primary") {
    return (
      <Link
        to={link.href}
        className={cn(
          buttonVariants({ size: "lg", rounded: true }),
          "rounded-full h-auto md:h-[48px] text-base md:text-lg !px-5 py-2 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px] whitespace-normal text-left no-underline",
        )}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        <span className="-ml-2 p-1 !size-6 md:!size-8 bg-black text-white rounded-full inline-flex items-center justify-center shrink-0">
          {external ? (
            <ArrowUpRight
              aria-hidden
              className="!size-[14px] md:!size-[16px] block"
              strokeWidth={3}
            />
          ) : (
            <ArrowRight
              aria-hidden
              className="!size-[14px] md:!size-[16px] block"
              strokeWidth={3}
            />
          )}
        </span>
        <span className="pl-2">{link.title}</span>
      </Link>
    );
  }

  return (
    <Link
      to={link.href}
      className={cn(
        buttonVariants({
          size: "lg",
          rounded: true,
          variant: "secondary-outline",
        }),
        "h-12 text-base md:text-lg no-underline text-inherit",
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {link.title}
      {external ? (
        <ArrowUpRight aria-hidden className="size-4" />
      ) : (
        <ArrowRight aria-hidden className="size-4" />
      )}
    </Link>
  );
}

function ResourceLink({ link }: { link: HubLink }) {
  const external = link.external ?? isExternalHref(link.href);

  return (
    <Link
      to={link.href}
      className="group flex items-center justify-between gap-4 px-2 py-4 rounded-md text-white no-underline transition-colors hover:bg-white/[0.03]"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="flex-1 min-w-0">
        <span className="block text-base md:text-lg font-medium leading-[1.35] tracking-[-0.18px] transition-colors group-hover:text-white">
          {link.title}
        </span>
        {link.description && (
          <span className="mt-1 block text-[13px] md:text-[14px] text-[#ABABBA] leading-[1.5]">
            {link.description}
          </span>
        )}
      </span>
      {external ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      ) : (
        <ChevronRight
          aria-hidden
          className="size-5 shrink-0 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-white"
        />
      )}
    </Link>
  );
}
