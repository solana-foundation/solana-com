import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import RegistrationPage from "@/components/pages/registration/RegistrationPage";
import { getPageMetadata } from "@/app/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.pages" });
  return getPageMetadata(locale, {
    path: "/registration",
    title: t("registration.title"),
    description: t("registration.metadataDescription"),
  });
}

export default async function LocaleRegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <RegistrationPage locale={locale} />;
}
