import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NewsCampaign } from "@/lib/news-campaign";

interface CampaignHeroProps {
  campaign: NewsCampaign;
}

/**
 * Promo artwork keyed by campaign id. Kept local to the component so the
 * campaign data model stays presentation-agnostic; a campaign without art
 * falls back to a refined text-only band. Alt text lives with the rest of the
 * campaign copy in packages/i18n under `news.campaigns.<id>.imageAlt`.
 */
const CAMPAIGN_ART: Record<string, string> = {
  "breakpoint-2026": "/uploads/campaigns/breakpoint-2026-promo.webp",
};

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Featured-event promo band for the News experience.
 *
 * A quiet, high-end poster: the campaign artwork anchors one side and a single
 * restrained eyebrow names the event. Whitespace and typography carry it — no
 * glow, no badge, no image scrim. All copy comes from packages/i18n under
 * `news.campaigns.<id>`; the campaign config only carries structure and URLs.
 */
export function CampaignHero({ campaign }: CampaignHeroProps) {
  const t = useTranslations(`news.campaigns.${campaign.id}`);
  const tHero = useTranslations("news.campaignHero");
  const { primaryCtaUrl, secondaryCtaUrl } = campaign;
  const artSrc = CAMPAIGN_ART[campaign.id];

  return (
    <section
      aria-label={tHero("regionLabel")}
      data-campaign-id={campaign.id}
      className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        {/* Two columns only when there is artwork; otherwise a full-width
            text-only band (avoids a dead 40% column on desktop). */}
        <div
          className={`grid${artSrc ? " lg:grid-cols-[1fr_minmax(0,40%)]" : ""}`}
        >
          {/* Content */}
          <div className="order-2 flex flex-col items-start gap-6 p-8 md:p-12 lg:order-1 lg:py-16 lg:pr-8">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              {t("eyebrow")}
            </span>

            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl lg:text-6xl">
              {t("title")}
            </h2>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="min-h-11 font-semibold">
                <Link
                  href={primaryCtaUrl}
                  {...(isExternal(primaryCtaUrl)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span>{t("primaryCta")}</span>
                  {isExternal(primaryCtaUrl) && (
                    <ArrowUpRight aria-hidden className="size-4" />
                  )}
                </Link>
              </Button>
              {secondaryCtaUrl && (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="min-h-11"
                >
                  <Link
                    href={secondaryCtaUrl}
                    {...(isExternal(secondaryCtaUrl)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span>{t("secondaryCta")}</span>
                    {isExternal(secondaryCtaUrl) && (
                      <ArrowUpRight aria-hidden className="size-4" />
                    )}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Artwork */}
          {artSrc && (
            <div className="relative order-1 min-h-[200px] overflow-hidden md:min-h-[240px] lg:order-2 lg:min-h-full">
              <Image
                src={artSrc}
                alt={t("imageAlt")}
                fill
                priority
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
