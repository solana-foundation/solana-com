"use client";

import dynamic from "next/dynamic";
import {
  ResponsiveBox,
  ResponsiveStyles,
} from "@/component-library/responsive-box";
import { CardDeck, Heading } from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmwasm";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

export function DevelopersChainMigrationCosmwasmPage() {
  const t = useTranslations("developers-chain-migration-cosmwasm");

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    heading: t(`resourceCardDeck.cards.${index}.heading`),
    callToAction: {
      ...card.callToAction,
      label: t(`resourceCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  const renderCopyBlock = ({
    contentKey,
    styleKey,
    id,
  }: {
    contentKey: string;
    styleKey?: keyof typeof BLOCK_STYLES;
    id?: string;
  }) => {
    const content = (
      <div
        className="tw-html_parser"
        id={id}
        dangerouslySetInnerHTML={{
          __html: t.raw(`contentEditor.blocks.${contentKey}`) as string,
        }}
      />
    );

    if (!styleKey) {
      return content;
    }

    return (
      <ResponsiveBox
        responsiveStyles={BLOCK_STYLES[styleKey] as ResponsiveStyles}
      >
        {content}
      </ResponsiveBox>
    );
  };

  return (
    <>
      {/* Aurora hero */}
      <section className="relative overflow-hidden bg-black border-b border-white/10">
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
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-16 md:py-28 xl:py-40 w-full">
          <div className="flex flex-col gap-6 max-w-2xl">
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {t("hero.eyebrow")}
            </p>
            <h1 className="text-[40px] md:text-[56px] xl:text-[88px] font-brand font-medium text-white leading-[1.1] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px] mb-0">
              {t("hero.headline")}
            </h1>
            <div
              className="text-[#ABABBA] text-lg md:text-2xl text-pretty leading-[1.33] tracking-[-0.36px] md:tracking-[-0.48px] mb-0 [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: t.raw("hero.body") as string }}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="tw-max-w-screen-xl tw-mx-auto">
        {renderCopyBlock({
          contentKey: "overview",
          styleKey: "spacingWithMargins",
          id: "overview",
        })}
        {renderCopyBlock({
          contentKey: "phase1",
          styleKey: "spacing",
          id: "phase-1-cosmos-wind-down",
        })}
        {renderCopyBlock({
          contentKey: "phase2",
          styleKey: "spacing",
          id: "phase-2-state-processing",
        })}
        {renderCopyBlock({
          contentKey: "phase3",
          styleKey: "spacing",
          id: "phase-3-solana-deployment",
        })}
        {renderCopyBlock({
          contentKey: "phase4",
          styleKey: "spacing",
          id: "phase-4-migration-execution",
        })}
        {renderCopyBlock({
          contentKey: "phase5",
          styleKey: "spacing",
          id: "phase-5-post-migration",
        })}
        {renderCopyBlock({
          contentKey: "addressLinking",
          styleKey: "spacing",
          id: "address-linking",
        })}
        {renderCopyBlock({
          contentKey: "tokenClaimProgram",
          styleKey: "spacing",
          id: "token-claim-program",
        })}
        {renderCopyBlock({
          contentKey: "governanceMigration",
          styleKey: "spacing",
          id: "governance-migration",
        })}
        {renderCopyBlock({
          contentKey: "complexStateMigration",
          styleKey: "spacing",
          id: "complex-state-migration",
        })}
        {renderCopyBlock({
          contentKey: "architectureDifferences",
          styleKey: "spacing",
          id: "architecture-differences",
        })}
        <ResponsiveBox
          responsiveStyles={BLOCK_STYLES.tableWrapper as ResponsiveStyles}
        >
          <div
            className="tw-html_parser"
            dangerouslySetInnerHTML={{
              __html: t.raw("contentEditor.architectureTable") as string,
            }}
          />
        </ResponsiveBox>
        {renderCopyBlock({
          contentKey: "solanaConstraints",
          styleKey: "spacing",
          id: "solana-constraints",
        })}
      </div>

      {/* CTA */}
      <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-12">
        <a
          href={CONTENT_EDITOR_CTA.button.url}
          className="tw-inline-flex tw-items-center tw-px-6 tw-py-3 tw-rounded-full tw-text-sm tw-font-brand tw-font-semibold tw-no-underline tw-bg-nd-cta tw-text-nd-on-cta-high-em-text tw-transition-opacity hover:tw-opacity-90"
        >
          {t("contentEditor.callToAction.button.label")}
        </a>
      </div>

      {/* Nav buttons */}
      <Heading
        variant="centered"
        eyebrow={t("navHeading.eyebrow")}
        headline=""
        body=""
        buttons={navButtons as React.ComponentProps<typeof Heading>["buttons"]}
      />

      {/* Resources */}
      <Heading eyebrow="" headline={t("resourceHeading.headline")} body="" />
      <ResponsiveBox
        responsiveStyles={BLOCK_STYLES.cardDeckWrapper as ResponsiveStyles}
      >
        <CardDeck
          cards={
            resourceCards as React.ComponentProps<typeof CardDeck>["cards"]
          }
          numCols={
            RESOURCE_CARD_DECK.numCols as React.ComponentProps<
              typeof CardDeck
            >["numCols"]
          }
          featured={RESOURCE_CARD_DECK.featured}
        />
      </ResponsiveBox>
    </>
  );
}
