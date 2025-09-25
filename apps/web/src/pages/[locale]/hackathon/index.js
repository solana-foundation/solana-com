import { useTranslations } from "next-intl";
import { withLocales } from "@workspace/i18n/routing";
import { useRef, useCallback } from "react";

import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import HackathonHeroSection from "@/components/hackathon/sections/HackathonHeroSection/HackathonHeroSection";
import HackathonOverviewSection from "@/components/hackathon/sections/HackathonOverviewSection/HackathonOverviewSection";
import HackathonPreviousSponsorsSection from "@/components/hackathon/sections/HackathonPreviousSponsorsSection/HackathonPreviousSponsorsSection";
import HackathonPreviousWinnersSection from "@/components/hackathon/sections/HackathonPreviousWinnersSection/HackathonPreviousWinnersSection";
import HackathonPreviousHackathonsSection from "@/components/hackathon/sections/HackathonPreviousHackathonsSection/HackathonPreviousHackathonsSection";

export default function HackathonIndex() {
  const t = useTranslations();
  const newsletterSignUpRef = useRef();

  const focusOnNewsletterSignUp = useCallback(() => {
    window.scrollTo(0, 0);

    if (newsletterSignUpRef.current) {
      newsletterSignUpRef.current.focus();
    }
  }, []);

  return (
    <Layout>
      <HTMLHead
        title={t("hackathon.index.title")}
        description={t("hackathon.index.description")}
      />
      <HackathonHeroSection newsletterInputRef={newsletterSignUpRef} />
      <HackathonPreviousWinnersSection />
      <HackathonPreviousSponsorsSection />
      <HackathonPreviousHackathonsSection />
      <HackathonOverviewSection onGetNotified={focusOnNewsletterSignUp} />
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
