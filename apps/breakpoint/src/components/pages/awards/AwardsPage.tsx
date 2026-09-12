import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import { getTranslations } from "@workspace/i18n/server";
import AwardsNominations from "./AwardsNominations";

const AWARDS_MARQUEE_KEYS = [
  "community",
  "culture",
  "creators",
  "builders",
  "awards",
] as const;

export default async function AwardsPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "breakpoint" });

  return (
    <PageShell
      contentId="breakpoint-awards-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: t("menu.items.register"),
        showMenuButton: true,
      }}
    >
      <SubpageHero
        eyebrow={t("awards.hero.eyebrow")}
        heroImage="awards"
        title={t("awards.hero.title")}
      >
        <p className="max-w-[620px] text-p-large text-white">
          {t("awards.hero.description")}
        </p>
      </SubpageHero>
      <Marquee
        highlightClassName="text-purple"
        highlights={AWARDS_MARQUEE_KEYS.map((key) =>
          t(`awards.marquee.${key}`),
        )}
      />
      <AwardsNominations />
      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
