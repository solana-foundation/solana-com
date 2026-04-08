"use client";

import dynamic from "next/dynamic";
import type { ComponentProps, ComponentType } from "react";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Container } from "@/component-library/container";
import { FeatureHighlight } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  CHAIN_SELECTOR,
  CHAIN_SELECTOR_CARDS,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";
import Code from "@@/public/src/img/icons/Code.inline.svg";
import FileText from "@@/public/src/img/icons/FileText.inline.svg";
import Youtube from "@@/public/src/img/icons/youtube.inline.svg";
import Tools from "@@/public/src/img/icons/Tools.inline.svg";

const FeatureHighlightComponent = FeatureHighlight as unknown as ComponentType<
  ComponentProps<typeof FeatureHighlight>
>;

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

function SectionDivider() {
  return (
    <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-my-12">
      <div className="tw-border-t tw-border-white/10" />
    </div>
  );
}

type HeroButton = {
  label: string;
  url: string;
  hierarchy: "primary" | "outline";
};

function AnimatedHeroSection({
  eyebrow,
  headline,
  body,
  buttons,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  buttons: HeroButton[];
}) {
  return (
    <section className="relative overflow-hidden bg-black border-b border-white/10">
      {/* Aurora animated background — same scene as /skills */}
      <UnicornScene
        className="!absolute inset-0 z-0"
        jsonFilePath="/src/img/solutions/icm/hero-bg.json"
        width="100%"
        height="100%"
        scale={1}
        dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
        fps={30}
        lazyLoad={true}
        production={true}
      />

      {/* Hero copy */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-16 md:py-28 xl:py-40 w-full">
        <div className="flex flex-col gap-6 max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[40px] md:text-[56px] xl:text-[88px] font-brand font-medium text-white leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px] mb-0">
            {headline}
          </h1>
          <div
            className="text-[#ABABBA] text-lg md:text-2xl text-pretty leading-[1.33] tracking-[-0.36px] md:tracking-[-0.48px] mb-0 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {buttons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  className={[
                    "inline-flex items-center px-6 py-3 rounded-full text-sm font-brand font-semibold no-underline transition-opacity hover:opacity-90",
                    btn.hierarchy === "primary"
                      ? "tw-bg-nd-cta tw-text-nd-on-cta-high-em-text"
                      : "border border-white/30 text-white bg-transparent",
                  ].join(" ")}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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
          className="chain-selector-override tw-scroll-mt-24"
        >
          <FeatureHighlightComponent
            headingAs={CHAIN_SELECTOR.headingAs}
            color={CHAIN_SELECTOR.color}
            eyebrow={t("chainSelector.eyebrow")}
            headline={t("chainSelector.headline")}
            body={t("chainSelector.body")}
            cards={chainSelectorCards}
            buttons={[]}
          />
        </div>
      </ResponsiveBox>

      <style jsx global>{`
        .chain-selector-override section,
        .chain-selector-override section > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .chain-selector-override section {
          padding-top: 80px !important;
          padding-bottom: 80px !important;
        }
        .chain-selector-override .tw-glass-card {
          min-height: 220px !important;
          padding: 2rem !important;
        }
        .chain-selector-override h2 {
          font-size: 32px !important;
          line-height: 1.25 !important;
          letter-spacing: -1.28px !important;
        }
        @media (min-width: 768px) {
          .chain-selector-override h2 {
            font-size: 40px !important;
            line-height: 1.1 !important;
            letter-spacing: -1.6px !important;
          }
        }
        @media (min-width: 1280px) {
          .chain-selector-override h2 {
            font-size: 64px !important;
            line-height: 1.125 !important;
            letter-spacing: -2.56px !important;
          }
        }
      `}</style>

      {/* Resources — community-style section */}
      <section
        id="resources"
        className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0 px-2 scroll-mt-24"
      >
        <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative transform-gpu">
          <UnicornScene
            projectId="migration-resources"
            className="!absolute inset-0 z-0"
            jsonFilePath="/src/img/index/community-bg.json"
            width="100%"
            height="101%"
            scale={1}
            dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
            fps={30}
            lazyLoad={true}
            production={true}
          />
          <Container className="pt-10 pb-[120px] flex flex-col justify-between">
            <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#0B0A10] via-[#0B0A10] via-19% to-transparent pointer-events-none" />
            <div className="xl:flex xl:justify-between xl:items-center relative">
              <h2 className="nd-heading-l xl:max-w-[50%]">
                {t("chainMigrationResources.headline")}
              </h2>
              <p className="nd-body-xl max-xl:mt-3 xl:py-3 xl:pl-6 xl:max-w-[40%] relative xl:before:absolute xl:before:top-0 xl:before:left-0 xl:before:w-px xl:before:h-full xl:before:bg-gradient-to-b xl:before:from-[#D884F0] xl:before:to-[#44EBA6]">
                {t("chainMigrationResources.body")}
              </p>
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
