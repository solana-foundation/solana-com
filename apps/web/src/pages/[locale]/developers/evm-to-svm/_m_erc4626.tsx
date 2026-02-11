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
  CONCEPTUAL_MAP_TABLE,
  CONTENT_EDITOR_CTA,
  META,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc4626";

const DevelopersEvmToSvmErc4626Page = () => {
  const t = useTranslations("developers-evm-to-svm-erc4626");

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
    children,
    styleKey,
  }: {
    children: React.ReactNode;
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    if (!styleKey) {
      return children;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {children}
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

  const tableCellStyle = {
    padding: "8px",
    border: "1px solid #999",
    verticalAlign: "top" as const,
  };
  const tableHeaderStyle = {
    ...tableCellStyle,
    textAlign: "center" as const,
    fontWeight: 600,
  };

  const renderConceptualMapTable = () => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {CONCEPTUAL_MAP_TABLE.headers.map((header) => (
            <th key={header} style={tableHeaderStyle}>
              {t(header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CONCEPTUAL_MAP_TABLE.rows.map((row, rowIndex) => (
          <tr key={`${row.labelKey}-${rowIndex}`}>
            <td style={tableCellStyle}>
              <strong>{t(row.labelKey)}</strong>
            </td>
            <td style={tableCellStyle}>{t(row.objectKey)}</td>
            <td style={tableCellStyle}>
              {"purposeParts" in row ? (
                row.purposeParts.map((part, partIndex) => {
                  if (part.type === "code") {
                    return (
                      <code key={`${row.labelKey}-code-${partIndex}`}>
                        {part.value}
                      </code>
                    );
                  }

                  return (
                    <span key={`${row.labelKey}-text-${partIndex}`}>
                      {t(part.key)}
                    </span>
                  );
                })
              ) : (
                <span>{t(row.purposeKey)}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
          <div key="copy-0" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacingWithMargins",
              children: <p>{t("contentEditor.intro")}</p>,
            })}
          </div>
          <div key="copy-1" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.keyCharacteristics.title")}
                    </strong>
                  </h3>
                  <ul>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.0.label")}
                      </strong>
                      : {t("contentEditor.keyCharacteristics.items.0.body")}
                    </li>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.1.label")}
                      </strong>
                      : {t("contentEditor.keyCharacteristics.items.1.body")}
                    </li>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.2.label")}
                      </strong>
                      : {t("contentEditor.keyCharacteristics.items.2.body")}
                    </li>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.3.label")}
                      </strong>
                      : {t("contentEditor.keyCharacteristics.items.3.body")}
                    </li>
                  </ul>
                </>
              ),
            })}
          </div>
          <div key="copy-2" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h2>
                    <strong>{t("contentEditor.programAccount.title")}</strong>
                  </h2>
                  <h3>{t("contentEditor.programAccount.subtitle")}</h3>
                  <p>{t("contentEditor.programAccount.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="code-3">{renderCodeBlock(0)}</div>
          <div key="copy-4" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: <p>{t("contentEditor.deploymentFeel")}</p>,
            })}
          </div>
          <div key="copy-5" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacingNoBottom",
              children: (
                <>
                  <h3>{t("contentEditor.accountsStorage.title")}</h3>
                  <p>{t("contentEditor.accountsStorage.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-6" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>{t("contentEditor.pda.title")}</strong>
                  </h3>
                  <p>{t("contentEditor.pda.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-7" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>{t("contentEditor.cpi.title")}</h3>
                  <p>{t("contentEditor.cpi.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-8" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.authoritativeFlow.title")}
                    </strong>
                  </h3>
                  <p>
                    <strong>
                      {t("contentEditor.authoritativeFlow.deposit.title")}
                    </strong>
                  </p>
                  <ul>
                    <li>
                      {t("contentEditor.authoritativeFlow.deposit.items.0")}
                    </li>
                    <li>
                      {t("contentEditor.authoritativeFlow.deposit.items.1")}
                    </li>
                  </ul>
                  <p>
                    <strong>
                      {t("contentEditor.authoritativeFlow.withdraw.title")}
                    </strong>
                  </p>
                  <ul>
                    <li>
                      {t("contentEditor.authoritativeFlow.withdraw.items.0")}
                    </li>
                  </ul>
                  <p>
                    <strong>
                      {t("contentEditor.authoritativeFlow.stateUpdate")}
                    </strong>
                  </p>
                  <p>{t("contentEditor.authoritativeFlow.preview")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-9" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h2>
                    <strong>
                      {t("contentEditor.tokenExtensionProgram.title")}
                    </strong>
                  </h2>
                  <p>{t("contentEditor.tokenExtensionProgram.body")}</p>
                  <p>{t("contentEditor.tokenExtensionProgram.bodyTwo")}</p>
                  <p>{t("contentEditor.tokenExtensionProgram.bodyThree")}</p>
                </>
              ),
            })}
          </div>
          <div key="code-10">{renderCodeBlock(1)}</div>
          <div key="copy-11" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h2>
                    <strong>{t("contentEditor.howTo.title")}</strong>
                  </h2>
                  <h3>
                    <strong>{t("contentEditor.howTo.conceptualMap")}</strong>
                  </h3>
                </>
              ),
            })}
          </div>
          <ResponsiveBox
            key="table-12"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">{renderConceptualMapTable()}</div>
          </ResponsiveBox>
          <div key="copy-13" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: <p>{t("contentEditor.oneTxSummary")}</p>,
            })}
          </div>
          <div key="copy-14" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>{t("contentEditor.callFlow.title")}</strong>
                  </h3>
                  <p>
                    <strong>{t("contentEditor.callFlow.steps.0")}</strong>
                  </p>
                  <p>
                    <strong>{t("contentEditor.callFlow.steps.1")}</strong>
                  </p>
                  <ul>
                    <li>{t("contentEditor.callFlow.stepTwo.items.0")}</li>
                    <li>{t("contentEditor.callFlow.stepTwo.items.1")}</li>
                  </ul>
                  <p>
                    <strong>{t("contentEditor.callFlow.steps.2")}</strong>
                  </p>
                  <ul>
                    <li>{t("contentEditor.callFlow.stepThree.items.0")}</li>
                    <li>{t("contentEditor.callFlow.stepThree.items.1")}</li>
                    <li>{t("contentEditor.callFlow.stepThree.items.2")}</li>
                    <li>{t("contentEditor.callFlow.stepThree.items.3")}</li>
                    <li>{t("contentEditor.callFlow.stepThree.items.4")}</li>
                  </ul>
                  <p>
                    <strong>{t("contentEditor.callFlow.steps.3")}</strong>
                  </p>
                  <p>
                    <strong>{t("contentEditor.callFlow.steps.4")}</strong>
                  </p>
                </>
              ),
            })}
          </div>
          <div key="copy-15" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <h3>
                  <strong>{t("contentEditor.writeProgram.title")}</strong>
                </h3>
              ),
            })}
          </div>
          <div key="copy-16" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: <p>{t("contentEditor.writeProgram.body")}</p>,
            })}
          </div>
          <div key="code-17">{renderCodeBlock(2)}</div>
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

export default DevelopersEvmToSvmErc4626Page;

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
