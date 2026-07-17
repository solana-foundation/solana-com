"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import { Columns } from "@/component-library/columns";
import {
  CardDeck,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
  TABLE_OF_CONTENTS_ANCHORS,
} from "@/data/developers/evm-to-svm/smart-contracts";

export function DevelopersEvmToSvmSmartContractsPage() {
  const t = useTranslations("developers-evm-to-svm-smart-contracts");
  const contentBlocks = t.raw("content.blocks") as string[];
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
  };

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
    index,
    id,
    styleKey,
  }: {
    index: number;
    id?: string;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const html = contentBlocks[index];
    const content = (
      <div className="tw-html_parser" id={id}>
        <HtmlParser rawHtml={html} />
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

  const renderHtmlBlock = ({
    html,
    styleKey,
  }: {
    html: string;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    const content = (
      <div className="tw-html_parser">
        <HtmlParser rawHtml={html} />
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
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
      />

      <Section>
        <div key="columns-0">
          <Columns space={30} stackColumnsAt="tablet">
            <div key="toc-0">
              <ResponsiveBox responsiveStyles={BLOCK_STYLES.tocBox}>
                <p>
                  <strong>{tableOfContents.title}</strong>
                </p>
                {tableOfContents.items.map((item, index) => {
                  const href = TABLE_OF_CONTENTS_ANCHORS[index] ?? "#";
                  return (
                    <p key={item} style={{ textIndent: "2em" }}>
                      <a href={href} rel="noopener noreferrer">
                        {item}
                      </a>
                    </p>
                  );
                })}
              </ResponsiveBox>
            </div>
            <div key="copy-0">
              {renderCopyBlock({ index: 0, styleKey: "columnCopy" })}
            </div>
          </Columns>
        </div>
        <div key="copy-1">
          {renderCopyBlock({ index: 1, styleKey: "spacing" })}
        </div>
        <div key="copy-2">
          {renderCopyBlock({ index: 2, id: "SPL", styleKey: "spacing" })}
        </div>
        <div key="copy-3">
          {renderCopyBlock({
            index: 3,
            id: "writing-programs",
            styleKey: "spacing",
          })}
        </div>
        <div key="table-4">
          {renderHtmlBlock({
            html: t.raw("tables.programArchitecture"),
            styleKey: "tableWrapper",
          })}
        </div>
        <div key="copy-5">
          {renderCopyBlock({ index: 4, styleKey: "spacing" })}
        </div>
        <div key="table-6">
          {renderHtmlBlock({
            html: t.raw("tables.clusterEnvironments"),
            styleKey: "tableWrapper",
          })}
        </div>
        <div key="copy-7">
          {renderCopyBlock({ index: 5, styleKey: "spacing" })}
        </div>
        <div key="copy-8">
          {renderCopyBlock({
            index: 6,
            id: "deploying-programs",
            styleKey: "spacing",
          })}
        </div>
        <div key="copy-9">
          {renderCopyBlock({ index: 7, styleKey: "codeBlock" })}
        </div>
        <div key="copy-10">
          {renderCopyBlock({ index: 8, styleKey: "spacing" })}
        </div>
        <div key="copy-11">
          {renderCopyBlock({ index: 9, id: "summary", styleKey: "spacing" })}
        </div>

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
