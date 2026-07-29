import { DeveloperPortal } from "./developer-portal";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page() {
  const t = await getTranslations("developerPortal");

  return (
    <DeveloperPortal
      copy={{
        hero: {
          eyebrow: t("hero.eyebrow"),
          title: t("hero.title"),
          description: t("hero.description"),
          primaryCta: t("hero.primaryCta"),
          secondaryCta: t("hero.secondaryCta"),
        },
        capitalMarkets: {
          eyebrow: t("capitalMarkets.eyebrow"),
          title: t("capitalMarkets.title"),
          description: t("capitalMarkets.description"),
          cta: t("capitalMarkets.cta"),
        },
        speed: {
          eyebrow: t("speed.eyebrow"),
          title: t("speed.title"),
          description: t("speed.description"),
          cta: t("speed.cta"),
        },
        ecosystem: {
          eyebrow: t("ecosystem.eyebrow"),
          title: t("ecosystem.title"),
          description: t("ecosystem.description"),
          cta: t("ecosystem.cta"),
        },
        examples: {
          eyebrow: t("examples.eyebrow"),
          title: t("examples.title"),
          description: t("examples.description"),
          cta: t("examples.cta"),
        },
        diagrams: {
          capitalMarkets: t("diagrams.capitalMarkets"),
          speed: t("diagrams.speed"),
          ecosystem: t("diagrams.ecosystem"),
        },
      }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developerPortal.meta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates("/developers", locale),
  };
}
