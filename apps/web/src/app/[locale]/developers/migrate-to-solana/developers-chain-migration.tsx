"use client";

import dynamic from "next/dynamic";
import { Container } from "@/component-library/container";
import { useTranslations } from "next-intl";
import { SECONDARY_CARD_DECK } from "@/data/developers/evm-to-svm";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { Code } from "@boxicons/react/Code";
import { FileDetail as FileText } from "@boxicons/react/FileDetail";
import { Youtube } from "@boxicons/react/Youtube";
import { Spanner as Tools } from "@boxicons/react/Spanner";
import {
  AnimatedHeroSection,
  SectionDivider,
} from "./cosmos/cosmos-page-shared";
import { MIGRATION_NAV } from "./components/migration-docs-layout";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

const EarthAnimation = dynamic(
  () =>
    import("@/components/index/earth-animation").then(
      (mod) => mod.EarthAnimation,
    ),
  { ssr: false },
);

function ChainCard({
  title,
  body,
  url,
  ctaLabel,
  guides,
}: {
  title: string;
  body: string;
  url: string;
  ctaLabel: string;
  guides: readonly { url: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-8 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div>
        <h3 className="font-brand text-[2rem] font-medium leading-[1.2] text-white mb-3">
          {title}
        </h3>
        <p className="nd-body-m text-[#ABABBA] mb-0">{body}</p>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {guides.map((guide) => (
          <li key={guide.url}>
            <a
              href={guide.url}
              className="inline-block rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60 no-underline transition-colors hover:border-white/30 hover:text-white"
            >
              {guide.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={url}
        className="group mt-auto inline-flex items-center gap-2 self-start text-sm font-semibold text-white no-underline"
      >
        {ctaLabel}
        <ChevronRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
    </div>
  );
}

function ResourceCard({
  heading,
  body,
  url,
  Icon,
}: {
  heading: string;
  body: string;
  url: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={url}
      className="flex flex-col items-start gap-12 px-6 py-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit no-underline"
    >
      <div className="shrink-0 grow-0 brightness-0 invert">
        <Icon className="block w-10 h-10" />
      </div>
      <div>
        <h3 className="font-medium nd-body-xl text-white mb-0">{heading}</h3>
        <p className="nd-body-m text-nd-mid-em-text mt-1 mb-0">{body}</p>
      </div>
    </a>
  );
}

const RESOURCE_ICONS = [Code, FileText, Youtube, Tools];

export function DevelopersChainMigrationPage() {
  const t = useTranslations("developers-evm-to-svm");

  const chainCards = MIGRATION_NAV.map((group, index) => ({
    title: group.label,
    body: t(`chainSelector.cards.${index}.body`),
    url: group.url,
    ctaLabel: t(`chainSelector.cards.${index}.button.label`),
    // The Ethereum overview is the hub itself; don't list it as a guide.
    guides: group.guides.filter((guide) => guide.url !== group.url),
  }));

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    heading: t(`secondaryCardDeck.cards.${index}.heading`),
    body: t(`secondaryCardDeck.cards.${index}.body`),
    url: card.callToAction.url,
    Icon: RESOURCE_ICONS[index],
  }));

  return (
    <>
      {/* Hero with animated background + ribbon graphic */}
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            label: "View Guides",
            url: "#choose-your-chain",
            hierarchy: "outline",
          },
        ]}
      />

      {/* Chain selector */}
      <section
        id="choose-your-chain"
        className="scroll-mt-24 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-24"
      >
        <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-16">
          <div>
            <h2 className="font-brand text-[32px] md:text-[40px] xl:text-[64px] font-medium leading-[1.05] tracking-[-0.02em] text-white mb-4">
              {t("chainSelector.headline")}
            </h2>
            <p className="nd-body-m text-[#ABABBA] mb-0">
              {t("chainSelector.body")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chainCards.map((card) => (
              <ChainCard key={card.url} {...card} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Resources: community-style section */}
      <section
        id="resources"
        className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0 px-2 scroll-mt-24"
      >
        <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative">
          <UnicornScene
            projectId="migration-resources"
            className="!absolute inset-0 z-0"
            jsonFilePath="/src/img/index/community-bg.json"
            width="100%"
            height="101%"
            scale={0.8}
            dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
            fps={30}
            lazyLoad={true}
            production={true}
          />
          <Container className="pt-[120px] pb-[120px] flex flex-col justify-between">
            <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#0B0A10] via-[#0B0A10] via-19% to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="nd-heading-l">
                {t("chainMigrationResources.headline")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-10 relative">
              {secondaryCards.map((card) => (
                <ResourceCard key={card.url} {...card} />
              ))}
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
