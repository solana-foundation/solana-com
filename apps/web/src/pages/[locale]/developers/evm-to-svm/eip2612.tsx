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
  META,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/eip2612";

const DevelopersEvmToSvmEip2612Page = () => {
  const t = useTranslations("developers-evm-to-svm-eip2612");

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
              url: "/developers/evm-to-svm/erc20",
            },
          }}
        >
          <div key="copy-0" className="tw-html_parser">
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacingWithMargins}>
              <p>{t("contentEditor.intro")}</p>
            </ResponsiveBox>
          </div>
          <div id="key-characteristics" key="copy-1" className="tw-html_parser">
            <h3>
              <strong>{t("contentEditor.keyCharacteristics.title")}</strong>
            </h3>
            <ul>
              <li>
                <strong>
                  {t("contentEditor.keyCharacteristics.items.0.label")}
                </strong>
                : {t("contentEditor.keyCharacteristics.items.0.description")}
              </li>
              <li>
                <strong>
                  {t("contentEditor.keyCharacteristics.items.1.label")}
                </strong>
                : {t("contentEditor.keyCharacteristics.items.1.description")}
              </li>
              <li>
                <strong>
                  {t("contentEditor.keyCharacteristics.items.2.label")}
                </strong>
                : {t("contentEditor.keyCharacteristics.items.2.description")}
              </li>
            </ul>
          </div>
          <div
            id="why-eip-2612-is-unnecessary-on-solana"
            key="copy-2"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacing}>
              <h2>
                <strong>{t("contentEditor.whyUnnecessary.title")}</strong>
              </h2>
              <p>{t("contentEditor.whyUnnecessary.body")}</p>
            </ResponsiveBox>
          </div>
          <div
            id="token-approval-model"
            key="copy-3"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacingNoBottom}>
              <h3>
                <strong>{t("contentEditor.tokenApprovalModel.title")}</strong>
              </h3>
              <p>{t("contentEditor.tokenApprovalModel.body")}</p>
            </ResponsiveBox>
          </div>
          <div
            id="fee-payer-(gas-delegation)-model"
            key="copy-4"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacing}>
              <h3>
                <strong>{t("contentEditor.feePayerModel.title")}</strong>
              </h3>
              <p>{t("contentEditor.feePayerModel.body")}</p>
            </ResponsiveBox>
          </div>
          <div
            id="how-to-do-eip-2612-on-solana"
            key="copy-5"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacing}>
              <h2>
                <strong>{t("contentEditor.howTo.title")}</strong>
              </h2>
              <p>{t("contentEditor.howTo.body")}</p>
            </ResponsiveBox>
          </div>
          <div
            id="1.-owner-pays-the-fee-(self-sponsored-transfer)"
            key="copy-6"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacing}>
              <h3>
                <strong>{t("contentEditor.exampleOne.title")}</strong>
              </h3>
              <p>{t("contentEditor.exampleOne.body")}</p>
            </ResponsiveBox>
          </div>
          <div key="code-7">
            <CodeBlock
              code={CODE_BLOCKS[0].code}
              language={
                CODE_BLOCKS[0].language as React.ComponentProps<
                  typeof CodeBlock
                >["language"]
              }
            />
          </div>
          <div
            id="2.-third-party-pays-the-fee-(relayed-transfer)"
            key="copy-8"
            className="tw-html_parser"
          >
            <ResponsiveBox responsiveStyles={BLOCK_STYLES.spacing}>
              <h3>
                <strong>{t("contentEditor.exampleTwo.title")}</strong>
              </h3>
              <p>{t("contentEditor.exampleTwo.body")}</p>
            </ResponsiveBox>
          </div>
          <div key="code-9">
            <CodeBlock
              code={CODE_BLOCKS[1].code}
              language={
                CODE_BLOCKS[1].language as React.ComponentProps<
                  typeof CodeBlock
                >["language"]
              }
            />
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

      <Section>
        <ResponsiveBox responsiveStyles={BLOCK_STYLES.smallOnly}>
          <HtmlParser rawHtml={t.raw("nodeComparison")} />
        </ResponsiveBox>
      </Section>
    </Layout>
  );
};

export default DevelopersEvmToSvmEip2612Page;

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
