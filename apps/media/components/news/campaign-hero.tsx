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

/** Take the event label from an eyebrow like "Solana Breakpoint 2026 | Campaign". */
function eyebrowLabel(eyebrow: string): string {
  return eyebrow.split("|")[0]?.trim() || eyebrow;
}

/**
 * Featured-event promo band for the News experience.
 *
 * A quiet, high-end poster: the campaign artwork anchors one side and a single
 * restrained eyebrow names the event. Whitespace and typography carry it — no
 * glow, no badge, no image scrim.
 */
export function CampaignHero({ campaign }: CampaignHeroProps) {
  const { eyebrow, title, description, primaryCta, secondaryCta } = campaign;
  const label = eyebrowLabel(eyebrow);
  const art = CAMPAIGN_ART[campaign.id];

  return (
    <section
      aria-label="Featured event"
      data-campaign-id={campaign.id}
      className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="grid lg:grid-cols-[1fr_minmax(0,40%)]">
          {/* Content */}
          <div className="order-2 flex flex-col items-start gap-6 p-8 md:p-12 lg:order-1 lg:py-16 lg:pr-8">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              {label}
            </span>

            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
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
                <Button asChild size="lg" variant="secondary">
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
