import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NewsCampaign } from "@/lib/news-campaign";

interface CampaignHeroProps {
  campaign: NewsCampaign;
}

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Optional campaign / promo band for the News experience.
 *
 * Intentionally restrained (no decorative gradients or heavy marketing hero
 * styling) so it complements, rather than overwhelms, the editorial lead. It
 * is clearly labeled as a campaign via the eyebrow, supports internal and
 * external CTAs, and degrades cleanly on mobile.
 */
export function CampaignHero({ campaign }: CampaignHeroProps) {
  const { eyebrow, title, description, primaryCta, secondaryCta } = campaign;

  return (
    <section
      aria-label="Campaign promotion"
      data-campaign-id={campaign.id}
      className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
    >
      <div className="rounded-lg border border-border bg-muted/40 p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-balance">
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button asChild size="lg">
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
    </section>
  );
}
