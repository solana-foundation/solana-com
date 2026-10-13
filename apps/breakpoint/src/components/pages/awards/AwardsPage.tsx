import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import { getTranslations } from "@workspace/i18n/server";
import { getApprovedFinalists } from "@/content/awards-finalists";
import {
  getAwardsCampaignStatus,
  getAwardsVotingStatus,
} from "@/lib/awards-campaign";
import AwardsNominations from "./AwardsNominations";
import AwardsVoting from "./AwardsVoting";

const AWARDS_MARQUEE_KEYS = [
  "community",
  "culture",
  "creators",
  "builders",
  "awards",
] as const;

export default async function AwardsPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "breakpoint" });
  const nominationsStatus = getAwardsCampaignStatus();
  const votingStatus = getAwardsVotingStatus();
  const nominationsActive = nominationsStatus !== "closed";
  const finalists = getApprovedFinalists();
  const heroCta = nominationsActive
    ? t("awards.hero.cta")
    : votingStatus === "open" && finalists
      ? t("awards.voting.heroCta")
      : t("awards.voting.viewAwards");

  return (
    <PageShell
      contentId="breakpoint-awards-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: nominationsActive ? "/awards#nominations" : "/awards#voting",
        ctaLabel: heroCta,
        showMenuButton: true,
      }}
    >
      <SubpageHero
        cta={{
          arrowDirection: "down",
          href: nominationsActive ? "#nominations" : "#voting",
          label: heroCta,
        }}
        eyebrow={t("awards.hero.eyebrow")}
        heroImage="awards"
        title={t("awards.hero.title")}
      >
        <p className="max-w-[620px] text-p-large text-white">
          {t(
            nominationsActive
              ? "awards.hero.description"
              : "awards.voting.heroDescription",
          )}
        </p>
      </SubpageHero>
      <Marquee
        highlightClassName="text-purple"
        highlights={AWARDS_MARQUEE_KEYS.map((key) =>
          t(`awards.marquee.${key}`),
        )}
      />
      {nominationsActive ? (
        <AwardsNominations />
      ) : (
        <AwardsVoting finalists={finalists} initialStatus={votingStatus} />
      )}
      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
