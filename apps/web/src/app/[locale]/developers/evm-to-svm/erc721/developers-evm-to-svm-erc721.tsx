"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  CodeBlock,
  ContentEditor,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  CODE_BLOCKS,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc721";

export function DevelopersEvmToSvmErc721Page() {
  const t = useTranslations("developers-evm-to-svm-erc721");

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

  const renderCodeBlock = (index: number) => {
    const codeBlock = CODE_BLOCKS[index];

    return (
      <CodeBlock
        code={codeBlock.code}
        language={
          codeBlock.language as React.ComponentProps<
            typeof CodeBlock
          >["language"]
        }
      />
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
              contentKey: "tokenProgram",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-2" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "mintAddresses",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-3" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "approvalFlow",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-4" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "tokenProgramIntro",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-5">{renderCodeBlock(0)}</div>
          <div key="copy-6" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "tokenProgramSummary",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-7" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "metadata",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-8" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "tradeoffs",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-9" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "comparisonIntro",
              styleKey: "spacing",
            })}
          </div>
          <ResponsiveBox
            key="table-10"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">
              <HtmlParser
                rawHtml={t.raw("contentEditor.blocks.comparisonTable")}
              />
            </div>
          </ResponsiveBox>
          <div key="copy-11" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "mintGuide",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-12" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToIntro",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-13" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToName",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-14">{renderCodeBlock(1)}</div>
          <div key="copy-15" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "nameDescription",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-16">{renderCodeBlock(2)}</div>
          <div key="copy-17" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToSymbol",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-18">{renderCodeBlock(3)}</div>
          <div key="copy-19" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "symbolDescription",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-20">{renderCodeBlock(4)}</div>
          <div key="copy-21" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToTokenUri",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-22">{renderCodeBlock(5)}</div>
          <div key="copy-23" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "tokenUriDescription",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-24">{renderCodeBlock(6)}</div>
          <div key="copy-25" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToOwnerOf",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-26">{renderCodeBlock(7)}</div>
          <div key="copy-27" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "ownerOfDescription",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-28">{renderCodeBlock(8)}</div>
          <div key="copy-29" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "howToTransferFrom",
              styleKey: "spacingWithOffset",
            })}
          </div>
          <div key="code-30">{renderCodeBlock(9)}</div>
          <div key="copy-31" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "transferFromIntro",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-32">{renderCodeBlock(10)}</div>
          <div key="copy-33" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "transferFromAta",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-34">{renderCodeBlock(11)}</div>
          <div key="copy-35" className="tw-html_parser">
            {renderCopyBlock({
              contentKey: "exploreMore",
              styleKey: "spacing",
            })}
          </div>
        </ContentEditor>

        <ResponsiveBox responsiveStyles={BLOCK_STYLES.smallOnly}>
          <HtmlParser rawHtml={t.raw("nodeComparison")} />
        </ResponsiveBox>

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
