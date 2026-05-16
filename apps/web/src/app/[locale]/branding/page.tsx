import { BrandingPage } from "./branding";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    title: t("branding.title"),
  };

  return <BrandingPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "branding.title",
    descriptionKey: "branding.description",
    path: "/branding",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["src/img/branding/solanaLogo.png"],
    },
  };
}
