import { TokenizedEquitiesPage } from "./tokenized-equities";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { META } from "@/data/tokenized-equities";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("tokenized-equities");

  const translations = {
    switchbackEyebrow: t("switchback.eyebrow"),
    switchbackHeadline: t("switchback.headline"),
    switchbackBody: t.raw("switchback.body") as string,
    switchbackButtonLabel: t("switchback.buttonLabel"),
    switchbackPlaceholder: t("switchback.placeholder"),
    switchbackEmailError: t("switchback.emailError"),
    switchbackSubmitError: t("switchback.submitError"),
    switchbackSuccessMessage: t("switchback.successMessage"),
  };

  return <TokenizedEquitiesPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "tokenized-equities.meta.seoTitle",
    descriptionKey: "tokenized-equities.meta.seoDescription",
    path: "/tokenized-equities",
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
