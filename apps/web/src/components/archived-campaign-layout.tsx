import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ArchiveNotice } from "./archive-notice";

export const archivedCampaignMetadata: Metadata = {
  robots: { index: false, follow: true },
};

export async function ArchivedCampaignLayout({
  children,
  period,
  noticeKey,
}: {
  children: ReactNode;
  period: string;
  noticeKey: string;
}) {
  const t = await getTranslations("archiveNotice");
  return (
    <>
      <ArchiveNotice
        label={t("label")}
        period={period}
        description={t(noticeKey)}
      />
      {children}
    </>
  );
}
