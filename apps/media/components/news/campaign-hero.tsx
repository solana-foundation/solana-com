import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NewsCampaign } from "@/lib/news-campaign";

interface CampaignHeroProps {
  campaign: NewsCampaign;
}

interface CampaignArt {
  src: string;
  alt: string;
}

/**
 * Promo artwork keyed by campaign id. Kept local to the component so the
 * campaign data model stays presentation-agnostic; a campaign without art
 * falls back to a refined text-only band.
 */
const CAMPAIGN_ART: Record<string, CampaignArt> = {
  "breakpoint-2026": {
    src: "/uploads/campaigns/breakpoint-2026-promo.webp",
    alt: "Solana Breakpoint 2026",
  },
};

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Split an eyebrow like "Solana Breakpoint 2026 | Campaign" into label + disclosure. */
function parseEyebrow(eyebrow: string): { label: string; disclosure: string } {
  const [label, ...rest] = eyebrow.split("|").map((part) => part.trim());
  return {
    label: label || eyebrow,
    disclosure: rest.join(" · ") || "Promoted",
  };
}

/**
 * Featured-event promo band for the News experience.
 *
 * Designed as a poster, not a notice card: the campaign artwork anchors one
 * side and its accent light bleeds across the band via an ambient glow, so the
 * promo reads as premium and unmistakably distinct from the editorial lead. A
 * single green pulse marks it as the live featured event; the "| Campaign"
 * disclosure is surfaced as a chip so the promotion is clearly labeled.
 */
export function CampaignHero({ campaign }: CampaignHeroProps) {
  const { eyebrow, title, description, primaryCta, secondaryCta } = campaign;
  const { label, disclosure } = parseEyebrow(eyebrow);
  const art = CAMPAIGN_ART[campaign.id];

  return (
    <section
      aria-label="Featured event"
      data-campaign-id={campaign.id}
      className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        {/* One restrained luminous accent, toward the artwork seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_120%_at_92%_10%,rgba(153,69,255,0.16),transparent_55%)]"
        />

        <div className="relative grid lg:grid-cols-[1fr_minmax(0,40%)]">
          {/* Content */}
          <div className="order-2 flex flex-col gap-5 p-6 md:p-10 lg:order-1 lg:py-12 lg:pr-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-primary"
                />
                {label}
              </span>
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {disclosure}
              </span>
            </div>

            <h2 className="text-balance text-3xl font-bold leading-[1.04] tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>

            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="font-semibold">
                <Link
                  href={primaryCta.url}
                  {...(isExternal(primaryCta.url)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span>{primaryCta.label}</span>
                  {isExternal(primaryCta.url) && (
                    <ArrowUpRight className="size-4" />
                  )}
                </Link>
              </Button>
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="border border-white/20 bg-white/5 text-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <Link
                    href={secondaryCta.url}
                    {...(isExternal(secondaryCta.url)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span>{secondaryCta.label}</span>
                    {isExternal(secondaryCta.url) && (
                      <ArrowUpRight className="size-4" />
                    )}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Artwork */}
          {art && (
            <div className="relative order-1 min-h-[200px] overflow-hidden md:min-h-[240px] lg:order-2 lg:min-h-full">
              <Image
                src={art.src}
                alt={art.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              {/* Blend the artwork into the charcoal panel: fade up on mobile,
                  fade left on desktop. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-muted via-muted/30 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-muted/10 lg:to-muted"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
