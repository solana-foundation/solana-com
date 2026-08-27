import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import { reader } from "@/lib/reader";
import { upgradesListingMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildUpgradeCollectionJsonLd } from "@/lib/content-structured-data";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";
import { isUpgradeStage } from "@/lib/upgrades/stage";
import {
  groupUpgradesByRelease,
  type ReleaseInput,
  type UpgradeListItem,
} from "@/lib/upgrades/group-by-release";
import UpgradesClientPage from "./client-page";

export const revalidate = 300;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeMetrics(value: unknown): UpgradeListItem["metrics"] {
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
    .filter(
      (item): item is UpgradeListItem["metrics"][number] => item !== null,
    );
}

async function getPublishedUpgrades(): Promise<UpgradeListItem[]> {
  const slugs = await reader.collections.upgrades.list();
  const upgrades = await Promise.all(
    slugs.map(async (slug: string) => {
      const entry = (await reader.collections.upgrades.read(slug)) as Record<
        string,
        unknown
      > | null;

      if (!isPublishedUpgrade(entry)) {
        return null;
      }

      return {
        slug,
        title: toStringValue(entry.title),
        description: toStringValue(entry.description),
        subtitle: toStringValue(entry.subtitle),
        publishedAt: toStringValue(entry.publishedAt) || null,
        stage: isUpgradeStage(entry.stage) ? entry.stage : "in_development",
        metrics: normalizeMetrics(entry.metrics),
        release: toStringValue(entry.release) || null,
        order: typeof entry.order === "number" ? entry.order : null,
      } satisfies UpgradeListItem;
    }),
  );

  return upgrades.filter(
    (upgrade): upgrade is UpgradeListItem => upgrade !== null,
  );
}

async function getReleases(): Promise<ReleaseInput[]> {
  const slugs = await reader.collections.releases.list();
  const releases = await Promise.all(
    slugs.map(async (slug: string) => {
      const entry = (await reader.collections.releases.read(slug)) as Record<
        string,
        unknown
      > | null;

      if (!entry) {
        return null;
      }

      return {
        slug,
        name: toStringValue(entry.name) || slug,
        status: entry.status === "shipped" ? "shipped" : "planned",
        expectedDate: toStringValue(entry.expectedDate) || null,
        overview: toStringValue(entry.overview) || null,
      } satisfies ReleaseInput;
    }),
  );

  return releases.filter(
    (release): release is ReleaseInput => release !== null,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return upgradesListingMetadata(locale);
}

export default async function UpgradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "upgrades" });
  const [upgrades, releases] = await Promise.all([
    getPublishedUpgrades(),
    getReleases(),
  ]);
  const groups = groupUpgradesByRelease(upgrades, releases);

  const structuredData = buildUpgradeCollectionJsonLd({
    upgrades: [...upgrades]
      .sort((left, right) => {
        const leftDate = left.publishedAt
          ? new Date(left.publishedAt).getTime()
          : 0;
        const rightDate = right.publishedAt
          ? new Date(right.publishedAt).getTime()
          : 0;

        return rightDate - leftDate;
      })
      .map((upgrade) => ({
        slug: upgrade.slug,
        title: upgrade.title,
        description: upgrade.description || upgrade.subtitle,
        publishedAt: upgrade.publishedAt,
      })),
    locale,
    title: t("metadata.title"),
    description: t("metadata.description"),
  });

  return (
    <section className="relative min-h-screen bg-black text-left text-white">
      <JsonLd data={structuredData} />
      <div className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px]">
        <div className="flex max-w-3xl flex-col gap-2 py-8 md:py-10">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#14F195]">
            {t("listing.kicker")}
          </span>
          <h1 className="m-0 text-[28px] font-medium leading-[1.15] tracking-[-0.5px] md:text-[34px] md:tracking-[-0.6px]">
            {t("listing.title")}
          </h1>
          <p className="m-0 max-w-2xl text-base leading-[1.4] text-[#ABABBA] md:text-lg">
            {t("listing.description")}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-[20px] pb-[64px] md:px-[32px] md:pb-[112px] xl:px-[40px] xl:pb-[160px]">
        <div className="border-t border-white/10 pt-8 md:pt-10">
          <UpgradesClientPage groups={groups} />
        </div>
      </div>
    </section>
  );
}
