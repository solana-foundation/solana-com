import { CommunityReport2024NewsletterSignUpPage } from "./community-report-2024-newsletter-sign-up";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("community-report-2024-newsletter-sign-up");

  const translations = {
    switchbackEyebrow: t("switchback.eyebrow"),
    switchbackHeadline: t("switchback.headline"),
    switchbackBody: t.raw("switchback.body") as string,
    switchbackPlaceholder: t("switchback.placeholder"),
    switchbackEmailError: t("switchback.emailError"),
    switchbackSubmitError: t("switchback.submitError"),
    switchbackSuccessMessage: t("switchback.successMessage"),
  };

  return (
    <CommunityReport2024NewsletterSignUpPage translations={translations} />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "community-report-2024-newsletter-sign-up.meta.seoTitle",
    descriptionKey:
      "community-report-2024-newsletter-sign-up.meta.seoDescription",
    path: "/community/report-2024-newsletter-sign-up",
    locale,
  });
}
