import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@workspace/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleAgendaPage({ params }: PageProps) {
  const { locale } = await params;

  permanentRedirect(
    locale === defaultLocale ? "/schedule" : `/${locale}/schedule`,
  );
}
