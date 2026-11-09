import { Outlook2023Page } from "./outlook-2023";
import { getIndexMetadata } from "@/app/metadata";
import { ArchiveNotice } from "@/components/archive-notice";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations("archiveNotice");
  return (
    <>
      <ArchiveNotice
        label={t("label")}
        period="2022"
        description={t("outlook2023")}
        href="/reports"
        linkLabel={t("reportsLink")}
      />
      <Outlook2023Page />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const metadata = await getIndexMetadata({
    titleKey: "ecdr.title",
    descriptionKey: "ecdr.description",
    path: "/2023outlook",
    locale,
  });
  return { ...metadata, robots: { index: false, follow: true } };
}
