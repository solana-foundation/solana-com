import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { isExternalUrl } from "@/lib/external-url";
import type { NewsCampaign } from "@/lib/news-campaign";

interface CampaignRailItemProps {
  campaign: NewsCampaign;
}

/**
 * Compact campaign entry for the "More top stories" rail on the news front.
 * Mirrors the rail's story rows (label / title / meta line) so the campaign
 * reads as one more story; the CTA line and external-link arrow are the only
 * promo signals. All copy comes from packages/i18n under
 * `news.campaigns.<id>`, same as the full CampaignHero.
 */
export function CampaignRailItem({ campaign }: CampaignRailItemProps) {
  const t = useTranslations(`news.campaigns.${campaign.id}`);
  const external = isExternalUrl(campaign.primaryCtaUrl);

  return (
    <li data-campaign-id={campaign.id}>
      <Link
        href={campaign.primaryCtaUrl}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex flex-col gap-1.5 py-4"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </span>
        <h3 className="text-base font-semibold leading-snug tracking-tight group-hover:underline md:text-lg">
          {t("title")}
        </h3>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          {t("primaryCta")}
          {external && <ArrowUpRight aria-hidden className="size-3.5" />}
        </span>
      </Link>
    </li>
  );
}
