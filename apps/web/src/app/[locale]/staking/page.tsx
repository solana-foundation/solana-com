import { StakingPage } from "./staking";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import {
  META,
  STAKING_ECONOMICS_ACCORDION_KEYS,
  STAKING_OVERVIEW_ACCORDION_KEYS,
  STAKING_REWARDS_ACCORDION_KEYS,
} from "@/data/staking";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("staking");

  const translations = {
    heroHeadline: t("hero.headline"),
    overview: t.raw("overview") as string,
    overviewSectionHeadline: t("sections.overview.headline"),
    overviewAccordions: STAKING_OVERVIEW_ACCORDION_KEYS.map((item) => ({
      title: t(item.titleKey),
      body: t.raw(item.bodyKey) as string,
    })),
    rewardsSectionHeadline: t("sections.rewards.headline"),
    rewardsAccordions: STAKING_REWARDS_ACCORDION_KEYS.map((item) => ({
      title: t(item.titleKey),
      body: t.raw(item.bodyKey) as string,
    })),
    economicsSectionHeadline: t("sections.economics.headline"),
    economicsAccordions: STAKING_ECONOMICS_ACCORDION_KEYS.map((item) => ({
      title: t(item.titleKey),
      body: t.raw(item.bodyKey) as string,
    })),
  };

  return <StakingPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "staking.meta.seoTitle",
    descriptionKey: "staking.meta.seoDescription",
    path: "/staking",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [META.seoImage],
    },
  };
}
