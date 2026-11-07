import type { ReactNode } from "react";
import { getTranslations } from "@workspace/i18n/server";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import { HERE_FOR_PATH } from "./constants";

export default async function HereForSubpage({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  return (
    <PageShell
      contentId="breakpoint-here-for-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: HERE_FOR_PATH,
        ctaLabel: t("nav.map"),
        showMenuButton: true,
      }}
    >
      {children}
      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
