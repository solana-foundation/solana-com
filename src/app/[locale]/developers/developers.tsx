"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import DevelopersCoursesSection from "@/components/developers/sections/DevelopersCoursesSection/DevelopersCoursesSection";
import DevelopersResourcesSection from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourcesSection";
import DevelopersDocumentsSection from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentsSection";
import DevelopersContentSection from "@/components/developers/sections/DevelopersContentSection/DevelopersContentSection";
import heroImg from "@@/assets/developers/hero-geometry.png";
import { useTranslation } from "next-i18next";
import StackExchangeIcon from "@@/assets/developers/stackexchange.inline.svg";

export function DevelopersPage({ latestChangelogVideo, guides, resources }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden">
      <DevelopersHeroSection
        title={t("developers.hero.title")}
        description={t("developers.hero.description")}
        img={{
          src: heroImg,
          // alt: "",
        }}
        buttons={{
          cta: {
            label: t("developers.hero.build"),
            href: "/docs/intro/quick-start",
          },
          secondary: {
            label: t("developers.hero.support"),
            href: "https://solana.stackexchange.com",
            icon: (
              <StackExchangeIcon width={16} height={20} fill="currentColor" />
            ),
          },
        }}
      />
      <DevelopersCoursesSection /* courses={courses} */ />
      <DevelopersResourcesSection
        items={guides}
        baseHref={`/developers/guides`}
        translationKey={"guides"}
      />
      <DevelopersResourcesSection
        items={resources}
        baseHref={`/developers/resources`}
        translationKey={"resources"}
      />
      <DevelopersDocumentsSection latestVideo={latestChangelogVideo} />
      <DevelopersContentSection />
    </div>
  );
}
