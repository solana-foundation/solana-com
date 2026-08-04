"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import DevelopersCoursesSection from "@/components/developers/sections/DevelopersCoursesSection/DevelopersCoursesSection";
import DevelopersResourcesSection, {
  DevelopersResourcesSectionProps,
} from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourcesSection";
import DevelopersDocumentsSection from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentsSection";
import DevelopersContentSection from "@/components/developers/sections/DevelopersContentSection/DevelopersContentSection";
import heroImg from "@@/assets/developers/hero-geometry.png";
import { useTranslations } from "next-intl";
import { MessageBubbleDots } from "@boxicons/react/MessageBubbleDots";
import { LatestChangelogVideo } from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersChangelog";

export function DevelopersPage({
  latestChangelogVideo,
  guides,
}: {
  latestChangelogVideo?: LatestChangelogVideo;
  guides?: DevelopersResourcesSectionProps["items"];
}) {
  const t = useTranslations();
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
              <MessageBubbleDots
                width={20}
                height={20}
                pack="filled"
                aria-hidden="true"
              />
            ),
          },
        }}
      />
      <DevelopersCoursesSection /* courses={courses} */ />
      <DevelopersResourcesSection
        items={guides ?? []}
        baseHref={`/docs`}
        translationKey={"guides"}
      />
      <DevelopersDocumentsSection latestVideo={latestChangelogVideo} />
      <DevelopersContentSection />
    </div>
  );
}
