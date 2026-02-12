import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
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
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
  CODE_BLOCKS,
  CONTENT_EDITOR_CTA,
  META,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc20";

const DevelopersEvmToSvmErc20Page = () => {
  const t = useTranslations("developers-evm-to-svm-erc20");

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
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

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
          <div key="copy-0">
            {renderCopyBlock({
              contentKey: "intro",
              styleKey: "spacingWithMargins",
            })}
          </div>
          <div key="copy-1">
            {renderCopyBlock({
              contentKey: "tokenProgram",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-2">
            {renderCopyBlock({
              contentKey: "tokensNoContractAddress",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-3">
            {renderCopyBlock({
              contentKey: "noApprovalFlow",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-4">
            {renderCopyBlock({
              contentKey: "tokenProgramLookLike",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-5">{renderCodeBlock(0)}</div>
          <div key="copy-6">
            {renderCopyBlock({
              contentKey: "tokenProgramExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-7">
            {renderCopyBlock({
              contentKey: "tokenMetadata",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-8">
            {renderCopyBlock({ contentKey: "tradeoffs", styleKey: "spacing" })}
          </div>
          <div key="copy-9">
            {renderCopyBlock({
              contentKey: "highLevelComparison",
              styleKey: "spacing",
            })}
          </div>
          <ResponsiveBox
            key="table-10"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">
              <HtmlParser rawHtml={t.raw("contentEditor.comparisonTable")} />
            </div>
          </ResponsiveBox>
          <div key="copy-11">
            {renderCopyBlock({
              contentKey: "mintGuideNote",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-12">
            {renderCopyBlock({ contentKey: "howToErc20", styleKey: "spacing" })}
          </div>
          <div key="copy-13">
            {renderCopyBlock({ contentKey: "howToName", styleKey: "spacing" })}
          </div>
          <div key="code-14">{renderCodeBlock(1)}</div>
          <div key="copy-15">
            {renderCopyBlock({
              contentKey: "nameExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-16">{renderCodeBlock(2)}</div>
          <div key="copy-17">
            {renderCopyBlock({
              contentKey: "howToSymbol",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-18">{renderCodeBlock(3)}</div>
          <div key="copy-19">
            {renderCopyBlock({
              contentKey: "symbolExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-20">{renderCodeBlock(4)}</div>
          <div key="copy-21">
            {renderCopyBlock({
              contentKey: "howToDecimals",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-22">{renderCodeBlock(5)}</div>
          <div key="copy-23">
            {renderCopyBlock({
              contentKey: "decimalsExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-24">{renderCodeBlock(6)}</div>
          <div key="copy-25">
            {renderCopyBlock({
              contentKey: "howToBalanceOf",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-26">{renderCodeBlock(7)}</div>
          <div key="code-27">{renderCodeBlock(8)}</div>
          <div key="copy-28">
            {renderCopyBlock({
              contentKey: "balanceOfExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="copy-29">
            {renderCopyBlock({
              contentKey: "howToTotalSupply",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-30">{renderCodeBlock(9)}</div>
          <div key="copy-31">
            {renderCopyBlock({
              contentKey: "totalSupplyExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-32">{renderCodeBlock(10)}</div>
          <div key="copy-33">
            {renderCopyBlock({
              contentKey: "howToTransfer",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-34">{renderCodeBlock(11)}</div>
          <div key="copy-35">
            {renderCopyBlock({
              contentKey: "transferExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-36">{renderCodeBlock(12)}</div>
          <div key="copy-37">
            {renderCopyBlock({
              contentKey: "transferAccountExplanation",
              styleKey: "spacing",
            })}
          </div>
          <div key="code-38">{renderCodeBlock(13)}</div>
          <div key="copy-39">
            {renderCopyBlock({
              contentKey: "moreFeaturesNote",
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
    </Layout>
  );
};

export default DevelopersEvmToSvmErc20Page;

export async function getStaticProps({
  params,
}: {
  params: { locale: string };
}) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
