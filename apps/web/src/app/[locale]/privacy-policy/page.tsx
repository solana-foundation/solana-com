import { PrivacyPolicyPage } from "./privacy-policy";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("privacy-policy");

  const sections = [
    "collection",
    "use",
    "sharing",
    "analytics",
    "transfer",
    "choices",
    "california",
    "europe",
    "contact",
  ] as const;

  const translations = {
    heroEyebrow: t("hero.eyebrow"),
    heroHeadline: t("hero.headline"),
    heroBody: t("hero.body"),
    introBody: t.raw("sections.intro") as string,
    sections: sections.map((key) => ({
      key,
      title: t(`sections.${key}.title`),
      body: t.raw(`sections.${key}.body`) as string,
    })),
  };

  return <PrivacyPolicyPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "privacy-policy.meta.seoTitle",
    descriptionKey: "privacy-policy.meta.seoDescription",
    path: "/privacy-policy",
    locale,
  });
}
