"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  ContentEditor,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc4337";

export function DevelopersEvmToSvmErc4337Page() {
  const t = useTranslations("developers-evm-to-svm-erc4337");

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
  }: {
    contentKey: string;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const content = (
      <HtmlParser rawHtml={t.raw(`contentEditor.blocks.${contentKey}`)} />
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
          <div key="copy-0" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "intro",
              styleKey: "spacingWithMargins",
            })}
          </div>
          <div key="copy-1" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "solanaSolved",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-2" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "allAccounts",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-3" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "programsExecutable",
              styleKey: "spacingNoBottom",
            })}
          </div>
          <div key="copy-4" className="tw-html_parser">
            {renderCopyBlock({ contentKey: "pdasCore", styleKey: "spacing" })}
          </div>
          <div key="copy-5" className="tw-html_parser">
            {renderCopyBlock({ contentKey: "cpiSupport", styleKey: "spacing" })}
          </div>
          <div key="copy-6" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "comparisonIntro",
              styleKey: "spacing",
            })}
          </div>
          <ResponsiveBox
            key="table-7"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">
              <HtmlParser
                rawHtml={t.raw("contentEditor.blocks.comparisonTable")}
              />
            </div>
          </ResponsiveBox>
          <div key="copy-8" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "comparisonOutro",
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

        <ResponsiveBox responsiveStyles={BLOCK_STYLES.smallOnly}>
          <HtmlParser rawHtml={t.raw("nodeComparison")} />
        </ResponsiveBox>
      </Section>
    </>
  );
}
