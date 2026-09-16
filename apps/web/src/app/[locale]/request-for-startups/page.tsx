import { RequestForStartupsPage } from "./request-for-startups";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <RequestForStartupsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "request-for-startups.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates("/request-for-startups", locale),
  };
}
