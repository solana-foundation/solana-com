import { TosPage } from "./tos";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("tos");

  const translations = {
    heroHeadline: t("hero.headline"),
    content: t.raw("content") as string,
  };

  return <TosPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "tos.meta.seoTitle",
    descriptionKey: "tos.meta.seoDescription",
    path: "/tos",
    locale,
  });
}
