"use client";

import dynamic from "next/dynamic";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  FeatureHighlight,
  Heading,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  CHAIN_SELECTOR,
  CHAIN_SELECTOR_CARDS,
  SECONDARY_CARD_DECK,
} from "@/data/developers/evm-to-svm";

const FeatureHighlightAny = FeatureHighlight as any;

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
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

export function DevelopersChainMigrationPage() {
  const t = useTranslations("developers-evm-to-svm");
  const blockSpacing = { large: { marginTop: "48px" } };

  const heroButtons: HeroButton[] = [
    {
      hierarchy: "primary",
      label: t("hero.buttons.0.label"),
      url: "/developers/chain-migration/ethereum",
    },
    {
      hierarchy: "outline",
      label: t("hero.buttons.1.label"),
      url: "/developers/cosmos-to-svm",
    },
  ];

  const chainSelectorCards = CHAIN_SELECTOR_CARDS.map((card, index) => ({
    ...card,
    feature: t(`chainSelector.cards.${index}.feature`),
    body: t(`chainSelector.cards.${index}.body`),
    eyebrow: t(`chainSelector.cards.${index}.eyebrow`),
    button: {
      ...card.button,
      label: t(`chainSelector.cards.${index}.button.label`),
    },
  }));

  const secondaryCards = SECONDARY_CARD_DECK.cards.map((card, index) => ({
    ...card,
    eyebrow: t(`secondaryCardDeck.cards.${index}.eyebrow`),
    heading: t(`secondaryCardDeck.cards.${index}.heading`),
    body: t(`secondaryCardDeck.cards.${index}.body`),
  }));

  return (
    <>
      {/* Hero with animated background + ribbon graphic */}
      <AnimatedHeroSection
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={heroButtons}
      />

      {/* Chain selector */}
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <FeatureHighlightAny
          headingAs={CHAIN_SELECTOR.headingAs}
          color={CHAIN_SELECTOR.color}
          eyebrow={t("chainSelector.eyebrow")}
          headline={t("chainSelector.headline")}
          body={t("chainSelector.body")}
          cards={chainSelectorCards}
          buttons={[]}
        />
      </ResponsiveBox>

      <SectionDivider />

      {/* Resources */}
      <ResponsiveBox responsiveStyles={blockSpacing}>
        <div id="resources" className="tw-scroll-mt-24">
          <Heading
            eyebrow={t("chainMigrationResources.eyebrow")}
            headline={t("chainMigrationResources.headline")}
            body={t("chainMigrationResources.body")}
          />
        </div>
      </ResponsiveBox>

      <CardDeck
        cards={secondaryCards as React.ComponentProps<typeof CardDeck>["cards"]}
        numCols={
          SECONDARY_CARD_DECK.numCols as React.ComponentProps<
            typeof CardDeck
          >["numCols"]
        }
        featured={SECONDARY_CARD_DECK.featured}
      />
    </>
  );
}
