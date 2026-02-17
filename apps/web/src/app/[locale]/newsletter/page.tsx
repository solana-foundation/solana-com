import { NewsletterPage } from "./newsletter";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    signup: t("newsletter.signup"),
    spam: t("newsletter.spam"),
  };

  return <NewsletterPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "titles.newsletter",
    descriptionKey: "titles.newsletter",
    path: "/newsletter",
    locale,
  });
}
