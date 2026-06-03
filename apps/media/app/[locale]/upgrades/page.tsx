import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

export const revalidate = 300;

type BadgeColor = "green" | "yellow" | "red" | "purple";
type BadgeVariant = "badge" | "text";

type UpgradeBadge = {
  text: string;
  color: BadgeColor;
  variant: BadgeVariant;
};

type UpgradeMetric = {
  value: string;
  label: string;
};

type UpgradeCard = {
  slug: string;
  title: string;
  description: string;
  subtitle: string;
  publishedAt: string | null;
  badges: UpgradeBadge[];
  metrics: UpgradeMetric[];
};

const badgeColorMap: Record<BadgeColor, string> = {
  green: "border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195]",
  yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeBadgeColor(value: unknown): BadgeColor {
  return value === "yellow" ||
    value === "red" ||
    value === "purple" ||
    value === "green"
    ? value
    : "green";
}

function normalizeBadgeVariant(value: unknown): BadgeVariant {
  return value === "text" ? "text" : "badge";
}

function normalizeBadges(value: unknown): UpgradeBadge[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const text = toStringValue(item.text);
      if (!text) {
        return null;
      }

      return {
        text,
        color: normalizeBadgeColor(item.color),
        variant: normalizeBadgeVariant(item.variant),
      };
    })
    .filter((item): item is UpgradeBadge => item !== null);
}

function normalizeMetrics(value: unknown): UpgradeMetric[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const metric = {
        value: toStringValue(item.value),
        label: toStringValue(item.label),
      };

      return metric.value && metric.label ? metric : null;
    })
    .filter((item): item is UpgradeMetric => item !== null);
}

function formatPublishedAt(value: string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

async function getPublishedUpgrades(): Promise<UpgradeCard[]> {
  const slugs = await reader.collections.upgrades.list();
  const upgrades = await Promise.all(
    slugs.map(async (slug: string) => {
      const entry = (await reader.collections.upgrades.read(slug)) as Record<
        string,
        unknown
      > | null;

      if (!entry || entry.status !== "published") {
        return null;
      }

      return {
        slug,
        title: toStringValue(entry.title),
        description: toStringValue(entry.description),
        subtitle: toStringValue(entry.subtitle),
        publishedAt: toStringValue(entry.publishedAt) || null,
        badges: normalizeBadges(entry.badges),
        metrics: normalizeMetrics(entry.metrics),
      };
    }),
  );

  return upgrades
    .filter((upgrade): upgrade is UpgradeCard => upgrade !== null)
    .sort((left, right) => {
      const leftDate = left.publishedAt
        ? new Date(left.publishedAt).getTime()
        : 0;
      const rightDate = right.publishedAt
        ? new Date(right.publishedAt).getTime()
        : 0;

      return rightDate - leftDate;
    });
}

export function generateMetadata(): Metadata {
  const title = "Solana Upgrades";
  const description =
    "Track Solana network upgrades, validator actions, protocol changes, and performance improvements.";
  const canonicalUrl = `${config.publicUrl}/upgrades`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: config.siteMetadata.title,
      images: [config.siteMetadata.socialShare],
    },
    twitter: {
      card: "summary_large_image",
      creator: `@${config.social.twitter.name}`,
      title,
      description,
      images: [config.siteMetadata.socialShare],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function UpgradesPage() {
  const upgrades = await getPublishedUpgrades();

  return (
    <section className="relative min-h-screen bg-black text-left text-white">
      <div className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px]">
        <div className="flex max-w-5xl flex-col py-[64px] md:py-[112px] xl:py-[160px]">
          <span className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[#14F195]">
            Network upgrade notifications
          </span>
          <h1 className="m-0 text-[40px] font-medium leading-[1.1] tracking-[-1px] md:text-[56px] md:tracking-[-1.4px] xl:text-[88px] xl:tracking-[-2px]">
            Solana Upgrades
          </h1>
          <p className="mb-0 mt-[12px] max-w-2xl text-lg leading-[1.33] tracking-[-0.18px] text-[#ABABBA] md:text-2xl md:tracking-[-0.24px] xl:mt-[24px]">
            Track network changes, validator actions, client support, and
            rollout status for Solana protocol and performance upgrades.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-[20px] pb-[64px] md:px-[32px] md:pb-[112px] xl:px-[40px] xl:pb-[160px]">
        <div className="border-t border-white/10 pt-8 md:pt-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm text-black">
              All
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              Validator actions
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              Protocol changes
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              Performance
            </span>
          </div>

          {upgrades.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {upgrades.map((upgrade) => {
                const publishedAt = formatPublishedAt(upgrade.publishedAt);

                return (
                  <Link
                    key={upgrade.slug}
                    href={`/upgrades/${upgrade.slug}`}
                    className="group flex min-h-[360px] flex-col justify-between border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06] md:p-7"
                  >
                    <div>
                      <div className="mb-5 flex flex-wrap items-center gap-2">
                        {upgrade.badges.length > 0 ? (
                          upgrade.badges.map((badge, index) =>
                            badge.variant === "text" ? (
                              <span
                                key={`${upgrade.slug}-${badge.text}-${index}`}
                                className="text-xs text-white/50"
                              >
                                {badge.text}
                              </span>
                            ) : (
                              <span
                                key={`${upgrade.slug}-${badge.text}-${index}`}
                                className={cn(
                                  "rounded-full border px-3 py-1 text-xs font-medium",
                                  badgeColorMap[badge.color],
                                )}
                              >
                                {badge.text}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                            Published
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-semibold tracking-[-0.48px] md:text-3xl">
                        {upgrade.title}
                      </h2>
                      {(upgrade.subtitle || upgrade.description) && (
                        <p className="mt-4 line-clamp-4 text-base leading-7 text-[#ABABBA]">
                          {upgrade.subtitle || upgrade.description}
                        </p>
                      )}

                      {upgrade.metrics.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {upgrade.metrics.slice(0, 2).map((metric) => (
                            <div
                              key={`${upgrade.slug}-${metric.value}-${metric.label}`}
                              className="border border-white/10 bg-black/30 p-4"
                            >
                              <div className="text-2xl font-semibold text-white">
                                {metric.value}
                              </div>
                              <div className="mt-1 text-xs leading-5 text-white/55">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                      <span className="text-sm text-white/55">
                        {publishedAt ?? "Upgrade"}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                        View details
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-lg tracking-[-0.18px] text-white/60">
              No published upgrades found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
