"use client";

import dynamic from "next/dynamic";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";

const ContentEditor = dynamic(
  () =>
    import("@solana-foundation/solana-lib").then((mod) => ({
      default: mod.ContentEditor,
    })),
  { ssr: false },
);
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/cosmwasm";

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
      <div className="tw-html_parser" id={id}>
        <HtmlParser rawHtml={t.raw(`contentEditor.blocks.${contentKey}`)} />
      </div>
    );

    if (!styleKey) {
      return content;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {content}
      </ResponsiveBox>
    );
  };

  return (
    <>
      <Section>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
        />

        <ContentEditor
          tocHeadline={t("contentEditor.tocHeadline")}
          callToAction={{
            eyebrow: t("contentEditor.callToAction.eyebrow"),
            headline: t("contentEditor.callToAction.headline"),
            description: t("contentEditor.callToAction.description"),
            button: {
              label: t("contentEditor.callToAction.button.label"),
              url: CONTENT_EDITOR_CTA.button.url,
            },
          }}
        >
          <div key="copy-0" id="overview">
            {renderCopyBlock({
              contentKey: "overview",
              styleKey: "spacingWithMargins",
            })}
          </div>
          <div key="copy-1" id="phase-1-cosmos-wind-down">
            {renderCopyBlock({
              contentKey: "phase1",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-2" id="phase-2-state-processing">
            {renderCopyBlock({
              contentKey: "phase2",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-3" id="phase-3-solana-deployment">
            {renderCopyBlock({
              contentKey: "phase3",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-4" id="phase-4-migration-execution">
            {renderCopyBlock({
              contentKey: "phase4",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-5" id="phase-5-post-migration">
            {renderCopyBlock({
              contentKey: "phase5",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-6" id="address-linking">
            {renderCopyBlock({
              contentKey: "addressLinking",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-7" id="token-claim-program">
            {renderCopyBlock({
              contentKey: "tokenClaimProgram",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-8" id="governance-migration">
            {renderCopyBlock({
              contentKey: "governanceMigration",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-9" id="complex-state-migration">
            {renderCopyBlock({
              contentKey: "complexStateMigration",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-10" id="architecture-differences">
            {renderCopyBlock({
              contentKey: "architectureDifferences",
              styleKey: "spacing",
            })}
          </div>
          <ResponsiveBox
            key="table-11"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">
              <HtmlParser rawHtml={t.raw("contentEditor.architectureTable")} />
            </div>
          </ResponsiveBox>
          <div key="copy-12" id="solana-constraints">
            {renderCopyBlock({
              contentKey: "solanaConstraints",
              styleKey: "spacing",
            })}
          </div>
        </ContentEditor>

        <Heading
          variant="centered"
          eyebrow={t("navHeading.eyebrow")}
          headline=""
          body=""
          buttons={
            navButtons as React.ComponentProps<typeof Heading>["buttons"]
          }
        />

        <Heading eyebrow="" headline={t("resourceHeading.headline")} body="" />

        <ResponsiveBox responsiveStyles={BLOCK_STYLES.cardDeckWrapper}>
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
      </Section>
    </>
  );
}
