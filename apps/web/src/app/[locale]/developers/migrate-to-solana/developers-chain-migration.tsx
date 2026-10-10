"use client";

import dynamic from "next/dynamic";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Container } from "@/component-library/container";
import { FeatureHighlight } from "@workspace/ui/landing";
import { useTranslations } from "next-intl";
import {
  CHAIN_SELECTOR,
  CHAIN_SELECTOR_CARDS,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";
import { Code } from "@boxicons/react/Code";
import { FileDetail as FileText } from "@boxicons/react/FileDetail";
import { Youtube } from "@boxicons/react/Youtube";
import { Spanner as Tools } from "@boxicons/react/Spanner";
import {
  AnimatedHeroSection,
  SectionDivider,
} from "./cosmos/cosmos-page-shared";

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
  const blockSpacing = { large: { marginTop: "48px" } }; // used by chain selector

  const chainSelectorCards = CHAIN_SELECTOR_CARDS.map((card, index) => ({
    ...card,
    feature: t(`chainSelector.cards.${index}.feature`),
    body: "",
    eyebrow: t(`chainSelector.cards.${index}.eyebrow`),
    button: {
      ...card.button,
      label: t(`chainSelector.cards.${index}.button.label`),
    },
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
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <div
          id="choose-your-chain"
          className="scroll-mt-24 xl:[&_section]:!px-0 [&_section]:!py-20 [&_[data-slot=feature-card]]:!min-h-[220px] [&_[data-slot=feature-card]]:!p-8 [&_[data-slot=feature-card]_h3]:!text-[2rem] [&_[data-slot=feature-card]_h3]:!leading-[1.2] [&_[data-slot=feature-card]_a]:!rounded-full [&_[data-slot=feature-card]_a]:!border-white/30 [&_[data-slot=feature-card]_a]:!bg-transparent [&_[data-slot=feature-card]_a]:!px-6 [&_[data-slot=feature-card]_a]:!py-3 [&_[data-slot=feature-card]_a]:!text-sm [&_[data-slot=feature-card]_a]:!font-semibold [&_[data-slot=feature-card]_a]:!normal-case [&_[data-slot=feature-card]_a]:!tracking-normal [&_h2]:!text-[32px] md:[&_h2]:!text-[40px] xl:[&_h2]:!text-[64px]"
        >
          <FeatureHighlight
            headingAs={CHAIN_SELECTOR.headingAs}
            eyebrow=""
            headline={t("chainSelector.headline")}
            body=""
            cards={chainSelectorCards}
            buttons={[]}
          />
        </div>
      </ResponsiveBox>

      <SectionDivider />

      {/* Resources — community-style section */}
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
