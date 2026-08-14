import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import {
  UPGRADES_SEO_DESCRIPTION,
  UPGRADES_SEO_TITLE,
  upgradesListingMetadata,
} from "@/lib/metadata";
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
  const [upgrades, releases] = await Promise.all([
    getPublishedUpgrades(),
    getReleases(),
  ]);
  const groups = groupUpgradesByRelease(upgrades, releases);

  const structuredData = buildUpgradeCollectionJsonLd({
    upgrades: upgrades.map((upgrade) => ({
      slug: upgrade.slug,
      title: upgrade.title,
      description: upgrade.description || upgrade.subtitle,
      publishedAt: upgrade.publishedAt,
    })),
    locale,
    title: UPGRADES_SEO_TITLE,
    description: UPGRADES_SEO_DESCRIPTION,
  });

  return (
    <section className="relative min-h-screen bg-black text-left text-white">
      <JsonLd data={structuredData} />
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
          <UpgradesClientPage groups={groups} />
        </div>
      </div>
    </section>
  );
}
